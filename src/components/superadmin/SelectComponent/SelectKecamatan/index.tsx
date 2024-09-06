"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState } from "react";

interface SelectItem {
    id: string;
    name: string;
}

interface KecamatanSelectProps {
    // items: SelectItem[];
    label?: string;
    placeholder?: string;
    value: any;
    onChange: (value: string) => void;
}

const items = [
    { id: "1", nama: "Metro Kibang" },
    { id: "2", nama: "Batanghari" },
    { id: "3", nama: "Sekampung" },
];

const KecamatanSelect: React.FC<KecamatanSelectProps> = ({
    // items,
    label = "Instansi",
    placeholder = "Pilih Instansi",
    value,
    onChange,
}) => {
    const [searchValue, setSearchValue] = useState("");

    // Filter items based on the search input
    const filteredItems = items.filter((item) =>
        item.nama.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Handle change in search input
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="pt-10 bg-white">
                <div className="px-2 fixed border-b w-full top-0 flex items-center justify-between z-10 bg-white">
                    <Search className="text-slate-400" />
                    <Input
                        placeholder="Search..."
                        className="w-full border-0"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                </div>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {filteredItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                            {item.nama}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default KecamatanSelect;
