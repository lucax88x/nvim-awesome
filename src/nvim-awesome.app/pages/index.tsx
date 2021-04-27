import { Home } from '../components/Home';
import { Plugin } from '../models/plugin.model';
import { pluginService } from '../server/plugin.service';

function HomePage({ plugins }: { plugins: Plugin[] }) {
  return <Home plugins={plugins} />;
}

export const getStaticProps = async () => {
  const plugins = await pluginService.get();

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
