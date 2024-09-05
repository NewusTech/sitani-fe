"use client";

import React, { useState } from "react";
import InputComp from "@/components/ui/InputComp";
import useSWR, { SWRResponse } from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage';

const ExamplePage = () => {
  interface Kecamatan {
    id: number;
    nama: string;
  }

  interface SelectItem {
    id: string;
    name: string;
  }

  interface Response {
    status: string;
    data: Kecamatan[];
    message: string;
  }

  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();

  // Fetching data with SWR
  const { data: dataKecamatan }: SWRResponse<Response> = useSWR(
    `kecamatan/get`,
    (url) =>
      axiosPrivate
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => res.data)
  );

  const [selectedValue, setSelectedValue] = useState<string | undefined>();
  const [searchInput, setSearchInput] = useState<string>("");

  // Filter the items and map them to the SelectItem format
  const filteredItems: SelectItem[] | undefined = dataKecamatan?.data
    .filter((item) =>
      item.nama.toLowerCase().includes(searchInput.toLowerCase())
    )
    .map((item) => ({ id: String(item.id), name: item.nama })); // Mapping to the SelectItem format

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Example Page</h1>

      {/* Select Search Component */}
      <InputComp
        typeInput="selectSearch"
        placeholder="Kecamatan"
        label="Cari Kecamatan"
        items={filteredItems} // Using mapped items
        value={selectedValue}
        onChange={(value: string) => setSelectedValue(value)}
        valueInput={searchInput}
        onChangeInputSearch={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
      />
    </div>
  );
};

export default ExamplePage;
