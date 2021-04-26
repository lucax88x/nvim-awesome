import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  fs.readdir('../data/plugins', (err, files) => {
    if (!err) {
      console.error(err);
      res.status(500).json({ error: 'Plugins folder missing' });
    }
    if (!!files && files.length) {
      files.forEach(file => {
        console.log(file);
      });
    }
    else {
      res.status(500).json({ error: 'No plugins!' });
    }
    res.status(200).json({ name: files.length });
  });
};
