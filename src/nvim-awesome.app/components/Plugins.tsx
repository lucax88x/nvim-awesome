import { theme } from '@awesome/code/theme';
import { CSSObject } from '@emotion/react';
import { filter, sortBy } from 'ramda';
import { useCallback, useEffect, useState } from 'react';
import { ListRowProps } from 'react-virtualized';
import { Plugin } from '../models/plugin.model';
import { headerHeight } from './Header';
import { PluginCard } from './PluginCard';
import { VirtualizedList } from './VirtualizedList';

const autocompleteHeight = '80px';
const pluginCountHeight = '20px';

interface PluginsProps {
  plugins: Plugin[];
  tags: string[];
}

const styles: CSSObject = {
  root: {
    display: 'grid',
    gridAutoFlow: 'row',
    gridGap: theme.spacing(1),
  },
  toRight: {
    justifySelf: 'end',
  },
};

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
    ({ index, key, style }: ListRowProps) => (
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
    <div css={styles.root}>
      <div css={styles.toRight}>
        {internalPlugins.length}/{plugins.length} plugins
      </div>
      <VirtualizedList
        height={0}
        width={0}
        containerHeight={` calc(100vh - ${headerHeight} - ${autocompleteHeight} - ${pluginCountHeight})`}
        rowHeight={getRowHeight}
        rowCount={internalPlugins.length}
        noRowsRenderer={noRowsRenderer}
        rowRenderer={rowRenderer}
      />
    </div>
  );
};
