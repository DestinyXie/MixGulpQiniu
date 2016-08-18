![qiniu](http://assets.qiniu.com/qiniu-409x220.png)
# mix-gulp-qiniu-cdn

> Gulp plugin for qiniu to upload file stream, copyright mix corp.
inherit form [gulp-qiniu-cdn](https://www.npmjs.com/package/gulp-qiniu-cdn)

# Install

Install with [npm](https://npmjs.org/)

```
npm install --save-dev mix-gulp-qiniu
```

# Usage

The following example will show the minimal usage with mix-gulp-qiniu

```
var gulp = require('gulp'),
    qiniuCDN = require('gulp-qiniu-cdn');

gulp.task('qiniu', function () {
    return gulp.src(['app/**/*.*'])
        .pipe(qiniuCDN({
            AK: Your ACCESS_KEY,
            SK: Your SECRET_KEY,
            scope: bucketname,
            src_root: 'xxx', // local directory to upload
            qiniu_dir: 'xxx', // qiniu directory
            quiet: true // no log
        }))
});

// upload example , upload entire directory:

gulp.task('qiniu', function () {
    return gulp.src(['app/**/*.*'])
        .pipe(qiniuCDN({
            AK: Your ACCESS_KEY,
            SK: Your SECRET_KEY,
            scope: 'my-bucket',
            src_root: 'app', // local directory to upload
            qiniu_dir: 'app-static', // qiniu directory which upload to
            quiet: true // no log
        }))
});

// results like this:
// app/images/logo.png -> [cdn_host]/app-static/images/logo.png
// app/images/1.png -> [cdn_host]/app-static/images/1.png
// ...

```

Optional configurations are available.For more detail about configuation ,see [offical document](http://developer.qiniu.com/docs/v6/sdk/nodejs-sdk.html).

```
{
    scope,
    callbackUrl,
    callbackBody,
    returnUrl,
    returnBody,
    asyncOps,
    endUser,
    expires,
    params,
    mimeType,
    crc32,
    checkCrc
}
```

## License
<a href="http://nate.mit-license.org">MIT</a>
