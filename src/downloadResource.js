import fs from 'fs';

import request from './request';

const downloadResource = async ({ url, path, log }) => {
  log(`fetch ${url}`);

  const data = await request({ url, responseType: 'arraybuffer', log });

  log(`save ${path}`);
  await fs.promises.writeFile(path, data);
};

export default downloadResource;
