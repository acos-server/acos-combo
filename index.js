var fs = require('fs');
var htmlencode = require('htmlencode').htmlEncode;

var Combo = function() {};

Combo.addToHead = function(params) {
  return '<script src="/static/combo/jsvee/jquery.min.js" type="text/javascript"></script>\n' +
    '<link href="/static/combo/style.css" rel="stylesheet" />\n' +
    '<link href="/static/combo/parsons/parsons.css" rel="stylesheet" />\n' +
    '<link href="/static/combo/parsons/prettify.css" rel="stylesheet" />\n' +
    '<script src="/static/combo/parsons/prettify.js"></script>\n' +

    '<link href="/static/combo/jsvee/jsvee.css" rel="stylesheet" type="text/css" />\n' +
    '<link href="/static/combo/jsvee/python.css" rel="stylesheet" type="text/css" />\n' +
    '<script src="/static/combo/jsvee/core.js" type="text/javascript"></script>\n' +
    '<script src="/static/combo/jsvee/messages.js" type="text/javascript"></script>\n' +
    '<script src="/static/combo/jsvee/ui_utils.js" type="text/javascript"></script>\n' +
    '<script src="/static/combo/jsvee/actions.js" type="text/javascript"></script>\n' +
    '<script src="/static/combo/jsvee/ui.js" type="text/javascript"></script>\n' +
    '<script src="/static/combo/jsvee/dummy.js" type="text/javascript"></script>\n' +
    '<script src="/static/combo/jsvee/logging.js" type="text/javascript"></script>\n' +
    '<script src="/static/combo/jsvee/animations.js" type="text/javascript"></script>\n' +

    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>\n' +
    '<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>\n' +
    '<script src="/static/combo/parsons/underscore-min.js"></script>\n' +
    '<script src="/static/combo/parsons/lis.js"></script>\n' +
    '<script src="/static/combo/parsons/parsons.js"></script>\n' +
    '<script src="/static/combo/parsons/skulpt.js"></script>\n' +
    '<script src="/static/combo/parsons/skulpt-stdlib.js"></script>\n' +
    '<script>window.exerciseId = "' + params.name + '";</script>';
};

Combo.addToBody = function(params) {
  return '<input type="hidden" name="exercise" value="' + params.name + '">\n' +
    '<div id="exercise-content"></div>';
};

Combo.initialize = function(req, params, handlers, cb) {

  // Initialize the content type
  params.headContent += Combo.addToHead(params);
  params.bodyContent += Combo.addToBody(params);

  // Initialize the content package
  handlers.contentPackages[req.params.contentPackage].initialize(req, params, handlers, function() {
    params.headContent += '<script src="/static/combo/script.js"></script>';
    cb();
  });
};

Combo.handleEvent = function(event, payload, req, res, protocolPayload, responseObj, cb) {
  var dir = Combo.config.logDirectory + '/combo/' + req.params.contentPackage;
  if (event == 'log') {
    fs.mkdir(dir, 0775, function(err) {
      var name = payload.animationId.replace(/\.|\/|\\|~/g, "-") + '.log';
      var data = new Date().toISOString() + ' ' + payload.logId + ' ' + JSON.stringify(payload.log) + ' ' + JSON.stringify(protocolPayload || {}) + '\n';
      fs.writeFile(dir + '/' + name, data, { flag: 'a' }, function(err) {
        cb(event, payload, req, res, protocolPayload, responseObj);
      });
    });
  } else {
    cb(event, payload, req, res, protocolPayload, responseObj);
  }
};

Combo.register = function(handlers, app, conf) {
  handlers.contentTypes.combo = Combo;
  fs.mkdir(conf.logDirectory + '/combo', 0775, function(err) {});
  Combo.config = conf;
};

Combo.namespace = 'combo';
Combo.installedContentPackages = [];
Combo.packageType = 'content-type';

Combo.meta = {
  'name': 'combo',
  'shortDescription': 'Combination of JSParsons and JSVEE.',
  'description': '',
  'author': 'Teemu Sirkiä',
  'license': 'MIT',
  'version': '0.2.0',
  'url': ''
};

module.exports = Combo;
