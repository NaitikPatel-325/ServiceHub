import React, { useState, useEffect } from 'react';
import { ChevronRight, User, FileText, Phone, Mail, MapPin } from 'lucide-react';
import { useSelector } from "react-redux";
import axios from 'axios';

const Profile: React.FC = () => {
    const user = useSelector((state: any) => state?.user);

    console.log('User:', user);
    const [isEditing, setIsEditing] = useState(false);
    const [isProfessionalRegistration, setIsProfessionalRegistration] = useState(false);

    const [formData, setFormData] = useState({
        username: user?.user?.username ||  '',
        address: user?.user?.address ||  '',
        phone_number: user?.user?.phone_number ||  '',
        email: user?.user?.email || '',
        certificate: '',
        year_of_experience: '',
        profession: ''
    });

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get('http://localhost:3000/user/check', {
                    withCredentials: true,
                });
                console.log('User:', response.data.data.user);

                setFormData((prevData) => ({ ...prevData, ...response.data.data.user }));
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        if (!user?.isAuthenticated) {
            fetchUser();
        }
    }, []);
    
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
                setFormData((prevData) => ({ ...prevData, ...response.data }));
                setIsEditing(false);
                setIsProfessionalRegistration(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleProfessionalRegistration = async () => {
        setIsProfessionalRegistration(true);
        setIsEditing(true);
    };

    const handleSubmitforprofessional = async (e: React.FormEvent) => {
        e.preventDefault();

        setFormData({ ...formData, 
            year_of_experience: formData.year_of_experience,
            profession: formData.profession
        });

        console.log('formData:', formData);
        setIsEditing(false);

        try {
            // Make a PUT request to update the user profile data
            const response = await axios.put('http://localhost:3000/user/changeroletoprofessional', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                setFormData((prevData) => ({ ...prevData, ...response.data }));
                setIsEditing(false);
                setIsProfessionalRegistration(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    }

    if (user?.isAuthenticated === false) {
        return (
            <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">Account Info</h1>
                <p className="text-gray-500 text-lg">Please login to view your account information</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-12 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-5xl font-bold text-gray-800">Account Info</h1>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>
    
            <form onSubmit={handleSubmit}>
                <div className="mb-12 flex flex-col md:flex-row items-center md:items-start">
                    <div className="w-48 h-48 bg-gray-200 rounded-full relative flex items-center justify-center overflow-hidden mb-6 md:mb-0">
                        {user?.user?.avatar ? (
                            <img src={user.user.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={90} className="text-gray-400" />
                        )}
                    </div>
                    <div className="md:ml-12 text-center md:text-left">
                        <h2 className="text-4xl font-semibold text-gray-800 mb-2">{formData.username || 'Your Name'}</h2>
                        <p className="text-2xl text-gray-500 mb-4">{user?.user?.role || 'User'}</p>
                        <p className="text-gray-600 flex items-center justify-center md:justify-start">
                            <MapPin size={20} className="mr-2" /> {formData.address || 'Location not set'}
                        </p>
                    </div>
                </div>
    
                <div className="bg-gray-50 rounded-lg p-8 mb-10">
                    <h2 className="text-3xl font-semibold mb-6 text-gray-700">Basic Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InfoItem
                            icon={<User size={22} />}
                            label="Name"
                            value={formData.username}
                            name="username"
                            isEditing={isEditing}
                            onChange={handleInputChange}
                        />
                        <InfoItem
                            icon={<MapPin size={22} />}
                            label="Address"
                            value={formData.address}
                            name="address"
                            isEditing={isEditing}
                            onChange={handleInputChange}
                        />
                        <InfoItem
                            icon={<Phone size={22} />}
                            label="Phone number"
                            value={formData.phone_number}
                            name="phone_number"
                            isEditing={isEditing}
                            onChange={handleInputChange}
                            verified={!!user?.user?.phone_number}
                        />
                        <InfoItem
                            icon={<Mail size={22} />}
                            label="Email"
                            value={formData.email}
                            name="email"
                            isEditing={isEditing}
                            onChange={handleInputChange}
                            verified={!!user?.user?.email}
                        />
                    </div>
                </div>
    
                {user?.user?.role === 'professional' && user?.user?.role !== 'goverment' ? (
                    <div className="bg-gray-50 rounded-lg p-8">
                        <h2 className="text-3xl font-semibold mb-6 text-gray-700">Professional Information</h2>
                        <div className="space-y-4">
                            <InfoItem
                                icon={<FileText size={22} />}
                                label="Year of Experience"
                                value={user.user.year_of_experience}
                                isEditing={isEditing}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-4">
                            <InfoItem
                                icon={<FileText size={22} />}
                                label="profession"
                                value={user.user.profession}
                                isEditing={isEditing}
                                onChange={handleInputChange}
                            />
                        </div>

                    </div>
                ) : (
                    <div className="mt-8">
                        {!isProfessionalRegistration && user?.user?.role !== 'goverment'  &&
                            <button
                                type="button"
                                onClick={handleProfessionalRegistration}
                                className="w-full px-8 py-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-lg font-semibold"
                            > 
                                Want to register as a professional?
                            </button>
                        }
                        {isProfessionalRegistration && user?.user?.role !== 'goverment' &&
                            <div className="bg-gray-50 rounded-lg p-8 mt-8">
                            <h2 className="text-3xl font-semibold mb-6 text-black">Professional Registration</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InfoItem
                                    icon={<FileText size={22} />}
                                    label="Year of Experience"
                                    value={formData.year_of_experience}
                                    name="year_of_experience"
                                    isEditing={isEditing}
                                    onChange={handleInputChange}
                                />
                                <InfoItem
                                    icon={<FileText size={22} />}
                                    label="profession"
                                    value={formData.profession}
                                    name="profession"
                                    isEditing={isEditing}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    onClick={handleSubmitforprofessional}
                                >
                                    Submit Professional Information
                                </button>
                            </div>
                            </div>

                        }
                    
                    </div>
                )}
    
                {isEditing && (
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="px-8 py-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
    
};

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    verified?: boolean;
    action?: React.ReactNode;
    isEditing?: boolean;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, verified, action, isEditing, name, onChange }) => {
    return (
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center flex-grow">
                <div className="mr-4 text-black">{icon}</div> 
                <div className="flex-grow">
                    <p className="text-sm font-medium text-black">{label}</p> 
                    {isEditing && name ? (
                        <input
                            type="text"
                            name={name}
                            value={value}
                            onChange={onChange}
                            className="w-full font-semibold text-black border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                    ) : (
                        <p className="font-semibold text-black">
                            {value}
                            {verified && <span className="ml-2 text-green-500 text-sm">●&nbsp;Verified</span>}
                        </p>
                    )}
                </div>
            </div>
            {action ? action : <ChevronRight size={20} className="text-gray-400" />}
        </div>
    );
};

export default Profile;
