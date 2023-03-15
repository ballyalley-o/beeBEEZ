const fs = require('fs')
const path = require('path')


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
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
      //create random id for each product
      this.id = Math.floor(Math.random() * 10000).toString()
       getProductsFromFile(products => {
         products.push(this);
         fs.writeFile(p, JSON.stringify(products), (err) => {
           console.log(err);
         });
       })
        fs.readFile(p,(err,fileContent)=> {})
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }

    static findById = (id, cb) => {
      getProductsByFile(products => {
        const product = products.find(p => p.id === id);
          console.log(product)
          cb(product)
      })
    }
}

module.exports = Product



