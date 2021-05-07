import axios from 'axios';
import fs from 'fs';
import nock from 'nock';
import os from 'os';
import path from 'path';

import { getFileName } from '../src/utils';
import loader from '../src/index';

axios.defaults.adapter = require('axios/lib/adapters/http');

const origin = 'https://ru.hexlet.io';
const pathname = '/courses';
const url = `${origin}${pathname}`;
const responseStatuses = {
  ok: 200,
  notFound: 404,
  serverError: 500,
};

const getFixture = (fileName) => path.join(__dirname, '../__fixtures__', fileName);

describe('index loader', () => {
  let tempDir = '';

  beforeAll(() => nock.disableNetConnect());
  beforeEach(async () => {
    const dirPath = path.join(os.tmpdir(), 'page-loader-');

    tempDir = await fs.promises.mkdtemp(dirPath);
  });
  afterEach(() => nock.cleanAll());
  afterAll(() => nock.enableNetConnect());

  it('should return files', async () => {
    const htmlFile = await fs.promises.readFile(getFixture('index.html'), 'utf-8');
    const cssFile = await fs.promises.readFile(getFixture('assets/application.css'), 'utf-8');
    const jsFile = await fs.promises.readFile(getFixture('packs/js/runtime.js'), 'utf-8');
    const imgFile = await fs.promises.readFile(
      getFixture('assets/professions/nodejs.png'),
      'utf-8'
    );

    nock(origin)
      .get(pathname)
      .reply(responseStatuses.ok, htmlFile)
      .get('/courses')
      .reply(responseStatuses.ok, htmlFile)
      .get('/assets/application.css')
      .reply(responseStatuses.ok, cssFile)
      .get('/assets/professions/nodejs.png')
      .reply(responseStatuses.ok, imgFile)
      .get('/packs/js/runtime.js')
      .reply(responseStatuses.ok, jsFile);

    await loader(url, tempDir);

    const htmlPath = path.join(tempDir, getFileName(url));
    const htmlResult = await fs.promises.readFile(htmlPath, 'utf-8');
    const htmlExpected = await fs.promises.readFile(getFixture('result.html'), 'utf-8');

    expect(htmlResult).toBe(htmlExpected);

    const cssPath = path.join(
      tempDir,
      'ru-hexlet-io-courses_files',
      getFileName(`${origin}/assets/application.css`)
    );
    const cssResult = await fs.promises.readFile(cssPath, 'utf-8');
    const cssExpected = await fs.promises.readFile(getFixture('/assets/application.css'), 'utf-8');

    expect(cssResult).toBe(cssExpected);

    const imgPath = path.join(
      tempDir,
      'ru-hexlet-io-courses_files',
      getFileName(`${origin}/assets/professions/nodejs.png`)
    );
    const imgResult = await fs.promises.readFile(imgPath, 'utf-8');
    const imgExpected = await fs.promises.readFile(
      getFixture('/assets/professions/nodejs.png'),
      'utf-8'
    );

    expect(imgResult).toBe(imgExpected);

    const jsPath = path.join(
      tempDir,
      'ru-hexlet-io-courses_files',
      getFileName(`${origin}/packs/js/runtime.js`)
    );
    const jsResult = await fs.promises.readFile(jsPath, 'utf-8');
    const jsExpected = await fs.promises.readFile(getFixture('/packs/js/runtime.js'), 'utf-8');

    expect(jsResult).toBe(jsExpected);

    // const promises = filePaths.map(test);
    // await Promise.all(promises);

    // const filePaths = [
    //   '/assets/application.css',
    //   '/assets/professions/nodejs.png',
    //   '/packs/js/runtime.js',
    // ];

    // const test = async (file) => {
    //   const fileName = getFileName(`${origin}${file}`);
    //   const filePath = path.join(tempDir, 'ru-hexlet-io-courses_files', fileName);
    //   const result = await fs.promises.readFile(filePath, 'utf-8');
    //   const expected = await fs.promises.readFile(getFixture(file), 'utf-8');

    //   expect(result).toBe(expected);
    // };

    // const promises = filePaths.map(test);
    // await Promise.all(promises);
  });

  it('should reject with 404', async () => {
    nock(origin).get('/notFound').reply(responseStatuses.notFound);

    const result = () => loader(`${origin}/notFound`, tempDir);

    await expect(result).rejects.toThrow(Error);
  });

  it('should return error for wrong folder', async () => {
    nock(origin).get(pathname).reply(responseStatuses.ok);

    const result = () => loader(url, `${tempDir}\folder`);

    await expect(result).rejects.toThrow();
  });
});
