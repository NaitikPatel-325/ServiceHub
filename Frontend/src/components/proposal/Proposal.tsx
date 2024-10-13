import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProposalForm = ({ isEdit = false }) => {
  const [proposalDescription, setProposalDescription] = useState('');
  const [costEstimate, setCostEstimate] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit && id) {
      const fetchProposal = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/proposals/${id}`);
          const proposal = response.data.data.proposal;
          setProposalDescription(proposal.proposal_description);
          setCostEstimate(proposal.cost_estimate);
          setTimeEstimate(proposal.time_estimate_days);
        } catch (err) {
          console.error("Error fetching proposal", err);
        }
      };

      fetchProposal();
    }
  }, [isEdit, id]);

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('proposal_description', proposalDescription);
    formData.append('cost_estimate', costEstimate);
    formData.append('time_estimate_days', timeEstimate);
    if (document) {
      formData.append('document', document);
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/proposals/${id}`, formData);
        alert('Proposal updated successfully');
      } else {
        await axios.post('http://localhost:3000/proposals', formData);
        alert('Proposal created successfully');
      }
      navigate('/');
    } catch (err) {
      console.error("Error submitting form", err);
      alert('Error in submission');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Proposal' : 'Add Proposal'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Proposal Description</label>
          <input
            type="text"
            value={proposalDescription}
            onChange={(e) => setProposalDescription(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Cost Estimate</label>
          <input
            type="number"
            value={costEstimate}
            onChange={(e) => setCostEstimate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Time Estimate (days)</label>
          <input
            type="number"
            value={timeEstimate}
            onChange={(e) => setTimeEstimate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Document (optional)</label>
          <input
            type="file"
            onChange={(e) => setDocument(e.target.files ? e.target.files[0] : null)}
            className="w-full bg-gray-800 border border-gray-700 p-2 rounded-md"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md">
          {isEdit ? 'Update Proposal' : 'Create Proposal'}
        </button>
      </form>
    </div>
  );
};

export default ProposalForm;
