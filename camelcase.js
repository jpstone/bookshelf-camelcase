const camelCase = require('lodash.camelcase');
const snakeCase = require('lodash.snakecase');

const keyUpdater = { camelCase, snakeCase };

const changeKey = type => attr => Object.keys(attr).reduce((updated, oldKey) => {
  updated[keyUpdater[type](oldKey)] = attr[oldKey];
  return updated;
}, {});

module.exports = (bookshelf) => {
  bookshelf.Model = bookshelf.Model.extend({
    parse: changeKey('camelCase'),
    format: changeKey('snakeCase')
  });
};
