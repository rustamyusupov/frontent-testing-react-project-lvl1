import debug from 'debug';
import fs from 'fs';
import path from 'path';

import downloadResource from './downloadResource';
import { getFileName, getFolderName } from './utils';
import replaceLinks from './replaceLinks';
import request from './request';

const logger = debug('page-loader');

const loader = async (url, folder, log = logger) => {
  if (!url) {
    log('url is empty');

    return '';
  }

  const htmlFile = getFileName(url);
  const folderName = getFolderName(url);
  const htmlPath = path.resolve(__dirname, folder, htmlFile);
  const filesPath = path.resolve(__dirname, folder, folderName);

  log(`fetch page ${url}`);
  const htmlData = await request({ url, responseType: 'text', log });

  log('replace links');
  const { data, links } = replaceLinks(htmlData, url);

  try {
    if (!fs.existsSync(filesPath)) {
      log(`create directory ${filesPath}`);
      fs.mkdirSync(filesPath);
    }

    log(`save page ${htmlPath}`);
    fs.writeFileSync(htmlPath, data);
  } catch (error) {
    log(error);
    throw error;
  }

  const promises = links.map(({ href, name }) =>
    downloadResource({ url: href, path: `${filesPath}/${name}`, log })
  );
  await Promise.all(promises);

  return htmlPath;
};

export default loader;
