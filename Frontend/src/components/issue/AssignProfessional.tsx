import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


interface Professional {
    _id: string;
    professionType: string;
    certificate: string;
    experience: string;
    role: string;
}

const AssignProfessional: React.FC = () => {
    const navigate = useNavigate();
    const { id: issueId } = useParams<{ id: string }>();
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assignedProfessionals, setAssignedProfessionals] = useState<string[]>([]);

    useEffect(() => {
        const fetchProfessionals = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/user/getProfessionals`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                setProfessionals(response.data.data.professionals);
            } catch (err) {
                setError('Failed to fetch professionals');
                console.error('Error fetching professionals:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfessionals();
    }, [issueId]);

    const handleAssign = async (professionalId: string) => {
        try {
            const response = await axios.post(`http://localhost:3000/task/assignProfessional`, {
                issueId,
                professionalId,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            toast.success('Professional assigned successfully');
            if (response.data.success) {
                setAssignedProfessionals((prev) => [...prev, professionalId]);
                navigate('/issues');
            }
        } catch (err) {
            console.error('Error assigning professional:', err);
            setError('Failed to assign professional');
        }
    };

    if (loading) {
        return <p>Loading professionals...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Assign Professional</h1>
            <p>This is the Assign Professional component for issue ID: {issueId}</p>
            <h2>Available Professionals:</h2>
            {professionals?.length > 0 ? (
                <ul>
                    {professionals?.map((prof) => (
                        <li key={prof?._id} className="flex justify-between items-center">
                            <p>{prof?._id}</p>
                            <p>{prof?.experience}</p>
                            <a href={prof?.certificate} target="_blank" rel="noreferrer">
                                Certificate
                            </a>
                            <p>{prof?.professionType}</p> 
                            <button
                                onClick={() => handleAssign(prof?._id)}
                                disabled={assignedProfessionals.includes(prof._id)}
                                className={`ml-4 px-3 py-1 rounded ${assignedProfessionals.includes(prof._id) ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
                            >
                                {assignedProfessionals.includes(prof._id) ? 'Assigned' : 'Assign'}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No professionals available.</p>
            )}
        </div>
    );
};

export default AssignProfessional;
