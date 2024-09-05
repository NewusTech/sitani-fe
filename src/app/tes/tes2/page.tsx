"use client";

import React, { useState } from "react";
import InputComp from "@/components/ui/InputComp";

const ExamplePage = () => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>();
  const [searchInput, setSearchInput] = useState<string>("");

  const dummyItems: { id: string; name: string }[] = [
    { id: "1", name: "Option 1" },
    { id: "2", name: "Option 2" },
    { id: "3", name: "Option 3" },
  ];

  const filteredItems = dummyItems.filter((item) =>
    item.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Example Page</h1>

      {/* Select Search Component */}
      <InputComp
        typeInput="selectSearch"
        placeholder="Select an option"
        label="Searchable Select"
        items={filteredItems} // Menggunakan hasil filter
        value={selectedValue}
        onChange={(value: string) => setSelectedValue(value)}
        valueInput={searchInput}
        onChangeInputSearch={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
      />

      {/* Select Component */}
      <InputComp
        typeInput="select"
        placeholder="Select an option"
        label="Simple Select"
        items={dummyItems}
        value={selectedValue}
        onChange={(value: string) => setSelectedValue(value)}
      />
    </div>
  );
};

export default ExamplePage;
