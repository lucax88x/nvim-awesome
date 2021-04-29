import { StarIcon } from '@heroicons/react/outline';
import { ExclamationIcon, XIcon } from '@heroicons/react/solid';
import { map, sum, take } from 'ramda';
import { CSSProperties, useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import classnames from 'classnames';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import { formatNumberAsString } from '../code/formatters';
import { GithubRepositoryInformation } from '../models/github.model';
import { Plugin } from '../models/plugin.model';
import { getRepositoryInformations } from '../services/github.api.service';
import { Spinner } from './Spinner';
import { Tag } from './Tag';

import { isServer } from '../code/is';

import styles from './PluginCard.module.css';

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

  const handleExampleChange = useCallback((index) => {
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
        className='grid items-center grid-flow-col gap-2 pointer justify-end'
        href={data.owner.link}
      >
        <img
          className='w-10 h-10 rounded-full mr-4'
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
      <div className='grid gap-2 grid-flow-col justify-start'>
        <Tag color='yellow'>
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
      map((language) => data.languages[language], Object.keys(data.languages)),
    );

    return (
      <div className='grid gap-2 grid-flow-col justify-start'>
        {map((language) => {
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

  return (
    <div
      className={classnames(
        'border border-grey-light lg:border-t lg:border-green-400 bg-green-200 rounded-b lg:rounded-b-none lg:rounded-r p-4',
        styles.root,
      )}
      {...otherProps}
    >
      <div className='grid gap-2'>
        <div className='grid gap-2 grid-flow-col justify-start'>
          {map(
            (tag) => (
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
      <div className='grid gap-2'>
        <div className='text-black font-bold text-xl mb-2'>{item.name}</div>
        {item.description && (
          <p className='text-grey-darker text-base'>{item.description}</p>
        )}
      </div>
      <div
        className={classnames('grid gap-2 overflow-hidden', styles.examples)}
      >
        {!isServer && (
          <Carousel
            height={300}
            plugins={['centered']}
            value={exampleIndex}
            onChange={handleExampleChange}
          >
            {map(
              ({ label, link }) => (
                <div
                  className={classnames(
                    'grid gap-2 overflow-hidden',
                    styles.example,
                  )}
                  key={link}
                >
                  <div
                    style={{ backgroundImage: `url(${link})` }}
                    className={styles.exampleImage}
                  />
                  <span>{label}</span>
                </div>
              ),
              item.examples,
            )}
          </Carousel>
        )}
        {item.examples.length > 1 && (
          <Dots
            value={exampleIndex}
            onChange={handleExampleChange}
            number={item.examples.length}
          />
        )}
      </div>
      <div className='grid gap-2'>{renderOwner()}</div>
    </div>
  );
};
