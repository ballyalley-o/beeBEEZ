const Product = require("../models/Product");

const EDIT = "admin/edit-product";
const PRODUCTS = "admin/products";
require('colors')


//method GET
//url
exports.getAddProduct = (req, res, next) => {
  res.render(EDIT, {
    pageTitle: "Add Product",
    path: "admin/add-product",
    editing: false
  });
  console.log("Logging in ADD-PRODUCT...".white.inverse);
};

//method POST
//url
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
  .then(result => {
    console.log("Product created".green.inverse)
    // console.log(result)
  })
  .catch(err => console.log(err))
};

//method GET
//url /edit-product/:productId
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/')
    }
    res.render(EDIT, {
      pageTitle: "Edit Product",
      path: EDIT,
      editing: editMode,
      product: product
    });
  })
}

exports.postEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
                                      prodId,
                                      updatedTitle,
                                      updatedImageUrl,
                                      updatedPrice,
                                      updatedDesc
                                    )
    updatedProduct.save();
    res.redirect('/admin/products')
}


exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render(PRODUCTS, {
            prods: products,
            path: 'admin/products',
            pageTitle: 'Admin: Products'
        })
    })
  console.log("Logging in ADMIN...".white.inverse);
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products')
};