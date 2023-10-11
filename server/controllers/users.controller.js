const {
    fetchAllUsernames,
    fetchUsernameByName,
} = require("../models/users.model");

exports.getAllUsernames = (req, res, next) => {
    fetchAllUsernames()
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch(next);
};

exports.getUsernameByName = (req, res, next) => {
    const { username } = req.params;
    fetchUsernameByName(username)
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch(next);
};
