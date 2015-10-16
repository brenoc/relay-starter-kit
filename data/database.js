/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
class Brand extends Object {}
class Category extends Object {}
class Product extends Object {}

// Mock data
var brands = ['Nike', 'Brinks'].map((name, i) => {
  var brand = new Brand();
  brand.id = `b_${i}`;
  brand.name = name;
  brand.slug = name.toLowerCase().replace(' ', '-');
  return brand;
})

var categories = ['camisetas', 'brinquedos'].map((name, i) => {
  var category = new Category();
  category.id = `c_${i}`;
  category.name = name;
  category.slug = name.toLowerCase().replace(' ', '-');
  return category;
})

var products = ['Camisa Polo', 'Bola Vermelha'].map((name, i) => {
  var product = new Product();
  product.id = `p_${i}`;
  product.name = name;
  product.slug = name.toLowerCase().replace(' ', '-');
  product.categories = [`c_${i}`];
  product.brand = `b_${i}`;
  return product;
});


module.exports = {
  // Export methods that your schema can use to interact with your database
  getBrand: (id) => brands.find(b => b.id === id),
  getProduct: (id) => products.find(p => p.id === id),
  getCategory: (id) => categories.find(c => c.id === id),
  getCategories: (ids) => {
    return categories.filter((category) => {
      return (ids.filter((id) => id === category.id)).length > 0;
    })
  },
  Brand,
  Category,
  Product
};
