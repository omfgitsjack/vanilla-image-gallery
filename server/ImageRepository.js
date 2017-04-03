
import Datastore from 'nedb';
import _ from 'lodash';

let images = new Datastore({ filename: 'db/images.db', autoload: true });

// Standard Create, Read, Remove
export function create(payload) {
    // Store standard data.
    return new Promise((resolve, reject) => {
        images.insert(Object.assign({}, payload, {
            createdOn: new Date()
        }), (err, image) => {
            if (err) reject(err);

            resolve(image);
        });
    });
}

export function update(id, payload) {
    return new Promise((resolve, reject) => {
        images.update({ _id: id }, payload, (err, numberUpdated) => {
            if (err || numberUpdated !== 1) reject(err || numberUpdated);

            resolve(payload);
        });
    });
}

function updateImagePointers(id, imagePointers) {
    return new Promise((resolve, reject) => {
        let payload = _.toPairs(imagePointers)
            // Only accept the following keys
            .filter(([key]) => key === 'nextImage' || key === 'previousImage')
            .reduce((acc, pointer) => Object.assign({}, acc, { [pointer[0]]: pointer[1] }), {});

        images.update({ _id: id }, { $set: payload }, (err, numberUpdated) => {
            if (err) reject(err);

            resolve(numberUpdated);
        });
    });
}

export function updateNextImagePointer(id, nextImageId) {
    if (!id) return Promise.resolve(0);

    return updateImagePointers(id, { nextImage: nextImageId });
}

export function updatePreviousImagePointer(id, previousImageId) {
    if (!id) return Promise.resolve(0);

    return updateImagePointers(id, { previousImage: previousImageId });
}

export function readAll(userId, page = 0, limit = 1) {
    return new Promise((resolve, reject) => {
        images
            .find({ author: userId })
            .sort({ createdOn: -1 })
            .skip(page * limit)
            .limit(limit)
            .exec((err, matchedImages) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(matchedImages);
                }
            });
    });
}

export function count(limit = 1) {
    return new Promise((resolve, reject) => {
        images.count({}, (err, count) => {
            if (err) reject(err);

            resolve({
                totalPages: Math.ceil(count / limit),
                totalRecords: count
            });
        });
    });
}

export function read(id) {
    return new Promise((resolve, reject) => {
        images.findOne({ _id: id }).exec((err, image) => {
            if (err || !image) reject(err || 'Image does not exist.');

            resolve(image);
        });
    });
}

export function getLast(author) {
    return new Promise((resolve, reject) => {
        images.find({ author }).sort({ createdOn: -1 }).exec((err, matchedImages) => {
            if (matchedImages.length === 0) {
                reject();
            } else {
                resolve(_.first(matchedImages));
            }
        });
    });
}

export function remove(id) {
    return new Promise((resolve, reject) => {
        images.remove({ _id: id }, (err, n) => {
            if (err || !n) reject(err || 'Image does not exist');

            resolve(n);
        });
    });
}