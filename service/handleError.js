const handleError = (res, error = null) => {
    res.status(400).send({
        'status': 'false',
        'message': '欄位不正確，或無此 ID',
        error,
    })
    res.end();
}

module.exports = handleError;
