"use client"
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import SearchIcon from "../../../../public/icons/SearchIcon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EditIcon from "../../../../public/icons/EditIcon";
import EyeIcon from "../../../../public/icons/EyeIcon";
import DeletePopup from "@/components/superadmin/PopupDelete";
import useSWR from "swr";
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useLocalStorage from "@/hooks/useLocalStorage";
import PaginationTable from "@/components/PaginationTable";
import { ResponsiveTable } from "responsive-table-react";

// Define your interfaces
interface Padi {
    id: number;
    kecamatanId: number;
    desaId: number;
    tanggal: string;
    hibrida_bantuan_pemerintah_lahan_sawah_panen: number;
    hibrida_bantuan_pemerintah_lahan_sawah_tanam: number;
    hibrida_bantuan_pemerintah_lahan_sawah_puso: number;
    hibrida_non_bantuan_pemerintah_lahan_sawah_panen: number;
    hibrida_non_bantuan_pemerintah_lahan_sawah_tanam: number;
    hibrida_non_bantuan_pemerintah_lahan_sawah_puso: number;
    unggul_bantuan_pemerintah_lahan_sawah_panen: number;
    unggul_bantuan_pemerintah_lahan_sawah_tanam: number;
    unggul_bantuan_pemerintah_lahan_sawah_puso: number;
    unggul_bantuan_pemerintah_lahan_bukan_sawah_panen: number;
    unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam: number;
    unggul_bantuan_pemerintah_lahan_bukan_sawah_puso: number;
    unggul_non_bantuan_pemerintah_lahan_sawah_panen: number;
    unggul_non_bantuan_pemerintah_lahan_sawah_tanam: number;
    unggul_non_bantuan_pemerintah_lahan_sawah_puso: number;
    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen: number;
    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam: number;
    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso: number;
    lokal_lahan_sawah_panen: number;
    lokal_lahan_sawah_tanam: number;
    lokal_lahan_sawah_puso: number;
    lokal_lahan_bukan_sawah_panen: number;
    lokal_lahan_bukan_sawah_tanam: number;
    lokal_lahan_bukan_sawah_puso: number;
    sawah_irigasi_lahan_sawah_panen: number;
    sawah_irigasi_lahan_sawah_tanam: number;
    sawah_irigasi_lahan_sawah_puso: number;
    sawah_tadah_hujan_lahan_sawah_panen: number;
    sawah_tadah_hujan_lahan_sawah_tanam: number;
    sawah_tadah_hujan_lahan_sawah_puso: number;
    sawah_rawa_pasang_surut_lahan_sawah_panen: number;
    sawah_rawa_pasang_surut_lahan_sawah_tanam: number;
    sawah_rawa_pasang_surut_lahan_sawah_puso: number;
    sawah_rawa_lebak_lahan_sawah_panen: number;
    sawah_rawa_lebak_lahan_sawah_tanam: number;
    sawah_rawa_lebak_lahan_sawah_puso: number;
}

interface Pagination {
    page: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
}

interface ResponseData {
    data: Padi[];
    pagination: Pagination;
}

interface Response {
    status: string;
    data: ResponseData;
    message: string;
}

