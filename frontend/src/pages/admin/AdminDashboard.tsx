import { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import LocaleTab from '../../components/admin/dashboard/LocaleTab';
import MfaPosterTab from '../../components/admin/dashboard/MfaPosterTab';
import UpdatesTab from '../../components/admin/dashboard/UpdatesTab';
import EventsTab from '../../components/admin/dashboard/EventsTab';
import OfficersTab from '../../components/admin/dashboard/OfficersTab';
import GroupsTab from '../../components/admin/dashboard/GroupsTab';
import ActivitiesTab from '../../components/admin/dashboard/ActivitiesTab';
import MinistriesTab from '../../components/admin/dashboard/MinistriesTab';
import { useAdminKioskData } from '../../hooks/useAdminKioskData';

function tabTitle(activeTab: string): string {
  return activeTab.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('locale');
  const {
    data,
    setData,
    loading,
    saving,
    message,
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
  } = useAdminKioskData(activeTab);

  const handleLocaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;
    setData({
      ...data,
      localeInfo: { ...data.localeInfo, [e.target.name]: e.target.value },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" aria-hidden />
        <p className="text-gray-400 text-sm">Loading kiosk data…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6">
        <div className="glass-card rounded-2xl max-w-md p-8 text-center border-red-500/20">
          <p className="text-red-400 font-medium">Failed to load system data.</p>
          <p className="text-gray-500 text-sm mt-2">Check the API and MongoDB connection, then refresh.</p>
        </div>
      </div>
    );
  }

  const listProps = {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    pageInput,
    setPageInput,
  };

  return (
    <div className="flex min-h-screen bg-navy-950 text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8 pb-6 border-b border-navy-800/60">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500/90 mb-1">System admin</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{tabTitle(activeTab)}</h1>
              <p className="text-sm text-gray-500 mt-1">Edit content below, then save changes.</p>
            </div>
            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              {message && (
                <span
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg border ${
                    message.includes('success')
                      ? 'text-green-400 bg-green-500/10 border-green-500/25'
                      : 'text-red-400 bg-red-500/10 border-red-500/25'
                  }`}
                >
                  {message}
                </span>
              )}
              <button
                type="button"
                onClick={() => handleSave(data)}
                disabled={saving}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-navy-900 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-amber-500/15 transition disabled:opacity-50 disabled:pointer-events-none"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </header>

          <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/30">
            {activeTab === 'locale' && <LocaleTab data={data} onLocaleChange={handleLocaleChange} />}
            {activeTab === 'mfa-poster' && <MfaPosterTab data={data} setData={setData} />}
            {activeTab === 'updates' && <UpdatesTab data={data} setData={setData} {...listProps} />}
            {activeTab === 'events' && <EventsTab data={data} setData={setData} {...listProps} />}
            {activeTab === 'officers' && <OfficersTab data={data} setData={setData} {...listProps} />}
            {activeTab === 'groups' && (
              <GroupsTab
                data={data}
                setData={setData}
                {...listProps}
                sheetSyncing={sheetSyncing}
                sheetSyncMsg={sheetSyncMsg}
                onSheetSync={handleSheetSync}
              />
            )}
            {activeTab === 'activities' && <ActivitiesTab data={data} setData={setData} {...listProps} />}
            {activeTab === 'ministries' && <MinistriesTab data={data} setData={setData} {...listProps} />}
          </div>
        </div>
      </div>
    </div>
  );
}
