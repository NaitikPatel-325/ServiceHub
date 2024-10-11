import React, { useEffect, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import axios from 'axios';
import AddIssueModal from './AddIssue.tsx';

interface Issue {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: 'Reported' | 'In Progress' | 'Resolved' | 'Closed';
  reporter_id: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: { [key: string]: string } = {
  'Reported': 'bg-yellow-600',
  'In Progress': 'bg-blue-600',
  'Resolved': 'bg-green-600',
  'Closed': 'bg-gray-600',
};

export default function IssueTracker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    async function fetchIssues() {
      try {
        const response = await axios.get("http://localhost:3000/issue", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setIssues(response.data.data.issues);
      } catch (err) {
        console.error("Error fetching issues:", err);
      }
    }
    fetchIssues();
  }, []);

  const filteredIssues = issues.filter(issue => {
    const title = issue.title || '';
    if (selectedStatus === '') {
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return title.toLowerCase().includes(searchTerm.toLowerCase()) && issue.status === selectedStatus;
    }
  });

  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Issue Tracker</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="mb-6">
            <label htmlFor="search" className="block text-sm font-medium mb-2">Search Issues</label>
            <div className="relative">
              <input
                type="text"
                id="search"
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-4">Issues List</h2>
          <div className="space-y-4">
            {filteredIssues.length > 0 ? (
              filteredIssues.map(issue => (
                <div key={issue._id} className="bg-gray-800 rounded-lg p-4 flex items-start">
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-blue-400 mb-1">{issue.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{issue.description}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[issue.status]}`}>
                        {issue.status}
                      </span>
                      {issue.location && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-600">
                          {issue.location}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Reported on {new Date(issue.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No issues found</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Status Filter</h2>
          <div className="relative mb-6">
            <select 
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 appearance-none cursor-pointer"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          <button 
            className="w-full bg-blue-600 text-white rounded-md py-2 px-4 font-medium hover:bg-blue-500 transition-colors"
            onClick={() => setIsModalOpen(true)} 
          >
            Add Issue
          </button>
        </div>
      </div>

      <AddIssueModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
}
