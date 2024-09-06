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

const DashboardKetahananPangan = () => {
    return (
        <section className="space-y-2 lg:space-y-4">
            <div className="text-lg lg:text-xl font-semibold text-primary uppercase lg:text-left text-center">Dashboard Ketahanan Pangan</div>
            <div className="rounded-[16px] bg-neutral-50 w-full p-2 lg:p-8 shadow">
                <div className="text-lg lg:text-xl font-semibold text-primary uppercase lg:text-left text-center">Harga Produsen Eceran</div>
                <div className="space-x-0 mt-2 lg:space-x-4 lg:mt-4 lg:flex lg:justify-between">
                    <Card
                        color="bg-gradient-to-b from-blue-400 via-blue-400 via-32% to-blue-400 mb-2"
                        text="10"
                        title="Harga Tertinggi"
                    />
                    <Card
                        color="bg-gradient-to-b from-secondary via-secondary via-36% to-secondary mb-2"
                        text="10"
                        title="Harga Terndah"
                    />
                </div>
            </div>

            <div className="rounded-[16px] bg-neutral-50 w-full p-2 lg:p-8 shadow">
                <div className="text-lg lg:text-xl font-semibold text-primary uppercase lg:text-left text-center">Coefiesien Variasi Tingkat Produksi</div>
                <div className="space-x-0 mt-2 lg:space-x-4 lg:mt-4 lg:flex lg:justify-between">
                    <Card
                        color="bg-gradient-to-b from-blue-400 via-blue-400 via-32% to-blue-400 mb-2"
                        text="10"
                        title="Rata-Rata"
                    />
                    <Card
                        color="bg-gradient-to-b from-secondary via-secondary via-36% to-secondary mb-2"
                        text="10"
                        title="Min"
                    />
                    <Card
                        color="bg-gradient-to-b from-secondary via-secondary via-36% to-secondary mb-2"
                        text="10"
                        title="Maks"
                    />
                </div>
            </div>

            <div className="rounded-[16px] bg-neutral-50 w-full p-2 lg:p-8 shadow">
                <div className="text-lg lg:text-xl font-semibold text-primary uppercase lg:text-left text-center">Coefiesien Variasi Tingkat Produsen</div>
                <div className="space-x-0 mt-2 lg:space-x-4 lg:mt-4 lg:flex lg:justify-between">
                    <Card
                        color="bg-gradient-to-b from-blue-400 via-blue-400 via-32% to-blue-400 mb-2"
                        text="10"
                        title="Rata-Rata"
                    />
                    <Card
                        color="bg-gradient-to-b from-secondary via-secondary via-36% to-secondary mb-2"
                        text="10"
                        title="Min"
                    />
                    <Card
                        color="bg-gradient-to-b from-secondary via-secondary via-36% to-secondary mb-2"
                        text="10"
                        title="Maks"
                    />
                </div>
            </div>
        </section>
    );
};

export default DashboardKetahananPangan;
