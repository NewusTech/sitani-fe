"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import SearchIcon from "../../../../public/icons/SearchIcon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeletePopup from "@/components/superadmin/PopupDelete";
import useSWR from "swr";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useLocalStorage from "@/hooks/useLocalStorage";
import PaginationTable from "@/components/PaginationTable";
import { ResponsiveTable } from "responsive-table-react";
import EyeIcon from "../../../../public/icons/EyeIcon";
import EditIcon from "../../../../public/icons/EditIcon";
import Swal from 'sweetalert2';
import { SWRResponse, mutate } from "swr";

// Define your interfaces
interface KorluhTanamanHiasResponse {
    status: number;
    message: string;
    data: {
        data: KorluhTanamanHias[];
        pagination: Pagination;
    };
}

interface KorluhTanamanHias {
    id: number;
    kecamatanId: number;
    desaId: number;
    tanggal: string;
    createdAt: string;
    updatedAt: string;
    kecamatan: Kecamatan;
    desa: Desa;
    list: Tanaman[];
}

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

interface Tanaman {
    id: number;
    korluhTanamanHiasId: number;
    namaTanaman: string;
    satuanProduksi: string;
    luasPanenHabis: number;
    luasPanenBelumHabis: number;
    luasRusak: number;
    luasPenanamanBaru: number;
    produksiHabis: number;
    produksiBelumHabis: number;
    rerataHarga: number;
    keterangan: string;
    createdAt: string;
    updatedAt: string;
}

interface Pagination {
    page: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
    links: {
        prev: string | null;
        next: string | null;
    };
}

interface KorluhRespon {
    urlApi?: string;
}

const KorluhTanamanHiasMobile = ({ urlApi }: KorluhRespon) => {
    // Format date
    const formatDate = (date?: Date): string => {
        if (!date) return ""; // Return an empty string if the date is undefined
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() is zero-based
        const day = date.getDate();

        return `${year}/${month}/${day}`;
    };

    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
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

    // GETALL
    const { data: dataTanaman }: SWRResponse<KorluhTanamanHiasResponse> = useSWR(
        // `korluh/padi/get?limit=1`,
        urlApi,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    console.log(dataTanaman)

    // Prepare columns for ResponsiveTable
    const columnsTanaman = [
        { id: "Tanaman", text: "Nama Tanaman" },
        { id: "satuanProduksi", text: "Hasil Produksi (kuintal)" },
        { id: "luasPanenHabis", text: "Luas Panen Habis/Dibongkar (Hektar)" },
        { id: "luasPanenBelumHabis", text: "Luas Panen Belum Habis (Hektar)" },
        { id: "luasRusak", text: "Luas Rusak/Tidak Berhasil/Puso (Hektar)" },
        { id: "luasPenanamanBaru", text: "Luas Penanaman Baru/Tambah Tanam (Hektar)" },
        { id: "produksiHabis", text: "Produksi (kuintal) Dipanen Habis/Dibongkar" },
        { id: "produksiBelumHabis", text: "Produksi (kuintal) Belum Habis" },
        { id: "rerataHarga", text: "Rata Rata Harga Jual Per Kilogram (Rupiah)" },
        { id: "keterangan", text: "Keterangan" },
        { id: "aksi", text: "Aksi" } // Added Aksi column
    ];

    // Handlers for actions
    const handleEdit = (id: number) => {
        console.log(`Edit item with id: ${id}`);
        // Implement edit functionality
    };

    const handleDetail = (id: number) => {
        console.log(`View details for item with id: ${id}`);
        // Implement detail view functionality
    };

    // const handleDelete = (id: number) => {
    //     console.log(`Delete item with id: ${id}`);
    //     // Implement delete functionality
    // };
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/korluh/sayur-buah/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(id)
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil dihapus!',
                text: 'Data sudah disimpan sistem!',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
                customClass: {
                    title: 'text-2xl font-semibold text-green-600',
                    icon: 'text-green-500 animate-bounce',
                    timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400', // Gradasi warna yang lembut
                },
                backdrop: `rgba(0, 0, 0, 0.4)`,
            });
            // alert
            // Update the local data after successful deletion
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal menghapus data!';
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan!',
                text: errorMessage,
                showConfirmButton: true,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                customClass: {
                    title: 'text-2xl font-semibold text-red-600',
                    icon: 'text-red-500 animate-bounce',
                },
                backdrop: 'rgba(0, 0, 0, 0.4)',
            });
            console.error("Failed to create user:", error);
        }

    };
    // DELETE

    // Ensure tableDataTanaman is always an array
    const tableDataTanaman: Array<Record<string, React.ReactNode>> = dataTanaman?.data?.data.flatMap((item) =>
        item.list.map((tanaman) => ({
            Tanaman: tanaman.namaTanaman,
            satuanProduksi: tanaman.satuanProduksi,
            luasPanenHabis: tanaman.luasPanenHabis,
            luasPanenBelumHabis: tanaman.luasPanenBelumHabis,
            luasRusak: tanaman.luasRusak,
            luasPenanamanBaru: tanaman.luasPenanamanBaru,
            produksiHabis: tanaman.produksiHabis,
            produksiBelumHabis: tanaman.produksiBelumHabis,
            rerataHarga: tanaman.rerataHarga,
            keterangan: tanaman.keterangan,
            aksi: (
                <div className="flex gap-4 items-center mt-2">
                    <Link title="Detail" href={`/bpp-kecamatan/tanaman-hias/detail/${tanaman.id}`}>
                        <EyeIcon />
                    </Link>
                    <Link title="Edit" href={`/bpp-kecamatan/tanaman-hias/edit/${tanaman.id}`}>
                        <EditIcon />
                    </Link>
                    <DeletePopup onDelete={() => handleDelete(String(tanaman.id))} />
                </div>
            )
        }))
    ) || [
            {
                Tanaman: "Tidak ada data",
                satuanProduksi: "-",
                luasPanenHabis: "-",
                luasPanenBelumHabis: "-",
                luasRusak: "-",
                luasPenanamanBaru: "-",
                produksiHabis: "-",
                produksiBelumHabis: "-",
                rerataHarga: "-",
                keterangan: "-",
                aksi: "-"
            }
        ];

    return (
        <div className="">
            {/* title */}
            {/* Responsive Table */}
            <div className="wrap-table flex flex-col gap-1">
                <div className="font-semibold mb-2">Tanaman Hias</div>
                {tableDataTanaman.length > 0 ? (
                    <ResponsiveTable designOptions={{ color: '#0A6847' }} columns={columnsTanaman} data={tableDataTanaman} />
                ) : (
                    <div className="text-center">Data tidak ada</div>
                )}
            </div>
        </div>
    );
};

export default KorluhTanamanHiasMobile;
