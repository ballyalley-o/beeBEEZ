const Product = require("../models/Product");
const Member = require("../models/Member");


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
  const product = new Product({
                                title: title,
                                price: price.replace(/\$/g, ''),
                                description: description,
                                imageUrl: imageUrl,
                                memberId: req.member
                              });
  product
    .save()
    .then((result) => {

      console.log("PRODUCT CREATED".green.inverse);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

//method GET
//url /edit-product/:productId
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
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
  .catch(err => console.log(err))
}

exports.postEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price.replace(/\$/g, "");
  const updatedDesc = req.body.description;
  Product
    .findById(prodId)
    .then(product => {
                      product.title = updatedTitle;
                      product.imageUrl = updatedImageUrl;
                      product.price = updatedPrice;
                      product.description = updatedDesc;
                      return product.save();
                    })
    .then(result => {
      console.log("PRODUCT UPDATED".green.inverse);
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err))
}


exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render(PRODUCTS, {
        prods: products,
        path: "admin/products",
        pageTitle: "Admin: Products"
      })
    }).then(result => {
      console.log("Logging in ADMIN...".white.inverse);
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
  .then(result => {
    console.log("PRODUCT DELETED".green.inverse);
    res.redirect("/admin/products");
  })
  .catch(err => console.log(err))

};