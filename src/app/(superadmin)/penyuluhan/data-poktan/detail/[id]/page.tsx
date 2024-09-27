"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams } from "next/navigation";
import useSWR from "swr";

interface LabelProps {
    label?: string;
    name?: string | number;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div className="flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2">
            <div className="label text-black">{props.label || "-"}</div>
            <div className="name text-black/70 text-end md:text-start">
                {props.name || "-"}
            </div>
        </div>
    );
};

// Interfaces for API response
interface Kecamatan {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
}

interface Desa {
    id: number;
    nama: string;
    kecamatanId: number;
    createdAt: string;
    updatedAt: string;
}

interface Response {
    status: number;
    message: string;
    data: {
        id: number;
        idPoktan: number | string;
        kecamatanId: number;
        desaId: number;
        tahun: number | string;
        nama: string;
        ketua: string;
        sekretaris: string;
        bendahara: string;
        alamat: string;
        dibent: number | string;
        l: number | string;
        p: number | string;
        kelas: string;
        createdAt: string;
        updatedAt: string;
        kecamatan: Kecamatan;
        desa: Desa;
    };
}

const DetailPoktanPage = () => {
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();

    const { data: dataPoktan, error } = useSWR<Response>(
        `/penyuluh-kelompok-tani/get/${id}`, // Fixed URL
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                return response.data;
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                return null;
            }
        }
    );

    const data = dataPoktan?.data;

    return (
        <div>
            {/* Title */}
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">
            Data Kelompok Tani (POKTAN) Kabupaten
            </div>
            {/* Back Link */}
            <div className="flex justify-start gap-2 md:gap-3 mt-4">
                <Link
                    href="/penyuluhan/data-poktan"
                    className="bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300"
                >
                    Kembali
                </Link>
            </div>
            {/* Detail */}
            <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
                <div className="font-semibold mb-2 text-base md:text-lg">Data Poktan</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <LabelDetail label="UPTD BPP" name={data?.kecamatan.nama ?? "-"} />
                    <LabelDetail label="Desa" name={data?.desa.nama ?? "-"} />
                    <LabelDetail label="ID Poktan" name={data?.idPoktan ?? "-"} />
                    <LabelDetail label="Tahun" name={data?.tahun ?? "-"} />
                    <LabelDetail label="Nama Kelompok Tani" name={data?.nama ?? "-"} />
                    <LabelDetail label="Ketua" name={data?.ketua ?? "-"} />
                    <LabelDetail label="Sekretaris" name={data?.sekretaris ?? "-"} />
                    <LabelDetail label="Bendahara" name={data?.bendahara ?? "-"} />
                    <LabelDetail label="Alamat Sekretariat" name={data?.alamat ?? "-"} />
                    <LabelDetail label="Tahun Dibentuk" name={data?.tahun ?? "-"} />
                    <LabelDetail label="Laki-laki" name={data?.l ?? "-"} />
                    <LabelDetail label="Perempuan" name={data?.p ?? "-"} />
                    <LabelDetail
                        label="Kelas Kelompok"
                        name={
                            data?.kelas === "p" ? "Pemula" :
                                data?.kelas === "l" ? "Lanjut" :
                                data?.kelas === "m" ? "Madya" :
                                    data?.kelas === "u" ? "Utama" :
                                        "-"
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default DetailPoktanPage;
