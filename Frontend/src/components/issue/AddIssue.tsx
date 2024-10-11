import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, Textarea, Select } from '@chakra-ui/react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AddIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddIssueModal: React.FC<AddIssueModalProps> = ({ isOpen, onClose}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Reported');

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/issue", {
        title,
        description,
        location,
        status
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      toast.success("Issue added successfully");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding issue:", error);
      toast.error("Failed to add issue");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Issue</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb={4}
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            mb={4}
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            mb={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Add Issue
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddIssueModal;
