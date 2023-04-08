const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                            type: Schema.Types.ObjectId,
                            ref: 'Product',
                            required: true
                            },
                quantity: {
                            type: Number,
                            required: true
                          }
            }
        ]
    }
},
{
    timestamps: true,
    collection: 'Members'
})


module.exports = mongoose.model('Member', MemberSchema);

// const mongodb = require('mongodb');


// const ObjectId = mongodb.ObjectId;

// class Member {
//     constructor(membername, email, cart, id) {
//         this.membername = membername;
//         this.email =email;
            // this.price = price.replace("$", "");
//         this.cart = cart;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//     }

//     save() {
//         const db = getDb();
//         db.collection('members').insertOne(this);
//         let dbOp;
//         if (this._id) {

//         }
//     }

//     addToCart(product) {
//         let cartProductIndex, updatedCartItems;
//         try {
//             cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//             });
//             updatedCartItems = [...this.cart.items];
//         } catch (err) {
//             cartProductIndex = -1;
//             updatedCartItems = [];
//         }

//         let newQuantity = 1;
//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity
//             });
//         }

//         const updatedcart = {
//           items: updatedCartItems,
//         };
//         const db = getDb();
//         return db
//             .collection('members')
//             .updateOne(
//                 {_id: new ObjectId(this._id)},
//                 {$set: {cart: updatedcart}}
//             );
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         });
//         return db
//             .collection('products')
//             .find({
//             _id: {$in: productIds}})
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p, quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString()
//                         }).quantity
//                     }
//                 })
//             })
//             .catch(err => console.log(err));
//     }

//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         })
//         const db = getDb();
//         return db
//         .collection("members")
//         .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: {items: updatedCartItems} } }
//         );
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//         .then(products => {
//              const order = {
//                items: products,
//                member: {
//                  _id: new ObjectId(this._id),
//                  name: this.name,
//                },
//              };
//              return db.collection("orders").insertOne(order);
//         })
//         .then(result => {
//             this.cart = {items: []}
//             return db
//               .collection("members")
//               .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: { items: [] } } }
//               );
//         })
//         .catch(err => {
//             console.log(err)
//         })
//     }

//     getOrders() {
//         const db = getDb()
//         return db
//             .collection('orders')
//             .find({'member._id': new ObjectId(this._id)})
//             .toArray()
//             .then()
//             .catch(err => {
//                 console.log(err)
//             })
//     }

//     static findById(memberId) {
//         const db = getDb();
//         return db
//             .collection('members')
//             .findOne({_id: new mongodb.ObjectId(memberId)})
//             .then(member => {
//                 console.log(member);
//                 return member;
//             })
//             .catch(err => console.log(err));
//     }
// }


// module.exports = Member;