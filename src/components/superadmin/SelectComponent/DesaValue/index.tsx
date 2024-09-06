import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSWR, { SWRResponse } from "swr";

interface DesaItem {
  id: number;
  nama: string;
  kecamatanId: number;
}

interface SelectDesaProps {
  value: number | undefined;
  onChange: (value: number) => void;
  kecamatanValue: number | undefined;
  disabled?: boolean;
}

const desaItems: DesaItem[] = [
  { id: 1, nama: "Sumber Agung", kecamatanId: 1 },
  { id: 2, nama: "Purbo Sembodo", kecamatanId: 1 },
  { id: 3, nama: "Desa C", kecamatanId: 2 },
];

const DesaValue: React.FC<SelectDesaProps> = ({ value, onChange, kecamatanValue, disabled=false }) => {
  // GET ALL DESA
  interface Desa {
    id: number;
    nama: string;
    kecamatanId: number;
  }

  interface ResponseDesa {
    status: string;
    data: Desa[];
    message: string;
  }

  const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

  const { data: dataDesa }: SWRResponse<ResponseDesa> = useSWR(
    `desa/get`,
    (url: string) =>
      axiosPrivate
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => res.data)
  );

  // GET ALL DESA

  const [searchDesa, setSearchDesa] = useState("");

  const filteredDesaItems = dataDesa?.data.filter(
    (desa) =>
      desa.kecamatanId === kecamatanValue && desa.nama.toLowerCase().includes(searchDesa.toLowerCase())
  );

  return (
    <Select disabled={disabled} value={value?.toString()} onValueChange={(val) => onChange(Number(val))}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pilih Desa" />
      </SelectTrigger>
      <SelectContent className="pt-10 bg-white">
        <div className="px-2 fixed border-b w-full top-0 flex items-center justify-between z-10 bg-white">
          <Search className="text-slate-400" />
          <Input
            placeholder="Search Desa..."
            className="w-full border-0"
            value={searchDesa}
            onChange={(e) => setSearchDesa(e.target.value)}
          />
        </div>
        <SelectGroup>
          <SelectLabel>Desa</SelectLabel>
          {filteredDesaItems?.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {item.nama}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DesaValue;
