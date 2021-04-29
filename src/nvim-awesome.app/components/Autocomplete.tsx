import Select, { Styles as SelectStyles } from 'react-select';
import colors from 'tailwindcss/colors';

export interface SelectOptionType {
  value: string;
  label: string;
}

const buildSelectStyles = (): SelectStyles<SelectOptionType, false> =>
  ({
    control: provided => ({
      ...provided,
      backgroundColor: colors.green[200],
      borderColor: colors.green[300],
      color: colors.green[500],
      boxShadow: 'none',
      '&:hover': {
        borderColor: colors.green[700],
      },
    }),
    indicatorSeparator: provided => ({
      ...provided,
      backgroundColor: colors.green[500],
    }),
    indicatorsContainer: provided => ({
      ...provided,
      color: colors.green[500],
    }),
    dropdownIndicator: provided => ({
      ...provided,
      color: colors.green[500],
      '&:hover': {
        color: colors.green[700],
      },
    }),
    multiValue: provided => ({
      ...provided,
      backgroundColor: colors.green[500],
      color: colors.gray[700],

      'div:nth-child(1)': {
        backgroundColor: colors.green[500],
        color: colors.gray[700],
      },
      'div:nth-child(2)': {
        backgroundColor: colors.green[500],
        color: colors.gray[700],
        '&:hover': {
          backgroundColor: colors.green[700],
        },
      },
    }),
    input: provided => ({
      ...provided,
      color: colors.gray,
    }),
    menu: provided => ({
      ...provided,
      backgroundColor: colors.green[300],
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: colors.green[200],
      color: !state.isSelected ? colors.gray : colors.green[500],
      '&:hover': {
        backgroundColor: colors.green[300],
      },
      '&:active': {
        backgroundColor: colors.green[400],
      },
    }),
    noOptionsMessage: provided => ({
      ...provided,
      color: colors.gray,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    menuPortal: (base: any) => ({ ...base, zIndex: 1500 }),
  } as SelectStyles<SelectOptionType, false>);

const selectStyles = buildSelectStyles();

interface AutocompleteProps {
  items: SelectOptionType[];
  placeholder: string;
  onChange: (items: SelectOptionType[]) => void;
}

export const Autocomplete = (props: AutocompleteProps) => {
  const { items, onChange, ...otherProps } = props;
  return (
    <Select
      isMulti
      options={items}
      styles={selectStyles}
      onChange={onChange}
      {...otherProps}
    />
  );
};
