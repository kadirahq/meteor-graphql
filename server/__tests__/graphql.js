const graphql = Npm.require('graphql');

describe('Server Side API', () => {
  describe('GraphQL.types', () => {
    it('should include basic GraphQL types', done => {
      Object.keys(graphql).forEach(type => {
        if(!/^GraphQL/.test(type)) {
          return;
        }

        expect(GraphQL.types[type]).to.equal(graphql[type]);
      });
      done();
    });
  });

  describe('GraphQL.registerSchema', () => {
    it('should register a schema', done => {
      const schema = {aa: Random.id()};
      const name = Random.id();

      GraphQL.registerSchema(name, schema);
      expect(GraphQL._schemas[name]).to.equal(schema);
      done();
    });

    it('should throw an error for existing schema', done => {
      const schema = {aa: Random.id()};
      const name = Random.id();

      GraphQL.registerSchema(name, schema);
      const run = () => GraphQL.registerSchema(name, schema);
      expect(run).to.throw(Error);
      done();
    });
  });
});