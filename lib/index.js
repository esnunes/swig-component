
'use strict';

var componentTag = require('./componentTag');

module.exports = function(swig) {
  swig.setTag(componentTag.name, componentTag.parse, componentTag.compile, componentTag.ends, componentTag.blockLevel);
};
