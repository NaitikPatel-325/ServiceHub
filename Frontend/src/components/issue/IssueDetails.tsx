import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const IssueDetails = () => {
  const { id } = useParams();  // Get the issue ID from the route
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch issue details when the component mounts
    const fetchIssueDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/issue/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setIssue(response.data.data.issue);
      } catch (err) {
        setError('Error fetching issue details');
        console.error("Error fetching issue:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssueDetails();
  }, [id]);

  if (loading) return <div>Loading issue details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="issue-details">
      <h1>{issue?.title}</h1>
      <p>{issue?.description}</p>
      <p>Status: {issue?.status}</p>
      <p>Location: {issue?.location}</p>
      <p>Reported on: {new Date(issue?.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default IssueDetails;
