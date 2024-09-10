"use client";

import React, { useState } from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import PaginationTable from '@/components/PaginationTable';
import Swal from 'sweetalert2';


const KelolaBeritaPage = () => {

  // INTEGRASI
  interface Artikel {
    id?: string; // Ensure id is a string
    judul?: string;
    slug?: string;
    createdAt?: string;
  }

  interface Pagination {
    page: number,
    perPage: number,
    totalPages: number,
    totalCount: number,
  }

  interface ResponseData {
    data: Artikel[];
    pagination: Pagination;
  }

  interface Response {
    status: string,
    data: ResponseData,
    message: string
  }
  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();
  const [search, setSearch] = useState("");
  // search
  // search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page: number) => {
    setCurrentPage(page)
  };
  // pagination
  // limit
  const [limit, setLimit] = useState(10);
  // limit

  // GETALL
  const { data: dataArtikel }: SWRResponse<Response> = useSWR(
    `article/get?page=${currentPage}&search=${search}&limit=${limit}`,
    (url) =>
      axiosPrivate
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => res.data)
  );
  console.log(dataArtikel)

  // DELETE
  const handleDelete = async (slug: string) => {
    try {
      await axiosPrivate.delete(`/article/delete/${slug}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
    mutate(`article/get?page=${currentPage}&search=${search}&limit=10`);

  };  // INTEGRASI
  return (
    <div>
      {/* title */}
      <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">Kelola Berita</div>
      {/* title */}
      {/* head */}
      <div className="header flex md:flex-row flex-col gap-2 justify-between items-center">
        <div className="search md:w-[50%] w-full">
          <Input
            autoFocus
            type="text"
            placeholder="Cari"
            value={search}
            onChange={handleSearchChange}
            rightIcon={<SearchIcon />}
            className='border-primary py-2'
          />
        </div>
        <div className="right md:w-fit w-full flex justify-end md:mt-0 mt-2">
          <Link href="/data-master/kelola-berita/tambah" className='bg-primary text-sm px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
            Tambah Data
          </Link>
        </div>
      </div>
      {/* head */}
      {/* table */}
      <Table className='border border-slate-200 mt-4'>
        <TableHeader className='bg-primary-600'>
          <TableRow >
            <TableHead className="text-primary py-3">No</TableHead>
            <TableHead className="text-primary py-3">Tanggal</TableHead>
            <TableHead className="text-primary py-3">Judul</TableHead>
            <TableHead className="text-primary py-3">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataArtikel?.data.data && dataArtikel.data.data.length > 0 ? (
            dataArtikel.data.data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  {(currentPage - 1) * limit + (index + 1)}
                </TableCell>
                <TableCell>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }) : 'Tanggal tidak tersedia'}
                </TableCell>

                <TableCell>
                  {item.judul}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Link href={`/data-master/kelola-berita/edit/${item.slug}`}>
                      <EditIcon />
                    </Link>
                    <DeletePopup onDelete={() => handleDelete(item.slug || '')} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* table */}
      {/* pagination */}
      <div className="pagi flex items-center lg:justify-end justify-center">
        {dataArtikel?.data.pagination.totalCount as number > 1 && (
          <PaginationTable
            currentPage={currentPage}
            totalPages={dataArtikel?.data.pagination.totalPages as number}
            onPageChange={onPageChange}
          />
        )}
      </div>
      {/* pagination */}
    </div>
  )
}

export default KelolaBeritaPage