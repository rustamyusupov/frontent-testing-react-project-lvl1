import fs from 'fs';

import request from './request';
import getName from './getName';

const downloadResource = async (link, url, filesPath, log) => {
  log(`fetch ${url}/${link}`);

  const { host } = new URL(url);
  const data = await request(`${url}/${link}`, 'arraybuffer');
  const fileName = getName(`${host}/${link}`);
  const filePath = `${filesPath}/${fileName}`;

  log(`save ${fileName}`);
  await fs.promises.writeFile(filePath, data);
};

export default downloadResource;
