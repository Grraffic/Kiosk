import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { LocaleModel } from '../models/Locale';
import { MFAModel } from '../models/MFA';
import { UpdateModel } from '../models/Update';
import { EventModel } from '../models/Event';
import { OfficerModel } from '../models/Officer';
import { GroupModel } from '../models/Group';
import { ActivityModel } from '../models/Activity';
import { MinistryModel } from '../models/Ministry';

const syncArrayToModel = async (Model: any, arr: any[]) => {
   await Model.deleteMany({});
   if (arr && arr.length > 0) {
      const docs = arr.map((item: any) => {
        const { id, ...rest } = item;
        return { _id: id || Date.now().toString() + Math.random().toString(), ...rest, id: id || Date.now().toString() };
      });
      await Model.insertMany(docs);
   }
};

const mapFromDB = (docs: any[]) => {
    return docs.map((d: any) => {
        const obj = d.toObject ? d.toObject() : d;
        return { ...obj, id: obj._id ? obj._id.toString() : obj.id };
    });
};

const migrateData = async (content: any) => {
    console.log("Migrating monolithic data into Mongoose Mapped models...");
    await LocaleModel.findOneAndUpdate({ _id: 'main' as any }, content.localeInfo, { upsert: true, new: true, setDefaultsOnInsert: true });
    await MFAModel.findOneAndUpdate({ _id: 'main' as any }, { mfaPosterUrl: content.mfaPosterUrl, mfaDriveLink: content.mfaDriveLink }, { upsert: true, new: true, setDefaultsOnInsert: true });
    
    await Promise.all([
       syncArrayToModel(UpdateModel, content.updates || []),
       syncArrayToModel(EventModel, content.events || []),
       syncArrayToModel(OfficerModel, content.officers || []),
       syncArrayToModel(GroupModel, content.groups || []),
       syncArrayToModel(ActivityModel, content.activities || []),
       syncArrayToModel(MinistryModel, content.ministries || []),
    ]);
};

