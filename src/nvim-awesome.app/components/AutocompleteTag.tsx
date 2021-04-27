import { map } from 'ramda';
import { useCallback, useMemo, useState } from 'react';
import ReactTags, { Tag } from 'react-tag-autocomplete';

interface AutocompleteTagProps {
  suggestions: string[];
  onChange: (tags: string[]) => void;
}

export const AutocompleteTag = ({
  suggestions,
  onChange,
}: AutocompleteTagProps) => {
  const [internalTags, setInternalTags] = useState<Tag[]>([]);

  const handleChange = useCallback(
    (tags: Tag[]) => onChange(map(t => t.name, tags)),
    [onChange],
  );

  const handleDelete = useCallback(
    (i: number) => {
      const updatedTags = internalTags.slice(0);
      updatedTags.splice(i, 1);
      setInternalTags(updatedTags);
      handleChange(updatedTags);
    },
    [internalTags, handleChange],
  );

  const handleAdd = useCallback(
    (tag: Tag) => {
      const updatedTags = [...internalTags, tag];
      setInternalTags(updatedTags);
      handleChange(updatedTags);
    },
    [internalTags, handleChange],
  );

  const internalSuggestions: Tag[] = useMemo(
    () =>
      map(suggestion => ({ id: suggestion, name: suggestion }), suggestions),
    [suggestions],
  );

  return (
    <ReactTags
      placeholderText='Filter by tag'
      tags={internalTags}
      suggestions={internalSuggestions}
      onDelete={handleDelete}
      onAddition={handleAdd}
    />
  );
};
