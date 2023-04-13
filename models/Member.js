const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const MemberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
    collection: "Members",
  }
);

MemberSchema.methods.addToCart = function(product) {
        let cartProductIndex, updatedCartItems;
        try {
            cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
            });
            updatedCartItems = [...this.cart.items];
        } catch (err) {
            cartProductIndex = -1;
            updatedCartItems = [];
        }

        let newQuantity = 1;

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: product._id,
                quantity: newQuantity
            });
        }

        const updatedcart = {
          items: updatedCartItems,
        };
        this.cart = updatedcart;
        return this.save();
};

MemberSchema.methods.removeFromCart = function(productId) {
     const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    })
    this.cart.items = updatedCartItems;
    return this.save();
}

MemberSchema.methods.clearCart = function(){
    this.cart = {items: []};
    return this.save();
}

MemberSchema.pre("save", async function(next) {
  let member = this;

  // only hash the password if it has been modified (or is new)
  if (!member.isModified("password")) return next();

  // generate a salt
  const salt = await bcrypt.genSalt(10);

  // hash the password along with our new salt
  const hash = await bcrypt.hash(member.password, salt);

  member.password = hash;
  next();
})

MemberSchema.methods.comparePassword = async function(enteredPassword, cb) {
    bcrypt.compare(enteredPassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}


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