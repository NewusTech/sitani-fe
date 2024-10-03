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
    chb_apbn: number;
    chb_tp: number;
    chb_apbd: number;
    chk_apbn: number;
    chk_tp: number;
    chk_apbd: number;
    power_thresher_apbn: number;
    power_thresher_tp: number;
    power_thresher_apbd: number;
    corn_sheller_apbn: number;
    corn_sheller_tp: number;
    corn_sheller_apbd: number;
    ptm_apbn: number;
    ptm_tp: number;
    ptm_apbd: number;
    ptm_mobile_apbn: number;
    ptm_mobile_tp: number;
    ptm_mobile_apbd: number;
    cs_mobile_apbn: number;
    cs_mobile_tp: number;
    cs_mobile_apbd: number;
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
        `/psp/alsintan-pascapanen/get/${id}`,
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
                Sebaran Alsintan Pascapanen
            </div>
            {/* Back Link */}
            <div className="flex justify-start gap-2 md:gap-3 mt-4">
                <Link
                    href="/psp/alsintan-pascapanen"
                    className="bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300"
                >
                    Kembali
                </Link>
            </div>
            {/* Detail */}
            <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
                <div className="font-semibold mb-2 text-base md:text-lg">Data Alsintan Pascapanen</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <LabelDetail label="Kecamatan" name={data.kecamatan.nama} />
                    <LabelDetail label="Tahun" name={data.tahun} />
                    <LabelDetail label="CHB APBN" name={data.chb_apbn} />
                    <LabelDetail label="CHB TP" name={data.chb_tp} />
                    <LabelDetail label="CHB APBD" name={data.chb_apbd} />
                    <LabelDetail label="CHK APBN" name={data.chk_apbn} />
                    <LabelDetail label="CHK TP" name={data.chk_tp} />
                    <LabelDetail label="CHK APBD" name={data.chk_apbd} />
                    <LabelDetail label="Power Thresher APBN" name={data.power_thresher_apbn} />
                    <LabelDetail label="Power Thresher TP" name={data.power_thresher_tp} />
                    <LabelDetail label="Power Thresher APBD" name={data.power_thresher_apbd} />
                    <LabelDetail label="Corn Sheller APBN" name={data.corn_sheller_apbn} />
                    <LabelDetail label="Corn Sheller TP" name={data.corn_sheller_tp} />
                    <LabelDetail label="Corn Sheller APBD" name={data.corn_sheller_apbd} />
                    <LabelDetail label="PTM APBN" name={data.ptm_apbn} />
                    <LabelDetail label="PTM TP" name={data.ptm_tp} />
                    <LabelDetail label="PTM APBD" name={data.ptm_apbd} />
                    <LabelDetail label="PTM Mobile APBN" name={data.ptm_mobile_apbn} />
                    <LabelDetail label="PTM Mobile TP" name={data.ptm_mobile_tp} />
                    <LabelDetail label="PTM Mobile APBD" name={data.ptm_mobile_apbd} />
                    <LabelDetail label="CS Mobile APBN" name={data.cs_mobile_apbn} />
                    <LabelDetail label="CS Mobile TP" name={data.cs_mobile_tp} />
                    <LabelDetail label="CS Mobile APBD" name={data.cs_mobile_apbd} />
                    <LabelDetail label="Keterangan" name={data.keterangan} />
                </div>
            </div>
        </div>
    );
};

export default DetailPraPanenPage;
