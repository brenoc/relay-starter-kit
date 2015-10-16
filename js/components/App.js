import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <h1>Product</h1>
        <pre>{JSON.stringify(this.props, null, 2)}</pre>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    product: () => Relay.QL`
      fragment on Product {
        id,
        name,
        categories(first: 10) {
          edges {
            node {
              name
            }
          }
        },
        brand {
          name
        }
      }
    `,
  },
});
