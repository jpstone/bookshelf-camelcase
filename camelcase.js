var _ = require('lodash');

module.exports = function (bookshelf, options) {

  var Model = bookshelf.Model.extend({
    parse: function (attr) {
      return _.reduce(attr, function (record, val, key) {
        record[_.camelCase(key)] = val;
        return record;
      }, {});
    },
    format: function (attr) {
      return _.reduce(attr, function (record, val, key) {
        record[_.snakeCase(key)] = val;
        return record;
      }, {});
    }
  });

  bookshelf.Model = Model;
};
