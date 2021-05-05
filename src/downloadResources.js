import fs from 'fs';
import path from 'path';

import request from './request';
import getName from './getName';

const downloadResources = (links, url, filesPath) => {
  const { host } = new URL(url);

  links.forEach(async (link) => {
    const data = await request(`${url}/${link}`, 'arraybuffer');
    const ext = path.extname(link);
    const withoutExt = link.replace(ext, '');
    const fileName = getName(`${host}/${withoutExt}`);
    const filePath = `${filesPath}/${fileName}${ext}`;

    fs.writeFileSync(filePath, data);
  });
};

export default downloadResources;
