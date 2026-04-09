import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  text: { type: String, required: true }
}, { versionKey: false });

export const UpdateModel = mongoose.model('Update', updateSchema, 'updates');
