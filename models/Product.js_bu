const db = require('../helper/db')
const Cart = require('./Cart.js')

class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }


    save() {
      return db.execute(
        //mysql query to insert into products table, the values of the product, also the ? are for cyber injection protection
        //where they use the query from the array to attack the database
        "INSERT INTO beeBEEZ.products (title, imageUrl, price, description) VALUES (?, ?, ?, ?)",
      [
        this.title,
        this.price,
        this.imageUrl,
        this.description
      ])
    }

    static deleteById(id) {

    }

    static fetchAll() {
      return db.execute("SELECT * FROM beeBEEZ.products")
    }

    static findById(id) {
      return db.execute("SELECT * FROM beeBEEZ.products WHERE products.id = ?", [id])
    }
}

module.exports = Product



