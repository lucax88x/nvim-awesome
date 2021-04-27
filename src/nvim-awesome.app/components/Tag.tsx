import { PropsWithChildren } from 'react';

interface TagProps {
  color: 'blue' | 'red' | 'purple' | 'green' | 'yellow';
}

export const Tag = ({ color, children }: PropsWithChildren<TagProps>) => {
  const bgColor = `bg-${color}-200`;
  const textColor = `text-${color}-700`;
  return (
    <div
      className={`text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 ${bgColor} ${textColor} rounded-full`}
    >
      {children}
    </div>
  );
};