export const getContent = async (req: Request, res: Response) => {
  try {
    const localeDoc = await LocaleModel.findOne({ _id: 'main' as any });
    if (!localeDoc) {
        let contentToMigrate = null;
        
        // Try native fallback if needed
        const nativeDb = mongoose.connection.db;
        if (nativeDb) {
            const oldData = await nativeDb.collection('kiosk_content').findOne({ _id: 'main_dashboard' as any });
            if (oldData && oldData.content) {
                contentToMigrate = oldData.content;
            }
        }

        if (!contentToMigrate) {
            const fallbackFile = path.join(__dirname, '../data/kioskData.json');
            if (fs.existsSync(fallbackFile)) {
                contentToMigrate = JSON.parse(fs.readFileSync(fallbackFile, 'utf-8'));
            }
        }
        
        if (contentToMigrate) {
            await migrateData(contentToMigrate);
        } else {
            return res.json({}); // completely empty fresh start
        }
    }

    const [
      refreshedLocale, 
      mfaDoc, 
      updatesCur, 
      eventsCur, 
      officersCur, 
      groupsCur, 
      activitiesCur, 
      ministriesCur
    ] = await Promise.all([
       LocaleModel.findOne({ _id: 'main' as any }),
       MFAModel.findOne({ _id: 'main' as any }),
       UpdateModel.find({}),
       EventModel.find({}),
       OfficerModel.find({}),
       GroupModel.find({}),
       ActivityModel.find({}),
       MinistryModel.find({})
    ]);

    const loc: any = refreshedLocale ? refreshedLocale.toObject() : {};
    delete loc._id;
    delete loc.id;

    const data = {
        localeInfo: loc,
        mfaPosterUrl: mfaDoc?.mfaPosterUrl || '',
        mfaDriveLink: mfaDoc?.mfaDriveLink || '',
        updates: mapFromDB(updatesCur),
        events: mapFromDB(eventsCur),
        officers: mapFromDB(officersCur),
        groups: mapFromDB(groupsCur),
        activities: mapFromDB(activitiesCur),
        ministries: mapFromDB(ministriesCur)
    };

    res.json(data);

  } catch (err) {
    console.error('Error reading Mongoose mapped data:', err);
    res.status(500).json({ message: 'Failed to read content data' });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const updatedData = req.body;
    if (!updatedData || typeof updatedData !== 'object') {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    await LocaleModel.findOneAndUpdate({ _id: 'main' as any }, updatedData.localeInfo, { upsert: true });
    await MFAModel.findOneAndUpdate({ _id: 'main' as any }, { mfaPosterUrl: updatedData.mfaPosterUrl, mfaDriveLink: updatedData.mfaDriveLink }, { upsert: true });

    await Promise.all([
       syncArrayToModel(UpdateModel, updatedData.updates),
       syncArrayToModel(EventModel, updatedData.events),
       syncArrayToModel(OfficerModel, updatedData.officers),
       syncArrayToModel(GroupModel, updatedData.groups),
       syncArrayToModel(ActivityModel, updatedData.activities),
       syncArrayToModel(MinistryModel, updatedData.ministries),
    ]);

    import('../index').then(({ io }) => {
       io.emit('kiosk_data_updated', updatedData);
    }).catch(err => console.error("Could not emit socket", err));

    res.json(updatedData);
  } catch (err) {
    console.error('Error writing separated Mongoose data:', err);
    res.status(500).json({ message: 'Failed to write content data' });
  }
};

const broadcastUpdate = async () => {
    const [
      refreshedLocale, mfaDoc, updatesCur, eventsCur, officersCur, groupsCur, activitiesCur, ministriesCur
    ] = await Promise.all([
       LocaleModel.findOne({ _id: 'main' as any }), MFAModel.findOne({ _id: 'main' as any }), 
       UpdateModel.find({}), EventModel.find({}), OfficerModel.find({}), 
       GroupModel.find({}), ActivityModel.find({}), MinistryModel.find({})
    ]);
    const loc: any = refreshedLocale ? refreshedLocale.toObject() : {};
    delete loc._id; delete loc.id;
    const data = {
        localeInfo: loc, mfaPosterUrl: mfaDoc?.mfaPosterUrl || '', mfaDriveLink: mfaDoc?.mfaDriveLink || '',
        updates: mapFromDB(updatesCur), events: mapFromDB(eventsCur), officers: mapFromDB(officersCur),
        groups: mapFromDB(groupsCur), activities: mapFromDB(activitiesCur), ministries: mapFromDB(ministriesCur)
    };
    import('../index').then(({ io }) => io.emit('kiosk_data_updated', data)).catch(err => console.error("Could not emit socket", err));
};

export const updateLocale = async (req: Request, res: Response) => {
    try { await LocaleModel.findOneAndUpdate({ _id: 'main' as any }, req.body, { upsert: true }); await broadcastUpdate(); res.json({ success: true }); }
    catch (err) { res.status(500).json({ message: 'Failed to update locale' }); }
};

export const updateMFA = async (req: Request, res: Response) => {
    try { await MFAModel.findOneAndUpdate({ _id: 'main' as any }, req.body, { upsert: true }); await broadcastUpdate(); res.json({ success: true }); }
    catch (err) { res.status(500).json({ message: 'Failed to update mfa' }); }
};

export const updateUpdates = async (req: Request, res: Response) => {
    try { await syncArrayToModel(UpdateModel, req.body); await broadcastUpdate(); res.json({ success: true }); }
    catch (err) { res.status(500).json({ message: 'Failed to update announcements' }); }
};

export const updateEvents = async (req: Request, res: Response) => {
    try { await syncArrayToModel(EventModel, req.body); await broadcastUpdate(); res.json({ success: true }); }
    catch (err) { res.status(500).json({ message: 'Failed to update events' }); }
};

export const updateOfficers = async (req: Request, res: Response) => {
    try { await syncArrayToModel(OfficerModel, req.body); await broadcastUpdate(); res.json({ success: true }); }
    catch (err) { res.status(500).json({ message: 'Failed to update officers' }); }
};

export const updateGroups = async (req: Request, res: Response) => {
    try { await syncArrayToModel(GroupModel, req.body); await broadcastUpdate(); res.json({ success: true }); }
    catch (err) { res.status(500).json({ message: 'Failed to update groups' }); }
};

export const updateActivities = async (req: Request, res: Response) => {
    try { await syncArrayToModel(ActivityModel, req.body); await broadcastUpdate(); res.json({ success: true }); }
    catch (err) { res.status(500).json({ message: 'Failed to update activities' }); }
};

export const updateMinistries = async (req: Request, res: Response) => {
    try { await syncArrayToModel(MinistryModel, req.body); await broadcastUpdate(); res.json({ success: true }); }
    catch (err) { res.status(500).json({ message: 'Failed to update ministries' }); }
};

