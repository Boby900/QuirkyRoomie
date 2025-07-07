import React from 'react';
import { ThumbsUp, ThumbsDown, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

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

interface ComplaintCardProps {
  complaint: Complaint;
  currentUserId: string;
  onVote: (complaintId: string, type: 'upvote' | 'downvote') => void;
  onResolve?: (complaintId: string) => void;
  showResolveButton?: boolean;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  currentUserId,
  onVote,
  onResolve,
  showResolveButton = true
}) => {
  const severityColors = {
    Mild: 'bg-green-100 text-green-800',
    Annoying: 'bg-yellow-100 text-yellow-800',
    Major: 'bg-orange-100 text-orange-800',
    Nuclear: 'bg-red-100 text-red-800'
  };

  const categoryColors = {
    Noise: 'bg-purple-100 text-purple-800',
    Cleanliness: 'bg-blue-100 text-blue-800',
    Bills: 'bg-indigo-100 text-indigo-800',
    Pets: 'bg-pink-100 text-pink-800',
    Kitchen: 'bg-green-100 text-green-800',
    Bathroom: 'bg-cyan-100 text-cyan-800',
    'Common Area': 'bg-gray-100 text-gray-800',
    Other: 'bg-slate-100 text-slate-800'
  };

  const userVote = complaint.votes.find(vote => vote.user === currentUserId);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {complaint.title}
          </h3>
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[complaint.severity]}`}>
              {complaint.severity}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[complaint.category as keyof typeof categoryColors]}`}>
              {complaint.category}
            </span>
          </div>
        </div>
        {complaint.status === 'Resolved' && (
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{complaint.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <span>By: {complaint.filedBy.username}</span>
          <span>Against: {complaint.againstUser.username}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {complaint.punishment && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Punishment Assigned:</span>
          </div>
          <p className="text-sm text-red-700 mt-1">{complaint.punishment}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onVote(complaint._id, 'upvote')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              userVote?.type === 'upvote'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{complaint.upvotes}</span>
          </button>
          <button
            onClick={() => onVote(complaint._id, 'downvote')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              userVote?.type === 'downvote'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{complaint.downvotes}</span>
          </button>
        </div>

        {showResolveButton && complaint.status === 'Active' && onResolve && (
          <button
            onClick={() => onResolve(complaint._id)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Mark Resolved
          </button>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;