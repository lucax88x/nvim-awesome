import { PropsWithChildren, useMemo } from 'react';
import classNames from 'classnames';

interface TagProps {
  color: 'blue' | 'red' | 'green' | 'yellow';
  isUppercase?: boolean;
}

export const Tag = ({
  color,
  isUppercase = true,
  children,
}: PropsWithChildren<TagProps>) => {
  const classColors = useMemo(() => {
    switch (color) {
      default:
      case 'blue':
        return 'bg-blue-200 text-blue-700';
      case 'red':
        return 'bg-red-200 text-red-700';
      case 'green':
        return 'bg-green-400 text-gray';
      case 'yellow':
        return 'bg-yellow-200 text-yellow-700';
    }
  }, [color]);

  return (
    <div
      className={classNames(
        'text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1',
        classColors,
        isUppercase && 'uppercase',
      )}
    >
      {children}
    </div>
  );
};
