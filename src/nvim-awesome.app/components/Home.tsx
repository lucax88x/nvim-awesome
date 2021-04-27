import { filter, flatten, map, uniq } from 'ramda';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plugin } from '../models/plugin.model';
import { AutocompleteTag } from './AutocompleteTag';
import { Header, headerHeight } from './Header';
import { PluginCard } from './PluginCard';

interface HomeProps {
  plugins: Plugin[];
}

const autocompleteHeight = '80px';

export const Home = ({ plugins }: HomeProps) => {
  const [internalPlugins, setInternalPlugins] = useState<Plugin[]>(plugins);
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

  useEffect(() => {
    console.log(internalTags);
    if (!!internalTags.length) {
      const filteredPlugins = filter(
        plugin => internalTags.every(tag => plugin.tags.includes(tag)),
        plugins,
      );
      setInternalPlugins(filteredPlugins);
      console.log(filteredPlugins);
    } else {
      setInternalPlugins(plugins);
    }
  }, [plugins, internalTags]);

  return (
    <>
      <Header />
      <div className='container mx-auto pt-2'>
        <div className='grid gap-2'>
          <AutocompleteTag suggestions={tags} onChange={handleTagChange} />
          <div
            className='grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto pr-1'
            style={{ maxHeight: `calc(100vh - ${headerHeight} - ${autocompleteHeight})` }}
          >
            {map(
              plugin => (
                <PluginCard key={plugin.name} item={plugin} />
              ),
              internalPlugins,
            )}
          </div>
        </div>
      </div>
    </>
  );
};
