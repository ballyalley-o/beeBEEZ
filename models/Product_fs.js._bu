const fs = require('fs')
const path = require('path')
const Cart = require('./Cart.js')

const p = path.join(
    path.dirname(require.main.filename),
    "data",
    "products.json"
  );

const getProductsFromFile = (cb) => {
     fs.readFile(p, (err, fileContent) => {
       if (err) {
         cb([]);
       } else {
         cb(JSON.parse(fileContent));
       }
     });
}

class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
      //create random id for each product
       getProductsFromFile(products => {
              if (this.id) {
                //check what index the id you will be editing
                const existProductIndex = products.findIndex(
                  prodId => prodId.id === this.id
                )
                const updatedProducts = [...products];
                updatedProducts[existProductIndex] = this;
                //will write and replace old file content
                 fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                  console.log(err);
                 });
                } else {
                //if not editing, create a new one/add one
                //create random id for each product
                this.id = Math.floor(Math.random() * 10000).toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                  console.log(err);
                });
              }
        })
    }

    static deleteById(id) {
      getProductsFromFile((products) => {
        //find the product to be delete
        const product = products.find(prod => prod.id !== id)
        //update cart, check if thats the product you are trying to delete, if not leave them.
        const updatedProducts = products.filter(prod => prod.id !== id);
        //write the and update the json file
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          if (!err) {
            Cart.deleteProduct(id, product.price);
          }
        })
      });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }

    static findById(id, cb) {
      getProductsFromFile(products => {
        const product = products.find(p => p.id === id);
          console.log(product)
          cb(product)
      })
    }
}

module.exports = Product



