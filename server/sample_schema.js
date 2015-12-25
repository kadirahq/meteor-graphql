if(!Package['kadira:runtime-dev']) {
  return;
}
// Add a sample API

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = GraphQL.types;

const query = new GraphQLObjectType({
  name: 'EchoAPI',
  description: "A simple GraphQL API which has a one field called echo",
  fields: {
    echo: {
      description: "Simply echo back the message your are sending",
      type: GraphQLString,
      args: {
        message: {
          type: GraphQLString,
          description: "The message to echo"
        }
      },
      resolve(parent, {message}) {
        return `Echo: ${message}`;
      }
    }
  }
});

const schema = new GraphQLSchema({
  query
});

GraphQL.registerSchema('GraphQL Echo', schema);