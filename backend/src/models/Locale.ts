import mongoose from 'mongoose';

const localeSchema = new mongoose.Schema({
  _id: { type: String, default: 'main' },
  locale: { type: String, default: '' },
  address: { type: String, default: '' },
  contactPerson: { type: String, default: '' },
  contactDetails: { type: String, default: '' },
  googleMapLink: { type: String, default: '' }
}, { versionKey: false });

export const LocaleModel = mongoose.model('Locale', localeSchema, 'locale_info');
