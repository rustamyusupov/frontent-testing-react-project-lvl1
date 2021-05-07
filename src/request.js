import axios from 'axios';

const request = async ({ url, responseType, log }) => {
  try {
    const response = await axios.get(url, { responseType });
    const result = response.data;

    return result;
  } catch (error) {
    log(error);
    throw error;
  }
};

export default request;
