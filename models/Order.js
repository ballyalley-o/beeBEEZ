const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    products: [
        {
    product: {
        type: Object,
        required: true
        },
    quantity: {
        type: Number,
        required: true
        }
        }
    ],
    member: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        memberId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Member'
        }
    }
},
{
    timestamps: true,
    collection: 'Orders'

})



module.exports = mongoose.model('Order', OrderSchema)