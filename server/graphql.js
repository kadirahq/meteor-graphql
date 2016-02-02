const Fiber = Npm.require('fibers');
const graphql = Npm.require('graphql');
const Lokka = Npm.require('lokka').Lokka;

GraphQL = {
  types: {},
  _schemas: {},
  registerSchema(name, schema) {
    if(this._schemas[name]) {
      throw new Error(`Schema with name "${name}" already exists.`);
    }

    const types = schema.getTypeMap();
    for (const typeName in types) {
      const type = types[typeName];
      if (!types.hasOwnProperty(typeName) || !type.getFields) {
        continue;
      }

      const fields = type.getFields();
      for (const fieldName in fields) {
        const field = fields[fieldName];
        if (!fields.hasOwnProperty(fieldName) || !field.resolve) {
          continue;
        }

        const resolveFn = field.resolve;

        // wrap the resolve function with a Fiber
        const resolveFiber = function (...args) {
          // It's not possible to run a function inside a new Fiber
          // and return the result of it. But we can return a promise.
          return new Promise((resolve, reject) => {
            // Do not create another Fiber if the field.resolve function
            // is called within a Fiber. Using `Fiber.current` to check.
            if (Fiber.current) {
              doProcess();
            } else {
              Fiber(doProcess).run();
            }

            function doProcess() {
              try {
                // Output of the resolve function may or may not be a Promise.
                // Use `Promise.resolve(...)` to get a Promise and use it to
                // resolve/reject the Promise returned by `field.resolve(...)`
                const out = resolveFn.call(this, ...args);
                Promise.resolve(out).then(resolve, reject);
              } catch (e) {
                reject(e);
              }
            }
          });
        };

        // Only send Meteor.Error to user
        field.resolve = function (...args) {
          try {
            const out = resolveFiber.call(this, ...args);
            return Promise.resolve(out).catch(err => {
              const maskedError = GraphQL._maskErrorIfNeeded(err);
              throw maskedError;
            });
          } catch(err) {
            const maskedError = GraphQL._maskErrorIfNeeded(err);
            throw maskedError;
          }
        };
      }
    }

    this._schemas[name] = schema;
  },
  createLokkaClient(schemaName, ddpObj) {
    const client = new Lokka({
      transport: new LokkaTransport(schemaName, ddpObj || undefined)
    });
    return client;
  }
};

GraphQL._maskErrorIfNeeded = (sourceError) => {
  if (!(sourceError instanceof Meteor.Error)) {
    console.error(sourceError && sourceError.stack || sourceError);
    return new Error('Internal Error');
  }

  return sourceError;
};

Object.keys(graphql).forEach(type => {
  if(/^GraphQL/.test(type)) {
    GraphQL.types[type] = graphql[type];
  }
});
