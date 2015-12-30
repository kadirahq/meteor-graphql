const Fiber = Npm.require('fibers');
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
      const schema = {aa: Random.id(), getTypeMap() { return {}; }};
      const name = Random.id();

      GraphQL.registerSchema(name, schema);
      expect(GraphQL._schemas[name]).to.equal(schema);
      done();
    });

    it('should throw an error for existing schema', done => {
      const schema = {aa: Random.id(), getTypeMap() { return {}; }};
      const name = Random.id();

      GraphQL.registerSchema(name, schema);
      const run = () => GraphQL.registerSchema(name, schema);
      expect(run).to.throw(Error);
      done();
    });

    it('should resolve fields with existing Fiber', done => {
      const f1 = {resolve() { return {fib: Fiber.current, foo: 'bar'} }};
      const t1 = {getFields() { return {f1} }};
      const s1 = {getTypeMap() { return {t1} }};

      const name = Random.id();
      GraphQL.registerSchema(name, s1);

      const fiber = Fiber.current;
      expect(fiber).to.not.equal(undefined);

      const out = s1.getTypeMap().t1.getFields().f1.resolve();
      Promise.resolve(out).then(res => {
        expect(res.foo).to.equal('bar');
        expect(res.fib).to.equal(fiber);
        done();
      }).catch(done);
    });

    it('should resolve fields with new Fiber', done => {
      const f1 = {resolve() { return {fib: Fiber.current, foo: 'bar'} }};
      const t1 = {getFields() { return {f1} }};
      const s1 = {getTypeMap() { return {t1} }};

      const name = Random.id();
      GraphQL.registerSchema(name, s1);

      const fiber = Fiber.current;
      expect(fiber).to.not.equal(undefined);

      setImmediate(function () {
        const out = s1.getTypeMap().t1.getFields().f1.resolve();
        Promise.resolve(out).then(res => {
          expect(res.foo).to.equal('bar');
          expect(res.fib).to.not.equal(fiber);
          expect(res.fib).to.not.equal(undefined);
          done();
        }).catch(done);
      });
    });
  });
});
