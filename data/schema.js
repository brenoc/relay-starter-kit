/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  Brand,
  Product,
  Category,
  getBrand,
  getProduct,
  getCategory,
  getCategories,
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var getId = function(type, id) {
  switch(type) {
    case 'Brand':
      return getBrand(id);
      break;
    case 'Category':
      return getCategory(id);
      break;
    case 'Product':
      return getProduct(id);
      break;
    default:
      return null;
  }
};

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    return getId(type, id);
  },
  (obj) => {
    if (obj instanceof Brand) {
      return brandType;
    } else if (obj instanceof Category)  {
      return categoryType;
    } else if (obj instanceof Product)  {
      return productType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var brandType = new GraphQLObjectType({
  name: 'Brand',
  description: 'A product brand',
  fields: () => ({
    id: globalIdField('Brand'),
    slug: {
      type: GraphQLString,
      description: 'The slug of the brand',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the brand'
    },
    logo: {
      type: GraphQLString,
      description: 'The URL to the brand logo'
    },
  }),
  interfaces: [nodeInterface],
})

var categoryType = new GraphQLObjectType({
  name: 'Category',
  description: 'A product category',
  fields: () => ({
    id: globalIdField('Category'),
    slug: {
      type: GraphQLString,
      description: 'The slug of the category',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the category'
    },
    children: {
      type: categoryConnection,
      description: 'Children category',
      args: connectionArgs,
      resolve: (category, args) => {
        return connectionFromArray(getCategories(category.children), args)
      },
    },
  }),
  interfaces: [nodeInterface],
})

var productType = new GraphQLObjectType({
  name: 'Product',
  description: 'A product',
  fields: () => ({
    id: globalIdField('Product'),
    slug: {
      type: GraphQLString,
      description: 'The slug of the product',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the product'
    },
    categories: {
      type: categoryConnection,
      description: 'Product categories',
      args: connectionArgs,
      resolve: (product, args) => {
        return connectionFromArray(getCategories(product.categories), args)
      }
    },
    brand: {
      type: brandType,
      description: 'Product brand',
      resolve: (product, args) => {
        return getBrand(product.brand);
      }
    }
  })
})

/**
 * Define your own connection types here
 */
var {connectionType: categoryConnection} =
  connectionDefinitions({name: 'Category', nodeType: categoryType});

function rootFieldById(typeName, type) {
  return {
    name: `${typeName}Query`,
    type: type,
    args: {
      id: {
        name: 'id',
        type: GraphQLID
      }
    },
    resolve: (_, {id, ...args}) => {
      if (id !== undefined && id !== null) {
        return getId(typeName, id);
      }
    },
  };
}

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    product: rootFieldById('Product', productType)
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
