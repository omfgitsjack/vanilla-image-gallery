import Datastore from 'nedb';
let counters = new Datastore({ filename: 'db/counters.db', autoload: true });

// Credits to https://docs.mongodb.com/v3.0/tutorial/create-an-auto-incrementing-field/
export function getNextMessageId(imageId) {
    return new Promise((resolve, reject) => {
        counters.update({ _id: imageId + '_messageId' },
        {
            $inc: { seq: 1 }
        },
        {
            upsert: true,
            returnUpdatedDocs: true,
            $set: {
                _id: imageId + '_messageId',
                seq: 0
            }
        },
        (err, numberOfUpdated, upsert) => {
            if (err) reject(err);

            resolve(upsert.seq);
        });
    });
}