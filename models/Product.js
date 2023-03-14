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
}

module.exports = Product



