const Product = require("../models/Product");

const ADMIN = "admin/add-product";
const PRODUCTS = "admin/products";


//method GET
//url
exports.getAddProduct = (req, res, next) => {
  res.render(ADMIN, {
    pageTitle: "Add Product",
    path: "admin/add-product",
    activeAddProduct: true,
  });
};

//method POST
//url
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect("/");
};


exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render(PRODUCTS, {
            prods: products,
            path: 'admin/products',
            pageTitle: 'Admin: Products'
        })
    })
}