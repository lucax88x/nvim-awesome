import { formatNumberAsString } from '@awesome/code/formatters';
import { getRandom } from '@awesome/code/get-random';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import { CSSObject } from '@emotion/react';
import { StarIcon } from '@heroicons/react/outline';
import { ExclamationIcon, XIcon } from '@heroicons/react/solid';
import { join, map, sum } from 'ramda';
import { CSSProperties, useCallback, useState } from 'react';
import { useQuery } from 'react-query';
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
    backgroundColor: theme.palette.primary5,
    color: theme.palette.contrary5,
    textAlign: 'right',
  },
  languages: {
    width: '100%',
    display: 'grid',
    height: theme.spacing(1),
  },
  language: {
    height: '100%',
  },
  languageLegends: {
    width: '100%',
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(1),
    alignItems: 'center',
  },
  languageLegend: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'min-content auto',
    gridGap: theme.spacing(1),
    alignItems: 'center',
  },
  languageLegendDot: {
    width: theme.spacing(1),
    height: theme.spacing(1),
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
      <a
        href={data.owner.link}
        target='_blank'
        css={[styles.owner, styles.link]}
        rel='noreferrer'
      >
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
        <a
          href={`https://github.com/${item.owner}/${item.repository}/issues`}
          target='_blank'
          css={styles.link}
          rel='noreferrer'
        >
          <Tag color='orange'>
            <StarIcon width='16px' /> {data.starCount}
          </Tag>
        </a>
        <a
          href={`https://github.com/${item.owner}/${item.repository}/stargazers`}
          target='_blank'
          css={styles.link}
          rel='noreferrer'
        >
          <Tag color='red'>
            <ExclamationIcon width='16px' /> {data.issuesCount}
          </Tag>
        </a>
      </div>
    );
  }, [isLoading, isError, data, item.owner, item.repository]);

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

    const toRandomizeColors = [
      '#3a3276',
      '#64c1e2',
      '#b60408',
      '#d3256e',
      '#f898c9',
      '#b27a58',
      '#d0f8e4',
      '#cfd53d',
    ];

    const colors = getRandom(
      toRandomizeColors,
      Object.keys(data.languages).length,
    );

    const calculatedLanguages = Object.keys(data.languages).map(
      (language, index) => {
        const languageLinesOfCode = data.languages[language];
        const percentual = (languageLinesOfCode * 100) / sumOfLinesOfCode;
        return { language, percentual, color: colors[index] };
      },
    );

    return (
      <>
        <div
          css={styles.languages}
          style={{
            gridTemplateColumns: join(
              ' ',
              map(c => `${c.percentual}%`, calculatedLanguages),
            ),
          }}
        >
          {map(
            lang => (
              <div
                css={styles.language}
                style={{ backgroundColor: lang.color }}
              />
            ),
            calculatedLanguages,
          )}
        </div>
        <div css={styles.languageLegends}>
          {map(
            ({ language, percentual, color }) => (
              <div css={styles.languageLegend}>
                <div
                  css={styles.languageLegendDot}
                  style={{ backgroundColor: color }}
                />
                <span>
                  {language} {formatNumberAsString(percentual)}%
                </span>
              </div>
            ),
            calculatedLanguages,
          )}
        </div>
      </>
    );
  }, [isLoading, isError, data]);

  const hasExamples = item.examples.length > 0;

  return (
    <a
      href={`https://github.com/${item.owner}/${item.repository}`}
      target='_blank'
      rel='noreferrer'
      css={[styles.root, styles.link, hasExamples && styles.rootWithExamples]}
      {...otherProps}
    >
      <div css={styles.texts}>
        <div css={styles.name}>{item.name}</div>
        {item.description && <p>{item.description}</p>}
      </div>
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
    </a>
  );
};
