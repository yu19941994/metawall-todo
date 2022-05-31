const http = {
    cors (res) {
        res.send({
            'status': true,
        })
        res.end();
    },
    notFound (res) {
        res.status(404).send({
            'status': 'false',
            'message': '無此網路路由'
        })
        res.end();
    }
}

module.exports = http;
