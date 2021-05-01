import fs from 'fs';
import path from 'path';

import fetchFile from './fetchFile';
import getFileName from './getFileName';

const loader = async (url, folder) => {
  const fileName = getFileName(url);
  const filePath = path.resolve(__dirname, folder, fileName);

  const fileData = await fetchFile(url);

  fs.writeFileSync(filePath, fileData);

  return filePath;
};

export default loader;
