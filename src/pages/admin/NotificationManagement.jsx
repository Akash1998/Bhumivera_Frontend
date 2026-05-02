import React, { useState, useEffect } from 'react';
import { Bell, Search, Plus, Send, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', type: 'info', user_id: '' });

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications/admin/all');
      setNotifications(Array.isArray(response.data) ? response.data : []);
    } catch (error) { console.error("Error fetching notifications:", error); } finally { setLoading(false); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, user_id: formData.user_id.trim() === '' ? null : formData.user_id };
      await api.post('/notifications/admin/create', payload);
      setIsModalOpen(false);
      setFormData({ title: '', message: '', type: 'info', user_id: '' });
      fetchNotifications();
    } catch (error) {
      console.error("Error creating notification:", error);
      alert("Failed to send notification.");
    }
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="text-emerald-500" size={16} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={16} />;
      case 'error': return <AlertCircle className="text-rose-500" size={16} />;
      default: return <Info className="text-blue-500" size={16} />;
    }
  };

  const filteredNotifications = notifications.filter(notif => 
    (notif.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notif.message || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Bell className="text-emerald-500" /> Global Alerts & Notifications
          </h2>
          <p className="text-slate-400 text-sm mt-1">Broadcast system alerts or target specific users.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all">
          <Plus size={18} /> Compose Alert
        </button>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Broadcast History</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="Search notifications..." className="bg-slate-950 border border-slate-800 text-sm text-white rounded-lg pl-9 pr-4 py-2 focus:border-emerald-500 focus:outline-none w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-slate-900 text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4 w-12">Type</th>
                <th className="px-6 py-4">Title & Message</th>
                <th className="px-6 py-4">Target Audience</th>
                <th className="px-6 py-4">Sent Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8">Loading logs...</td></tr>
              ) : filteredNotifications.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-slate-500">No notifications found.</td></tr>
              ) : (
                filteredNotifications.map((notif) => (
                  <tr key={notif.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="px-6 py-4">{getIconForType(notif.type)}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{notif.title}</p>
                      <p className="text-xs text-slate-500 truncate max-w-md mt-1">{notif.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      {notif.user_id ? <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded-md text-xs font-mono">User: {notif.user_id}</span> : <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md text-xs font-bold">Global Broadcast</span>}
                    </td>
                    <td className="px-6 py-4">{new Date(notif.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-lg relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Send size={20} className="text-emerald-500" /> Send Notification</h3>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Title</label>
                <input type="text" required placeholder="e.g. Flash Sale Starting Soon!" className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Message Body</label>
                <textarea required rows="4" placeholder="Type content here..." className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none resize-none" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Alert Type</label>
                  <select className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none appearance-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="info">Info (Blue)</option>
                    <option value="success">Success (Green)</option>
                    <option value="warning">Warning (Yellow)</option>
                    <option value="error">Error (Red)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Target User ID (Optional)</label>
                  <input type="text" placeholder="Global" className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none font-mono text-sm" value={formData.user_id} onChange={(e) => setFormData({...formData, user_id: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition-all mt-6 flex justify-center items-center gap-2"><Send size={18} /> Push Notification</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
