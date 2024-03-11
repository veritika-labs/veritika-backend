const asyncHandler = require("express-async-handler");

const test = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        message: "Test route"
    });
    });

module.exports = {
    test
}