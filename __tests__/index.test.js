import axios from 'axios';
import fs from 'fs';
import nock from 'nock';
import os from 'os';
import path from 'path';

import loader from '../src/index';

axios.defaults.adapter = require('axios/lib/adapters/http');

const origin = 'http://rustamyusupov.github.io';
const pathname = '/nerds';
const url = `${origin}${pathname}`;
const responseStatuses = {
  ok: 200,
  serverError: 500,
};
const fileName = 'rustamyusupov-github-io-nerds.html';

describe('index loader', () => {
  let tempDir = '';

  beforeAll(() => nock.disableNetConnect());
  beforeEach(async () => {
    const dirPath = path.join(os.tmpdir(), 'page-loader-');

    tempDir = await fs.promises.mkdtemp(dirPath);
  });
  afterEach(() => nock.cleanAll());
  afterAll(() => nock.enableNetConnect());

  it('should return filename', async () => {
    nock(origin).get(pathname).reply(responseStatuses.ok, fileName);

    const result = await loader(url, tempDir);
    const expected = path.join(tempDir, 'rustamyusupov-github-io-nerds.html');

    expect(result).toBe(expected);
  });

  it('should return file is exists', async () => {
    nock(origin).get(pathname).reply(responseStatuses.ok);

    const response = await loader(url, tempDir);
    const result = fs.existsSync(response);

    expect(result).toBeTruthy();
  });

  it('should return empty string', async () => {
    nock(origin).get(pathname).reply(responseStatuses.ok);

    const result = await loader('', '');

    expect(result).toBe('');
  });

  it('should reject with error', async () => {
    nock(origin).get(pathname).reply(responseStatuses.serverError);

    const result = () => loader(url, tempDir);

    await expect(result).rejects.toThrow(Error);
  });
});
