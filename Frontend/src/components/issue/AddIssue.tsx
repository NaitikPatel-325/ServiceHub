import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input, Textarea, FormControl, FormLabel } from '@chakra-ui/react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AddIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddIssueModal: React.FC<AddIssueModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [status] = useState('Reported');
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // Adjusted loading state name to lowercase

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

    setLoading(true); // Set loading to true
    try {
      const res = await axios.post("http://localhost:3000/issue", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("Issue added successfully:", res.data);
      toast.success("Issue added successfully");
      onClose();
      navigate(`/issue/`);
    } catch (error) {
      console.error("Error adding issue:", error);
      toast.error("Failed to add issue");
    } finally {
      setLoading(false); // Reset loading state in finally block
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg='none' backdropFilter='auto' backdropInvert='15%' backdropBlur='2px' />
      <ModalContent borderRadius={10} bg={"rgb(39 39 42)"} color="white">
        <ModalHeader className="shadow-lg">Add New Issue</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="shadow-lg">
          <FormControl mb={4}>
            <FormLabel color="white">Title</FormLabel>
            <Input
              placeholder="Enter issue title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              bg="gray.800"
              border="none"
              focusBorderColor="blue.500"
              color="white"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel color="white">Description</FormLabel>
            <Textarea
              placeholder="Enter issue description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              bg="gray.800"
              border="none"
              focusBorderColor="blue.500"
              color="white"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel color="white">Location</FormLabel>
            <Input
              placeholder="Enter issue location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              bg="gray.800"
              border="none"
              focusBorderColor="blue.500"
              color="white"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel color="white">Photos</FormLabel>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              bg="gray.800"
              border="none"
              focusBorderColor="blue.500"
              color="white"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel color="white">Video</FormLabel>
            <Input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              bg="gray.800"
              border="none"
              focusBorderColor="blue.500"
              color="white"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter className="bg-opacity-100 shadow-lg">
          <Button isLoading={loading} colorScheme="blue" onClick={handleSubmit} mr={3}>
            Add Issue
          </Button>
          <Button variant="ghost" onClick={onClose} colorScheme="blue">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddIssueModal;
