import fs from 'fs';

import request from './request';
import getName from './getName';

const downloadResource = async (link, filesPath, log) => {
  log(`fetch ${link}`);

  const data = await request(link, 'arraybuffer');
  const fileName = getName(link);
  const filePath = `${filesPath}/${fileName}`;

  log(`save ${fileName}`);
  await fs.promises.writeFile(filePath, data);
};

export default downloadResource;
