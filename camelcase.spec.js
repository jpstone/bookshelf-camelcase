
var knex     = require('knex');
var Bookshelf = require('bookshelf');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {filename: ':memory:'},
  useNullAsDefault: true
});

var bookshelf = Bookshelf(knex);
var camelcase = require('./camelcase.js');

bookshelf.plugin(camelcase);

var expect = require('unexpected').clone();

describe('bookshelf camelcase converter plugin', function () {

    var User;

    before(function () {
        Related = bookshelf.Model.extend({
            tableName: 'profile_parts',
            hasTimestamps: true,
        });

        User = bookshelf.Model.extend({
            tableName: 'users',
            hasTimestamps: true,

            profileParts: function () {
                return this.hasMany(Related);
            }
        });


        return knex.schema.createTable('users', function (table) {
            table.increments();
            table.timestamps();

            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.integer('password_version').notNullable();
            table.integer('profile_part_id');
        })
        .then(function () {
            return knex.schema.createTable('profile_parts', function (table) {
                table.increments();
                table.timestamps();

                table.integer('user_id').references('id').inTable('users');
                table.string('name');
                table.string('sample_camel_cased');
            })
        })
    })

    it('should work with new model()', function () {
        return expect(User.forge({
            email: `${Date.now()}@foo.com`,
            password: '123456',
            passwordVersion: 1,
            updatedAt: Date.now()
        }).save(), 'to be fulfilled')
        .then(function (user) {
            var attributes = Object.keys(user.attributes);
            expect(attributes, 'to contain', 'updatedAt');
            expect(attributes, 'to contain', 'passwordVersion');
        });
    });

    it('should work with forge', function () {
        return expect(User.forge({
            email: `${Date.now()}@foo.com`,
            password: '123456',
            passwordVersion: 1,
            updatedAt: Date.now()
        }).save(), 'to be fulfilled')
        .then(user => {
            var attributes = Object.keys(user.attributes);
            expect(attributes, 'to contain', 'updatedAt');
            expect(attributes, 'to contain', 'passwordVersion');
        });
    });

    it('should work with toJSON', function () {
        return expect(User.forge({
            email: `${Date.now()}@foo.com`,
            password: '123456',
            passwordVersion: 1,
            updatedAt: Date.now()
        }).save(), 'to be fulfilled')
        .then(user => {
            var attributes = Object.keys(user.toJSON());
            expect(attributes, 'to contain', 'updatedAt');
            expect(attributes, 'to contain', 'passwordVersion');
        });
    });

    it('should work after fetching', function () {
        return expect(User.forge({
            email: `${Date.now()}@foo.com`,
            password: '123456',
            passwordVersion: 1,
            updatedAt: Date.now()
        }).save(), 'to be fulfilled')
        .then(savedUser => User.where({ id: savedUser.id }))
        .then(newUser => expect(newUser.fetch(), 'to be fulfilled').then(fetchedProfile => {
            var attributes = Object.keys(fetchedProfile.attributes);
            expect(attributes, 'to contain', 'updatedAt');
            expect(attributes, 'to contain', 'passwordVersion');
        }));
    });

    it('should work on relations meaningfully', function () {
        return expect((function () {
            return User.forge({
                email: `${Date.now()}@foo.com`,
                password: '123456',
                passwordVersion: 1,
                updatedAt: Date.now()
            }).save()
            .then(function (user) {
                return user.related('profileParts').create({
                    name: 'this_is_a_sample',
                    sampleCamelCased: 'this_is_a_sample',
                })
                .then(function () {
                    return user.clear().refresh();
                })
            });
        })(), 'to be fulfilled')
        .then(function (savedUser) {
            var profileParts = savedUser.related('profileParts').toJSON();
            expect(Object.keys(profileParts[0]), 'to contain', 'sampleCamelCased');
            expect(profileParts[0].name, 'to be', 'this_is_a_sample');
        });
    });
});
