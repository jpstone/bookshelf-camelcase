var reduce = require('lodash.reduce');
var camelCase = require('lodash.camelcase');
var snakeCase = require('lodash.snakecase');

module.exports = function (bookshelf, options) {

  var Model = bookshelf.Model.extend({
    parse: function (attr) {
      return reduce(attr, function (record, val, key) {
        record[camelCase(key)] = val;
        return record;
      }, {});
    },
    format: function (attr) {
      return reduce(attr, function (record, val, key) {
        record[snakeCase(key)] = val;
        return record;
      }, {});
    }
  });

  bookshelf.Model = Model;
};
