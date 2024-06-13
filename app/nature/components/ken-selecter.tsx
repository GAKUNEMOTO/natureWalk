// import React from 'react';
// import { kenTags } from "@/data/tag";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

// const KenSelecter = ({ onSelect }: { onSelect: (value: string) => void }) => {
//   return (
//     <Select onValueChange={onSelect}>
//       <SelectTrigger className="w-[180px]">
//         <SelectValue placeholder="県タグを選択" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           <SelectLabel>県タグ</SelectLabel>
//           {kenTags.map((tag) => (
//             <SelectItem key={tag.id} value={tag.id}>
//               {tag.label}
//             </SelectItem>
//           ))}
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   );
// };

// export default KenSelecter;

import React from 'react';
import Select from 'react-select';
import { kenTags } from '@/data/tag';

const KenSelecter = ({ onSelect }: { onSelect: (value: string) => void }) => {
  const options = kenTags.map(tag => ({ value: tag.id, label: tag.label }));

  const handleChange = (selectedOption: any) => {
    onSelect(selectedOption.value);
  };

  return (
    <Select
      options={options}
      onChange={handleChange}
      placeholder="県タグを選択"
      className="w-[180px]"
    />
  );
};

export default KenSelecter;
