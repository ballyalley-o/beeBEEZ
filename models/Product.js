const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
 title: {
  type: String,
  required: true
 },
 price: {
  type: Number,
  required: true,
  },
 description: {
  type: String,
  required: true
 },
 imageUrl: {
  type: String,
  required: true
 },
 memberId: {
  type: Schema.Types.ObjectId,
  ref: 'Member',
 }
},
{
  timestamps: true,
  collection: 'Products'
})


module.exports = mongoose.model('Product', ProductSchema);
// const mongodb = require('mongodb');

// class Product {
//   constructor(title, price, imageUrl, description, id, memberId) {
//     this.title = title;
//     this.price = price.replace("$", "");
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.memberId = memberId;
//   }
//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       //update the product
//       dbOp = db
//       .collection("products")
//       .updateOne({_id: this._id}, {$set: this});
//     } else {
//       dbOp = db
//       .collection("products")
//       .insertOne(this);
//     }
//     return dbOp
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => console.log(err));
//     }

//     static fetchAll() {
//       const db = getDb();
//       return db
//         .collection('products')
//         .find()
//         .toArray()
//         .then(products => {
//           console.log(products);
//           return products;
//         })
//         .catch(err => console.log(err));
//   }
//   static findByPk(prodId) {
//     const db = getDb();
//     return db
//     .collection('products')
//     .find({_id: new mongodb.ObjectId(prodId)})
//     .next()
//     .then(product => {
//       console.log(product);
//       return product;
//     })
//     .catch(err => console.log(err));
//   }

//   static deleteById(prodId) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .deleteOne({
//                   _id: new mongodb
//                   .ObjectId(prodId)
//                 }).then(result => {
//                   console.log("PRODUCT DELETED".green.inverse);
//                 })
//                 .catch(err => console.log(err));
//               }
// }

// module.exports = Product;

