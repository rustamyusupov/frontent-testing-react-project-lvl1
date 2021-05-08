import debug from 'debug';
import fs from 'fs/promises';
import path from 'path';

import getName from './getName';
import request from './request';
import updatePaths from './updatePaths';

const logger = debug('page-loader');

const loader = async (url, folder, log = logger) => {
  if (!url) {
    log('error: url is empty');

    return '';
  }

  const htmlFileName = getName(url);
  const folderName = getName(url, 'folder');
  const htmlFilePath = path.resolve(__dirname, folder, htmlFileName);
  const folderPath = path.resolve(__dirname, folder, folderName);

  try {
    log(`fetch page ${url}`);
    const htmlData = await request(url);

    log('update paths');
    const { data, links } = updatePaths(htmlData, url);

    log(`create directory ${folderPath}`);
    await fs.mkdir(folderPath);

    log(`save page ${htmlFilePath}`);
    await fs.writeFile(htmlFilePath, data);

    const promises = links.map(async ({ href, name }) => {
      log(`fetch resource ${href}`);
      const response = await request(href, 'arraybuffer');
      await fs.writeFile(`${folderPath}/${name}`, response);
    });
    await Promise.all(promises);

    return htmlFilePath;
  } catch (error) {
    log(`error: ${error}`);
    throw error;
  }
};

export default loader;
