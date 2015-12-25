const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString
} = GraphQL.types;

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

GraphQL.registerSchema('test-schema', schema);