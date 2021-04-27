import { tmpdir } from 'os';
import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const cacheDir = join(tmpdir(), 'cache');

const buildCacheFilePath = (key: string) => join(cacheDir, key);

// TODO: expiration tbd
const set = async <T>(key: string, value: T) => {
  try {
    await readdir(cacheDir);
  } catch (e) {
    await mkdir(cacheDir);
  }
  const cacheFilePath = buildCacheFilePath(key);
  await writeFile(cacheFilePath, JSON.stringify(value));
};

const get = async <T>(key: string) => {
  const cacheFilePath = buildCacheFilePath(key);
  try {
    const file = await readFile(cacheFilePath);
    const json = file.toString();
    return JSON.parse(json) as T;
  } catch (e) {
    return null;
  }
};

export const cacheService = { get, set };
