import { filter, sortBy } from 'ramda';
import { useCallback, useEffect, useState } from 'react';
import { Plugin } from '../models/plugin.model';
import { headerHeight } from './Header';
import { PluginCard } from './PluginCard';
import { VirtualizedList } from './VirtualizedList';

const autocompleteHeight = '80px';

interface PluginsProps {
  plugins: Plugin[];
  tags: string[];
}

export const Plugins = ({ plugins, tags }: PluginsProps) => {
  const [internalPlugins, setInternalPlugins] = useState<Plugin[]>(plugins);

  const getRowHeight = useCallback(
    ({ index }) => {
      const item = internalPlugins[index];
      if (item.examples.length === 0) {
        return 300;
      }
      return 600;
    },
    [internalPlugins],
  );

  const noRowsRenderer = useCallback(() => <p>No items</p>, []);

  const rowRenderer = useCallback(
    ({ index, key, style }) => (
      <PluginCard
        key={key}
        item={internalPlugins[index]}
        style={{ ...style, overflow: 'hidden' }}
      />
    ),
    [internalPlugins],
  );

  useEffect(() => {
    if (!!tags.length) {
      let result = filter(
        plugin => tags.every(tag => plugin.tags.includes(tag)),
        plugins,
      );

      result = sortBy(p => p.name, result);

      setInternalPlugins(result);
    } else {
      setInternalPlugins(plugins);
    }
  }, [plugins, tags]);

  return (
    <VirtualizedList
      height={0}
      width={0}
      containerHeight={` calc(100vh - ${headerHeight} - ${autocompleteHeight})`}
      rowHeight={getRowHeight}
      rowCount={internalPlugins.length}
      noRowsRenderer={noRowsRenderer}
      rowRenderer={rowRenderer}
    />
  );
};
