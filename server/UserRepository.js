
import Datastore from 'nedb';
import crypto from 'crypto';

let users = new Datastore({ filename: 'db/users.db', autoload: true });

export function read(username) {
    return new Promise((resolve, reject) => {
        users.findOne({ username }, (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
}

export function create(username, password) {
    return new Promise((resolve, reject) => {
        users.findOne({ username: username }, (err, user) => {
            if (err) return reject(err);
            if (user) return reject("Username " + username + " already exists");

            users.insert(new User({ username, password }), (err, user) => {
                if (err) return reject(err);

                resolve(user);
            });
        });
    });
}

export function getSaltedPassword(salt, password) {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);

    return hash.digest('base64');
}

const PAGE_SIZE = 10;
export function readAll(page = 0, limit = PAGE_SIZE) {
    return new Promise((resolve, reject) => {
        users
            .find()
            .sort({ createdAt: -1 })
            .skip(page * limit)
            .limit(limit)
            .exec((err, docs) => {
                if (err) reject(err);

                resolve(docs);
            });
    });
}

export function count(limit = PAGE_SIZE) {
    return new Promise((resolve, reject) => {
        users.count({}, (err, count) => {
            if (err) reject(err);

            resolve({
                totalPages: Math.ceil(count / limit),
                totalRecords: count
            });
        });
    });
}

export function User(user) {
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(user.password);

    this.createdOn = new Date();
    this.username = user.username;
    this.salt = salt;
    this.saltedHash = hash.digest('base64');
}