const DefaultErrorComponent = ({error}) => (
  <pre style={{color: 'red'}}>
    {error.message} <br />
    {error.stack}
  </pre>
);

const DefaultLoadingComponent = () => (
  <p>Loading...</p>
);

GraphQL.bindData = (fn) => {
  return (DataComponent, L, E) => {
    const LoadingComponent = L || DefaultLoadingComponent;
    const ErrorComponent = E || DefaultErrorComponent;

    return class extends React.Component {
      constructor(props, context) {
        super(props, context);

        this.state = {_fnData: {}};
        this._subscribe(props);
        // XXX: In the server side environment, we need to 
        // stop the subscription right away. Otherwise, it's a starting
        // point to huge subscription leak.
      }

      componentDidMount() {
        this._mounted = true;
      }

      componentWillReceiveProps(props) {
        this._subscribe(props);
      }

      componentWillUnmount() {
        this._unsubscribe();
      }

      render() {
        const error = this._getError();
        const loading = this._isLoading();

        return (
          <div>
            {error? <ErrorComponent error={error}/> : null }
            {(!error && loading)? <LoadingComponent /> : null}
            {(!error && !loading)? <DataComponent {...this._getProps()} /> : null}
          </div>
        );
      }

      _subscribe(props) {
        this._unsubscribe();

        this._stop = fn(props, (error, payload) => {
          const state = {
            _fnData: {error, payload}
          };

          if(this._mounted) {
            this.setState(state);
          } else {
            this.state = state;
          }
        });
      }

      _unsubscribe() {
        if(this._stop) {
          this._stop();
        }
      }

      _getProps() {
        const {_fnData} = this.state;
        const {
          payload={},
          error
        } = _fnData;

        const props = {
          ...this.props,
          ...payload,
          error
        };

        return props;
      }

      _getError() {
        const {_fnData} = this.state;
        return _fnData.error;
      }

      _isLoading() {
        const {_fnData} = this.state;
        return !_fnData.payload;
      }
    }
  };
};
