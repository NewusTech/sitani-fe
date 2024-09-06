import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSWR, { SWRResponse } from "swr";

interface SelectItem {
    id: number;
    nama: string;
}

interface SelectKecamatanProps {
    value: number | undefined;
    onChange: (value: number) => void;
}

const kecamatanItems: SelectItem[] = [
    { id: 1, nama: "Metro Kibang" },
    { id: 2, nama: "Batanghari" },
    { id: 3, nama: "Sekampung" },
];

const KecValue: React.FC<SelectKecamatanProps> = ({ value, onChange }) => {

    // GET ALL KECAMATAN
    interface Kecamatan {
        id: number;
        nama: string;
    }

    interface Response {
        status: string;
        data: Kecamatan[];
        message: string;
    }

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataKecamatan }: SWRResponse<Response> = useSWR(
        `kecamatan/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    const [searchKecamatan, setSearchKecamatan] = useState("");

    const filteredKecamatanItems = dataKecamatan?.data.filter((kecamatan) =>
        kecamatan.nama.toLowerCase().includes(searchKecamatan.toLowerCase())
    );

    return (
        <Select value={value?.toString()} onValueChange={(val) => onChange(Number(val))}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kecamatan" />
            </SelectTrigger>
            <SelectContent className="pt-10 bg-white">
                <div className="px-2 fixed border-b w-full top-0 flex items-center justify-between z-10 bg-white">
                    <Search className="text-slate-400" />
                    <Input
                        placeholder="Search Kecamatan..."
                        className="w-full border-0"
                        value={searchKecamatan}
                        onChange={(e) => setSearchKecamatan(e.target.value)}
                    />
                </div>
                <SelectGroup>
                    <SelectLabel>Kecamatan</SelectLabel>
                    {filteredKecamatanItems?.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                            {item.nama}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default KecValue;
