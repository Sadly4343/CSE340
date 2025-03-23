const testError = (req, res, next) => {
    const error = new Error("500 Error ");
    error.status = 500;
    next(error);
};

module.exports = { testError };