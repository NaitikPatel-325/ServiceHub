import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
} from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';


interface Task {
  _id: string;
  task_description: string;
  task_cost: number;
  task_estimate_days: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
  issue_id  : string;
  issue_name: string; 
  location: string;
}


const TaskList: React.FC = () => {
  const user = useSelector((state: any) => state?.user?.user);
  const isAuthenticated = useSelector((state: any) => state?.user?.isAuthenticated);
  console.log("Is Authenticated:", isAuthenticated);

  const textColor = 'black';
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/task/professional/${user._id}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      setTasks(response.data.data.tasks || []);
      console.log("Tasks fetched successfully:", response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks');
      toast({
        title: 'Error fetching tasks.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user._id) {
      console.error('User is not loaded yet');
      return;
    }
    fetchTasks();
  }, [user, toast]);

  const handleTaskCompletion = async (taskId: string,issueId:any) => {
    try {
      await axios.put(`http://localhost:3000/task/changestatus/${taskId}`, { issue_id: issueId,}, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      toast({
        title: 'Task status updated successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      // Refetch tasks to update the list
      fetchTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      toast({
        title: 'Error updating task status.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>{error}</div>;
  if (!tasks || tasks.length === 0) return <div>No tasks available.</div>;

  if (!isAuthenticated || user.role === 'citizen') {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={bgColor}
      >
        <Box
          maxWidth="md"
          width="full"
          borderRadius="xl"
          p={10}
          boxShadow="xl"
          bg={cardBgColor}
        >
          <VStack spacing={8}>
            <WarningTwoIcon boxSize="16" color="red.500" />
            <Heading size="xl" textAlign="center" color={textColor}>
              Access Denied
            </Heading>
            <Text fontSize="lg" textAlign="center" color={textColor}>
              Only professionals can view this page
            </Text>
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="md"
            >
              <AlertIcon boxSize="6" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg" color={textColor}>
                Unauthorized Access
              </AlertTitle>
              <AlertDescription maxWidth="sm" color={textColor}>
                You don't have the required permissions to access this area.
                If you believe this is an error, please contact support.
              </AlertDescription>
            </Alert>
            <Button
              colorScheme="blue"
              width="full"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </VStack>
        </Box>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white p-8 w-full"
    >
      <h1 className="text-4xl font-bold mb-8 text-center">Task List</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-300 mb-4">{task.task_description}</p>
            <h3 className="text-lg font-semibold">Issue Name: {task.issue_name}</h3>
            <h3 className="text-lg font-semibold">Location: {task.location}</h3>
            <h3 className="text-lg font-semibold">Cost: {task.task_cost}</h3>
            <h3 className="text-lg font-semibold">Estimated Days: {task.task_estimate_days}</h3>
            <h3 className={`text-lg font-semibold ${
              task.status === 'Completed' ? 'text-green-500' : 
              task.status === 'In Progress' ? 'text-blue-500' : 'text-yellow-500'
            }`}>
              Status: {task.status}
            </h3>

            <button
              onClick={() => handleTaskCompletion(task._id, task?.issue_id)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              disabled={task.status === 'Completed'}
            >
              {task.status === 'Completed' ? 'Task Completed' : 'Mark as Completed'}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TaskList;