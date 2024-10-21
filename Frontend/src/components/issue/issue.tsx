import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIssueModal from './AddIssue.tsx';
import { motion } from 'framer-motion'; 

interface Issue {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: 'Reported' | 'In Progress' | 'Accepted' | 'Resolved';
  reporter_id: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: { [key: string]: string } = {
  Reported: 'bg-yellow-600',
  'In Progress': 'bg-blue-600',
  Accepted: 'bg-green-600',
  Resolved: 'bg-gray-600',
};

export default function IssueTracker() {
  const user = useSelector((state: any) => state?.user?.user);
  console.log(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchIssues() {
      try {
        const response = await axios.get('https://servicehub-k17j.onrender.com/issue', {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setIssues(response.data.data.issues);
      } catch (err) {
        console.error('Error fetching issues:', err);
      }
    }
    fetchIssues();
  }, []);

  const handleIssueClick = (issue: Issue) => {
    if (issue.status === 'Reported') {
      navigate(
        user?.role === 'goverment'
          ? `/issue/proposal/${issue._id}`
          : `/issue/${issue._id}`
      );
    } else {
      toast.info('This issue is already assigned or closed.');
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const title = issue.title || '';
    if (selectedStatus === '') {
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        issue.status === selectedStatus
      );
    }
  });
  

  return (
    <motion.div
      initial={{ opacity: 0, y: -300, scale: 0.4 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      exit={{ opacity: 0, x: -400 }} 
      transition={{ duration: 1.5, type: 'spring' }} 
      className="min-h-screen bg-gray-900 text-white p-8 w-full"
    >
      <ToastContainer />

      <h1 className="text-4xl font-bold mb-8 text-center">Issue Tracker</h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="mb-6">
            <label htmlFor="search" className="block text-sm font-medium mb-2">
              Search Issues
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Issues List</h2>
          <div className="space-y-4">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <div
                  key={issue._id}
                  className="block bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow focus:ring focus:ring-blue-500 focus:outline-none cursor-pointer"
                  onClick={() => handleIssueClick(issue)} 
                >
                  <div className="flex-grow">
                    <h3 className="text-xl font-medium text-blue-400 mb-1 cursor-pointer hover:underline">
                      {issue.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-3">
                      {issue.description}
                    </p>

                    {user?.role === 'goverment' &&  (issue.status === 'In Progress' ) &&  (
                        <a 
                          href={`/assignprofessional/${issue._id}`} 
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                          aria-label="Assign Professional"
                        >
                          Assign Professional
                        </a>
                      )}

                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[issue.status]}`}
                      >
                        {issue.status}
                      </span>
                      {issue.location && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-600">
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
              <p className="text-gray-400">No issues found</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Filter by Status</h2>
          <div className="relative mb-6">
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 pr-10 appearance-none cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="In Progress">In Progress</option>
              <option value="Accepted">Accepted</option>
              <option value="Resolved">Resolved</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          <button
            className="w-full bg-blue-600 text-white rounded-md py-3 px-4 font-semibold hover:bg-blue-500 shadow-md transition-all"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Issue
          </button>
        </div>
      </div>

      <AddIssueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.div>
  );
}
