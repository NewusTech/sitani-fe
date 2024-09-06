"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Loader, Search } from "lucide-react";
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
import Link from "next/link";

const Card = ({
    color,
    title,
    text,
}: {
    color: string;
    title: string;
    text: string;
}) => {
    return (
        <div
            className={`${color} rounded-[16px] w-full h-[155px] flex flex-col items-center justify-center gap-y-10`}
        >
            <h5 className="text-neutral-50 font-semibold text-sm w-[187px] text-center">
                {title}
            </h5>
            <h1 className="text-neutral-50 text-3xl font-medium">{text}</h1>
        </div>
    );
};

const DashboardKepegawaian = () => {
    return (
        <section className="space-y-4">
            <div className="w-full py-4 px-8 rounded-[16px] shadow bg-neutral-50">
                <div className="flex justify-end space-x-4 items-center">
                    <div className="flex gap-x-3 text-slate-400">
                        <p className="text-neutral-900">Tahun</p>
                    </div>
                    <div className="w-2/12">
                        <Select
                        // value={selectedYear.toString()}
                        // onValueChange={(e: any) => setSelectedYear(e)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Tahun</SelectLabel>
                                    {/* {years?.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))} */}
                                    <SelectItem value="2022">2022</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-x-4 mt-4 flex justify-between">
                    <Card
                        color="bg-gradient-to-b from-primary via-primary via-32% to-primary"
                        text="10"
                        title="Jumlah Data Pegawai"
                    />
                    <Card
                        color="bg-gradient-to-b from-secondary via-secondary via-36% to-secondary"
                        text="10"
                        title="Jumlah Data Pegawai Pensiun"
                    />
                </div>
            </div>

            <div className="rounded-[16px] bg-neutral-50 w-full p-12 shadow">
                {/* {services && (
                    <DataTables
                        columns={DashboardKepegawaianColumns}
                        data={services}
                        filterBy="layanan_name"
                        type="request"
                    />
                )} */}
            </div>
        </section>
    );
};

export default DashboardKepegawaian;
