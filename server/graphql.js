const graphql = Npm.require('graphql');

GraphQL = {
  types: {},
  _schemas: {},
  registerSchema: (name, schema) => {
    if(this._schemas[name]) {
      throw new Error(`Schema with name "${name}" already exists.`);
    }

    this._schemas[name] = schema;
  }
};

Object.keys(graphql).forEach(type => {
  if(/^GraphQL/.test(type)) {
    GraphQL.types[type] = graphql[type];
  }
});