import axios from 'axios';

const fetchFile = async (url, responseType) => {
  try {
    const response = await axios.get(url, { responseType });
    const result = response.data;

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export default fetchFile;
