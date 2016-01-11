# Change Log

### v1.2.4
* Allow IDE transport to work properly, even query variables are null

### v1.2.3

* Implement error masking. So, we won't expose any internal errors to 
the client. But, we make an excuse for Meteor.Error

### v1.2.2

* Get GraphQL.bindData directly from `react-data-binder` package.

### v1.2.0

* Now resolve function run inside a Fiber. So, we could use native Meteor stuffs as well.

### v1.1.0

* Update README
* Add error message to bindData

### v1.0.0

* Initial version
