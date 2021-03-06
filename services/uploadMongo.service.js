let GridFsStorage = require('multer-gridfs-storage');
var mongoose = require('mongoose');
let multer = require('multer');
var Grid = require('gridfs-stream');
require('../resources/db');

let storage = GridFsStorage({
  // url: 'mongodb+srv://naveena:naveena@cluster0-6rknx.mongodb.net/viprahub?retryWrites=true',
  // url: 'mongodb+srv://Dharani:OmSaiRam@246@cluster0-yfvvs.mongodb.net/modelhub?retryWrites=true&w=majority',

url: 'mongodb://localhost:27017/viprahub',
  file: function(req, file) {

    return new Promise((resolve, reject) => {
      const fileInfo = {
        filename: file.originalname,
        bucketName: 'uploadFiles'
      };
      resolve(fileInfo);
    });
  }
});

var upload = multer({storage: storage}).single('file');

// mongoose.connection.on('connected', function () {
//   console.log("waiting for db connection ----- connected")

// });

module.exports = upload;

// var gfs = Grid(mongoose.connection.db, mongoose.mongo);

//   module.exports = gfs;
// module.exports = gfs = () => {
//   mongoose.connection.on('connected', function () {
//     console.log("waiting for db connection ----- connected")
//     Grid(mongoose.connection.db, mongoose.mongo);
//   });
// };
