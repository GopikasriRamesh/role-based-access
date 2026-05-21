import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FilePlus, CheckCircle } from 'lucide-react';

const CreateRequest = () => {
  const [formData, setFormData] = useState({ title: '', description: '', category: '', priority: 'Medium' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/requests', formData);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit workflow ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Initiate Workflow File</h1>
          <p className="text-slate-500 text-sm">Fill all parameters to index a new tracking ticket into the approval machine</p>
        </div>

        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-8">
          {success ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Transaction Indexed</h3>
              <p className="text-slate-500 text-sm max-w-xs mt-1">Request successfully committed to MySQL storage matrices. Updating interface dashboard view...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Request Title</label>
                <input 
                  type="text" required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  placeholder="e.g., Software License Renewal Q3"
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Category Identification</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    placeholder="e.g., Procurement / Tech Supply"
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Priority Level</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm appearance-none"
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="Low">Low (Routine operational)</option>
                    <option value="Medium">Medium (Standard business queue)</option>
                    <option value="High">High (Immediate executive evaluation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Contextual Description</label>
                <textarea 
                  required rows="4"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  placeholder="Detail the operational necessity, business justifications, or specific items required..."
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl py-3 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <FilePlus className="h-4 w-4" />
                {loading ? 'Transmitting Data Package...' : 'Dispatch Request Package'}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreateRequest;