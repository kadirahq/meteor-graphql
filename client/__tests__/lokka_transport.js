describe('Client Side Transport', () => {
  it('should call a query and get the result', done => {
    const t = new LokkaTransport('test-schema');
    const query = `
      {
        sum(a: 10, b: 20)
      }
    `;
    const response = t.send(query);
    response.then(result => {
      expect(result).to.be.deep.equal({sum: 30});
      done();
    });
  });

  it('should call a query with vars', done => {
    const t = new LokkaTransport('test-schema');
    const query = `
      query _($a: Int) {
        sum(a: $a, b: 20)
      }
    `;
    const response = t.send(query, {a: 20});
    response.then(result => {
      expect(result).to.be.deep.equal({sum: 40});
      done();
    });
  });

  it('should call a query with the operationName', done => {
    const t = new LokkaTransport('test-schema');
    const query = `
      query a {
        sum(a: 10, b: 20)
      }

      query b {
        sum(a: 40, b: 20)
      }
    `;
    const response = t.send(query, null, 'b');
    response.then(result => {
      expect(result).to.be.deep.equal({sum: 60});
      done();
    });
  });

  it('should throw error for graphql errors', done => {
    const t = new LokkaTransport('test-schema');
    const query = `
      sss
    `;
    const response = t.send(query);
    response.catch(error => {
      expect(error.message).to.match(/Syntax Error/);
      done();
    });
  });

  it('should throw error for Meteor errors', done => {
    const t = new LokkaTransport('test-schema');
    const query = `
      sss
    `;
    const response = t.send();
    response.catch(error => {
      expect(error.message).to.match(/Match failed/);
      done();
    });
  });
});