var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost:27017/xuexi',{ useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false})

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  console.info('we\'re connected to test !')
});

module.exports = db;