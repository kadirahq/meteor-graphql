## GraphQL Support for Meteor with [Lokka](https://github.com/kadirahq/lokka)

This is an alternative data layer for Meteor with GraphQL. Basically, it'll allow you to expose GraphQL schemas to the client.

Then you can use Lokka to interact with GraphQL schemas in the client side.

### Usage

Add it your app with:

```
meteor add kadira:graphql
```

Then run your app with: `meteor -p 3000`

Then visit <http://localhost:3000/graphql> to see all the schemas available in your app.

![](https://cldup.com/NspE-q_fzY.png)

### Getting Started

Refer [this guide](https://voice.kadira.io/meteor-meets-graphql-3cba2e65fd00#.szh1gnuhm) to get started with GraphQL inside Meteor.

### Features

* Register multiple GraphQL schemas.
* In Browser GraphQL IDE while development.
* Seamless client side integration with Lokka.
* React utilities.
* [Meteor based Authorization](#authorization)
* Optimistic Updates support (via Lokka).
* Client Side Caching (via Lokka).
* Declarative Data Definition (via Lokka).

### API

GraphQL Meteor intergration comes with few simple APIs. Let's explore them:

#### GraphQL.types [server only]

This holds all the types in GraphQL, where you can used to build GraphQL schemas. Check [this schema](https://goo.gl/2ppifr) for a sample usage.

#### GraphQL.registerSchema() [server only]

This API allows you to register a GraphQL schema with Meteor. Then you can use it on the client and inside the in-browser IDE.

```js
const schema = new GraphQLSchema({
  query,
  mutation
});

GraphQL.registerSchema('Blog', schema);
```

#### GraphQL.createLokkaClient() [server only]

This API allows you to create a [Lokka](https://github.com/kadirahq/lokka) client. Then you can use it to interact with your schema. You can specify ddp connection, so you're able to query any meteor-graphql server you want.

```js
var ddpInstance = DDP.connect('http://localhost:3000/');
BlogSchema = GraphQL.createLokkaClient('Blog', ddpInstance);
```

#### Authorization

GraphQL uses Meteor methods as the transport layer. So, we can get the Meteor userId inside the GraphQL schema with the `rootValue` to the schema.

See how to [use it](https://goo.gl/HK59qT) inside a schema.

#### GraphQL.createLokkaClient() [client only]

This API allows you to create a [Lokka](https://github.com/kadirahq/lokka) client. Then you can use it to interact with your schema.

> This will return a Lokka client with the version of 1.6.0.

```js
BlogSchema = GraphQL.createLokkaClient('Blog');
```

> Check [this app](https://goo.gl/pZB1WT) on how to use Lokka in a real app.

#### GraphQL.bindData() [client only]

This is a general purpose React utility to bind data to a react component. Specially for a stateless component via props.

Let's say we've a component like this.

```js
const CurrentTime = ({time, text}) => (
  <span>{text}: {time}</span>
);
```

We can bind the time to this component like this:

```js
const onPropsChange = ((props, onData) => {
  // start the setInterval
  const handler = setInterval(() => {
    let time = (new Date()).toString();
    let text = "Current Time";

    // check props and do some logic
    if (props.timestamp) {
      time = Date.now();
      text = "Timestamp"
    }

    // send data like this
    //  if there's in an error,
    //  send an Error object instead null
    onData(null, {time, text});
  }, 1000);

  // stop function to cleanup resources
  const stop = () => {
    clearInterval(handler);
  }

  // return the stop function which called when
  // the component getting destroyed.
  return stop;
});

const Clock = GraphQL.bindData(onPropsChange)(CurrentTime);
```

Then we can render our clock like this:

```js
ReactDOM.render((
    <div>
      <Clock />
      <Clock timestamp={true} />
    </div>
  ), document.body);
```

![](https://cldup.com/5vOf1Te3YB.gif)

> See how to use `GraphQL.bindData` with Lokka: <https://goo.gl/M758pR>

**Loading Component**

`GraphQL.bindData` will indentify the loading state of your component and it'll render a loading message to the UI. You can send a custom component like this:

```js
const MyLoading = () => (
  <div>...+++...</div>
);
const Clock = GraphQL.bindData(onPropsChange)(CurrentTime, MyLoading);
```

**Error Component**

Just like the loading component, you can send a custom component to handle the error message. For that, do it like this:

```js
const MyError = ({error}) => (
  <div>{error.message}</div>
);
const Clock = GraphQL.bindData(onPropsChange)(CurrentTime, null, MyError);
```
