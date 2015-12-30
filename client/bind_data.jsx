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

      _subscribe(props) {
        this._unsubscribe();

        this._stop = fn(props, (error, payload) => {
          const state = {
            _data: {error, payload}
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

      _getProps() {
        const {_data={}} = this.state || {};
        const {
          payload={},
          error
        } = _data;

        const props = {
          ...this.props,
          ...payload,
          error
        };

        return props;
      }

      _getError() {
        if (!this.state) {
          return null;
        }

        const {_data} = this.state;
        return _data.error;
      }

      _isLoading() {
        if (!this.state) {
          return true;
        }

        const {_data} = this.state;
        return !_data.payload;
      }
    }
  };
};
