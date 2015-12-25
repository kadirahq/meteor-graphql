Package.describe({
  name: 'kadira:graphql',
  summary: 'GraphQL support for Meteor with Lokka',
  version: '1.0.0',
  git: 'https://github.com/kadirahq/meteor-graphql.git'
});

Npm.depends({
  'graphql': '0.4.14',
  'lokka': '1.3.1',
  'body-parser': '1.14.2',
  'express-graphql': '0.4.5'
});

Package.onUse(function(api) {
  configure(api);
  api.export('GraphQL');
});

Package.onTest(function(api) {
  configure(api);
  api.use('smithy:describe@1.0.1');
  api.use('random');
  api.use('ddp');

  api.addFiles('server/__tests__/graphql.js', 'server');
  api.addFiles('server/__tests__/transport.js', 'server');
});

function configure(api) {
  api.versionsFrom('1.0');
  api.use('ecmascript');
  api.use('check');
  api.use('underscore');
  api.use('meteorhacks:picker@1.0.3');
  api.use('kadira:runtime-dev@0.0.1');

  api.addFiles('server/graphql.js', 'server');
  api.addFiles('server/transport.js', 'server');
  api.addFiles('server/render_ide.js', 'server');
  api.addFiles('server/ide.js', 'server');
  api.addFiles('assets/schema_list.html', 'server', {isAsset: true});
}