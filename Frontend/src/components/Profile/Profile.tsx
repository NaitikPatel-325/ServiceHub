import React from 'react';
import { ChevronRight, Edit } from 'lucide-react';
import { useSelector } from "react-redux";

const Profile: React.FC = () => {
  const { name, phoneNumber, email } = useSelector((state: any) => state?.user);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Account Info</h1>
      
      <div className="mb-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto relative">
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-2">
            <Edit size={16} />
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-2">Basic Info</h2>
      
      <div className="space-y-4">
        <InfoItem label="Name" value={name || 'N/A'} />
        <InfoItem label="Phone number" value={phoneNumber || 'N/A'} verified />
        <InfoItem label="Email" value={email || 'N/A'} verified />
      </div>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  verified?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, verified }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value} {verified && <span className="text-green-500">●</span>}</p>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  );
};

export default Profile;
