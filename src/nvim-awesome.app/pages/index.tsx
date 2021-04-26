import { Home } from '../components/Home';
import { Plugin } from '../models/plugin.model';
import { getPlugins } from '../services/plugin.service';

function HomePage({ plugins }: { plugins: Plugin[] }) {
  return <Home plugins={plugins} />;
}

export const getStaticProps = async () => {
  const plugins = await getPlugins();

  if (!plugins && !plugins.length) {
    return {
      notFound: true,
    };
  }

  return {
    props: { plugins },
  };
};

export default HomePage;
