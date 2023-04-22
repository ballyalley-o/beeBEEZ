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
  required: true,
  minlength: [10, 'Description must be at least 10 characters long'],
 },
 imageUrl: {
  type: String,
  required: true,
  // match: [/^https?:\/\//, 'Please add a valid URL']
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
