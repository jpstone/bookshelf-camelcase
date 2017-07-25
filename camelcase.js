const camelCase = require('lodash.camelcase');
const snakeCase = require('lodash.snakecase');

const formatKey = formatter => attr => Object.keys(attr).reduce((updated, oldKey) => {
  updated[formatter(oldKey)] = attr[oldKey];
  return updated;
}, {});

module.exports = (bookshelf) => {
  bookshelf.Model = bookshelf.Model.extend({
    parse: formatKey(camelCase),
    format: formatKey(snakeCase)
  });
};
