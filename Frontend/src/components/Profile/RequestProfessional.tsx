import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ProfessionalRequest {
  id: string;
  username: string;
  professionType: string;
  certificate: string;
  status: string; 
}

export default function RequestProfessional() {
  const [requests, setRequests] = useState<ProfessionalRequest[]>([]);

  useEffect(() => {
    const fetchProfessionalRequests = async () => {
      try {
        const response = await axios.get("https://servicehub-k17j.onrender.com/user/getprofessionalrequest", {
          withCredentials: true,
        });
        console.log("Fetched requests:", response.data); 
        const professionals = response.data.data.professionals;
        if (Array.isArray(professionals)) {
          const formattedRequests: ProfessionalRequest[] = professionals.map(prof => ({
            id: prof._id, 
            username: prof.username,
            professionType: prof.professionType,
            certificate: prof.certificate,
            status: prof.professionStatus, 
          }));
          setRequests(formattedRequests);
        } else {
          toast.error("Invalid data format.");
        }
      } catch (error) {
        toast.error("Failed to fetch professional requests.");
        console.error("Error fetching requests:", error);
      }
    };

    fetchProfessionalRequests();
  }, []);

  const handleAccept = async (id: string) => {
    console.log("Accepting request:", id);  
    try {
      await axios.post(`https://servicehub-k17j.onrender.com/user/acceptrequest/${id}`, {}, {
        withCredentials: true,
      });
      setRequests((prev) => prev.filter((request) => request.id !== id));
      toast.success("Request accepted successfully.");
    } catch (error) {
      toast.error("Failed to accept request.");
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.post(`https://servicehub-k17j.onrender.com/rejectprofessionalrequest/${id}`, {}, {
        withCredentials: true,
      });
      setRequests((prev) => prev.filter((request) => request.id !== id));
      toast.success("Request rejected successfully.");
    } catch (error) {
      toast.error("Failed to reject request.");
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className='text-black'>
      <h1 className="text-2xl font-bold mb-4">Professional Requests</h1>
      {requests.length === 0 ? (
        <p>No professional requests available.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{request.username}</h2>
                <p>Profession: {request.professionType}</p>
                <p>Status: {request.status}</p>
                {/* Link to the certificate */}
                {request.certificate && (
                  <p>
                    <a 
                      href={request.certificate} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-500 underline"
                    >
                      View Certificate
                    </a>
                  </p>
                )}
              </div>
              <div>
                <button
                  onClick={() => handleAccept(request.id)}
                  className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
