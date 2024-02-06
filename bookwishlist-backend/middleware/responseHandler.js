require("../constants");

module.exports = (req, res, next) => {

    const rilCorrelationId = (typeof req.get('ril-correlation-id') !== 'undefined') ? req.get('ril-correlation-id') : req.sessionID;
    res.set({ 'ril-correlation-id': rilCorrelationId });

    let code = (typeof req.response === 'undefined') ? HTTP_200 : req.response.code;
    let message = (typeof req.response === 'undefined') ? '' : req.response.message;
    let data = (typeof req.response === 'undefined') ? {} : req.response.data;
    
    // Set the HTTP status code based on the code variable or use HTTP_200 as default
    if(code>=200 && code<=300){
        res.status(code).json({
            error: false,
            success: true,
            message: message,
            data: data,
        });
    }else{
        res.status(code).json({
            error: true,
            success: false,
            message: message,
            data: data,
        });
    }
    next();
};
