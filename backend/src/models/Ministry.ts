import mongoose from 'mongoose';

const ministrySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  coordinators: [{
     name: { type: String, default: '' },
     picture: { type: String, default: '' }
  }],
  members: [{
     name: { type: String, default: '' }
  }]
}, { versionKey: false });

export const MinistryModel = mongoose.model('Ministry', ministrySchema, 'ministries');
