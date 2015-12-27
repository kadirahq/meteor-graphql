const DefaultErrorComponent = ({error}) => (
  <pre>
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
        const stop = fn(props, s => fnState = s);
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

      _runFn(props) {
        if(this.stop) {
          this.stop();
        }

        this.stop = fn(props, s => {
          const defaultState = {data: null, error: null};
          this.setState(Object.assign({}, defaultState, s));
        });
      }

      render() {
        const {data, error} = this.state;
        return (
          <div>
            {error? <ErrorComponent error={error}/> : null}
            {data? <DataComponent data={data} /> : null}
            {(!data && !error)? <LoadingComponent /> : null}
          </div>
        );
      }
    }
  };
};