import { useState, useEffect, useCallback } from 'react';
import {
  getKioskData,
  updateKioskData,
  updateLocaleAPI,
  updateMfaAPI,
  updateUpdatesAPI,
  updateEventsAPI,
  updateOfficersAPI,
  updateGroupsAPI,
  updateActivitiesAPI,
  updateMinistriesAPI,
  syncGroupsFromSheetAPI,
} from '../services/api';
import type { KioskData } from '../types';

export function useAdminKioskData(activeTab: string) {
  const [data, setData] = useState<KioskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [sheetSyncing, setSheetSyncing] = useState(false);
  const [sheetSyncMsg, setSheetSyncMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');

  useEffect(() => {
    setCurrentPage(1);
    setPageInput('1');
  }, [activeTab, searchTerm]);

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const fetchData = useCallback(async () => {
    try {
      const res = await getKioskData();
      setData(res);
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (updatedData: KioskData) => {
    setSaving(true);
    setMessage('');
    try {
      if (activeTab === 'locale') await updateLocaleAPI(updatedData.localeInfo);
      else if (activeTab === 'mfa-poster')
        await updateMfaAPI(updatedData.mfaPosterUrl || '', updatedData.mfaDriveLink || '');
      else if (activeTab === 'updates') await updateUpdatesAPI(updatedData.updates || []);
      else if (activeTab === 'events') await updateEventsAPI(updatedData.events || []);
      else if (activeTab === 'officers') await updateOfficersAPI(updatedData.officers || []);
      else if (activeTab === 'groups') await updateGroupsAPI(updatedData.groups || []);
      else if (activeTab === 'activities') await updateActivitiesAPI(updatedData.activities || []);
      else if (activeTab === 'ministries') await updateMinistriesAPI(updatedData.ministries || []);
      else await updateKioskData(updatedData);

      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSheetSync = async () => {
    setSheetSyncing(true);
    setSheetSyncMsg('');
    try {
      const result = await syncGroupsFromSheetAPI();
      setSheetSyncMsg(`✅ Synced ${result.groupCount} groups from Google Sheet!`);
      await fetchData();
      setTimeout(() => setSheetSyncMsg(''), 5000);
    } catch (err) {
      console.error(err);
      setSheetSyncMsg('❌ Failed to sync from Google Sheet');
      setTimeout(() => setSheetSyncMsg(''), 5000);
    } finally {
      setSheetSyncing(false);
    }
  };

  return {
    data,
    setData,
    loading,
    saving,
    message,
    setMessage,
    fetchData,
    handleSave,
    handleSheetSync,
    sheetSyncing,
    sheetSyncMsg,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    pageInput,
    setPageInput,
  };
}
