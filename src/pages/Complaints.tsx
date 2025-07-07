import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search, Filter } from 'lucide-react';
import ComplaintCard from '../components/ComplaintCard';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  severity: 'Mild' | 'Annoying' | 'Major' | 'Nuclear';
  filedBy: { username: string; avatar?: string };
  againstUser: { username: string; avatar?: string };
  upvotes: number;
  downvotes: number;
  punishment?: string;
  status: 'Active' | 'Resolved' | 'Archived';
  createdAt: string;
  votes: Array<{ user: string; type: 'upvote' | 'downvote' }>;
}

interface User {
  _id: string;
  username: string;
  email: string;
  karmaPoints: number;
}

const Complaints: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [flatmates, setFlatmates] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [againstUserId, setAgainstUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Noise', 'Cleanliness', 'Bills', 'Pets', 'Kitchen', 'Bathroom', 'Common Area', 'Other'];
  const severities = ['Mild', 'Annoying', 'Major', 'Nuclear'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [complaintsRes, flatmatesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/complaints`),
        axios.get(`${API_BASE_URL}/users/flatmates`)
      ]);

      setComplaints(complaintsRes.data);
      setFlatmates(flatmatesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/complaints`, {
        title,
        description,
        category,
        severity,
        againstUserId
      });

      setComplaints(prev => [response.data, ...prev]);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating complaint:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setSeverity('');
    setAgainstUserId('');
  };

  const handleVote = async (complaintId: string, type: 'upvote' | 'downvote') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/complaints/${complaintId}/vote`, { type });
      setComplaints(prev => prev.map(c => c._id === complaintId ? response.data : c));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleResolve = async (complaintId: string) => {
    try {
      await axios.put(`${API_BASE_URL}/complaints/${complaintId}/resolve`);
      setComplaints(prev => prev.map(c => 
        c._id === complaintId ? { ...c, status: 'Resolved' as const } : c
      ));
    } catch (error) {
      console.error('Error resolving complaint:', error);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || complaint.category === filterCategory;
    const matchesSeverity = !filterSeverity || complaint.severity === filterSeverity;
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Complaints</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>File Complaint</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Severities</option>
            {severities.map(sev => (
              <option key={sev} value={sev}>{sev}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-6">
        {filteredComplaints.map((complaint) => (
          <ComplaintCard
            key={complaint._id}
            complaint={complaint}
            currentUserId={user?.id || ''}
            onVote={handleVote}
            onResolve={handleResolve}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">File a Complaint</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Detailed description of the issue"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity
                    </label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select severity</option>
                      {severities.map(sev => (
                        <option key={sev} value={sev}>{sev}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Against Flatmate
                  </label>
                  <select
                    value={againstUserId}
                    onChange={(e) => setAgainstUserId(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select flatmate</option>
                    {flatmates.map(flatmate => (
                      <option key={flatmate._id} value={flatmate._id}>
                        {flatmate.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {submitting ? 'Filing...' : 'File Complaint'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;