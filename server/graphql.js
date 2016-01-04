const Fiber = Npm.require('fibers');
const graphql = Npm.require('graphql');

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
          // Do not create another Fiber if the field.resolve function
          // is called within a Fiber. Using `Fiber.current` to check.
          if (Fiber.current) {
            return resolveFn.call(this, ...args);
          }

          // It's not possible to run a function inside a new Fiber
          // and return the result of it. But we can return a promise.
          return new Promise((resolve, reject) => {
            Fiber(() => {
              try {
                // Output of the resolve function may or may not be a Promise.
                // Use `Promise.resolve(...)` to get a Promise and use it to
                // resolve/reject the Promise returned by `field.resolve(...)`
                const out = resolveFn.call(this, ...args);
                Promise.resolve(out).then(resolve, reject);
              } catch (e) {
                reject(e);
              }
            }).run();
          });
        };

        // Only send Meteor.Error to user
        field.resolve = function (...args) {
          const out = resolveFiber.call(this, ...args);
          return Promise.resolve(out).catch(err => {
            if (!(err instanceof Meteor.Error)) {
              console.error(err && err.stack || err);
              err.message = '[Internal Error]';
            }

            throw err;
          });
        };
      }
    }

    this._schemas[name] = schema;
  }
};

Object.keys(graphql).forEach(type => {
  if(/^GraphQL/.test(type)) {
    GraphQL.types[type] = graphql[type];
  }
});
