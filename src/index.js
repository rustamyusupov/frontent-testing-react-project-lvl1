import fs from 'fs';
import path from 'path';

import fetchFile from './fetchFile';
import getName from './getName';

const loader = async (url, folder) => {
  if (!url) {
    return '';
  }

  const fileName = `${getName(url)}.html`;
  const filePath = path.resolve(__dirname, folder, fileName);

  try {
    const fileData = await fetchFile(url);

    fs.writeFileSync(filePath, fileData);
  } catch (error) {
    throw new Error(error);
  }

  return filePath;
};

export default loader;
