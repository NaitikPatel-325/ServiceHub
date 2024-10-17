import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Proposal {
  _id: string;
  issue_id: string;
  professional_id: string;
  proposal_description: string;
  cost_estimate: string;
  time_estimate_days: number;
  document: string;
  createdAt: string;
  updatedAt: string;
}

const ProposalList = () => {
  const { id: issueId } = useParams<{ id: string }>();   
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/proposal/${issueId}/solution`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setProposals(response.data.data.proposals);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        setError('Failed to fetch proposals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [issueId]);

  if (loading) return <div>Loading proposals...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Proposal List</h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {proposals?.length > 0 ? (
          proposals.map((proposal) => (
            <div key={proposal._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-blue-400 mb-2">Proposal for Issue: {proposal.issue_id}</h2>

              <p className="text-sm text-gray-400 mb-4">Professional: {proposal.professional_id || 'N/A'}</p>

              <p className="mb-2">
                <span className="font-bold">Description: </span>
                {proposal.proposal_description}
              </p>

              <p className="mb-2">
                <span className="font-bold">Cost Estimate: </span>
                {proposal.cost_estimate}
              </p>

              <p className="mb-2">
                <span className="font-bold">Time Estimate: </span>
                {proposal.time_estimate_days} days
              </p>

              {proposal.document && (
                <a
                  href={proposal.document}
                  className="text-blue-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Document
                </a>
              )}

              <p className="text-sm text-gray-500 mt-4">
                Created on {new Date(proposal.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No proposals found</p>
        )}
      </div>
    </div>
  );
};

export default ProposalList;
