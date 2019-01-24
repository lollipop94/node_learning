// express -e photo 创建项目
var createError = require('http-errors');
var express = require('express');
var path = require('path');

var photosRouter = require('./routes/photos')

var Photo = require('./models/Photo') // 引入Photo模型

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) { // 指定文件上传到服务器的路径
    cb(null, __dirname + '/public/photos')
  },
  filename: function (req, file, cb) { // 指定上传到服务器文件的名称
    // console.log(file)
    cb(null, file.originalname)
  }
})
var upload = multer({
  storage: storage
})

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', photosRouter.list)
app.get('/photo/:id/download', photosRouter.download(app.get('/')))
app.get('/upload', photosRouter.form)
app.post('/upload', upload.single('photo[image]'), function (req, res, next) {
  var file = req.file
  // console.log(file)
  // console.log('文件类型：' + file.mimetype)
  // console.log('原始文件名：', file.originalname)
  var name = req.body.name
  Photo.create({
    name: name,
    path: file.filename
  })
  res.redirect('/')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;