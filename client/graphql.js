GraphQL = {
  createLokkaClient(schemaName) {
    const client = new Lokka({
      transport: new LokkaTransport(schemaName)
    });
    return client;
  },
  bindData
};