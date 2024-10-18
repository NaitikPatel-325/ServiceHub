import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, Textarea, FormControl, FormLabel } from '@chakra-ui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from "react-redux";

interface AddProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string; 
}

const AddProposalModal: React.FC<AddProposalModalProps> = ({ isOpen, onClose, issueId }) => {
  const user = useSelector((state: any) => state?.user);
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
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg='none' backdropFilter='auto' backdropInvert='15%' backdropBlur='2px' />
      <ModalContent borderRadius={10} bg={"rgb(39 39 42)"} color="white">
        <ModalHeader className="shadow-lg">Add New Proposal</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="shadow-lg">
          <FormControl mb={4}>
            <FormLabel>Proposal Description</FormLabel>
            <Textarea
              placeholder="Enter proposal description"
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
              bg="gray.800"
              border="none"
              focusBorderColor="blue.500"
              color="white"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Cost Estimate</FormLabel>
            <Input
              placeholder="Enter cost estimate"
              type="number"
              value={costEstimate}
              onChange={(e) => setCostEstimate(e.target.value)}
              bg="gray.800"
              border="none"
              focusBorderColor="blue.500"
              color="white"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Time Estimate (Days)</FormLabel>
            <Input
              placeholder="Enter time estimate in days"
              type="number"
              value={timeEstimateDays}
              onChange={(e) => setTimeEstimateDays(e.target.value)}
              bg="gray.800"
              border="none"
              focusBorderColor="blue.500"
              color="white"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Upload Document (PDF, DOC, DOCX)</FormLabel>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleDocumentChange}
              bg="gray.800"
              border="none"
              focusBorderColor="blue.500"
              color="white"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter className="bg-opacity-100 shadow-lg">
          <Button colorScheme="blue" onClick={handleSubmit} mr={3}>
            Submit Proposal
          </Button>
          <Button  colorScheme="blue" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProposalModal;
