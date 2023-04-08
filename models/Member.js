const mongodb = require('mongodb');
const getDb = require('../helper/db').getDb;

const ObjectId = mongodb.ObjectId;

class Member {
    constructor(membername, email, cart, id) {
        this.membername = membername;
        this.email =email;
        this.cart = cart;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        db.collection('members').insertOne(this);
        let dbOp;
        if (this._id) {

        }
    }

    addToCart(product) {
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
                productId: new ObjectId(product._id),
                quantity: newQuantity
            });
        }

        const updatedcart = {
          items: updatedCartItems,
        };
        const db = getDb();
        return db
            .collection('members')
            .updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set: {cart: updatedcart}}
            );
    }

    getCart() {
        return this.cart
    }

    static findById(memberId) {
        const db = getDb();
        return db
            .collection('members')
            .findOne({_id: new mongodb.ObjectId(memberId)})
            .then(member => {
                console.log(member);
                return member;
            })
            .catch(err => console.log(err));
    }
}


module.exports = Member;