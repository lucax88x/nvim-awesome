import { CSSObject } from '@emotion/react';
import { flatten, map, sortBy, uniq } from 'ramda';
import { useCallback, useMemo, useState } from 'react';
import { theme } from '../code/theme';
import { Plugin } from '../models/plugin.model';
import { Autocomplete, SelectOptionType } from './Autocomplete';
import { Container } from './Container';
import { Header, headerHeight } from './Header';
import { Plugins } from './Plugins';

const styles: CSSObject = {
  root: {
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    display: 'grid',
    gridTemplateRows: `${headerHeight} auto`,
  },

  main: {
    height: '100%',
    display: 'grid',
    gridGap: theme.spacing(2),
    gridTemplateRows: 'min-content auto',
    alignContent: 'start',

    maxHeight: `calc(100vh - ${headerHeight})`,
    maxWidth: '100vw',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflow: 'auto',
  },
};

interface HomeProps {
  plugins: Plugin[];
}

export const Home = ({ plugins }: HomeProps) => {
  const [selectedTags, setSelectedTags] = useState<SelectOptionType[]>([]);

  const tags: SelectOptionType[] = useMemo(() => {
    const uniqTags = uniq(
      flatten(
        map(plugin => map(tag => tag.toLowerCase(), plugin.tags), plugins),
      ),
    );

    const orderedTags = sortBy(t => t, uniqTags);

    return map(tag => ({ label: tag, value: tag }), orderedTags);
  }, [plugins]);

  const handleTagChange = useCallback((eventTags: SelectOptionType[]) => {
    setSelectedTags(eventTags);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTags([{ value: tag, label: tag }]);
  }, []);

  return (
    <div css={styles.root}>
      <Header />
      <Container>
        <div css={styles.main}>
          <Autocomplete
            placeholder='Filter by tag'
            items={tags}
            selectedItems={selectedTags}
            onChange={handleTagChange}
          />
          <Plugins
            plugins={plugins}
            tags={map(t => t.value, selectedTags)}
            onTagClick={handleTagClick}
          />
        </div>
      </Container>
    </div>
  );
};
