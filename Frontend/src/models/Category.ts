// import mongoose from 'mongoose';

// const categorySchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   image: { type: String, required: true } // Add an image URL for category display
// });

// module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);


import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true } // Add an image URL for category display
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);