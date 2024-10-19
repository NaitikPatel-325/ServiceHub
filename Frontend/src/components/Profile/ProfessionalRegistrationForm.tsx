import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface ProfessionalRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfessionalRegistrationForm: React.FC<ProfessionalRegistrationFormProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    certificate: null as File | null,
    professionType: '',
    experience: 0,
    professionDescription: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setFormData((prevData) => ({ ...prevData, certificate: files ? files[0] : null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.certificate || !formData.professionType || !formData.experience || !formData.professionDescription) {
      toast.error("All fields are required.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('certificate', formData.certificate!);
    formDataToSubmit.append('professionType', formData.professionType);
    formDataToSubmit.append('experience', formData.experience.toString());
    formDataToSubmit.append('professionDescription', formData.professionDescription);

    try {
      await axios.post("https://servicehub-k17j.onrender.com/user/requesttoprofessional", formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      onClose();
      toast.success("Registration submitted successfully.");
    } catch (error) {
      toast.error("Failed to submit registration.");
      console.error("Error submitting registration:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg='none' backdropFilter='auto' backdropInvert='15%' backdropBlur='2px' />
      <ModalContent borderRadius={10} bg={"rgb(39 39 42)"}>
        <ModalHeader className="shadow-lg text-white">Professional Registration</ModalHeader>
        <ModalCloseButton className="text-white" />
        <ModalBody className="space-y-4 shadow-lg text-gray-900">
          <form onSubmit={handleSubmit}>
            <FormControl mb={4}>
              <FormLabel color="white">Certificate (Upload File)</FormLabel>
              <Input
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={handleFileChange}
                bg="gray.300"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel color="white">Profession Type</FormLabel>
              <Input
                placeholder="Enter profession type"
                name="professionType"
                value={formData.professionType}
                onChange={handleInputChange}
                bg="gray.300"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel color="white">Years of Experience</FormLabel>
              <Input
                type="number"
                placeholder="Enter years of experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                bg="gray.300"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel color="white">Profession Description</FormLabel>
              <Textarea
                placeholder="Describe what you can do and why you want to pursue this profession"
                name="professionDescription"
                value={formData.professionDescription}
                onChange={handleInputChange}
                bg="gray.300"
              />
            </FormControl>
            <ModalFooter className="bg-opacity-100 shadow-lg text-white">
              <Button colorScheme="blue" type="submit">Submit</Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProfessionalRegistrationForm;
