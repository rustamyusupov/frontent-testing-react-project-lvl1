import fs from 'fs';
import path from 'path';
import axios from 'axios';

const getFileName = (url) => {
  const { host, pathname } = new URL(url);
  const location = `${host}${pathname}`;
  const name = location.replace(/[^\w]/gi, '-');
  const fileName = `${name}.html`;

  return fileName;
};

const loader = async (url, folder) => {
  const fileName = getFileName(url);
  const filePath = path.resolve(__dirname, folder, fileName);

  const response = await axios.get(url, { responseType: 'arraybuffer' });

  await fs.promises.writeFile(filePath, response.data);

  return filePath;
};

export default loader;
