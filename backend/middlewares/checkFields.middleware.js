const { validationResult } = require('express-validator');
const StdResponse = require("../classes/stdResponse");


const checkFields = (req, res, next) => {
    const errorList = validationResult(req).array();
    const errors = errorList.map(item => item.msg.message)

    if (errorList.length > 0) {
        return res.status(400).json(
            new StdResponse('Los campos indicados no son validos', {errors, executed: false})
        )
    }

    next();
}

module.exports = {
    checkFields
}