const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findOne( {where: { id:prodId }})
  .then((product) => {
    console.log(product, 'details')
      res.render('shop/product-detail', { 
        product: product,
        pageTitle: 'Product',
        path:'/products'})
  })
  .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
  console.log(req.user)
  req.user
  .getCart()
  .then(cart => {
    // console.log(cart);
    return cart.getProducts();
  })
  .then(products => {
    // console.log(products);
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    })
  })
  .catch(err => console.log(err));
  // res.render('shop/cart', {
  //   path: '/cart',
  //   pageTitle: 'Your Cart'
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let newQuantity = 1;
  let fetchedCart;
  req.user
  .getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts({where: {id: prodId}});
  })
  .then(products => {
    console.log(products,products.length, 'line 74');
    let product;
    if(products.length > 0){
      product = products[0];
    }
    if(product){

      let {cartItem: {quantity}} = product;
      console.log(quantity, product.cartItem.quantity, 'destructured quantity')
      newQuantity += quantity;
      console.log(newQuantity,'after increment');
      return product;
    }
    return Product.findOne({where: {id: prodId}});
  })
  .then(product => {
    console.log(product,'before adding to cart')
    return fetchedCart.addProduct(product, { through: {quantity: newQuantity} })
  })
  .then(r => {
    console.log(r,'quantity updated');
    res.redirect('/cart');
  })
  .catch(err => console.log(err));

  // Product.findProduct(prodId, (product) => {
  //   Cart.addProduct(prodId, product.price);
  // })
  // res.redirect('/cart');
}

exports.deleteCartItem = (req, res, next) => {
  const itemId = req.body.productId;
  let fetchedCart;
  // Product.findOne({where: {id: itemId}})
  // .then(product => console.log(product,product.cartItem,'as in products table'))
  // console.log(req.body,'checking');
  req.user
  .getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts({where: {id: itemId}})
  })
  .then(products => {
    let product = products[0];
    console.log(product,'-- before delete');
    return product.cartItem.destroy();
  })
  .then(result => {    
    console.log(result,'-- after delete');
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
}

// exports.deleteProduct = (req, res, next) => {
//   const productId = req.params.prodId;
//   Product.deleteProductById (productId, () => res.redirect('/products'));
// }

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};