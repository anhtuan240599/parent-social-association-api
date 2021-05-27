const multer = require("multer");
const path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb, folder) {
    cb(null, './upload');
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname)
    cb(null, Date.now() + ext );
  },
});

module.exports = function upload() {
  return multer({
    // ... other params
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png"
      ) {
        cb(null, false);
        return cb(new Error("File types not allowed file .exe !"));
      } else {
        cb(null, true);
      }
    },
  })
}