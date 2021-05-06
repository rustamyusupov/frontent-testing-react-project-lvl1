import fs from 'fs';
import path from 'path';

import request from './request';
import getName from './getName';

const downloadResource = async (link, url, filesPath, log) => {
  log(`fetch ${link}`);

  const { host } = new URL(url);
  const data = await request(`${url}/${link}`, 'arraybuffer');
  const ext = path.extname(link);
  const withoutExt = link.replace(ext, '');
  const fileName = getName(`${host}/${withoutExt}`);
  const filePath = `${filesPath}/${fileName}${ext}`;

  log(`save ${fileName}`);
  await fs.promises.writeFile(filePath, data);
};

export default downloadResource;
