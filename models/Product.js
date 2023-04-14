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
