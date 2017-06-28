
makeSuccessResponse = (data, messages) => ({
    status: "OK",
    messages: messages ? messages : [],
    data: data ? data : {},
});

makeFailResponse = (messages) => ({
    status: "FAIL",
    messages: messages ? messages : [],
});


module.exports =  {
    makeSuccessResponse,
    makeFailResponse,
};
