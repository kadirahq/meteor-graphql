describe('Client Side API', () => {
  describe('createLokkaClient', () => {
    it('should create a lokka client with the transport', done => {
      const client = GraphQL.createLokkaClient('test-schema');
      const query = `
        {
          sum(a: 50, b: 20)
        }
      `;
      client.query(query)
        .then(result => {
          expect(result).to.be.deep.equal({sum: 70});
          done();
        });
    });
  });
});