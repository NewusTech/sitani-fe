// page.tsx
"use client"
import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import useLocalStorage from '@/hooks/useLocalStorage';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import DownloadPDF from '@/components/Print/Holtilultura/test-pdf';

const Page: React.FC = () => {
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const tahun = new Date().getFullYear(); // Ganti dengan logika tahun yang sesuai
    const bulan = new Date().getMonth() + 1; // Ganti dengan logika bulan yang sesuai
    const selectedKecamatan = 'Kecamatan Pilihan'; // Ganti dengan logika pilihan kecamatan yang sesuai

    const { data: dataPalawija1 } = useSWR(
        `/tph/realisasi-palawija-1/get?bulan=${tahun}/${bulan}&kecamatan=${selectedKecamatan}`,
        (url) =>
            axiosPrivate.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then(res => res.data)
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Laporan Realisasi Palawija</h1>
            <DownloadPDF data={dataPalawija1} />
        </div>
    );
};

export default Page;
