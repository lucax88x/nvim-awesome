import { flatten, map, uniq } from 'ramda';
import { useCallback, useMemo, useState } from 'react';
import { Plugin } from '../models/plugin.model';
import { AutocompleteTag } from './AutocompleteTag';
import { Header } from './Header';
import { Plugins } from './Plugins';

interface HomeProps {
  plugins: Plugin[];
}

export const Home = ({ plugins }: HomeProps) => {
  const [internalTags, setInternalTags] = useState<string[]>([]);

  const tags = useMemo(
    () =>
      uniq(
        flatten(
          map(plugin => map(tag => tag.toLowerCase(), plugin.tags), plugins),
        ),
      ),
    [plugins],
  );

  const handleTagChange = useCallback((eventTags: string[]) => {
    setInternalTags(eventTags);
  }, []);

  return (
    <>
      <Header />
      <div className='container mx-auto pt-2'>
        <div className='grid gap-2'>
          <AutocompleteTag suggestions={tags} onChange={handleTagChange} />
          <Plugins plugins={plugins} tags={internalTags} />
        </div>
      </div>
    </>
  );
};
