const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
  .createProduct( {
    title: title,
    price: price,
    imageUrl:imageUrl,
    description: description
  })
  .then( () => {res.redirect('/admin/products')})
  .catch(err => console.log(err));
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const prodId = req.params.prodId;
  // Product.findOne({where:{id:prodId}})
  // .then(product => {
  //   if(!product){
  //     return res.redirect('/');
  //   }
  //   console.log(product);
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: product
  //   })
  // })
  // .catch(err => console.log(err));
  
  req.user
  .getProducts({where: {id: prodId}})
  .then(product => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product[0]
    })
  })
  .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(req.body, 'line 63');

  const updatedTitle = req.body.title;
  const updatedImage = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;

  Product.findOne({where: {id: prodId}})
  .then(product => {
    console.log(product.dataValues,product.title,product.dataValues.title,'before edit');
    product.title = updatedTitle;
    product.imageUrl = updatedImage;
    product.price = updatedPrice;
    product.description = updatedDesc;
    return product.save()
  })
  .then((r) => {
    console.log(r.dataValues,r.description,"Update success");
    res.redirect('/admin/products')
  })
  .catch(err => console.log(err));
}
exports.getProducts = (req, res, next) => {
  // Product.findAll()
  // .then( (products) => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   })
  // })
  // .catch(err => console.log(err));

  req.user
  .getProducts()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    })
  })
  .catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  Product.findOne({where: {id:prodId}})
  .then( (product) => product.destroy())
  .then( () => {
    console.log("deletion success");
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
}