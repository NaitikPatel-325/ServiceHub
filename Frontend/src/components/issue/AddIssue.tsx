import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, Textarea } from '@chakra-ui/react';
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
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null); 

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files)); 
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]); 
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('status', status);

    photos.forEach((photo) => {
      formData.append(`photos`, photo);
    });

    if (video) {
      formData.append('video', video);
    }

      await axios.post("http://localhost:3000/issue", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log("Issue added successfully:", res.data);
        toast.success("Issue added successfully");
        onClose(); 
      })
      .catch((error) => {
        console.error("Error adding issue:", error);
        toast.error("Failed to add issue");
      });
      
    
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

          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoChange}
            mb={4}
          />

          <Input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
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
