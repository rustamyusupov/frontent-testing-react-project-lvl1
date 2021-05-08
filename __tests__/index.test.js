import axios from 'axios';
import fs from 'fs/promises';
import nock from 'nock';
import os from 'os';
import path from 'path';

import getName from '../src/getName';
import loader from '../src/index';

axios.defaults.adapter = require('axios/lib/adapters/http');

const getFixture = (fileName) => path.join(__dirname, '../__fixtures__', fileName);

describe('index loader', () => {
  let tempDir = '';
  const origin = 'https://ru.hexlet.io';
  const pathname = '/courses';
  const url = `${origin}${pathname}`;
  const responseStatuses = {
    ok: 200,
    notFound: 404,
    serverError: 500,
  };

  beforeAll(() => nock.disableNetConnect());
  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });
  afterEach(() => nock.cleanAll());
  afterAll(() => nock.enableNetConnect());

  it('should return files', async () => {
    const htmlFile = await fs.readFile(getFixture('index.html'), 'utf-8');
    const cssFile = await fs.readFile(getFixture('assets/application.css'), 'utf-8');
    const imgFile = await fs.readFile(getFixture('assets/professions/nodejs.png'), 'utf-8');
    const jsFile = await fs.readFile(getFixture('packs/js/runtime.js'), 'utf-8');

    nock(origin)
      .get(pathname)
      .reply(responseStatuses.ok, htmlFile)
      .get('/assets/application.css')
      .reply(responseStatuses.ok, cssFile)
      .get('/assets/professions/nodejs.png')
      .reply(responseStatuses.ok, imgFile)
      .get('/packs/js/runtime.js')
      .reply(responseStatuses.ok, jsFile);

    await loader(url, tempDir);

    const htmlPath = path.join(tempDir, getName(url));
    const htmlResult = await fs.readFile(htmlPath, 'utf-8');
    const htmlExpected = await fs.readFile(getFixture('result.html'), 'utf-8');

    expect(htmlResult).toBe(htmlExpected);

    const assetsPaths = [
      '/assets/application.css',
      '/assets/professions/nodejs.png',
      '/packs/js/runtime.js',
    ];

    const test = async (file) => {
      const fileName = getName(`${origin}${file}`);
      const filePath = path.join(tempDir, 'ru-hexlet-io-courses_files', fileName);
      const result = await fs.readFile(filePath, 'utf-8');
      const expected = await fs.readFile(getFixture(file), 'utf-8');

      expect(result).toBe(expected);
    };

    const promises = assetsPaths.map(test);
    await Promise.all(promises);
  });

  it('should reject with 404', async () => {
    const scope = nock(origin).get('/notFound').reply(responseStatuses.notFound);
    const result = () => loader(`${origin}/notFound`, tempDir);

    await expect(result).rejects.toThrow(Error);
    scope.done();
  });

  it('should return error for wrong folder', async () => {
    const scope = nock(origin).get(pathname).reply(responseStatuses.ok, '');

    await expect(loader(url, `${tempDir}/folder`)).rejects.toThrow();
    scope.done();
  });
});
