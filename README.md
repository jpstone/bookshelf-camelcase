# Description

Simple bookshelf plugin that converts gets to camelCase and sets to snake_case.

# Installation

`npm install --save bookshelf-camelcase`

# Usage

In your bookshelf configuration file, add the plugin:

`bookshelf.plugin('bookshelf-camelcase');`

Or if you have multiple plugins:

`bookshelf.plugin(['other-plugin', 'bookshelf-camelcase']);`
