import { tmpdir } from 'os';
import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const cacheDir = join(tmpdir(), 'cache');

const buildCacheFilePath = (key: string) => join(cacheDir, key);

const setup = async () => {
  try {
    await readdir(cacheDir);
  } catch (e) {
    try {
      await mkdir(cacheDir);
    } catch (nestedError) {
      // concurrent mkdir can be a problem, maybe a lock would be better
      console.error(nestedError);
    }
  }
};

// TODO: expiration tbd
const set = async <T>(key: string, value: T) => {
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

export const cacheService = { setup, get, set };
