const json = require("../endpoints.json");

exports.endspoints = async (req, res, next) => {
    res.status(200).send(json);
};
