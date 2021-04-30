import Carousel, { Dots } from '@brainhubeu/react-carousel';
import { CSSObject } from '@emotion/react';
import { StarIcon } from '@heroicons/react/outline';
import { ExclamationIcon, XIcon } from '@heroicons/react/solid';
import { map, sum } from 'ramda';
import { CSSProperties, useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { formatNumberAsString } from '../code/formatters';
import { isServer } from '../code/is';
import { theme } from '../code/theme';
import { GithubRepositoryInformation } from '../models/github.model';
import { Plugin } from '../models/plugin.model';
import { getRepositoryInformations } from '../services/github.api.service';
import { Spinner } from './Spinner';
import { Tag } from './Tag';

const styles: CSSObject = {
  root: {
    display: 'grid',
    gridTemplateRows: '1fr 1fr 1fr',
    gridGap: theme.spacing(2),
    padding: theme.spacing(1),
    maxHeight: '600px',
    border: `1px solid ${theme.palette.primary5}`,
    borderBottom: 'none',
    '&:last-of-type': {
      borderBottom: `1px solid ${theme.palette.primary5}`,
    },
  },
  rootWithExamples: {
    gridTemplateRows: '1fr 1fr minmax(0, 300px) 1fr',
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
  decorators: {
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  tags: {
    display: 'grid',
    gridGap: theme.spacing(1),
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
  },
  texts: {
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  name: {
    fontWeight: 'bold',
  },
  examples: {
    display: 'grid',
    gridTemplateRows: 'auto min-content',
    height: '100%',
    minWidth: 0,
  },
  example: {
    display: 'grid',
    gridTemplateRows: 'auto min-content',
    width: '100%',
    height: '100%',
  },
  exampleImage: {
    width: 'auto',
    height: '100%',
    backgroundSize: '100%',
    backgroundPosition: 'top',
    backgroundRepeat: 'no-repeat',
  },
  exampleImageLabel: {
    justifySelf: 'center',
  },
  owner: {
    display: 'grid',
    gridGap: theme.spacing(1),
    gridAutoFlow: 'column',
    alignItems: 'center',
    justifyContent: 'end',
  },
  ownerImage: {
    width: '64px',
    height: '64px',
    borderRadius: '100%',
  },
};

interface PluginCardProps {
  item: Plugin;
  style?: CSSProperties;
}

export const PluginCard = (props: PluginCardProps) => {
  const { item, ...otherProps } = props;
  const [exampleIndex, setExampleIndex] = useState(0);

  const { isLoading, isError, data } = useQuery<GithubRepositoryInformation>(
    `github-${item.owner}-${item.repository}`,
    getRepositoryInformations(item.owner, item.repository),
  );

  const handleExampleChange = useCallback(index => {
    setExampleIndex(index);
  }, []);

  const renderOwner = useCallback(() => {
    if (isLoading) {
      return <Spinner />;
    }

    if (isError || !data.owner) {
      return <XIcon width='16px' />;
    }

    return (
      <a href={data.owner.link} css={[styles.owner, styles.link]}>
        <img
          css={styles.ownerImage}
          src={data.owner.avatar}
          alt={data.owner.name}
        />
        <div>{data.owner.name}</div>
      </a>
    );
  }, [isLoading, isError, data]);

  const renderStats = useCallback(() => {
    if (isLoading) {
      return <Spinner />;
    }

    if (isError) {
      return <XIcon width='16px' />;
    }
    return (
      <div css={styles.tags}>
        <Tag color='orange'>
          <StarIcon width='16px' /> {data.starCount}
        </Tag>
        <Tag color='red'>
          <ExclamationIcon width='16px' /> {data.issuesCount}
        </Tag>
      </div>
    );
  }, [isLoading, isError, data]);

  const renderLanguages = useCallback(() => {
    if (isLoading) {
      return <Spinner />;
    }

    if (isError || !data.languages) {
      return <XIcon width='16px' />;
    }

    const sumOfLinesOfCode = sum(
      map(language => data.languages[language], Object.keys(data.languages)),
    );

    return (
      <div css={styles.tags}>
        {map(language => {
          const languageLinesOfCode = data.languages[language];
          const percentual = (languageLinesOfCode * 100) / sumOfLinesOfCode;
          return (
            <Tag key={language} color='yellow'>
              {language} {formatNumberAsString(percentual)}%
            </Tag>
          );
        }, Object.keys(data.languages))}
      </div>
    );
  }, [isLoading, isError, data]);

  const hasExamples = item.examples.length > 0;

  return (
    <div
      css={[styles.root, hasExamples && styles.rootWithExamples]}
      {...otherProps}
    >
      <div css={styles.decorators}>
        <div css={styles.tags}>
          {map(
            tag => (
              <Tag key={tag} color='green' isUppercase={false}>
                {tag}
              </Tag>
            ),
            item.tags,
          )}
        </div>
        {renderLanguages()}
        {renderStats()}
      </div>
      <div css={styles.texts}>
        <div css={styles.name}>{item.name}</div>
        {item.description && <p>{item.description}</p>}
      </div>
      {hasExamples && (
        <div css={styles.examples}>
          {item.examples.length > 1 ? (
            <>
              {!isServer && (
                <Carousel
                  height={300}
                  plugins={['centered']}
                  value={exampleIndex}
                  onChange={handleExampleChange}
                >
                  {map(
                    ({ label, link }) => (
                      <div css={styles.example} key={link}>
                        <div
                          style={{ backgroundImage: `url(${link})` }}
                          css={styles.exampleImage}
                        />
                        <span css={styles.exampleImageLabel}>{label}</span>
                      </div>
                    ),
                    item.examples,
                  )}
                </Carousel>
              )}
              <Dots
                value={exampleIndex}
                onChange={handleExampleChange}
                number={item.examples.length}
              />
            </>
          ) : (
            <div css={styles.example} key={item.examples[0].link}>
              <div
                style={{ backgroundImage: `url(${item.examples[0].link})` }}
                css={styles.exampleImage}
              />
              <span css={styles.exampleImageLabel}>
                {item.examples[0].label}
              </span>
            </div>
          )}
        </div>
      )}
      {renderOwner()}
    </div>
  );
};
