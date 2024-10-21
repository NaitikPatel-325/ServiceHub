import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AddProposalModal from '../proposal/Proposal';

interface Issue {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: 'Reported' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  photos?: string[];
  video?: string;
}

const IssueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProposalModalOpen, setProposalModalOpen] = useState(false);

  const openProposalModal = () => setProposalModalOpen(true);
  const closeProposalModal = () => setProposalModalOpen(false);

  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        const response = await axios.get(`https://servicehub-k17j.onrender.com/issue/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setIssue(response.data.data.issue);
      } catch (err) {
        setError('Failed to fetch issue details. Please try again later.');
        console.error('Error fetching issue:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssueDetails();
  }, [id]);

  useEffect(() => {
    const checkForUploadedSolution = async () => {
      try {
        const res = await axios.get(`https://servicehub-k17j.onrender.com/proposal/${id}/solution`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        console.log('Solution:', res.data.data.proposal);
      } catch (error) {
        console.error('Error checking for solution PDF:', error);
      }
    };
    checkForUploadedSolution();
  },[]);

  if (loading) return <div>Loading issue details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const handlePrevClick = () => {
    if (issue?.photos && issue.photos.length > 0) {
      setCurrentIndex((prevIndex) =>
        (prevIndex - 1 + (issue?.photos?.length || 0)) % (issue?.photos?.length || 1)
      );
    }
  };

  const handleNextClick = () => {
    if (issue?.photos && issue.photos.length > 0) {
      setCurrentIndex((prevIndex) =>
        (prevIndex + 1) % (issue?.photos?.length || 1)
      );
    }
  };

  const getDisplayPhotos = () => {
    if (!issue?.photos) return [];

    const totalImages = issue.photos.length;

    if (totalImages >= 3) {
      return [
        issue.photos[currentIndex],
        issue.photos[(currentIndex + 1) % totalImages],
        issue.photos[(currentIndex + 2) % totalImages],
      ];
    } else {
      return issue.photos;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 relative">
      <div className="absolute top-8 right-8">
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded"
          onClick={openProposalModal}
        >
          Add Proposal
        </button>
      </div>

      <h1 className="text-4xl font-bold text-left mb-4">{issue?.title}</h1>
      <p className="text-2xl font-bold text-left mb-4">Description: {issue?.description}</p>
      <p className="mb-2 text-left">Location: <span className="font-semibold">{issue?.location}</span></p>

      {id && (
        <AddProposalModal
          isOpen={isProposalModalOpen}
          onClose={closeProposalModal}
          issueId={id}
        />
      )}

      {issue?.photos && issue.photos.length > 0 && (
        <div className="mb-6">
          <div className="relative w-full max-w-3xl mx-auto overflow-hidden">
            <div className="flex items-center justify-between">
              {issue.photos.length > 1 && (
                <button
                  className="absolute left-0 z-10 p-2 bg-gray-700 rounded-full hover:bg-gray-500"
                  onClick={handlePrevClick}
                >
                  &#9664;
                </button>
              )}

              <div className="w-full flex overflow-hidden snap-x snap-mandatory">
                {getDisplayPhotos().map((photo, index) => (
                  <div key={index} className="snap-center p-2">
                    <img
                      src={photo}
                      alt={`Issue Photo ${index + 1}`}
                      className="rounded-lg shadow-lg w-72 h-72 object-cover"
                    />
                  </div>
                ))}
              </div>

              {issue.photos.length > 1 && (
                <button
                  className="absolute right-0 z-10 p-2 bg-gray-700 rounded-full hover:bg-gray-500"
                  onClick={handleNextClick}
                >
                  &#9654;
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {issue?.video && (
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Video:</h3>
          <video controls className="w-full rounded-lg shadow-lg">
            <source src={issue.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default IssueDetails;
