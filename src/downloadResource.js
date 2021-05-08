import fs from 'fs/promises';

import request from './request';

const downloadResource = async (url, path, log) => {
  log(`fetch ${url}`);

  const data = await request({ url, responseType: 'arraybuffer', log });

  log(`save ${path}`);
  await fs.writeFile(path, data);
};

export default downloadResource;
