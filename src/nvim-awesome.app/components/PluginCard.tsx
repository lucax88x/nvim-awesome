import { map } from 'ramda';
import { Plugin } from '../models/plugin.model';
import { Tag } from './Tag';

interface PluginCardProps {
  item: Plugin;
}

export const PluginCard = ({ item }: PluginCardProps) => {
  return (
    <div className='max-w-md w-full lg:flex'>
      <div className='border-r border-b border-l border-grey-light lg:border-t lg:border-grey-light bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal'>
        <div className='mb-8'>
          {map(
            tag => (
              <Tag text={tag} />
            ),
            item.tags,
          )}
          <div className='text-black font-bold text-xl mb-2'>{item.name}</div>
          <p className='text-grey-darker text-base'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Voluptatibus quia, nulla! Maiores et perferendis eaque,
            exercitationem praesentium nihil.
          </p>
        </div>
        <div className='flex items-center'>
          {map(
            example => (
              <img src={example} alt='Avatar of Jonathan Reinink' />
            ),
            item.examples,
          )}
        </div>
        <div className='flex items-center'>
          <img
            className='w-10 h-10 rounded-full mr-4'
            src='https://pbs.twimg.com/profile_images/885868801232961537/b1F6H4KC_400x400.jpg'
            alt='Avatar of Jonathan Reinink'
          />
          <div className='text-sm'>
            <p className='text-black leading-none'>Jonathan Reinink</p>
            <p className='text-grey-dark'>Aug 18</p>
          </div>
        </div>
      </div>
    </div>
  );
};
