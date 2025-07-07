import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, FileText, TrendingUp, Trophy, Users } from 'lucide-react';
import ComplaintCard from '../components/ComplaintCard';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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

interface Stats {
  totalComplaints: number;
  resolvedComplaints: number;
  activeComplaints: number;
  resolutionRate: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [complaintsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/complaints`),
        axios.get(`${API_URL}/users/stats`)
      ]);

      setComplaints(complaintsRes.data.slice(0, 5)); // Show only latest 5
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (complaintId: string, type: 'upvote' | 'downvote') => {
    try {
      const response = await axios.post(`${API_URL}/complaints/${complaintId}/vote`, { type });
      setComplaints(prev => prev.map(c => c._id === complaintId ? response.data : c));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleResolve = async (complaintId: string) => {
    try {
      await axios.put(`${API_URL}/complaints/${complaintId}/resolve`);
      setComplaints(prev => prev.map(c => 
        c._id === complaintId ? { ...c, status: 'Resolved' as const } : c
      ));
    } catch (error) {
      console.error('Error resolving complaint:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600 text-lg">
          Flat Code: <span className="font-semibold text-purple-600">{user?.flatCode}</span>
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalComplaints}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Issues</p>
                <p className="text-3xl font-bold text-orange-600">{stats.activeComplaints}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{stats.resolvedComplaints}</p>
              </div>
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-3xl font-bold text-blue-600">{stats.resolutionRate}%</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Complaints</h2>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>New Complaint</span>
          </button>
        </div>

        {complaints.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints yet</h3>
            <p className="text-gray-600">Your flat is living in harmony! 🎉</p>
          </div>
        ) : (
          <div className="space-y-6">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                currentUserId={user?.id || ''}
                onVote={handleVote}
                onResolve={handleResolve}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;