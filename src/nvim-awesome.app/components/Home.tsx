import { flatten, map, sortBy, uniq, filter } from 'ramda';
import { useCallback, useMemo, useState } from 'react';
import { Plugin } from '../models/plugin.model';
import { Autocomplete, SelectOptionType } from './Autocomplete';
import { Header } from './Header';
import { PluginCard } from './PluginCard';
import { Plugins } from './Plugins';

interface HomeProps {
  plugins: Plugin[];
}

export const Home = ({ plugins }: HomeProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags: SelectOptionType[] = useMemo(() => {
    const uniqTags = uniq(
      flatten(
        map((plugin) => map((tag) => tag.toLowerCase(), plugin.tags), plugins),
      ),
    );

    const orderedTags = sortBy((t) => t, uniqTags);

    return map((tag) => ({ label: tag, value: tag }), orderedTags);
  }, [plugins]);

  const handleTagChange = useCallback((eventTags: SelectOptionType[]) => {
    setSelectedTags(map((t) => t.value, eventTags));
  }, []);

  // <PluginCard item={filter(p => p.examples.length > 3, plugins)[0]} />
  return (
    <>
      <Header />
      <div className='container mx-auto pt-2'>
        <div className='grid gap-2'>
          <Autocomplete
            placeholder='Filter by tag'
            items={tags}
            onChange={handleTagChange}
          />
          <Plugins plugins={plugins} tags={selectedTags} />
        </div>
      </div>
    </>
  );
};
