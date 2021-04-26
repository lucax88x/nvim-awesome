import { InferGetStaticPropsType } from 'next';
import { Home } from '../components/Home';
import { buildApiUrl } from '../services/env.service';

function HomePage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(props);
  return <Home />;
}

export const getStaticProps = async () => {
  const res = await fetch(buildApiUrl(`plugins`));
  const data = await res.json();
  console.log(data);

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data },
  };
};

export default HomePage;
