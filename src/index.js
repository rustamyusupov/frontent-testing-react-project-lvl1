import debug from 'debug';
import fs from 'fs';
import path from 'path';

import downloadResource from './downloadResource';
import getName from './getName';
import replaceLinks from './replaceLinks';
import request from './request';

const logger = debug('page-loader');

const loader = async (url, folder, log = logger) => {
  if (!url) {
    log('url is empty');

    return '';
  }

  const { host, pathname } = new URL(url);
  const name = getName(`${host}${pathname}`);
  const htmlName = `${name}.html`;
  const filesName = `${name}_files`;
  const htmlPath = path.resolve(__dirname, folder, htmlName);
  const filesPath = path.resolve(__dirname, folder, filesName);

  try {
    log(`fetch page ${url}`);
    const htmlData = await request(url, 'text');

    if (!fs.existsSync(filesPath)) {
      log(`create directory ${filesPath}`);
      fs.mkdirSync(filesPath);
    }

    log('replace links');
    const { data, links } = replaceLinks(htmlData, url);

    log(`save page ${htmlPath}`);
    fs.writeFileSync(htmlPath, data);

    const promises = links.map((link) => downloadResource(link, url, filesPath, log));
    await Promise.all(promises);
  } catch (error) {
    throw new Error(error);
  }

  return htmlPath;
};

export default loader;
