import axios from 'axios';

export const getSentSwapRequests = async () => {
  const token = localStorage.getItem('skillswap_token');
  console.log("token is ",token);
  if (!token) throw new Error('Token missing');

  try {
    const response = await axios.get('http://localhost:1124/api/v1/user/allsendrequest', {
      
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data.data; // Assuming the backend sends: { success: true, data: [...] }
  } catch (error) {
    console.error('❌ Error loading sent requests:', error.response?.data || error.message);
    throw error;
  }
};

export const getReceivedSwapRequests = async () => {
  const token = localStorage.getItem('skillswap_token');
  console.log("token is ", token);
  if (!token) throw new Error('Token missing');

  try {
    const response = await axios.get('http://localhost:1124/api/v1/user/allreciverequest', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data.data; // Adjust this if your backend structure is different
  } catch (error) {
    console.error('❌ Error loading received requests:', error.response?.data || error.message);
    throw error;
  }
};


export const acceptSwapRequest = async (id) => {
  const token = localStorage.getItem('skillswap_token');
  const response = await axios.post(
    `http://localhost:1124/api/v1/user/accept/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const rejectSwapRequest = async (id) => {
  const token = localStorage.getItem('skillswap_token');
  const response = await axios.delete(
    `http://localhost:1124/api/v1/user/reject/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
