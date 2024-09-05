// components/ui/SelectKecamatan.tsx
"use client";

import React, { useState } from "react";
import InputComp from "@/components/ui/InputComp";

interface SelectKecamatanProps {
  onSelect: (value: string) => void;
}

const SelectKecamatan: React.FC<SelectKecamatanProps> = ({ onSelect }) => {
  const [searchInput, setSearchInput] = useState<string>("");

  const dummyItems: { id: string; name: string }[] = [
    { id: "1", name: "Kecamatan 1" },
    { id: "2", name: "Kecamatan 2" },
    { id: "3", name: "Kecamatan 3" },
  ];

  const filteredItems = dummyItems.filter((item) =>
    item.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleSelectChange = (value: string) => {
    onSelect(value); // Kirim nilai kecamatan ke komponen induk
  };

  return (
    <div>
      {/* Select Search Component */}
      <InputComp
        typeInput="selectSearch"
        placeholder="Select an option"
        label="Searchable Select"
        items={filteredItems}
        value={""}
        onChange={handleSelectChange}
        valueInput={searchInput}
        onChangeInputSearch={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchInput(e.target.value)
        }
      />
    </div>
  );
};

export default SelectKecamatan;
