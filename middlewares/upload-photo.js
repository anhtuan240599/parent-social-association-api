const path = require('path')
const multer = require('multer')

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req,file,cb) => {
        let ext = path.extname(file.originalname);
        if ( ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" ) {
            cb(new Error("file type is not supported"),false)
        }
        cb(null,true);
    },
})