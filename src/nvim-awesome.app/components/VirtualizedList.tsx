import { AutoSizer, List, ListProps } from 'react-virtualized';

interface VirtualizedListProps {
  containerHeight: string;
}

export const VirtualizedList = (props: VirtualizedListProps & ListProps) => {
  const {
    containerHeight,
    headerHeight = 48,
    rowHeight = 48,
    ...otherProps
  } = props;

  return (
    <div style={{ height: !!containerHeight ? containerHeight : '70vh' }}>
      <AutoSizer>
        {({ height: sizerHeight, width: sizerWidth }) => (
          <List
            rowHeight={!!rowHeight ? rowHeight : 0}
            headerHeight={!!headerHeight ? headerHeight : 0}
            {...otherProps}
            height={sizerHeight}
            width={sizerWidth}
          />
        )}
      </AutoSizer>
    </div>
  );
};
