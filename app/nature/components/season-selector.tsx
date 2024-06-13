// import React from 'react';
// import { seasonTags } from "@/data/tag";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

// const SeasonSelecter = ({ onSelect }: { onSelect: (value: string) => void }) => {
//   return (
//     <Select onValueChange={onSelect}>
//       <SelectTrigger className="w-[180px]">
//         <SelectValue placeholder="シーズンタグを選択" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           <SelectLabel>シーズンタグ</SelectLabel>
//           {seasonTags.map((tag) => (
//             <SelectItem key={tag.id} value={tag.id}>
//               {tag.label}
//             </SelectItem>
//           ))}
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   );
// };

// export default SeasonSelecter;

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
