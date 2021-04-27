import { map, sum } from 'ramda';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { GithubRepositoryInformation } from '../models/github.model';
import { Plugin } from '../models/plugin.model';
import { getRepositoryInformations } from '../services/github.api.service';
import { ExclamationIcon, XIcon } from '@heroicons/react/solid';
import { Spinner } from './Spinner';
import { Tag } from './Tag';
import { formatNumberAsString } from '../code/formatters';
import { StarIcon } from '@heroicons/react/outline';

interface PluginCardProps {
  item: Plugin;
}

export const PluginCard = ({ item }: PluginCardProps) => {
  const { isLoading, isError, data } = useQuery<GithubRepositoryInformation>(
    'github',
    getRepositoryInformations(item.owner, item.repository),
  );

  const renderOwner = useCallback(() => {
    if (item.name !== 'nvim-compe') {
      return 'skip';
    }

    if (isLoading) {
      return <Spinner />;
    }

    if (isError || !data.owner) {
      return <XIcon />;
    }

    return (
      <>
        <img
          className='w-10 h-10 rounded-full mr-4'
          src={data.owner.avatar}
          alt={data.owner.name}
        />
        <div className='text-sm'>
          <p className='text-black leading-none'>{data.owner.name}</p>
          <a className='text-grey-dark' href={data.owner.link}>
            github icon
          </a>
        </div>
      </>
    );
  }, [isLoading, isError, data]);

  const renderStats = useCallback(() => {
    if (item.name !== 'nvim-compe') {
      return 'skip';
    }

    if (isLoading) {
      return <Spinner />;
    }

    if (isError) {
      return <XIcon />;
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
    if (item.name !== 'nvim-compe') {
      return 'skip';
    }

    if (isLoading) {
      return <Spinner />;
    }

    if (isError || !data.languages) {
      return <XIcon />;
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
      <div className='border border-grey-light lg:border-t lg:border-grey-light bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 grid grid-col justify-between leading-normal'>
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
              <img src={example} alt='example' />
            ),
            item.examples,
          )}
        </div>
        <div className='grid items-center'>{renderOwner()}</div>
      </div>
    </div>
  );
};
