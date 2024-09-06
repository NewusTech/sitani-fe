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

const DashboardPeranPengguna = () => {
    return (
        <section className="space-y-2 lg:space-y-4">
            <div className="text-lg lg:text-xl font-semibold text-primary uppercase lg:text-left text-center">Dashboard Peran Pengguna</div>
        </section>
    );
};

export default DashboardPeranPengguna;
