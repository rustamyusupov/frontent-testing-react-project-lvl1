import fs from 'fs';
import path from 'path';

import downloadResources from './downloadResources';
import getName from './getName';
import replaceLinks from './replaceLinks';
import request from './request';

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
    const htmlData = await request(url, 'text');

    if (!fs.existsSync(filesPath)) {
      fs.mkdirSync(filesPath);
    }

    const { data, links } = replaceLinks(htmlData, url);

    fs.writeFileSync(htmlPath, data);

    await downloadResources(links, url, filesPath);
  } catch (error) {
    throw new Error(error);
  }

  return htmlPath;
};

export default loader;
