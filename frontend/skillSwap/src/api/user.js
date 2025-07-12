import axios from 'axios';

export const getUserDetail = async (id, token) => {
  const response = await axios.post(
    'http://localhost:1124/api/v1/user/detail',
    { id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
};
