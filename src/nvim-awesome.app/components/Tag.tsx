import { PropsWithChildren, useMemo } from 'react';

interface TagProps {
  color: 'blue' | 'red' | 'green' | 'yellow';
}

export const Tag = ({ color, children }: PropsWithChildren<TagProps>) => {
  const classColors = useMemo(() => {
    switch (color) {
      default:
      case 'blue':
        return 'bg-blue-200 text-blue-700';
      case 'red':
        return 'bg-red-200 text-red-700';
      case 'green':
        return 'bg-green-200 text-green-700';
      case 'yellow':
        return 'bg-yellow-200 text-yellow-700';
    }
  }, [color]);

  return (
    <div
      className={`text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full ${classColors}`}
    >
      {children}
    </div>
  );
};
