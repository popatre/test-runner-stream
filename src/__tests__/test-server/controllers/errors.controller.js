exports.notARoute = (req, res) => {
    res.status(404).send({ message: "invalid url" });
};

exports.errors400 = (err, req, res, next) => {
    
    if (err.status) {
        res.status(err.status).send({ message: err.msg });
    } else {
        next(err);
    }
};

exports.psqlErrors = (err, req, res, next) => {
   
    if (err.code === "22P02") {
        res.status(400).send({ message: "invalid request" });
    } else if (err.code === "23503") {
        res.status(404).send({ message: "invalid content" });
    } else {
        next(err);
    }
};
exports.methodNotAllowed = (req, res, next) => {
    res.status(405).send({ message: "bad method on this route" });
};
