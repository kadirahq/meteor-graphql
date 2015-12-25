LokkaTransport = class {
  constructor(schemaName) {
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
      Meteor.call(...args, (error, result) => {
        if(error) {
          return reject(error);
        }

        return resolve(result);
      });
    });
  }
};