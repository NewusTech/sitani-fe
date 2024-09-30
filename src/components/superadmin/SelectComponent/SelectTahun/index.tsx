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
import React from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSWR, { SWRResponse } from "swr";

interface TahunSelectProps {
    url: string;
    label?: string;
    placeholder?: string;
    value: any;
    semua?: boolean;
    onChange: (value: string) => void;
}

const TahunSelect: React.FC<TahunSelectProps> = ({
    label = "Tahun",
    placeholder = "Pilih Tahun",
    semua = false,
    value,
    url,
    onChange,
}) => {
    // INTEGRASI
    interface Response {
        status: string;
        data: number[];
        message: string;
    }

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataTahun }: SWRResponse<Response> = useSWR(
        `${url}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-fit">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white">
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {semua && (
                        <SelectItem value={"semua"}>Semua</SelectItem>
                    )}
                    {dataTahun?.data?.map((item) => (
                        <SelectItem key={item.toString()} value={item.toString()}>
                            {item}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default TahunSelect;
