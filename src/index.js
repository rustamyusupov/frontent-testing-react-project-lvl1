import fs from 'fs';
import path from 'path';

import request from './request';
import getName from './getName';
import replaceLinks from './replaceLinks';

const loader = async (url, folder) => {
  if (!url) {
    return '';
  }

  const { host, pathname } = new URL(url);
  const name = getName(`${host}${pathname}`);
  const htmlName = `${name}.html`;
  const filesName = `${name}_files`;
  const htmlPath = path.resolve(__dirname, folder, htmlName);
  const filesPath = path.resolve(__dirname, folder, filesName);

  try {
    // download html
    const htmlData = await request(url, 'text');

    // create directory
    if (!fs.existsSync(filesPath)) {
      fs.mkdirSync(filesPath);
    }

    // download resource files (images)
    const { data, links } = replaceLinks(htmlData, url);

    fs.writeFileSync(htmlPath, data);
    console.log(links);

    // replace urls for resources
  } catch (error) {
    throw new Error(error);
  }

  return htmlPath;
};

export default loader;
