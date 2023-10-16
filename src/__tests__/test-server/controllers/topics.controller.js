const { fetchAllTopics, addNewTopic } = require("../models/topics.model");

exports.getAllTopics = async (req, res, next) => {
    try {
        const topics = await fetchAllTopics();
        res.status(200).send({ topics });
    } catch (err) {
        next(err);
    }
};

exports.postNewTopic = async (req, res, next) => {
    const { slug, description } = req.body;
    const reqLength = Object.keys(req.body).length;
    try {
        const topic = await addNewTopic(slug, description, reqLength);
        res.status(201).send({ topic });
    } catch (err) {
        next(err);
    }
};
