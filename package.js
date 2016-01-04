Package.describe({
  name: 'kadira:graphql',
  summary: 'GraphQL support for Meteor with Lokka',
  version: '1.2.3',
  git: 'https://github.com/kadirahq/meteor-graphql.git'
});

Npm.depends({
  'graphql': '0.4.14',
  'lokka': '1.6.0',
  'body-parser': '1.14.2',
  'express-graphql': '0.4.5',
  'react-data-binder': '1.0.0',
  'externalify': '0.1.0'
});

Package.onUse(function(api) {
  configure(api);
  api.export('GraphQL');
});

Package.onTest(function(api) {
  configure(api);
  api.use('smithy:describe@1.0.1', ['server', 'client']);
  api.use('random');
  api.use('ddp');

  api.addFiles('__tests__/init.js', 'server');
  api.addFiles('server/__tests__/graphql.js', 'server');
  api.addFiles('server/__tests__/lokka_transport.js', 'server');

  api.addFiles('client/__tests__/lokka_transport.js', 'client');
  api.addFiles('client/__tests__/graphql.js', 'client');
});

function configure(api) {
  api.use('ecmascript@0.1.6');
  api.use('check@1.1.0');
  api.use('underscore@1.0.4', 'server');
  api.use('react@0.14.3');
  api.use('meteorhacks:picker@1.0.3');
  api.use('kadira:runtime-dev@0.0.1');
  api.use('cosmos:browserify@0.9.3', 'client');

  api.addFiles('server/graphql.js', 'server');
  api.addFiles('server/lokka_transport.js', 'server');
  api.addFiles('server/render_ide.js', 'server');
  api.addFiles('server/ide.js', 'server');
  api.addFiles('server/sample_schema.js', 'server');
  api.addFiles('assets/schema_list.html', 'server', {isAsset: true});

  api.addFiles('client/client.browserify.js', 'client');
  api.addFiles('client/lokka_transport.js', 'client');
  api.addFiles('client/graphql.js', 'client');
}
