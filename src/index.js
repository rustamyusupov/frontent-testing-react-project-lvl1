import fs from 'fs';
import path from 'path';

import fetchFile from './fetchFile';
import getName from './getName';

// https://ru.hexlet.io/courses -> ru-hexlet-io-courses.html
// https://ru.hexlet.io/courses -> ru-hexlet-io-courses_files
// /assets/professions/nodejs.png -> ru-hexlet-io-assets-professions-nodejs.png

const loader = async (url, folder) => {
  if (!url) {
    return '';
  }

  const { host, pathname } = new URL(url);
  const name = getName(`${host}${pathname}`);
  const htmlName = `${name}.html`;
  const filePath = path.resolve(__dirname, folder, htmlName);
  const filesName = `${name}_files`;
  const dirPath = path.resolve(__dirname, folder, filesName);

  try {
    // download html
    const fileData = await fetchFile(url, 'text');
    fs.writeFileSync(filePath, fileData);

    // create directory
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    // download resource files (images)
    // replace urls for resources
  } catch (error) {
    throw new Error(error);
  }

  return filePath;
};

export default loader;
