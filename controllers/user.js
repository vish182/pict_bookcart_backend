const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        };

        req.profile = user;
        next();
    });
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    res.json(req.profile);
};

exports.readNameOnly = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    req.profile.phone = undefined;
    req.profile.email = undefined;
    req.profile.history = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    req.profile.role = undefined;
    console.log(req.profile)
    res.json(req.profile);
};

exports.update = (req, res) => {
    User.findOneAndUpdate({
            _id: req.profile._id
        }, {
            $set: req.body
        },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "User could not be updated"
                });
            };

            user.hashed_password = undefined;
            user.salt = undefined;

            res.json(user);
        }
    );
};

exports.getUserById = (req, res) => {

};