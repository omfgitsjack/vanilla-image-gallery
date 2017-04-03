
import * as UserRepository from './UserRepository';
import * as ImageRepository from './ImageRepository';

export function create(req, res) {
    UserRepository.create(req.body.username, req.body.password)
        .then(() => res.json({ success: true }))
        .catch(err => res.status(404).json({ success: false, message: err }));
}

// Get a paginated list of every user's galleries along with a coverImage :)
export function readAll(req, res) {
    Promise.all([
        UserRepository.readAll(req.query && parseInt(req.query.page), req.query && parseInt(req.query.limit)),
        UserRepository.count(req.query && req.query.limit)
    ])
        .then(([data, { totalPages, totalRecords }]) => {
            Promise.all(data.map(record => ImageRepository.readAll(record.username, 0, 1)))
                .then(coverImages => {
                    let hashedImages = coverImages.reduce((acc, cur) => {
                        if (cur.length > 0) {
                            return Object.assign({}, acc, {
                                [cur[0].author]: cur[0]
                            });
                        } else {
                            return acc;
                        }
                    }, {});

                    res.json({
                        success: true,
                        data: data.map(record => ({
                            _id: record._id,
                            createdOn: record.createdOn,
                            username: record.username,
                            coverImage: hashedImages[record.username]
                        })),
                        totalPages,
                        totalRecords
                    });
                });
        })
        .catch(err => res.status(404).json({ success: false, message: err }));
}