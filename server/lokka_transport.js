const { graphql } = Npm.require('graphql');
const Future = Npm.require('fibers/future');

LokkaTransport = class {
  constructor(schemaName, ddpInstance) {
    if (!! ddpInstance) {
        this.ddpObj = ddpInstance;
    } else {
        this.ddpObj = Meteor;
    }
    this.schemaName = schemaName;
  }

  send(query, variables, operationName) {
    return this.call(
      'graphql.transport', this.schemaName, query,
      variables, operationName
    ).then(({data, errors}) => {
      if (errors) {
        const message = errors[0].message;
        const error = new Meteor.Error(400, `GraphQL Error: ${message}`);
        error.rawError = errors;

        throw error;
      }

      return data;
    });
  }

  call(...args) {
    return new Promise((resolve, reject) => {
      this.ddpObj.call(...args, (error, result) => {
        if(error) {
          return reject(error);
        }

        return resolve(result);
      });
    });
  }
};

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
