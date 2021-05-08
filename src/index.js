import debug from 'debug';
import fs from 'fs/promises';
import path from 'path';

import download from './downloadResource';
import updatePaths from './updatePaths';
import request from './request';
import getName from './getName';

const logger = debug('page-loader');

const loader = async (url, folder, log = logger) => {
  if (!url) {
    log('url is empty');

    return '';
  }

  const htmlFileName = getName(url);
  const folderName = getName(url, 'folder');
  const htmlFilePath = path.resolve(__dirname, folder, htmlFileName);
  const folderPath = path.resolve(__dirname, folder, folderName);

  try {
    log(`fetch page ${url}`);
    const htmlData = await request(url);

    log('replace links');
    const { data, links } = updatePaths(htmlData, url);

    log(`create directory ${folderPath}`);
    await fs.mkdir(folderPath);

    log(`save page ${htmlFilePath}`);
    await fs.writeFile(htmlFilePath, data);

    // maybe separate actions: fetch and save
    const promises = links.map(({ href, name }) => {
      log(`fetch resource ${href}`);

      return download(href, `${folderPath}/${name}`);
    });
    await Promise.all(promises);

    return htmlFilePath;
  } catch (error) {
    log(`error: ${error}`);
    throw error;
  }
};

export default loader;
