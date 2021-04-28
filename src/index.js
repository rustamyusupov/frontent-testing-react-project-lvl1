import fs from 'fs';
import path from 'path';
import axios from 'axios';

import getFileName from './getFileName';

const loader = async (url, folder) => {
  const fileName = getFileName(url);
  const filePath = path.resolve(__dirname, folder, fileName);

  const response = await axios.get(url, { responseType: 'arraybuffer' });

  fs.writeFileSync(filePath, response.data);

  return filePath;
};

export default loader;
