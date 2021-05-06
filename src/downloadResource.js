import fs from 'fs';

import request from './request';
import getName from './getName';

const downloadResource = async (link, url, filesPath, log) => {
  log(`fetch ${link}`);

  const { protocol, host, pathname } = new URL(url);
  const newUrl = `${host}${pathname}/${link}`.replace(/\/\//g, '/');
  const data = await request(`${protocol}//${newUrl}`, 'arraybuffer');
  const name = `${host}/${link}`.replace(/\/\//g, '/');
  const fileName = getName(name);
  const filePath = `${filesPath}/${fileName}`;

  log(`save ${fileName}`);
  await fs.promises.writeFile(filePath, data);
};

export default downloadResource;
