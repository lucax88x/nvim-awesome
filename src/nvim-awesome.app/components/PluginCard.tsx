import { humanDifferenceFromDates } from '@awesome/code/date.formatters';
import { formatNumberAsString } from '@awesome/code/formatters';
import { getRandom } from '@awesome/code/get-random';
import { isServer } from '@awesome/code/is';
import { theme } from '@awesome/code/theme';
import { Plugin, PluginExampleLink } from '@awesome/models/plugin.model';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import { CSSObject } from '@emotion/react';
import { StarIcon } from '@heroicons/react/outline';
import { ExclamationIcon } from '@heroicons/react/solid';
import { filter, indexOf, join, map, reject, sum } from 'ramda';
import { CSSProperties, memo, useCallback, useMemo, useState } from 'react';
import { Tag } from './Tag';

const pluginHeaderHeight = theme.spacing(5);

const styles: CSSObject = {
  root: {
    display: 'grid',
    gridAutoFlow: 'row',

    borderLeft: `1px solid ${theme.palette.primary5}`,
    borderRight: `1px solid ${theme.palette.primary5}`,
  },
  container: {
    display: 'grid',
    gridGap: theme.spacing(2),
    minWidth: 0,
    minHeight: 0,
    padding: theme.spacing(1),
    gridTemplateRows: 'minmax(0, 1fr) 1fr 1fr',
    maxHeight: `calc(300px - ${pluginHeaderHeight})`,
  },
  containerWithExamples: {
    gridTemplateRows: 'min-content 1fr minmax(0, 300px) 1fr',
    maxHeight: `calc(600px - ${pluginHeaderHeight})`,
  },
  description: {
    overflow: 'auto',
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
    height: '100%',

    display: 'grid',
    gridGap: theme.spacing(1),
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
  },
  header: {
    backgroundColor: theme.palette.primary5,
    color: theme.palette.contrary5,
    textAlign: 'center',

    display: 'grid',
    gridGap: theme.spacing(1),
    alignItems: 'center',
    gridTemplateColumns: 'auto min-content',

    height: pluginHeaderHeight,
  },
  name: {
    fontWeight: 'bold',
  },
  headerLink: {
    padding: `0 ${theme.spacing(1)}`,
    height: '100%',

    display: 'grid',
    gridGap: theme.spacing(1),
    gridAutoFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeft: `2px solid ${theme.palette.contrary5}`,
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
    minHeight: 0,
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
  footer: {
    display: 'grid',
    gridGap: theme.spacing(1),
    alignItems: 'center',
    gridAutoFlow: 'column',
    borderTop: `1px solid ${theme.palette.primary5}`,
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
  onTagClick: (tag: string) => void;
}

const ExampleLink = ({
  example: { link, label },
}: {
  example: PluginExampleLink;
}) => (
  <div css={styles.example} key={link}>
    {!link.endsWith('mp4') ? (
      <div
        style={{ backgroundImage: `url(${link})` }}
        css={styles.exampleImage}
      />
    ) : (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video width='100%' height='300px' controls>
        <source src={link} type='video/mp4' />
      </video>
    )}
    <span css={styles.exampleImageLabel}>{label}</span>
  </div>
);

const PluginCard = (props: PluginCardProps) => {
  const {
    item: { name, github, owner, repository, description, examples, tags },
    onTagClick,
    ...otherProps
  } = props;
  const [exampleIndex, setExampleIndex] = useState(0);

  const handleExampleChange = useCallback(index => {
    setExampleIndex(index);
  }, []);

  const renderedLanguages = useMemo(() => {
    const sumOfLinesOfCode = sum(
      map(
        language => github.languages[language],
        Object.keys(github.languages),
      ),
    );

    const toRandomizeColors = [
      '#3a3276',
      '#64c1e2',
      '#b60408',
      '#d3256e',
      '#f898c9',
      '#b27a58',
      '#d0f8e4',
      '#3a4d50',
      '#cfd53d',
      '#1fdc98',
      '#258fe0',
      '#280821',
      '#8f6732',
    ];

    const mappedLanguages = Object.keys(github.languages).map(language => {
      const languageLinesOfCode = github.languages[language];
      const percentual = (languageLinesOfCode * 100) / sumOfLinesOfCode;
      return { language, percentual };
    });

    const toShowLanguages = filter(l => l.percentual > 5, mappedLanguages);
    const otherLanguages = reject(
      l => indexOf(l, toShowLanguages) > -1,
      mappedLanguages,
    );

    const otherLanguage = {
      language: 'Other',
      percentual: sum(map(l => l.percentual, otherLanguages)),
    };

    const toRenderLanguages =
      otherLanguage.percentual > 0
        ? [...toShowLanguages, otherLanguage]
        : toShowLanguages;

    const colors = getRandom(toRandomizeColors, toRenderLanguages.length);

    const toRenderLanguagesWithColor = toRenderLanguages.map(
      ({ language, percentual }, index) => ({
        language,
        percentual,
        color: colors[index],
      }),
    );

    // todo: exclude lanugages with less than 5%

    return (
      <>
        <div
          css={styles.languages}
          style={{
            gridTemplateColumns: join(
              ' ',
              map(c => `${c.percentual}%`, toRenderLanguagesWithColor),
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
            toRenderLanguagesWithColor,
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
            toRenderLanguagesWithColor,
          )}
        </div>
      </>
    );
  }, [github]);

  const hasExamples = examples.length > 0;

  return (
    <div css={styles.root} {...otherProps}>
      <div css={styles.header}>
        <a
          href={`https://github.com/${owner}/${repository}`}
          target='_blank'
          rel='noreferrer'
          css={[styles.name, styles.link]}
        >
          {name}
        </a>
        <div css={styles.tags}>
          <a
            href={`https://github.com/${owner}/${repository}/stargazers`}
            target='_blank'
            css={[styles.headerLink, styles.link]}
            rel='noreferrer'
          >
            <StarIcon width='16px' /> {github.starCount}
          </a>
          <a
            href={`https://github.com/${owner}/${repository}/issues`}
            target='_blank'
            css={[styles.headerLink, styles.link]}
            rel='noreferrer'
          >
            <ExclamationIcon width='16px' /> {github.issuesCount}
          </a>
        </div>
      </div>
      <div
        css={[styles.container, hasExamples && styles.containerWithExamples]}
      >
        {description && <p css={styles.description}>{description}</p>}
        <div css={styles.decorators}>
          <div css={styles.tags}>
            {map(
              tag => (
                <Tag
                  key={tag}
                  name={tag}
                  color='green'
                  isUppercase={false}
                  onClick={onTagClick}
                >
                  {tag}
                </Tag>
              ),
              tags,
            )}
          </div>
          {renderedLanguages}
        </div>
        {hasExamples && (
          <div css={styles.examples}>
            {examples.length > 1 ? (
              <>
                {!isServer && (
                  <Carousel
                    height={300}
                    plugins={['centered']}
                    value={exampleIndex}
                    onChange={handleExampleChange}
                  >
                    {map(
                      example => (
                        <ExampleLink example={example} />
                      ),
                      examples,
                    )}
                  </Carousel>
                )}
                <Dots
                  value={exampleIndex}
                  onChange={handleExampleChange}
                  number={examples.length}
                />
              </>
            ) : (
              <ExampleLink example={examples[0]} />
            )}
          </div>
        )}
        <div css={styles.footer}>
          {!!github.lastCommit && (
            <a
              href={github.lastCommit.link}
              target='_blank'
              css={styles.link}
              rel='noreferrer'
            >
              last commit:&nbsp;
              {humanDifferenceFromDates(
                new Date(github.lastCommit.date),
                new Date(),
              )}
            </a>
          )}
          <a
            href={github.owner.link}
            target='_blank'
            css={[styles.owner, styles.link]}
            rel='noreferrer'
          >
            {!!github.owner.avatar && (
              <img
                css={styles.ownerImage}
                src={github.owner.avatar}
                alt={github.owner.name}
              />
            )}
            <div>{github.owner.name}</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export const MemoizedPluginCard = memo(PluginCard);
