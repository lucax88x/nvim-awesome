import { map } from 'ramda';
import { Plugin } from '../models/plugin.model';
import { Header } from './Header';
import { PluginCard } from './PluginCard';

interface HomeProps {
  plugins: Plugin[];
}

export const Home = ({ plugins }: HomeProps) => {
  return (
    <>
      <Header />
      <div className='container mx-auto pt-2'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          {map(
            plugin => (
              <PluginCard key={plugin.name} item={plugin} />
            ),
            plugins,
          )}
        </div>
      </div>
    </>
  );
};
