import mongoose from 'mongoose';

const mfaSchema = new mongoose.Schema({
  _id: { type: String, default: 'main' },
  mfaPosterUrl: { type: String, default: '' },
  mfaDriveLink: { type: String, default: '' }
}, { versionKey: false });

export const MFAModel = mongoose.model('MFA', mfaSchema, 'mfa_info');
