'use strict';

var loopback = require("loopback");
var boot = require("loopback-boot");

var app = module.exports = loopback();

//var captcha = require('canvas-captcha');
var captchaOptions = {
  charPool: ('abcdefghijklmnopqrstuvwxyz' + 'abcdefghijklmnopqrstuvwxyz'.toUpperCase() + '1234567890').split(''),
  size: {
    width: 100,
    height: 32
  },
  textPos: {
    left: 15,
    top: 26
  },
  rotate: .01,
  charLength: 4,
  font: '26px Unifont',
  strokeStyle: '#0088cc',
  bgColor: '#eeeeee',
  confusion: true,
  cFont: '30px Arial',
  cStrokeStyle: '#adc',
  cRotate: -.05
};

app.start = function() {
  return app.listen(function() {
    app.emit("started");

    /*app.get('/captcha', function(req, res) {
      captchaPromise(captchaOptions)
        .then(function(data) {
          req.session.captcha = data.captchaStr
          res.end(data.captchaImg)
        }, function(err) {
          res.send(err)
        })
    });*/

    var baseUrl = app.get("url").replace(/\/$/, "");
    console.log("Web server listening at: %s", baseUrl);
  });
};

boot(app, __dirname, function(err) {
  if (err) throw err;
  if (require.main === module)
    app.start();
});
