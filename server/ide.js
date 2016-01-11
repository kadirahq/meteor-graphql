// IDE is not available in the production mode
if(!Package['kadira:runtime-dev']) {
  return;
}

const fs = Npm.require('fs');
const bodyParser = Npm.require('body-parser');

Picker.middleware(bodyParser.json());
Picker.route('/graphql', (params, req, res) => {
  const template = Assets.getText('assets/schema_list.html');
  const schemaInfoList = Object.keys(GraphQL._schemas).map(name => {
    return {name};
  });
  const html = _.template(template)({schemas: schemaInfoList});
  res.end(html);
});

Picker.route('/graphql/ide', (params, req, res) => {
  if(req.method === 'GET') {
    const {query, variables} = params.query;
    const html = RenderIde({query, variables});
    res.end(html);
  } else {
    try {
      const {query, variables, operationName} = req.body;
      const variablesJson = (variables) ? JSON.parse(variables) : {};
      const schemaName = params.query.schema;

      const response = Meteor.call(
        'graphql.transport', schemaName, query, variablesJson, operationName
      );

      const json = JSON.stringify(response);
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(json);
    } catch(ex) {
      console.error(ex.stack);
      res.writeHead(500);
      res.end("Internal Error");
    }
  }
});
