const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString
} = GraphQL.types;

describe('Server Side Transport', () => {
  const schemaName = Random.id();
  before(() => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          "sum": {
            type: GraphQLInt,
            args: {
              a: {type: GraphQLInt},
              b: {type: GraphQLInt}
            },
            resolve(parent, {a, b}) {
              return a + b;
            }
          },
          "userId": {
            type: GraphQLString,
            resolve(parent, args, {rootValue}) {
              return rootValue.userId;
            }
          }
        }
      })
    });

    GraphQL.registerSchema(schemaName, schema);
  });

  it('should throw an error if there is no such schema', done => {
    const run = () => {
      Meteor.call('graphql.transport', 'some-other-query', '{sum(a: 10, b: 20)}');    
    };

    expect(run).to.throw(/There is no such schema/);
    done();
  });

  it('should get the result from the graphql schema', done => {
    const query = `
      {
        sum(a: 10, b: 20)
      }
    `;
    const result = Meteor.call('graphql.transport', schemaName, query);
    expect(result.data).to.deep.equal({sum: 30});
    done();
  });

  it('should accept query variables', done => {
    const query = `
      query adding($a: Int) {
        sum(a: $a, b: 20)
      }
    `;
    const queryVariables = {a: 50};
    const result = Meteor.call(
      'graphql.transport', schemaName, query, queryVariables
    );
    
    expect(result.data).to.deep.equal({sum: 70});
    done();
  });

  it('should accept the operationName', done => {
    const query = `
      query adding1 {
        sum(a: 0, b: 20)
      }

      query adding2 {
        sum(a: 20, b: 20)
      }
    `;
    const result = Meteor.call(
      'graphql.transport', schemaName, query, null, 'adding2'
    );
    
    expect(result.data).to.deep.equal({sum: 40});
    done();
  });

  it('should get the error from graphql schema', done => {
    const query = `
      ssds
    `;
    const result = Meteor.call(
      'graphql.transport', schemaName, query
    );

    expect(result.errors[0].message).to.match(/Syntax Error/);
    done();
  });

  it('should get the rootValue with the userId', done => {
    const query = `
      {
        userId
      }
    `;

    const fakeUserId = Random.id();
    DDP._CurrentInvocation.withValue({userId: fakeUserId}, () => {
      const result = Meteor.call('graphql.transport', schemaName, query);
      expect(result.data).to.deep.equal({userId: fakeUserId});
      done();
    });
  });
});