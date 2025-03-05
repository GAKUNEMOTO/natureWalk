import React from 'react';
import Select from 'react-select';
import { seasonTags } from '@/data/tag';

const SeasonSelecter = ({ onSelect }: { onSelect: (value: string) => void }) => {
  const options = seasonTags.map(tag => ({ value: tag.id, label: tag.label }));

  const handleChange = (selectedOption: any) => {
    onSelect(selectedOption.value);
  };

  return (
    <Select
      options={options}
      onChange={handleChange}
      placeholder="季節タグを選択"
      className="w-[180px]"
    />
  );
};

export default SeasonSelecter;
