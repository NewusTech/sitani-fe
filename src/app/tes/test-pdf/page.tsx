"use client"

import React, { useEffect, useState } from "react";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage';
import PdfGenerator from "@/components/Print/Kepegawaian/test-pdf";

interface Response {
    status: string;
    data: ResponseData;
    message: string;
}

interface ResponseData {
    data: Data[];
    pagination: Pagination;
}

interface Pagination {
    page: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
}

interface Data {
    id?: number;
    nama?: string;
    nip?: string;
    tempatLahir?: string;
    tglLahir?: string;
    pangkat?: string;
    golongan?: string;
    tmtPangkat?: string;
    jabatan?: string;
    tmtJabatan?: string;
    namaDiklat?: string;
    tglDiklat?: string;
    totalJam?: number;
    namaPendidikan?: string;
    tahunLulus?: number;
    jenjangPendidikan?: string;
    usia?: string;
    masaKerja?: string;
    keterangan?: string;
    status?: string;
    bidang_id?: number;
    bidang?: Bidang;
}

interface Bidang {
    id?: number;
    nama?: string;
    createdAt?: number;
    updatedAt?: number;
}

const DataPegawaiPage: React.FC = () => {
    const [allData, setAllData] = useState<Data[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const fetchAllData = async () => {
        let fetchedData: Data[] = [];
        let page = 1;
        let hasMore = true;

        try {
            while (hasMore) {
                const response = await axiosPrivate.get(`/kepegawaian/get`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: {
                        page,
                        limit: 100, // Data per page
                        year: new Date().getFullYear(),
                    },
                });

                const newData = response?.data?.data?.data || [];
                const pagination = response?.data?.data?.pagination;

                fetchedData = [...fetchedData, ...newData];
                page += 1;
                hasMore = page <= pagination.totalPages;
            }

            setAllData(fetchedData);
        } catch (err) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    },);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Data Pegawai</h1>
            <PdfGenerator data={allData} />
        </div>
    );
};

export default DataPegawaiPage;
