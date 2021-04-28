/* This example requires Tailwind CSS v2.0+ */
import { GithubIcon } from '../icons/GithubIcon';
import { NeovimIcon } from '../icons/NeovimLogo';

export const headerHeight = '56px';
// https://tailwindui.com/components/marketing/elements/headers
// TODO: convert to css grid
export const Header = () => {
  return (
    <div className='bg-green-400 dark:bg-gray-900'>
      <div className='container mx-auto'>
        <div
          className='flex justify-between items-center py-3 md:justify-start md:space-x-10'
          style={{ height: headerHeight }}
        >
          <div className='flex justify-start lg:w-0 lg:flex-1'>
            <a href='#'>
              <span className='sr-only'>nvim-awesome</span>
              <NeovimIcon height='40' />
            </a>
          </div>
          <div className='flex items-center justify-end md:flex-1 lg:w-0'>
            <a
              href='https://github.com/lucax88x/nvim-awesome'
              target='_blank'
              className='whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900'
            >
              <GithubIcon width='24' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
