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

interface PspAlsintanPrapanen {
    id: number;
    kecamatanId: number;
    tahun: number;
    tr_4_apbn: number;
    tr_4_tp: number;
    tr_4_apbd: number;
    tr_2_apbn: number;
    tr_2_tp: number;
    tr_2_apbd: number;
    rt_apbn: number;
    rt_tp: number;
    rt_apbd: number;
    cornplanter_apbn: number;
    cornplanter_tp: number;
    cornplanter_apbd: number;
    cultivator_apbn: number;
    cultivator_tp: number;
    cultivator_apbd: number;
    hand_sprayer_apbn: number;
    hand_sprayer_tp: number;
    hand_sprayer_apbd: number;
    pompa_air_apbn: number;
    pompa_air_tp: number;
    pompa_air_apbd: number;
    keterangan: string;
    createdAt: string;
    updatedAt: string;
    kecamatan: Kecamatan;
}

interface Response {
    status: number;
    message: string;
    data: PspAlsintanPrapanen;
}

const DetailPraPanenPage = () => {
    const axiosPrivate = useAxiosPrivate();
    const { id } = useParams();

    const { data: dataUser, error } = useSWR<Response>(
        `/psp/alsintan-prapanen/get/${id}`,
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch data:', error);
                return null;
            }
        }
    );

    const data = dataUser?.data;

    if (error) return <div>Error loading data</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <div>
            {/* Title */}
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">
                Sebaran Alsintan Prapanen
            </div>
            {/* Back Link */}
            <div className="flex justify-start gap-2 md:gap-3 mt-4">
                <Link
                    href="/psp/alsintan-prapanen"
                    className="bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                >
                    Kembali
                </Link>
            </div>
            {/* Detail */}
            <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
                <div className="font-semibold mb-2 text-base md:text-lg">Data Alsintan Prapanen</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <LabelDetail label="UPTD BPP" name={data.kecamatan.nama} />
                    <LabelDetail label="Tahun" name={data.tahun} />
                    <LabelDetail label="TR 4 APBN" name={data.tr_4_apbn} />
                    <LabelDetail label="TR 4 TP" name={data.tr_4_tp} />
                    <LabelDetail label="TR 4 APBD" name={data.tr_4_apbd} />
                    <LabelDetail label="TR 2 APBN" name={data.tr_2_apbn} />
                    <LabelDetail label="TR 2 TP" name={data.tr_2_tp} />
                    <LabelDetail label="TR 2 APBD" name={data.tr_2_apbd} />
                    <LabelDetail label="RT APBN" name={data.rt_apbn} />
                    <LabelDetail label="RT TP" name={data.rt_tp} />
                    <LabelDetail label="RT APBD" name={data.rt_apbd} />
                    <LabelDetail label="Corn Planter APBN" name={data.cornplanter_apbn} />
                    <LabelDetail label="Corn Planter TP" name={data.cornplanter_tp} />
                    <LabelDetail label="Corn Planter APBD" name={data.cornplanter_apbd} />
                    <LabelDetail label="Cultivator APBN" name={data.cultivator_apbn} />
                    <LabelDetail label="Cultivator TP" name={data.cultivator_tp} />
                    <LabelDetail label="Cultivator APBD" name={data.cultivator_apbd} />
                    <LabelDetail label="Hand Sprayer APBN" name={data.hand_sprayer_apbn} />
                    <LabelDetail label="Hand Sprayer TP" name={data.hand_sprayer_tp} />
                    <LabelDetail label="Hand Sprayer APBD" name={data.hand_sprayer_apbd} />
                    <LabelDetail label="Pompa Air APBN" name={data.pompa_air_apbn} />
                    <LabelDetail label="Pompa Air TP" name={data.pompa_air_tp} />
                    <LabelDetail label="Pompa Air APBD" name={data.pompa_air_apbd} />
                    <LabelDetail label="Keterangan" name={data.keterangan} />
                </div>
            </div>
        </div>
    );
};

export default DetailPraPanenPage;
