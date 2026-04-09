import { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { 
  getKioskData, updateKioskData,
  updateLocaleAPI, updateMfaAPI, updateUpdatesAPI, updateEventsAPI,
  updateOfficersAPI, updateGroupsAPI, updateActivitiesAPI, updateMinistriesAPI
} from '../../services/api';
import ImageUpload from '../../components/admin/ImageUpload';
import type { KioskData } from '../../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('locale');
  const [data, setData] = useState<KioskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');

  // Reset pagination when searching or switching tabs
  useEffect(() => {
    setCurrentPage(1);
    setPageInput('1');
  }, [activeTab, searchTerm]);

  // Keep pageInput synced when currentPage changes via Prev/Next buttons
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getKioskData();
      setData(res);
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedData: KioskData) => {
    setSaving(true);
    setMessage('');
    try {
      if (activeTab === 'locale') await updateLocaleAPI(updatedData.localeInfo);
      else if (activeTab === 'mfa-poster') await updateMfaAPI(updatedData.mfaPosterUrl || '', updatedData.mfaDriveLink || '');
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
      setMessage('Failed to save settings Context');
    } finally {
      setSaving(false);
    }
  };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;
    setData({
      ...data,
      localeInfo: { ...data.localeInfo, [e.target.name]: e.target.value }
    });
  };

  const renderSearchBar = () => (
    <div className="flex justify-end mb-4">
      <input 
        type="text" 
        placeholder="Search items..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)}
        className="bg-navy-900 border border-white/10 rounded-lg p-2 text-sm text-white outline-none w-full max-w-xs focus:border-amber-500 transition-colors"
      />
    </div>
  );

  const renderPagination = (arrayLength: number) => {
    const totalPages = Math.ceil(arrayLength / 5) || 1;
    return (
      <div className="flex justify-between items-center mt-6 border-t border-white/5 pt-4">
        <div className="text-gray-400 text-sm">
          Page {currentPage} out of {totalPages}
        </div>
        <div className="flex items-center gap-4">
          <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 bg-navy-800 text-white rounded-lg disabled:opacity-50 text-sm hover:bg-navy-700 transition">Prev</button>
          <input 
             type="text" 
             value={pageInput}
             onChange={(e) => setPageInput(e.target.value)}
             onKeyDown={(e) => {
                if (e.key === 'Enter') {
                   const p = parseInt(pageInput, 10);
                   if (!isNaN(p) && p >= 1 && p <= totalPages) setCurrentPage(p);
                   else setPageInput(currentPage.toString());
                }
             }}
             onBlur={() => {
                const p = parseInt(pageInput, 10);
                if (!isNaN(p) && p >= 1 && p <= totalPages) setCurrentPage(p);
                else setPageInput(currentPage.toString());
             }}
             className="w-12 text-center bg-navy-900 border border-white/10 rounded p-1 text-sm text-white outline-none focus:border-amber-500 transition-colors"
           />
          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 bg-navy-800 text-white rounded-lg disabled:opacity-50 text-sm hover:bg-navy-700 transition">Next</button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen bg-navy-950 flex items-center justify-center text-amber-500">Loading admin data...</div>;
  if (!data) return <div className="min-h-screen bg-navy-950 flex items-center justify-center text-red-500">Failed to load system data.</div>;

  return (
    <div className="flex min-h-screen bg-navy-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white capitalize">{activeTab.replace('-', ' ')} Settings</h1>
            
            <div className="flex items-center gap-4">
              {message && (
                <span className={`text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </span>
              )}
              <button
                onClick={() => handleSave(data)}
                disabled={saving}
                className="bg-amber-500 hover:bg-amber-400 text-navy-900 px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            {activeTab === 'locale' && (
              <div className="space-y-4">
                <div><label className="block text-xs text-gray-400 mb-1">Locale Name</label><input type="text" name="locale" value={data.localeInfo.locale || ''} onChange={handleLocaleChange} className="w-full bg-navy-900 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Address</label><input type="text" name="address" value={data.localeInfo.address || ''} onChange={handleLocaleChange} className="w-full bg-navy-900 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Contact Person</label><input type="text" name="contactPerson" value={data.localeInfo.contactPerson || ''} onChange={handleLocaleChange} className="w-full bg-navy-900 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Contact Details</label><input type="text" name="contactDetails" value={data.localeInfo.contactDetails || ''} onChange={handleLocaleChange} className="w-full bg-navy-900 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Google Maps Link</label><input type="text" name="googleMapLink" value={data.localeInfo.googleMapLink || ''} onChange={handleLocaleChange} className="w-full bg-navy-900 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" /></div>
              </div>
            )}

            {activeTab === 'mfa-poster' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Poster Image URL (or Upload)</label>
                  <div className="flex gap-2 items-center">
                    <input type="text" value={data.mfaPosterUrl || ''} onChange={(e) => setData({...data, mfaPosterUrl: e.target.value})} className="flex-1 bg-navy-900 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" />
                    <ImageUpload onUploadSuccess={(url) => setData({...data, mfaPosterUrl: url})} className="text-sm py-2 px-3" />
                  </div>
                </div>
                <div><label className="block text-xs text-gray-400 mb-1">Google Drive Registration Link</label><input type="text" value={data.mfaDriveLink || ''} onChange={(e) => setData({...data, mfaDriveLink: e.target.value})} className="w-full bg-navy-900 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" /></div>
              </div>
            )}

            {activeTab === 'updates' && (() => {
              const filtered = (data.updates || []).filter(u => (u.text || '').toLowerCase().includes(searchTerm.toLowerCase()));
              const paginated = filtered.slice((currentPage - 1) * 5, currentPage * 5);
              return (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold">Marquee Updates</h3>
                  <button onClick={() => setData({...data, updates: [{ id: Date.now().toString(), text: 'New Update' }, ...(data.updates || [])]})} className="bg-amber-500/20 text-amber-400 text-sm px-3 py-1 rounded">Add Update</button>
                </div>
                {renderSearchBar()}
                {paginated.map((update) => {
                  const globalIdx = data.updates.findIndex(u => u.id === update.id);
                  if (globalIdx === -1) return null;
                  return (
                  <div key={update.id} className="flex gap-2">
                    <input type="text" value={update.text || ''} onChange={(e) => {
                      const arr = [...data.updates];
                      arr[globalIdx] = { ...update, text: e.target.value };
                      setData({...data, updates: arr});
                    }} className="flex-1 bg-navy-900 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" />
                    <button onClick={() => setData({...data, updates: data.updates.filter(u => u.id !== update.id)})} className="bg-red-500/20 text-red-500 px-3 rounded hover:bg-red-500/40">X</button>
                  </div>
                )})}
                {renderPagination(filtered.length)}
              </div>
            )})()}

            {activeTab === 'events' && (() => {
              const filtered = (data.events || []).filter(e => (e.label || '').toLowerCase().includes(searchTerm.toLowerCase()));
              const paginated = filtered.slice((currentPage - 1) * 5, currentPage * 5);
              return (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold">Upcoming Events</h3>
                  <button onClick={() => setData({...data, events: [{ id: Date.now().toString(), date: '', label: '', items: [] }, ...(data.events || [])]})} className="bg-amber-500/20 text-amber-400 text-sm px-3 py-1 rounded">Add Event</button>
                </div>
                {renderSearchBar()}
                {paginated.map((ev) => {
                  const globalIdx = data.events.findIndex(e => e.id === ev.id);
                  if (globalIdx === -1) return null;
                  return (
                  <div key={ev.id} className="glass-card border border-white/5 bg-navy-900/50 rounded-xl p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                       <h4 className="text-amber-500 font-bold text-sm uppercase tracking-widest">{ev.label || 'Untitled Event'}</h4>
                       <div className="flex items-center gap-4">
                         <label className="text-xs text-amber-300 flex items-center gap-2 cursor-pointer font-bold bg-amber-500/10 px-2 py-1 rounded">
                           <input type="checkbox" checked={ev.showCountdown || false} onChange={e => {
                             const arr = [...data.events];
                             arr[globalIdx] = { ...ev, showCountdown: e.target.checked };
                             setData({...data, events: arr});
                           }} className="accent-amber-500" /> Show Countdown
                         </label>
                         <button onClick={() => setData({...data, events: data.events.filter(e => e.id !== ev.id)})} className="text-red-500 text-xs hover:text-red-400 transition bg-red-500/10 px-2 py-1 rounded">Remove</button>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Event Title</label>
                        <input type="text" placeholder="e.g. EVENTS (Tap multimedia)" value={ev.label} onChange={(e) => { const arr = [...data.events]; arr[globalIdx] = { ...ev, label: e.target.value }; setData({...data, events: arr}); }} className="w-full bg-navy-950 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-amber-500 transition-colors shadow-inner" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Start Date</label>
                        <input type="date" value={ev.date} onChange={(e) => { const arr = [...data.events]; arr[globalIdx] = { ...ev, date: e.target.value }; setData({...data, events: arr}); }} className="w-full bg-navy-950 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-amber-500 shadow-inner" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">End Date (Optional Range)</label>
                        <input type="date" value={ev.endDate || ''} onChange={(e) => { const arr = [...data.events]; arr[globalIdx] = { ...ev, endDate: e.target.value }; setData({...data, events: arr}); }} className="w-full bg-navy-950 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-amber-500 shadow-inner" />
                      </div>
                      <div className="col-span-2">
                         <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Description</label>
                         <textarea placeholder="Write event details here..." value={ev.description || ''} onChange={(e) => { const arr = [...data.events]; arr[globalIdx] = { ...ev, description: e.target.value }; setData({...data, events: arr}); }} className="w-full bg-navy-950 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-amber-500 h-24 shadow-inner custom-slide-scroll" />
                      </div>
                    </div>
                  </div>
                )})}
                {renderPagination(filtered.length)}
              </div>
            )})()}

            {activeTab === 'officers' && (() => {
              const filtered = (data.officers || []).filter(o => 
                (o.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                (o.position || '').toLowerCase().includes(searchTerm.toLowerCase())
              );
              const paginated = filtered.slice((currentPage - 1) * 5, currentPage * 5);
              return (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold">Locale Officers</h3>
                  <button onClick={() => setData({...data, officers: [{ id: Date.now().toString(), name: '', position: '' }, ...(data.officers || [])]})} className="bg-amber-500/20 text-amber-400 text-sm px-3 py-1 rounded">Add Officer</button>
                </div>
                {renderSearchBar()}
                {paginated.map((officer) => {
                  const globalIdx = data.officers.findIndex(o => o.id === officer.id);
                  if (globalIdx === -1) return null;
                  return (
                  <div key={officer.id} className="grid grid-cols-12 gap-4 items-end bg-navy-900 border border-white/5 rounded-xl p-4">
                    <div className="col-span-12 md:col-span-3">
                      <label className="block text-xs text-gray-400 mb-1">Avatar / Picture</label>
                      <div className="flex flex-col gap-2">
                        {officer.picture ? <img src={officer.picture} className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 rounded bg-navy-800" />}
                        <ImageUpload buttonLabel="Upload" onUploadSuccess={(url) => { const arr = [...data.officers]; arr[globalIdx] = { ...officer, picture: url }; setData({...data, officers: arr}); }} className="text-xs w-full" />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <label className="block text-xs text-gray-400 mb-1">Name</label>
                      <input type="text" value={officer.name} onChange={(e) => { const arr = [...data.officers]; arr[globalIdx] = { ...officer, name: e.target.value }; setData({...data, officers: arr}); }} className="w-full bg-navy-950 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" />
                    </div>
                    <div className="col-span-12 md:col-span-3">
                      <label className="block text-xs text-gray-400 mb-1">Position</label>
                      <input type="text" value={officer.position} onChange={(e) => { const arr = [...data.officers]; arr[globalIdx] = { ...officer, position: e.target.value }; setData({...data, officers: arr}); }} className="w-full bg-navy-950 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" />
                    </div>
                    <div className="col-span-12 md:col-span-2">
                      <button onClick={() => setData({...data, officers: data.officers.filter(o => o.id !== officer.id)})} className="w-full bg-red-500/20 text-red-500 p-2 rounded-lg hover:bg-red-500/40">Remove</button>
                    </div>
                  </div>
                )})}
                {renderPagination(filtered.length)}
              </div>
            )})()}

            {activeTab === 'groups' && (() => {
               const filtered = (data.groups || []).filter(g => (g.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
               const paginated = filtered.slice((currentPage - 1) * 5, currentPage * 5);
               return (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold">Groupings Configuration</h3>
                  <button onClick={() => setData({...data, groups: [{ id: Date.now().toString(), name: 'New Group', members: [], toka: '', combinedToka: '' }, ...(data.groups || [])]})} className="bg-amber-500/20 text-amber-400 text-sm px-3 py-1 rounded">Add Group</button>
                </div>
                {renderSearchBar()}
                {paginated.map((group) => {
                  const globalIdx = data.groups.findIndex(g => g.id === group.id);
                  if (globalIdx === -1) return null;
                  return (
                  <div key={group.id} className="bg-navy-900 border border-white/5 rounded-xl p-4 space-y-4">
                     <div className="flex justify-between items-center mb-4">
                       <div className="flex items-center gap-3">
                         {group.picture ? <img src={group.picture} className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 rounded bg-navy-800" />}
                         <ImageUpload buttonLabel="Img" className="text-[10px] p-1 px-2" onUploadSuccess={(url) => { const arr = [...data.groups]; arr[globalIdx] = { ...group, picture: url }; setData({...data, groups: arr}); }} />
                         <h4 className="text-amber-500 font-bold text-sm">Group Settings: {group.name}</h4>
                       </div>
                       <button onClick={() => setData({...data, groups: data.groups.filter(g => g.id !== group.id)})} className="text-red-500 text-xs hover:underline">Remove Group</button>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div><label className="block text-xs text-gray-400 mb-1">Group Name</label><input type="text" value={group.name} onChange={(e) => { const arr = [...data.groups]; arr[globalIdx] = { ...group, name: e.target.value }; setData({...data, groups: arr}); }} className="w-full bg-navy-950 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" /></div>
                      <div><label className="block text-xs text-gray-400 mb-1">Individual Toka</label><input type="text" value={group.toka || ''} onChange={(e) => { const arr = [...data.groups]; arr[globalIdx] = { ...group, toka: e.target.value }; setData({...data, groups: arr}); }} className="w-full bg-navy-950 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" /></div>
                      <div className="col-span-2"><label className="block text-xs text-gray-400 mb-1">Combined/Tandem Toka</label><input type="text" value={group.combinedToka || ''} onChange={(e) => { const arr = [...data.groups]; arr[globalIdx] = { ...group, combinedToka: e.target.value }; setData({...data, groups: arr}); }} className="w-full bg-navy-950 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" /></div>
                    </div>
                    <div className="bg-navy-950/50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Members</span>
                        <button onClick={() => { const arr = [...data.groups]; arr[globalIdx] = { ...group, members: [...(group.members || []), { name: '' }] }; setData({...data, groups: arr}); } } className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded">Add Member</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {(group.members || []).map((member, memIdx) => (
                          <div key={memIdx} className="flex gap-2">
                            <input type="text" placeholder="Member Name" value={member.name} onChange={(e) => { const arr = [...data.groups]; const mArr = [...(group.members || [])]; mArr[memIdx] = { ...member, name: e.target.value }; arr[globalIdx] = { ...group, members: mArr }; setData({...data, groups: arr}); }} className="flex-1 bg-navy-900 border-white/10 rounded-lg p-2 text-sm text-white outline-none" />
                            <button onClick={() => { const arr = [...data.groups]; arr[globalIdx] = { ...group, members: group.members?.filter((_, i) => i !== memIdx) }; setData({...data, groups: arr}); }} className="bg-red-500/20 text-red-500 px-3 rounded hover:bg-red-500/40">X</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )})}
                {renderPagination(filtered.length)}
              </div>
            )})()}

            {activeTab === 'activities' && (() => {
              const filtered = (data.activities || []).filter(a => (a.category || '').toLowerCase().includes(searchTerm.toLowerCase()));
              const paginated = filtered.slice((currentPage - 1) * 5, currentPage * 5);
              return (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold">Activities Configuration</h3>
                  <button onClick={() => setData({...data, activities: [{ id: Date.now().toString(), category: 'New Category', schedule: '', meetings: [] }, ...(data.activities || [])]})} className="bg-amber-500/20 text-amber-400 text-sm px-3 py-1 rounded">Add Category</button>
                </div>
                {renderSearchBar()}
                {paginated.map((activity) => {
                  const globalIdx = data.activities.findIndex(a => a.id === activity.id);
                  if (globalIdx === -1) return null;
                  return (
                  <div key={activity.id} className="bg-navy-900 border border-white/5 rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                       <h4 className="text-amber-500 font-bold text-sm">{activity.category || 'New Category'}</h4>
                       <button onClick={() => setData({...data, activities: data.activities.filter(a => a.id !== activity.id)})} className="text-red-500 text-xs hover:underline">Remove Category</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs text-gray-400 mb-1">Category Title</label><input type="text" value={activity.category} onChange={(e) => { const arr = [...data.activities]; arr[globalIdx] = { ...activity, category: e.target.value }; setData({...data, activities: arr}); }} className="w-full bg-navy-950 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" /></div>
                      <div><label className="block text-xs text-gray-400 mb-1">Schedule Text (Optional)</label><input type="text" value={activity.schedule || ''} onChange={(e) => { const arr = [...data.activities]; arr[globalIdx] = { ...activity, schedule: e.target.value }; setData({...data, activities: arr}); }} className="w-full bg-navy-950 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" /></div>
                    </div>
                    {/* Sub-meetings / Target Dates */}
                    <div className="bg-navy-950/50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Tracked Meetings / Dates</span>
                        <button onClick={() => { const arr = [...data.activities]; arr[globalIdx] = { ...activity, meetings: [...(activity.meetings || []), { name: '', date: '', time: '' }] }; setData({...data, activities: arr}); }} className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded">Add Meeting</button>
                      </div>
                      {(activity.meetings || []).map((meeting, meetIdx) => (
                        <div key={meetIdx} className="grid grid-cols-3 gap-2">
                          <input type="text" placeholder="Meeting Name (e.g. Zone 1)" value={meeting.name} onChange={(e) => { const arr = [...data.activities]; const mArr = [...(activity.meetings || [])]; mArr[meetIdx] = { ...meeting, name: e.target.value }; arr[globalIdx] = { ...activity, meetings: mArr }; setData({...data, activities: arr}); }} className="bg-navy-900 border-white/10 rounded-lg p-2 text-sm text-white outline-none" />
                          <input type="date" value={meeting.date} onChange={(e) => { const arr = [...data.activities]; const mArr = [...(activity.meetings || [])]; mArr[meetIdx] = { ...meeting, date: e.target.value }; arr[globalIdx] = { ...activity, meetings: mArr }; setData({...data, activities: arr}); }} className="bg-navy-900 border-white/10 rounded-lg p-2 text-sm text-white outline-none" />
                          <div className="flex gap-2">
                            <input type="time" value={meeting.time} onChange={(e) => { const arr = [...data.activities]; const mArr = [...(activity.meetings || [])]; mArr[meetIdx] = { ...meeting, time: e.target.value }; arr[globalIdx] = { ...activity, meetings: mArr }; setData({...data, activities: arr}); }} className="flex-1 bg-navy-900 border-white/10 rounded-lg p-2 text-sm text-white outline-none" />
                            <button onClick={() => { const arr = [...data.activities]; arr[globalIdx] = { ...activity, meetings: activity.meetings?.filter((_, i) => i !== meetIdx) }; setData({...data, activities: arr}); }} className="bg-red-500/20 text-red-500 px-3 rounded hover:bg-red-500/40">X</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )})}
                {renderPagination(filtered.length)}
              </div>
            )})()}

            {activeTab === 'ministries' && (() => {
              const filtered = (data.ministries || []).filter(m => (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
              const paginated = filtered.slice((currentPage - 1) * 5, currentPage * 5);
              return (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold">12 Ministries</h3>
                  <button onClick={() => setData({...data, ministries: [{ id: Date.now().toString(), name: 'New Ministry', coordinators: [] }, ...(data.ministries || [])]})} className="bg-amber-500/20 text-amber-400 text-sm px-3 py-1 rounded">Add Ministry</button>
                </div>
                {renderSearchBar()}
                {paginated.map((ministry) => {
                  const globalIdx = data.ministries.findIndex(m => m.id === ministry.id);
                  if (globalIdx === -1) return null;
                  return (
                  <div key={ministry.id} className="bg-navy-900 border border-white/5 rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                       <h4 className="text-amber-500 font-bold text-sm">{ministry.name || 'New Ministry'}</h4>
                       <button onClick={() => setData({...data, ministries: data.ministries.filter(m => m.id !== ministry.id)})} className="text-red-500 text-xs hover:underline">Remove Ministry</button>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Ministry Name</label>
                      <input type="text" value={ministry.name} onChange={(e) => { const arr = [...data.ministries]; arr[globalIdx] = { ...ministry, name: e.target.value }; setData({...data, ministries: arr}); }} className="w-full bg-navy-950 border-white/10 rounded-lg p-2 text-white outline-none focus:border-amber-500" />
                    </div>
                    <div className="bg-navy-950/50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Coordinators</span>
                        <button onClick={() => { const arr = [...data.ministries]; arr[globalIdx] = { ...ministry, coordinators: [...(ministry.coordinators || []), { name: '' }] }; setData({...data, ministries: arr}); } } className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded">Add Coordinator</button>
                      </div>
                        {(ministry.coordinators || []).map((coord, coordIdx) => (
                          <div key={coordIdx} className="flex gap-2 items-center">
                            {coord.picture ? <img src={coord.picture} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-navy-800" />}
                            <ImageUpload buttonLabel="Pic" onUploadSuccess={(url) => { const arr = [...data.ministries]; const cArr = [...(ministry.coordinators || [])]; cArr[coordIdx] = { ...coord, picture: url }; arr[globalIdx] = { ...ministry, coordinators: cArr }; setData({...data, ministries: arr}); }} className="text-[10px] p-1 px-2" />
                            <input type="text" placeholder="Coordinator Name" value={coord.name} onChange={(e) => { const arr = [...data.ministries]; const cArr = [...(ministry.coordinators || [])]; cArr[coordIdx] = { ...coord, name: e.target.value }; arr[globalIdx] = { ...ministry, coordinators: cArr }; setData({...data, ministries: arr}); }} className="flex-1 bg-navy-900 border-white/10 rounded-lg p-2 text-sm text-white outline-none" />
                            <button onClick={() => { const arr = [...data.ministries]; arr[globalIdx] = { ...ministry, coordinators: ministry.coordinators?.filter((_, i) => i !== coordIdx) }; setData({...data, ministries: arr}); }} className="bg-red-500/20 text-red-500 px-3 rounded hover:bg-red-500/40">X</button>
                          </div>
                        ))}
                    </div>
                    {/* Members Level */}
                    <div className="bg-navy-950/50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Members</span>
                        <button onClick={() => { const arr = [...data.ministries]; arr[globalIdx] = { ...ministry, members: [...(ministry.members || []), { name: '' }] }; setData({...data, ministries: arr}); } } className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded">Add Member</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {(ministry.members || []).map((member, memIdx) => (
                          <div key={memIdx} className="flex gap-2">
                            <input type="text" placeholder="Member Name" value={member.name} onChange={(e) => { const arr = [...data.ministries]; const mArr = [...(ministry.members || [])]; mArr[memIdx] = { ...member, name: e.target.value }; arr[globalIdx] = { ...ministry, members: mArr }; setData({...data, ministries: arr}); }} className="flex-1 bg-navy-900 border-white/10 rounded-lg p-2 text-sm text-white outline-none" />
                            <button onClick={() => { const arr = [...data.ministries]; arr[globalIdx] = { ...ministry, members: ministry.members?.filter((_, i) => i !== memIdx) }; setData({...data, ministries: arr}); }} className="bg-red-500/20 text-red-500 px-3 rounded hover:bg-red-500/40">X</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )})}
                {renderPagination(filtered.length)}
              </div>
            )})()}
          </div>
        </div>
      </div>
    </div>
  );
}
