import { PropsWithChildren } from 'react';

interface TagProps {
  color: 'blue' | 'red' | 'purple' | 'green' | 'yellow';
}

export const Tag = ({ color, children }: PropsWithChildren<TagProps>) => {
  return (
    <div
      className={`text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-${color}-200 text-{color}-700 rounded-full`}
    >
      {children}
    </div>
  );
};
