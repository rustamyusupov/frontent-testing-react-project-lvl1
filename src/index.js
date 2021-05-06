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

  const name = getName(url);
  const htmlName = `${name}.html`;
  const filesName = `${name}_files`;
  const htmlPath = path.resolve(__dirname, folder, htmlName);
  const filesPath = path.resolve(__dirname, folder, filesName);

  log(`fetch page ${url}`);
  const htmlData = await request(url, 'text');

  log('replace links');
  const { data, links } = replaceLinks(htmlData, url, log);

  try {
    if (!fs.existsSync(filesPath)) {
      log(`create directory ${filesPath}`);
      fs.mkdirSync(filesPath);
    }

    log(`save page ${htmlPath}`);
    fs.writeFileSync(htmlPath, data);
  } catch (error) {
    throw new Error(error);
  }

  const promises = links.map((link) => downloadResource(link, filesPath, log));
  await Promise.all(promises);

  return htmlPath;
};

export default loader;
