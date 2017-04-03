
import Datastore from 'nedb';

import _ from 'lodash';
let messages = new Datastore({ filename: 'db/messages.db', autoload: true });

import { getNextMessageId } from './CounterRepository';

export function create(imageId, payload) {
    return new Promise((resolve, reject) => {
        getNextMessageId(imageId).then(id => {
            messages.insert(Object.assign({}, payload, {
                _id: imageId + '_' + id,
                imageId: imageId,
                createdAt: new Date()
            }), (err, doc) => {
                if (err) reject(err);

                resolve(doc);
            });
        });
    });
}

// IF we store messages as an array under the key 
const PAGE_SIZE = 10;
export function readAll(imageId, page = 0) {
    return new Promise((resolve, reject) => {
        messages.find({ imageId: imageId })
            .sort({ createdAt: -1 })
            .skip(page * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .exec((err, docs) => {
                if (err) reject(err);

                resolve(docs);
            });
    });
}

export function read(messageId) {
    return new Promise((resolve, reject) => {
        messages.findOne({ _id: messageId }).exec((err, message) => {
            if (err || !message) reject(err || 'Message does not exist.');

            resolve(message);
        });
    });
}

export function count(imageId) {
    return new Promise((resolve, reject) => {
        messages.count({ imageId }, (err, count) => {
            if (err) reject(err);

            resolve({
                totalPages: Math.ceil(count / PAGE_SIZE),
                totalRecords: count
            });
        });
    });
}

export function remove(messageId) {
    return new Promise((resolve, reject) => {
        messages.remove({ _id: messageId }, (err, docs) => {
            if (err || !docs) reject(err || "Message is not defined");

            resolve();
        });
    });
}

export function removeMessagesAssociatedWithImage(imageId) {
    return new Promise((resolve, reject) => {
        messages.remove({ imageId }, { multi: true }, (err, docs) => {
            if (err) reject(err);

            resolve(docs);
        });
    });
}