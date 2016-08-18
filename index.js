var through = require('through2');
var qiniu = require('qiniu');

// consts
const PLUGIN_NAME = 'mix-gulp-qiniu';

function uploadFile(localFile, key, uptoken, cb) {
  var extra = new qiniu.io.PutExtra();
  //extra.params = params;
  //extra.mimeType = mimeType;
  //extra.crc32 = crc32;
  //extra.checkCrc = checkCrc;

  qiniu.io.putFile(uptoken, key, localFile, extra, cb);
}

// plugin level function (dealing with files)
function gulpQiniuCdn(conf) {

  qiniu.conf.ACCESS_KEY = conf.AK;
  qiniu.conf.SECRET_KEY = conf.SK;

  var putpolicy = new qiniu.rs.PutPolicy()


  //token parameter
  putpolicy.scope = conf.scope || null;
  putpolicy.callbackUrl = conf.callbackUrl || null;
  putpolicy.callbackBody = conf.callbackBody || null;
  putpolicy.returnUrl = conf.returnUrl || null;
  putpolicy.returnBody = conf.returnBody || null;
  putpolicy.asyncOps = conf.asyncOps || null;
  putpolicy.endUser = conf.endUser || null;
  putpolicy.expires = conf.expires || 3600;
  // var uptokenStr = putpolicy.token();
  var uptokenStr;

  //uploadFile parameter
  var params = conf.params || {};
  var mimeType = conf.mimeType || null;
  var crc32 = conf.crc32 || null;
  var checkCrc = conf.checkCrc || 0;
  var rootSrc = conf.src_root + (/\/$/.test(conf.src_root) ? '' : '/');
  var qiniuDir = (conf.qiniu_dir || '') + (/\/$/.test(conf.qiniu_dir) ? '' : '/');
  var pathRegExp = new RegExp(rootSrc + '(.*)');

  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
    var path = file.history[0];
    var fileName = path.split("/").pop();

    var extra = new qiniu.io.PutExtra(params, mimeType, crc32, checkCrc);

    var realKey = qiniuDir + fileName;
    if (conf.src_root) {
      var regResult = pathRegExp.exec(path);

      if (regResult && regResult[1]) {
        realKey = qiniuDir + regResult[1];
      }
    }

    // scope: <bucket> 只允许“新增”资源, <bucket>:<key>允许“修改”，即覆盖原有资源
    putpolicy.scope = (conf.scope + ':' + realKey) || null;
    uptokenStr = putpolicy.token();

    // console.log(realKey);
    qiniu.io.putFile(uptokenStr, realKey, path, extra, function(err, ret){
      if(!err) {
        // 上传成功， 处理返回值
        if (!conf['quiet']) {
          console.log('ok. uploaded target: ' + ret.key);
        }
        // console.log(ret.key, ret.hash);
        // ret.key & ret.hash
      } else {
        // 上传失败， 处理返回代码
        console.log('err. upload target:' + realKey);
        // console.log(realKey, err);
        // http://developer.qiniu.com/docs/v6/api/reference/codes.html
      }
      //end of invoking this file stream
      cb();
    });
  });

  // returning the file stream
  return stream;
};

// exporting the plugin main function
module.exports = gulpQiniuCdn;
