import fs from 'fs';

import request from './request';
import getName from './getName';

const downloadResource = async (link, url, filesPath, log) => {
  const { protocol, host, pathname } = new URL(url);
  const href = `${host}${pathname}/${link}`.replace(/\/\//g, '/');
  const newUrl = `${protocol}//${href}`;

  log(`fetch ${newUrl}`);

  const data = await request(newUrl, 'arraybuffer');
  const name = `${host}/${link}`.replace(/\/\//g, '/');
  const fileName = getName(name);
  const filePath = `${filesPath}/${fileName}`;

  log(`save ${fileName}`);
  await fs.promises.writeFile(filePath, data);
};

export default downloadResource;
