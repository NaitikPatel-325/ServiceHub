import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import ProfessionalRegistrationForm from './ProfessionalRegistrationForm';
import toast from "react-hot-toast";
import RequestProfessional from './RequestProfessional';

const Profile: React.FC = () => {
    const user = useSelector((state: any) => state?.user?.user);
    console.log("Full User Object:", user);

    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        address: '',
        phone_number: '',
        email: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                address: user.address || '',
                phone_number: user.phone_number || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:3000/user/update', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success("Profile updated successfully");
                setFormData((prevData) => ({ ...prevData, ...response.data }));
                setIsEditing(false);
                setShowModal(false);
            }
        } catch (error) {
            toast.error("Error updating profile");
            console.error('Error updating profile:', error);
        }
    };

    const handleProfessionalRegistration = () => {
        setShowModal(true);
    };

    return (
        <div className="max-w-6xl mx-auto p-12 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-5xl font-bold text-gray-800">Account Info</h1>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors min-w-[150px]"
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm ${isEditing ? "bg-white" : "bg-gray-100"}`}
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm ${isEditing ? "bg-white" : "bg-gray-100"}`}
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm ${isEditing ? "bg-white" : "bg-gray-100"}`}
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm ${isEditing ? "bg-white" : "bg-gray-100"}`}
                        />
                    </div>
                </div>

    
              
                
    
                {isEditing && (
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="px-8 py-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors min-w-[150px]"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </form>

          
            {user?.role === "professional" && (
                <>
                    <div className="mt-6">
                        <h2 className="text-lg text-black font-semibold">Experience</h2>
                        <p className='text-black'>{user?.experience || 'N/A'}</p>
                    </div>
                    <div className="mt-2">
                        <h2 className="text-black text-lg font-semibold">Certificate URL</h2>
                        <a href={user?.certificate} target="_blank" rel="noopener noreferrer" className=" text-blue-500 underline">
                            View Certificate
                        </a>
                    </div>
                    <div className="mt-2">
                        <h2 className="text-black text-lg font-semibold">Profession Type</h2>
                        <p className='text-black'>{user?.professionType}</p>
                    </div>
                </>
            )}

            {user?.role === 'citizen' && (
                <div className="mt-12">
                    <button
                        onClick={handleProfessionalRegistration}
                        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        Register as Professional
                    </button>
                </div>
            )}

            {user?.role === "goverment" && 
                <RequestProfessional />
            }
            <ProfessionalRegistrationForm isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default Profile;
