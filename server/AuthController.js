
import * as UserRepository from './UserRepository';
import util from 'util';

export function signinValidator(req, res, next) {
    Object.keys(req.body).forEach(arg => {
        switch (arg) {
            case 'username':
                req.checkBody(arg, 'invalid username').isAlpha();
                break;
            case 'password':
                break;
            default:
                req.checkBody(arg, 'unknown argument').fail();
        }
    });

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation errors: ' + util.inspect(result.array()) });
        } else if (!req.body.username || !req.body.password) {
            return res.status(400).json({ success: false, message: "username and password required." });
        } else {
            next();
        }
    });
}

export function signin(req, res) {
    UserRepository.read(req.body.username)
        .then(user => {
            if (user.saltedHash !== UserRepository.getSaltedPassword(user.salt, req.body.password)) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            } else {
                req.session.user = user;
                res.cookie('username', user.username, {
                    secure: true,
                    sameSite: true
                });

                res.json({ success: true });
            }
        })
        .catch(err => res.status(404).json({ success: false, message: err }));
}

export function signout(req, res) {
    req.session.destroy(err => {
        if (err) {
            res.status(500).json({ success: false, message: err });
        } else {
            res.json({ success: true });
        }
    });
}