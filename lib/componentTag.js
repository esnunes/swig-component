
'use strict';

var component = module.exports = {
  name: 'component',
  ends: true,
  blockLevel: true
};

component.compile = function(compiler, args, content, parents, options, blockName) {
  var file = args.shift();
  var parentFile = (args.pop() || '').replace(/\\/g, '\\\\');
  var w = args.join('');

  var func = [];
  func.push('(function() {');
  func.push('var _output = "";');
  func.push(compiler(content, parents, options, blockName));
  func.push('return _output;');
  func.push('})');  

  var ctx = '_utils.extend({}, { _content: ' + func.join('') + ' }, ' + w + ')';

  return '_output += _swig.compileFile(' + file + ', { resolveFrom: "' + parentFile + '" })(' + ctx + ');';
};

component.parse = function(str, line, parser, types, stack, options) {
  var file, w;
  parser.on(types.STRING, function (token) {
    if (!file) {
      file = token.match;
      this.out.push(file);
      return;
    }

    return true;
  });

  parser.on(types.VAR, function (token) {
    if (!file) {
      file = token.match;
      return true;
    }

    if (!w && token.match === 'with') {
      w = true;
      return;
    }

    return true;
  });

  parser.on('end', function () {
    this.out.push(options.filename || null);
  });

  return true;
};
