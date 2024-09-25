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
interface Desa {
  id: number;
  nama: string;
  kecamatanId: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  penyuluh_kecamatan_desabinaan: {
    penyuluh_kecamatan_id: number;
    desa_id: number;
  };
}

interface PenyuluhKecamatan {
  id: number;
  kecamatanId: number;
  nama: string;
  nip: string;
  pangkat: string;
  golongan: string;
  keterangan: string;
  desa: Desa[];
}

interface ApiResponse {
  status: number;
  message: string;
  data: PenyuluhKecamatan;
}

const DetailDataKecamatanPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();

  const { data: dataPenyuluhKab, error } = useSWR<ApiResponse>(
    `/penyuluh-kecamatan/get/${id}`, // Fixed URL
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

  const data = dataPenyuluhKab?.data;

  return (
    <div>
      {/* Title */}
      <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">
        Daftar Penempatan Penyuluh Pertanian Kecamatan
      </div>
      {/* Back Link */}
      <div className="flex justify-start gap-2 md:gap-3 mt-4">
        <Link
          href="/penyuluhan/data-kecamatan"
          className="bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300"
        >
          Kembali
        </Link>
      </div>
      {/* Detail */}
      <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
        <div className="font-semibold mb-2 text-base md:text-lg">Data Penyuluh</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          <LabelDetail label="Kecamatan" name={data?.kecamatanId} />
          <LabelDetail
            label="Wilayah Desa Binaan"
            name={data?.desa?.map((des) => des.nama).join(", ") || "-"}
          />
          <LabelDetail label="Nama" name={data?.nama} />
          <LabelDetail label="NIP" name={data?.nip} />
          <LabelDetail label="Pangkat" name={data?.pangkat} />
          <LabelDetail label="Golongan" name={data?.golongan} />
          <LabelDetail label="Keterangan" name={data?.keterangan} />
        </div>
      </div>
    </div>
  );
};

export default DetailDataKecamatanPage;
