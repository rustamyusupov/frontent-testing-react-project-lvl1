import fs from 'fs';
import os from 'os';
import path from 'path';

import loader from '../src/index';

const url = 'https://raw.githubusercontent.com/rustamyusupov/life-in-weeks/master/README.md';
const fileData = path.join(
  __dirname,
  '../__fixtures__/raw-githubusercontent-com-rustamyusupov-life-in-weeks-master-README-md.html'
);

describe('index loader', () => {
  let tempDir = '';

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });

  it('should return filename', async () => {
    const result = await loader(url, tempDir);
    const expected = path.join(
      tempDir,
      'raw-githubusercontent-com-rustamyusupov-life-in-weeks-master-README-md.html'
    );

    expect(result).toBe(expected);
  });

  it('should return fetched file', async () => {
    const response = await loader(url, tempDir);
    const result = fs.readFileSync(response, { encoding: 'utf-8' });
    const expected = fs.readFileSync(fileData, { encoding: 'utf-8' });

    expect(result).toBe(expected);
  });

  it('should return error', async () => {
    const result = await loader('', '');

    expect(result).toBe('');
  });
});
