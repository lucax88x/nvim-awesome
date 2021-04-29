import { AutoSizer, List, ListProps } from 'react-virtualized';

interface Row {
  index: number;
}

interface VirtualizedListProps<T> extends ListProps {
  rowGetter: (row: Row) => T;
}

export const VirtualizedList = <T extends unknown>(
  props: VirtualizedListProps<T>,
) => {
  const { height, headerHeight = 48, rowHeight = 48, ...otherProps } = props;

  return (
    <div style={{ height: !!height ? height : '70vh' }}>
      <AutoSizer>
        {({ height: sizerHeight, width: sizerWidth }) => (
          <List
            height={sizerHeight}
            width={sizerWidth}
            rowHeight={!!rowHeight ? rowHeight : 0}
            headerHeight={!!headerHeight ? headerHeight : 0}
            {...otherProps}
          />
        )}
      </AutoSizer>
    </div>
  );
};
