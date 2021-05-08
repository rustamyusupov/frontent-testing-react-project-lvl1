import fs from 'fs/promises';

import request from './request';

const downloadResource = async (url, path) => {
  const data = await request(url, 'arraybuffer');

  await fs.writeFile(path, data);
};

export default downloadResource;
