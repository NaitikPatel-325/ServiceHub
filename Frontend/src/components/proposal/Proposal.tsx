import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, Textarea } from '@chakra-ui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from "react-redux";


interface AddProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string; 
}

const AddProposalModal: React.FC<AddProposalModalProps> = ({ isOpen, onClose, issueId }) => {
  const user = useSelector((state:any) => state?.user)
  console.log(user);

  const [proposalDescription, setProposalDescription] = useState('');
  const [costEstimate, setCostEstimate] = useState('');
  const [timeEstimateDays, setTimeEstimateDays] = useState('');
  const [document, setDocument] = useState<File | null>(null); 

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]); 
    }
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('proposal_description', proposalDescription);
    formData.append('cost_estimate', costEstimate);
    formData.append('time_estimate_days', timeEstimateDays);
    formData.append('issue_id', issueId); 

    if (document) {
      formData.append('document', document); 
    }

    try {
      await axios.post("http://localhost:3000/proposal", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
        withCredentials: true,
      });
      toast.success("Proposal added successfully");
      onClose(); 
    } catch (error) {
      console.error("Error adding proposal:", error);
      toast.error("Failed to add proposal");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Proposal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Proposal Description"
            value={proposalDescription}
            onChange={(e) => setProposalDescription(e.target.value)}
            mb={4}
          />
          <Input
            placeholder="Cost Estimate"
            type="number"
            value={costEstimate}
            onChange={(e) => setCostEstimate(e.target.value)}
            mb={4}
          />
          <Input
            placeholder="Time Estimate (Days)"
            type="number"
            value={timeEstimateDays}
            onChange={(e) => setTimeEstimateDays(e.target.value)}
            mb={4}
          />
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleDocumentChange}
            mb={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Submit Proposal
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProposalModal;
