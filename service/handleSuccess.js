const handleSuccess = (res, posts) => {
    // res.json 或 res.send
    res.send({
        'status': true,
        posts,
    })
    res.end();
}

module.exports = handleSuccess;
