'use strict';

module.exports = function(sequelize) {
  return sequelize.define('Apps', {
    _id: 1,
    name: 'default',
    slug: 'default',
    short_description: 'default',
    description: 'default',
    features: ['default'],
    categories: ['default'],
    permissions: ['default'],
    hidden: false,
    featured: false,
    image_url: 'default',
    preview_url: 'default',
    client_secret: 'default',
    client_id: 'default',
    webhook_url: 'default',
    webhook_secret: 'default',
  }, {
    timestamps: false,
    hasPrimaryKeys: false,
    underscored: true,
  });
};