const KorlubPadi = () => {
    // Format date
    const formatDate = (date?: Date): string => {
        if (!date) return ""; // Return an empty string if the date is undefined
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() is zero-based
        const day = date.getDate();

        return `${year}/${month}/${day}`;
    };

    const [startDate, setStartDate] = useState<Date>();
    const filterDate = formatDate(startDate);

    // State management
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // Pagination handler
    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Data fetching using SWR
    const { data: dataPadi }: SWRResponse<Response> = useSWR(
        `korluh/padi/get?page=${currentPage}&search=${search}&limit=1&equalDate=${filterDate}`, // Adjust limit as needed
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );

    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/korluh/padi/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            mutate("/korluh/padi/get");
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    // Prepare columns for ResponsiveTable
    // - padi hibrida lahan sawah bantuan pemerintah 
    const columnsPadiBantuan = [
        { id: "uraian", text: "Uraian" },
        { id: "panen", text: "Bantuan Pemerintah Lahan Sawah - Panen" },
        { id: "tanam", text: "Bantuan Pemerintah Lahan Sawah - Tanam" },
        { id: "puso", text: "Bantuan Pemerintah Lahan Sawah - Puso" },
    ];
    const tableDataPadiBantuan = dataPadi?.data?.data?.map((item, index) => ({
        uraian: "Jenis Padi Hibrida Bantuan Pemerintah Lahan Sawah", // This can be dynamic if needed
        panen: item.hibrida_bantuan_pemerintah_lahan_sawah_panen,
        tanam: item.hibrida_bantuan_pemerintah_lahan_sawah_tanam,
        puso: item.hibrida_bantuan_pemerintah_lahan_sawah_puso,
    })) || [];
    // - padi hibrida lahan sawan non bantuan pemerintah
    const columnsPadiNonBantuan = [
        { id: "uraian", text: "Uraian" },
        { id: "panen", text: "Non Bantuan Pemerintah Lahan Sawah - Panen" },
        { id: "tanam", text: "Non Bantuan Pemerintah Lahan Sawah - Tanam" },
        { id: "puso", text: "Non Bantuan Pemerintah Lahan Sawah - Puso" },
    ];
    const tableHibridaLahanSawahNonBantuan = dataPadi?.data?.data?.map((item, index) => ({
        uraian: "Jenis Padi Hibrida Bantuan Non Pemerintah Lahan Sawah", // This can be dynamic if needed
        panen: item.hibrida_non_bantuan_pemerintah_lahan_sawah_panen,
        tanam: item.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam,
        puso: item.hibrida_non_bantuan_pemerintah_lahan_sawah_puso,

    })) || [];
    // - padi unggul lahan sawah bantuan pemerintah 
    const columnsUnggulLahanSawahBantuan = [
        { id: "uraian", text: "Uraian" },
        { id: "panen", text: "Non Bantuan Pemerintah Lahan Sawah - Panen" },
        { id: "tanam", text: "Non Bantuan Pemerintah Lahan Sawah - Tanam" },
        { id: "puso", text: "Non Bantuan Pemerintah Lahan Sawah - Puso" },
    ];
    const tableUnggulLahanSawahBantuan = dataPadi?.data?.data?.map((item, index) => ({
        uraian: "Jenis Padi Unggul Bantuan Pemerintah Lahan Sawah", // This can be dynamic if needed
        panen: item.unggul_bantuan_pemerintah_lahan_sawah_panen,
        tanam: item.unggul_bantuan_pemerintah_lahan_sawah_tanam,
        puso: item.unggul_bantuan_pemerintah_lahan_sawah_puso,

    })) || [];
    // - padi unggul lahan bukan sawah bantuan pemerintah 
    const columnsUnggulLahanBukanSawahBantuan = [
        { id: "uraian", text: "Uraian" },
        { id: "panen", text: "Non Bantuan Pemerintah Lahan Sawah - Panen" },
        { id: "tanam", text: "Non Bantuan Pemerintah Lahan Sawah - Tanam" },
        { id: "puso", text: "Non Bantuan Pemerintah Lahan Sawah - Puso" },
    ];
    const tableUnggulLahanBukanSawahBantuan = dataPadi?.data?.data?.map((item, index) => ({
        uraian: "Jenis Padi Unggul Bantuan Pemerintah Lahan Sawah", // This can be dynamic if needed
        panen: item.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen,
        tanam: item.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam,
        puso: item.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso,

    })) || [];

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">
                Korluh Padi
            </div>
            {/* Search and Filter */}
            <div className="flex gap-4 mb-4">
                <Input
                    placeholder="Search"
                    value={search}
                    onChange={handleSearchChange}
                />
                <Button>
                    <SearchIcon />
                </Button>
                {/* Add more filter buttons as needed */}
            </div>
            {/* Responsive Table */}
            <div className="wrap-table flex flex-col gap-3">
                <ResponsiveTable columns={columnsPadiBantuan} data={tableDataPadiBantuan} />
                <ResponsiveTable columns={columnsPadiNonBantuan} data={tableHibridaLahanSawahNonBantuan} />
                <ResponsiveTable columns={columnsUnggulLahanSawahBantuan} data={tableUnggulLahanSawahBantuan} />
                <ResponsiveTable columns={columnsUnggulLahanBukanSawahBantuan} data={tableUnggulLahanBukanSawahBantuan} />
            </div>
            {/* Pagination */}
            <PaginationTable
                currentPage={currentPage}
                totalPages={dataPadi?.data?.pagination?.totalPages || 1}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default KorlubPadi;
