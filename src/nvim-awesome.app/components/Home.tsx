import { map } from 'ramda';
import { Plugin } from '../models/plugin.model';
import { PluginCard } from './PluginCard';

interface HomeProps {
  plugins: Plugin[];
}

export const Home = ({ plugins }: HomeProps) => {
  console.log(plugins);
  return (
    <div className='container mx-auto'>
      <h1 className='text-lg'>Nvim Awesome</h1>

      {map(
        plugin => (
          <PluginCard item={plugin} />
        ),
        plugins,
      )}
    </div>
  );
};
