import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import RequestModal from '../components/RequestModal';
import { Search, Filter, Layers, ListFilter, ClipboardCheck, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, priorityFilter, searchQuery]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/requests/dashboard', {
        params: { status: statusFilter, priority: priorityFilter, search: searchQuery }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to parse dashboard data pipelines', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      Submitted: 'bg-blue-50 text-blue-700 border-blue-200',
      'Needs Clarification': 'bg-amber-50 text-amber-700 border-amber-200',
      Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Closed: 'bg-slate-100 text-slate-700 border-slate-300',
      Rejected: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return `inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${config[status] || 'bg-slate-50 text-slate-600 border-slate-200'}`;
  };

  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === 'Submitted').length;
  const criticalCount = requests.filter(r => r.priority === 'High').length;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workflow Operations Center</h1>
          <p className="text-slate-500 text-sm">Monitor, inspect, and evaluate open file approval trajectories in real-time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Layers className="h-5 w-5" /></div>
            <div><span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Indexed Tracks</span><span className="text-2xl font-bold text-slate-900">{totalCount} files</span></div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><ListFilter className="h-5 w-5" /></div>
            <div><span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Awaiting Evaluation</span><span className="text-2xl font-bold text-slate-900">{pendingCount} pending</span></div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><AlertCircle className="h-5 w-5" /></div>
            <div><span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">High Velocity Queue</span><span className="text-2xl font-bold text-slate-900">{criticalCount} critical</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search track titles or sectors..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex gap-4 w-full md:w-auto shrink-0 justify-end">
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Flow Statuses</option>
              <option value="Submitted">Submitted (Pending)</option>
              <option value="Needs Clarification">Needs Clarification</option>
              <option value="Approved">Approved</option>
              <option value="Closed">Closed</option>
            </select>

            <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-2"><div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> Loading pipeline matrices...</div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-400">No open workflow rows found corresponding to parameters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider font-semibold text-slate-400">
                    <th className="p-4 pl-6">Title ID</th>
                    <th className="p-4">Origin Sector</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Flow Position</th>
                    <th className="p-4 text-right pr-6">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {requests.map((req) => (
                    <tr key={req.id} onClick={() => setSelectedRequest(req)} className="hover:bg-slate-50/80 cursor-pointer transition-all border-b border-slate-100">
                      <td className="p-4 pl-6 font-semibold text-slate-900 max-w-xs truncate">{req.title}</td>
                      <td className="p-4 text-xs text-slate-500">{req.category}</td>
                      <td className="p-4"><span className={`text-xs font-bold ${req.priority === 'High' ? 'text-rose-600' : req.priority === 'Medium' ? 'text-amber-600' : 'text-slate-500'}`}>{req.priority}</span></td>
                      <td className="p-4"><span className={getStatusBadge(req.status)}>{req.status}</span></td>
                      <td className="p-4 text-right pr-6 text-xs text-slate-400">{new Date(req.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <RequestModal request={selectedRequest} onClose={() => setSelectedRequest(null)} userRole={user?.role} onStatusUpdated={fetchRequests} />
      )}
    </Layout>
  );
};

export default Dashboard;