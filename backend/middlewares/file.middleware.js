const StdResponse = require("../classes/stdResponse");

const hasFiles = async (req, res, next) => {
    if (!req.files) return res.status(400).json(
        new StdResponse(
            "No se ha subido ningun archivo.",
            {
                executed: false,
            }
        )
    );

    next()
}

module.exports = {hasFiles}