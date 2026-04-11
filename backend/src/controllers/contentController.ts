import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
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

// ─── Google Sheet Sync ──────────────────────────────────────────────────────

const SHEET_ID = '1kqm91zg_dmyiZ7440rALe-rQxLqUFc4Sba0EC9b2a6w';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

const fetchSheetText = (): Promise<string> =>
    new Promise((resolve, reject) => {
        https.get(SHEET_URL, (res) => {
            let data = '';
            res.on('data', (chunk: Buffer) => { data += chunk.toString(); });
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });

const parseSheetToGroups = (raw: string): { id: string; name: string; members: { name: string }[] }[] => {
    // Strip JSONP wrapper: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) throw new Error('Could not parse sheet response');
    const json = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    const rows: any[] = json.table?.rows || [];

    const groupsMap: Map<string, { name: string; members: { name: string }[] }> = new Map();

    for (const row of rows) {
        const cells = row.c || [];
        const groupNum: string = cells[1]?.v || '';
        const memberName: string = cells[2]?.v || '';
        // Skip header rows (e.g. rows where groupNum === 'GROUP NUMBER')
        if (!groupNum || groupNum === 'GROUP NUMBER' || !memberName) continue;

        if (!groupsMap.has(groupNum)) {
            groupsMap.set(groupNum, { name: groupNum, members: [] });
        }
        groupsMap.get(groupNum)!.members.push({ name: memberName });
    }

    return Array.from(groupsMap.values()).map((g) => ({
        id: g.name.replace(/\s+/g, '_').toLowerCase(),
        name: g.name,
        members: g.members,
    }));
};

export const syncGroupsFromSheet = async (req: Request, res: Response) => {
    try {
        const raw = await fetchSheetText();
        const sheetGroups = parseSheetToGroups(raw);

        // Preserve existing toka / combinedToka / picture for each group
        const existingGroups = await GroupModel.find({});
        const existingMap = new Map(existingGroups.map((g: any) => [g._id.toString(), g.toObject()]));

        const merged = sheetGroups.map((g) => {
            const existing = existingMap.get(g.id) || {};
            return {
                ...g,
                picture: (existing as any).picture || '',
                toka: (existing as any).toka || '',
                combinedToka: (existing as any).combinedToka || '',
            };
        });

        await syncArrayToModel(GroupModel, merged);
        await broadcastUpdate();

        res.json({ success: true, groupCount: merged.length });
    } catch (err) {
        console.error('Error syncing groups from Google Sheet:', err);
        res.status(500).json({ message: 'Failed to sync groups from Google Sheet' });
    }
};

/** Called from index.ts to auto-sync on a schedule */
export const autoSyncGroupsFromSheet = async () => {
    try {
        const raw = await fetchSheetText();
        const sheetGroups = parseSheetToGroups(raw);
        const existingGroups = await GroupModel.find({});
        const existingMap = new Map(existingGroups.map((g: any) => [g._id.toString(), g.toObject()]));
        const merged = sheetGroups.map((g) => {
            const existing = existingMap.get(g.id) || {};
            return {
                ...g,
                picture: (existing as any).picture || '',
                toka: (existing as any).toka || '',
                combinedToka: (existing as any).combinedToka || '',
            };
        });
        await syncArrayToModel(GroupModel, merged);
        await broadcastUpdate();
        console.log(`[AutoSync] Groups synced from Google Sheet at ${new Date().toISOString()} (${merged.length} groups)`);
    } catch (err) {
        console.error('[AutoSync] Failed to sync groups from Google Sheet:', err);
    }
};
