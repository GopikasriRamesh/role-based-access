import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Clock, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

const RequestModal = ({ request, onClose, userRole, onStatusUpdated }) => {
  const [logs, setLogs] = useState([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [request.id]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/requests/${request.id}/logs`);
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to grab audit history metrics', err);
    }
  };

  const handleAction = async (targetStatus) => {
    setSubmitting(true);
    try {
      await axios.patch(`http://localhost:5000/api/requests/${request.id}/status`, {
        targetStatus,
        comment: comment || `Action executed by profile holding ${userRole} clearance parameters.`
      });
      setComment('');
      onStatusUpdated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Workflow state engine transition failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderActionButtons = () => {
    if (request.status === 'Submitted' && userRole === 'Manager') {
      return (
        <div className="flex gap-3">
          <button onClick={() => handleAction('Approved')} disabled={submitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm shadow-sm transition-all">Approve Request</button>
          <button onClick={() => handleAction('Needs Clarification')} disabled={submitting} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-4 rounded-xl text-sm shadow-sm transition-all">Needs Clarification</button>
          <button onClick={() => handleAction('Rejected')} disabled={submitting} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm shadow-sm transition-all">Reject</button>
        </div>
      );
    }
    if (request.status === 'Needs Clarification' && userRole === 'User') {
      return (
        <button onClick={() => handleAction('Submitted')} disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm shadow-sm transition-all">Resubmit for Approval</button>
      );
    }
    if (request.status === 'Approved' && userRole === 'Admin') {
      return (
        <button onClick={() => handleAction('Closed')} disabled={submitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-xl text-sm shadow-sm transition-all">Close Pipeline File</button>
      );
    }
    if (request.status === 'Closed' && userRole === 'Admin') {
      return (
        <button onClick={() => handleAction('Submitted')} disabled={submitting} className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2.5 px-4 rounded-xl text-sm transition-all">Reopen Workflow File</button>
      );
    }
    return <p className="text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl py-3 bg-slate-50">No structural state modifications available for your role tier parameters.</p>;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end animate-fade-in font-sans">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">File Node details</span>
            <h3 className="font-bold text-slate-900 text-base truncate max-w-sm">{request.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
            <div><span className="text-slate-400 block mb-0.5">Category Identification</span><span className="font-semibold text-slate-800">{request.category}</span></div>
            <div><span className="text-slate-400 block mb-0.5">Priority Level</span><span className="font-semibold text-slate-800">{request.priority}</span></div>
            <div><span className="text-slate-400 block mb-0.5">Initiating Node Account</span><span className="font-semibold text-slate-800">{request.creator?.name || 'Unknown'}</span></div>
            <div><span className="text-slate-400 block mb-0.5">Indexed Datetime</span><span className="font-semibold text-slate-800">{new Date(request.createdAt).toLocaleString()}</span></div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contextual Scope</h4>
            <p className="text-sm text-slate-600 bg-white border border-slate-100 rounded-xl p-4 shadow-sm leading-relaxed">{request.description}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-400" /> Complete Audit History Timeline</h4>
            <div className="relative border-l border-slate-200 ml-2 pl-6 space-y-5 py-2">
              {logs.map((log) => (
                <div key={log.id} className="relative text-xs">
                  <span className="absolute -left-[31px] top-0.5 bg-white border-2 border-indigo-600 h-3.5 w-3.5 rounded-full flex items-center justify-center shadow-sm"></span>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span className="font-semibold text-slate-700">{log.modifier?.name || 'System Server'}</span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase">{log.modifier?.role}</span>
                    <span className="ml-auto text-[10px]">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800 mt-1">
                    <span className="text-slate-400 font-normal">{log.previousStatus}</span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                    <span className="text-indigo-600 font-semibold">{log.newStatus}</span>
                  </div>
                  {log.comment && <p className="text-slate-500 bg-slate-50/70 border border-slate-100 rounded-lg p-2 mt-1.5 italic font-sans flex items-start gap-1.5"><MessageSquare className="h-3 w-3 mt-0.5 text-slate-400 shrink-0" /> {log.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-4">
          <div className="relative">
            <textarea rows="2" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400" placeholder="Append structural log justification details (Optional)..." />
          </div>
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default RequestModal;