import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    product: () => Relay.QL`
      query ProductQuery {
        product(id: $productId)
      }
    `,
  };
  static paramDefinitions = {
    productId: { required: true }
  };
  static routeName = 'AppHomeRoute';
}
