

exports.pageNotFound = (req, res, next) => {
    const error = new Error(`the page is Not Found`);
    error.status = 404;
    next(error); 
}

exports.serverNotFound = (error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
}

