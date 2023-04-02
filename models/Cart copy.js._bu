const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

class Cart {
    static addProduct(id, productPrice) {
        //fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
          let cart = {
            products: [],
            totalPrice: 0,
          };
          if (!err) {
            cart = JSON.parse(fileContent);
          }
          //analyze the cart, find the existing product
          const existProductIndex = cart.products.findIndex(
            (prod) => prod.id === id
          );
          const existProduct = cart.products[existProductIndex];
          // update the total proce
          let updatedProduct;
          // add new product and comppute total qty
          if (existProduct) {
            updatedProduct = { ...existProduct };
            updatedProduct.qty = updatedProduct.qty + 1;
            cart.products = [...cart.products];
            cart.products[existProductIndex] = updatedProduct;
          } else {
            updatedProduct = {
              id: id,
              qty: 1,
            };
            cart.products = [...cart.products, updatedProduct];
          }
          //parse the product price  before adding to the database
          // productPrice = productPrice.replace("$", "");
          // productPrice = productPrice.replace(",", "");

        let productPriceParsed = parseFloat(productPrice);

          cart.totalPrice = cart.totalPrice + +productPriceParsed;
          fs.writeFile(p, JSON.stringify(cart), (err) => {
            console.log(err);
          });
        })
    }

    static deleteProduct(id, prodPrice) {
      //read/look in json
      fs.readFile(p, (err, fileContent) => {
        //if theres an error, do nothing
        if (err) {
          console.log(err);
          return;
        }
        //continue and update the cart
        const updatedCart = {...JSON.parse(fileContent)};
        //look for the index of the id you are trying to delete
        const product = updatedCart.products.find(prod => prod.id === id);
        //check if the product exist, if it doesnt, break
        if (!product) {
          return;
        }
        //check the qty
        const prodQty = product.qty;
        updatedCart.products = updatedCart.products.filter(
          prod => prod.id !== id
        );
        //update the cart , update the total price and quantity
        updatedCart.totalPrice = updatedCart.totalPrice - prodPrice * prodQty;
        //now, write the updated file in product.json
        fs.writeFile(p, JSON.stringify(updatedCart), err => {
          console.log(err)
        })
      })
    }
    //populate cart
    static getCart(cb) {
      fs.readFile(p, (err, fileContent) => {
        const cart = JSON.parse(fileContent);
        if (err) {
          cb(null)
        } else {
          cb(cart);
        }
      })
    }
}





module.exports = Cart;