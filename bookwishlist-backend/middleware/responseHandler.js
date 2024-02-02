const { constants } = require("../constants");

module.exports = (req, res, next) => {

    // if (req.response) {
    //     // If req.response is already set, assume the route handled the response
    //     return res.status(req.response.code || 200).json(req.response);
    // }

    // If req.response is not set, format the response using default values
    const rilCorrelationId = (typeof req.get('ril-correlation-id') !== 'undefined') ? req.get('ril-correlation-id') : req.sessionID;
    res.set({ 'ril-correlation-id': rilCorrelationId });

    let code = (typeof req.response === 'undefined') ? HTTP_200 : req.response.code;
    let message = (typeof req.response === 'undefined') ? '' : req.response.message;
    let data = (typeof req.response === 'undefined') ? {} : req.response.data;
    
    // const rilCorrelationId = (typeof req.get('ril-correlation-id') !== 'undefined') ? req.get('ril-correlation-id') : req.sessionID;
    // res.set({ 'ril-correlation-id': rilCorrelationId });

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

    // // debbug3
    // console.log("req.response after:", req.response);
    // console.log("Exiting responseHandler");

    next();
};
