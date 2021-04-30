import Select, { Styles as SelectStyles } from 'react-select';
import { theme, ThemePalette } from '../code/theme';

export interface SelectOptionType {
  value: string;
  label: string;
}

const buildSelectStyles = (
  palette: ThemePalette,
): SelectStyles<SelectOptionType, false> =>
  ({
    control: provided => ({
      ...provided,
      backgroundColor: palette.neutral5,
      borderColor: palette.primary5,
      color: palette.primary5,
      boxShadow: `0 0 0 1px ${palette.primary6}`,
      '&:hover': {
        borderColor: palette.primary6,
      },
    }),
    indicatorSeparator: provided => ({
      ...provided,
      backgroundColor: palette.primary5,
    }),
    indicatorsContainer: provided => ({
      ...provided,
      color: palette.primary5,
    }),
    dropdownIndicator: provided => ({
      ...provided,
      color: palette.primary5,
      '&:hover': {
        color: palette.primary6,
      },
    }),
    singleValue: provided => ({
      ...provided,
      color: palette.primary5,
    }),
    multiValue: provided => ({
      ...provided,
      backgroundColor: theme.palette.primary5,

      'div:nth-child(1)': {
        color: theme.palette.contrary5,
      },
      'div:nth-child(2)': {
        color: theme.palette.neutral5,
        '&:hover': {
          backgroundColor: theme.palette.primary6,
        },
      },
    }),
    input: provided => ({
      ...provided,
      color: palette.contrary5,
    }),
    menu: provided => ({
      ...provided,
      backgroundColor: palette.neutral5,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: palette.neutral5,
      color: !state.isSelected ? palette.contrary5 : palette.primary5,
      '&:hover': {
        backgroundColor: palette.primary5,
        color: palette.neutral5,
      },
      '&:active': {
        backgroundColor: palette.primary5,
        color: palette.neutral5,
      },
    }),
    noOptionsMessage: provided => ({
      ...provided,
      color: palette.contrary5,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    menuPortal: (base: any) => ({ ...base, zIndex: 1500 }),
  } as SelectStyles<SelectOptionType, false>);

const selectStyles = buildSelectStyles(theme.palette);

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
