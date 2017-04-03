
import * as MessageRepository from './MessageRepository';
import * as ImageRepository from './ImageRepository';

import util from 'util';

export function createValidator(req, res, next) {
    Object.keys(req.body).forEach(arg => {
        switch (arg) {
            case 'message':
                req.sanitizeBody(arg).escape();
                break;
            default:
                req.checkBody(arg, 'unknown argument').fail();
        }
    });

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            return res.status(400).send('Validation errors: ' + util.inspect(result.array()));
        } else if (!req.body.message) {
            return res.status(400).json({ success: false, message: "message required." });
        } else {
            next();
        }
    });
}


export function create(req, res) {
    MessageRepository.create(req.params.imageId, Object.assign({}, req.body, {
        name: req.session.user.username
    }))
        .then(data => {
            res.send({ success: true, data });
            res.end();
        })
        .catch(err => res.status(404).json({ success: false, message: err }));
}

export function get(req, res) {
    Promise.all([
        MessageRepository.readAll(req.params.imageId, req.query && parseInt(req.query.page)),
        MessageRepository.count(req.params.imageId)
    ])
        .then(([ data, { totalPages, totalRecords } ]) => {
            res.send({ success: true, data, totalPages, totalRecords });
            res.end();
        })
        .catch(err => res.status(404).json({ success: false, message: err }));
}

export function remove(req, res) {
    Promise.all([
        MessageRepository.read(req.params.messageId),
        ImageRepository.read(req.params.imageId)
    ])
        .then(([ message, image ]) => {
            if (message.name === req.session.user.username ||
                req.session.user.username === image.author) {
                return true;
            } else {
                res.status(403).json({ success: false, message: "Permission denied." });

                return Promise.reject();
            }
        })
        .then(() => MessageRepository.remove(req.params.messageId))
        .then(() => res.json({ success: true }))
        .catch(() => {
            res.status(404).json({ success: false });
            res.end();
        });
}