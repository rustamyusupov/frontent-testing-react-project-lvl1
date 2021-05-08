import axios from 'axios';

const request = async (url, responseType = 'text') => {
  const response = await axios.get(url, { responseType });
  const result = response.data;

  return result;
};

export default request;
