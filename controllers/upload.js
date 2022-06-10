const appError = require('../service/appError');
const sizeOf = require('image-size');
const upload = require('../service/image');
const { ImgurClient } = require('imgur');

const uploadImgur = {
    async upload (req, res, next) {
        if (!req.files) {
            return next(appError(400, '尚未上傳檔案', next));
        }
        const dimensions = sizeOf(req.files[0].buffer);
        if (dimensions.width !== dimensions.height) {
            return next(appError(400, '圖片長寬不符合 1:1 尺寸', next));
        }
        const client = new ImgurClient({
            clientId: process.env.IMGUR_CLIENTID,
            clientSecret: process.env.IMGUR_CLIENT_SECRET,
            refreshToken: process.env.IMGUR_REFRESH_TOKEN,
        });
        const response = await client.upload({
            image: req.files[0].buffer.toString('base64'),
            type: 'baset64',
            album: process.env.IMGUR_ALBUM_ID,
        });
        res.status(200).json({
            status: 'success',
            imgUrl: response.data.link
        })
    }
}

module.exports = uploadImgur;