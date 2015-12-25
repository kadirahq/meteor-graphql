const { graphql } = Npm.require('graphql');
const Future = Npm.require('fibers/future');

Meteor.methods({
  'graphql.transport'(schemaName, query, vars, operationName) {
    check(schemaName, String);
    check(query, String);
    check(vars, Match.OneOf(Object, undefined, null));
    check(operationName, Match.OneOf(String, undefined, null));

    const schema = GraphQL._schemas[schemaName];
    if(!schema) {
      const message = 
        'There is no such schema' + 
        ' registered with the name' + schemaName;
      throw new Error(message);
    }

    const rootValue = {userId: this.userId};
    const f = new Future();

    graphql(schema, query, rootValue, vars, operationName)
      .then(result => {
        f.return(result);
      })
      .catch(error => {
        f.throw(error);
      });

    return f.wait();
  }
});