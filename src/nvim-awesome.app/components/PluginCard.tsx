import { StarIcon } from '@heroicons/react/outline';
import { ExclamationIcon, XIcon } from '@heroicons/react/solid';
import { map, sum } from 'ramda';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { formatNumberAsString } from '../code/formatters';
import { GithubRepositoryInformation } from '../models/github.model';
import { Plugin } from '../models/plugin.model';
import { getRepositoryInformations } from '../services/github.api.service';
import { Spinner } from './Spinner';
import { Tag } from './Tag';

interface PluginCardProps {
  item: Plugin;
}

export const PluginCard = ({ item }: PluginCardProps) => {
  const { isLoading, isError, data } = useQuery<GithubRepositoryInformation>(
    `github-${item.owner}-${item.repository}`,
    getRepositoryInformations(item.owner, item.repository),
  );

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
        <Tag color='green'>
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
      <div className='grid gap-2 grid-flow-col justify-start'>
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

  return (
    <div className='w-full lg:grid'>
      <div className='border border-grey-light lg:border-t lg:border-grey-light bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 grid grid-col gap-2'>
        <div className='mb-8'>
          <div className='grid gap-2'>
            <div className='grid gap-2 grid-flow-col justify-start'>
              {map(
                tag => (
                  <Tag key={tag} color='blue'>
                    {tag}
                  </Tag>
                ),
                item.tags,
              )}
            </div>
            {renderLanguages()}
            {renderStats()}
          </div>
          <div className='text-black font-bold text-xl mb-2'>{item.name}</div>
          {item.description && (
            <p className='text-grey-darker text-base'>{item.description}</p>
          )}
        </div>
        <div className='grid items-center'>
          {map(
            example => (
              <img key={example} src={example} alt='example' />
            ),
            item.examples,
          )}
        </div>
        {renderOwner()}
      </div>
    </div>
  );
};
