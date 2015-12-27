const DefaultErrorComponent = ({error}) => (
  <pre style={{color: 'red'}}>
    {error.stack}
  </pre>
);

GraphQL.bindData = (fn) => {
  return (DataComponent, L, E) => {
    const LoadingComponent = L || () => (<p>Loading...</p>);
    const ErrorComponent = E || DefaultErrorComponent;

    return class extends React.Component {
      constructor(props, context) {
        super(props, context);
        let fnState = {};
        const stop = fn(props, (error, payload) => {
          if(error) {
            return fnState = {error}
          }

          fnState = payload;
        });
        if (stop) {
          stop();
        }

        this.state = fnState;
      }

      componentDidMount() {
        this._runFn(this.props);
      }

      componentWillReceiveProps(props) {
        this._runFn(props);
      }

      componentWillUnmount() {
        if(this.stop) {
          this.stop();
        }
      }

      _runFn(props) {
        if(this.stop) {
          this.stop();
        }

        this.stop = fn(props, (error, payload) => {
          const defaultState = {data: null, error: error};
          this.setState(Object.assign({}, defaultState, payload));
        });
      }

      render() {
        const {data, error} = this.state;
        const state = this.state;

        return (
          <div>
            {error? <ErrorComponent error={error}/> : null }
            {this._isLoading()? <LoadingComponent /> : null}
            {(!this._isLoading() && !error)? <DataComponent {...state} /> : null}
          </div>
        );
      }

      _isLoading() {
        const keys = Object.keys(this.state);
        for(key of keys) {
          if(this.state[key]) {
            return false;
          }
        }

        return true;
      }
    }
  };
};
