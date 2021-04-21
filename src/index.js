import fs from 'fs';
import path from 'path';
import axios from 'axios';

const loader = async (url, folder) => {
  const filePath = path.resolve(__dirname, folder, 'github-com-rustamyusupov.html');

  const response = await axios.get(url, { responseType: 'arraybuffer' });

  await fs.promises.writeFile(filePath, response.data);

  return filePath;
};

export default loader;
