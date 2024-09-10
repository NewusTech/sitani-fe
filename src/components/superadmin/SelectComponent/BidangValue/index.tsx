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
import useLocalStorage from "@/hooks/useLocalStorage";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSWR, { SWRResponse } from "swr";

interface SelectItem {
    id: string;
    name: string;
}

interface BidangSelectProps {
    label?: string;
    placeholder?: string;
    value: any;
    onChange: (value: string) => void;
}

const BidangSelect: React.FC<BidangSelectProps> = ({
    // items,
    label = "Bidang",
    placeholder = "Pilih Bidang",
    value,
    onChange,
}) => {

    // INTEGRASI

    interface Pagination {
        page: number;
        perPage: number;
        totalPages: number;
        totalCount: number;
        links: {
            prev: string | null;
            next: string | null;
        };
    }

    interface Data {
        id: string;
        nama: string;
    }

    interface Data {
        data: Data[];
        pagination: Pagination;
    }

    interface Response {
        status: string;
        message: string;
        data: Data;
    }

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataBidang }: SWRResponse<Response> = useSWR(
        `/bidang/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    // INTEGRASI
    const [searchValue, setSearchValue] = useState("");

    // Filter items based on the search input
    const filteredItems = dataBidang?.data?.data?.filter((item) => item?.nama.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Handle change in search input
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    console.log("data bidang: ", dataBidang?.data?.data)

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
                    <SelectItem value={"semua"}>Semua</SelectItem>
                    {filteredItems?.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                            {item.nama}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default BidangSelect;
