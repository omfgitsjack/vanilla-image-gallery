
import { readFile } from 'fs';
import * as ImageRepository from './ImageRepository';
import * as MessageRepository from './MessageRepository';

import util from 'util';

export function createValidator(req, res, next) {
    Object.keys(req.body).forEach(arg => {
        switch (arg) {
            case 'name':
                req.sanitizeBody(arg).escape();
                break;
            case 'externalPictureRoute':
                break;
            default:
                req.checkBody(arg, 'unknown argument').fail();
        }
    });

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            return res.status(400).send({ success: false, message: 'Validation errors: ' + util.inspect(result.array())});
        } else if (!req.body.name) {
            return res.status(400).json({ success: false, message: "name required." });
        } else {
            next();
        }
    });
}

/**
 * Create a new image and set the pointers to previous and next nodes.
 */
export function create(req, res) {
    let done = payloads => {
        res.send({
            success: true,
            data: payloads
        });
        res.end();
    };

    let imagePayload = Object.assign({}, req.body, {
        internalPictureRoute: (req.file && req.file.path) || '',
        internalPictureMetadata: req.file,
        author: req.session.user.username
    });

    // Grab last image before creating the new one.
    // Set the next node pointer to the newly created nodes id, whilst setting the prevNode of the new node to the last.
    // otherwise we create a new node with nulled pointers.
    ImageRepository.getLast(req.session.user.username)
        .then(oldImage =>
            ImageRepository.create(Object.assign({}, imagePayload, {
                previousImage: oldImage._id,
                nextImage: null
            }))
                .then(newImage => ({ newImageId: newImage._id, oldImageId: oldImage._id, newImage }))) // resolve the new & old ids, as well as the created newImage
        .then(payload => ImageRepository.updateNextImagePointer(payload.oldImageId, payload.newImageId).then(() => payload.newImage))
        .then(done)
        // Catch could occur if db is empty.
        .catch(err => ImageRepository.create(Object.assign({}, imagePayload, {
            previousImage: null,
            nextImage: null
        })).then(done));
}

export function read(req, res) {
    ImageRepository.read(req.params.imageId)
        .then(image => {
            delete image.internalPictureRoute; // Don't reveal to public
            delete image.internalPictureMetadata;

            res.send({ success: true, data: image });
            res.end();
        })
        .catch(err => res.status(404).json({ success: false, message: err }));
}

export function remove(req, res) {
    ImageRepository.read(req.params.imageId)
        .then(payload => {
            if (payload.author !== req.session.user.username) {
                res.status(403).json({ success: false, message: "Permission denied." });

                return Promise.reject();
            } else {
                return payload;
            }
        })
        .then(image => Promise.all([
            ImageRepository.updateNextImagePointer(image.previousImage, image.nextImage),
            ImageRepository.updatePreviousImagePointer(image.nextImage, image.previousImage)
        ]).then(() => image))
        .then(image => ImageRepository.remove(image._id).then(() => image))
        .then(image => MessageRepository.removeMessagesAssociatedWithImage(image._id).then(() => image))
        .then(image => {
            res.send({ success: true, data: image });
            res.end();
        })
        .catch(err => res.status(404).json({ success: false, message: err }));
}

export function readPicture(req, res) {
    ImageRepository.read(req.params.imageId)
        .then(imageMetadata => {
            readFile('./' + imageMetadata.internalPictureRoute, (err, picture) => {
                res.writeHead(200, { 'Content-Type': imageMetadata.internalPictureMetadata.mimetype });
                res.end(picture, 'binary');
            });
        })
        .catch(err => res.status(404).json({ success: false, message: err }));
}