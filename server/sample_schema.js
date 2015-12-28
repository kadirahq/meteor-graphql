if(!Package['kadira:runtime-dev']) {
  return;
}
// Add a sample API

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList
} = GraphQL.types;

const OS = Npm.require('os');

const LoadAverage = new GraphQLObjectType({
  name: 'LoadAverage',
  description: 'Load average of the system.',
  fields: {
    min15: {
      type: GraphQLFloat,
      description: "Load average of last 15 minutes."
    },
    min5: {
      type: GraphQLFloat,
      description: "Load average of last 5 minutes."
    },
    min1: {
      type: GraphQLFloat,
      description: "Load average of last minute."
    }
  }
});

const SysInfo = new GraphQLObjectType({
  name: 'SysInfo',
  description: 'Contains some useful system information.',
  fields: {
    hostname: {
      type: GraphQLString,
      description: 'Hostname of the system running the app.',
      resolve() {
        return OS.hostname()
      }
    },
    memory: {
      type: GraphQLFloat,
      description: 'Memory usage of the app in mega bytes.',
      resolve() {
        return process.memoryUsage().rss / 1024 / 1024;
      }
    },
    uptime: {
      type: GraphQLFloat,
      description: 'Uptime of the app in seconds.',
      resolve() {
        return OS.uptime();
      }
    },
    loadavg: {
      type: LoadAverage,
      description: 'Load average of the system running the app.',
      resolve() {
        const [min1, min5, min15] = OS.loadavg();
        return {min15, min5, min1};
      }
    }
  }
});

const query = new GraphQLObjectType({
  name: 'SysInfoQueries',
  description: "A simple GraphQL API which has a one field called echo.",
  fields: {
    sysInfo: {
      description: "Get basic system information of the app's process.",
      type: SysInfo,
      resolve() {
        // We need to return something
        return {};
      }
    }
  }
});

const SysInfoSchema = new GraphQLSchema({
  query
});

GraphQL.registerSchema('SysInfo', SysInfoSchema);