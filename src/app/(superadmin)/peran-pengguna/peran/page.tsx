"use client";

import { Input } from "@/components/ui/input";
import React from "react";
import SearchIcon from "../../../../../public/icons/SearchIcon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR, { SWRResponse, mutate } from "swr";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useLocalStorage from "@/hooks/useLocalStorage";
import EyeIcon from "../../../../../public/icons/EyeIcon";
import EditIcon from "../../../../../public/icons/EditIcon";
import DeletePopup from "@/components/superadmin/PopupDelete";
import Swal from 'sweetalert2';


const PeranPage = () => {

  interface User {
    id: string;
    roleName: string;
    description: string;
  }

  interface Response {
    status: string;
    data: User[];
    message: string;
  }

  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();

  const { data: dataRole }: SWRResponse<Response> = useSWR(
    `/role/get`,
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
      await axiosPrivate.delete(`/role/delete/${id}`, {
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
    } mutate(`/role/get`);
  };

  return (
    <div>
      <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">
        Peran
      </div>

      <div className="header flex gap-2 justify-between items-center">
        <div className="search md:w-[50%]">
          <Input
            type="text"
            placeholder="Cari"
            rightIcon={<SearchIcon />}
            className="border-primary py-2"
          />
        </div>
        <div className="right">
          <Link
            href="/peran-pengguna/peran/tambah"
            className="bg-primary text-sm px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium"
          >
            Tambah Data
          </Link>
        </div>
      </div>

      <Table className="border border-slate-200 mt-5">
        <TableHeader className="bg-primary-600">
          <TableRow>
            <TableHead className="text-primary py-3">No</TableHead>
            <TableHead className="text-primary py-3">Nama Peran</TableHead>
            <TableHead className="text-primary py-3">Deskripsi</TableHead>
            <TableHead className="text-primary py-3">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataRole?.data && dataRole.data.length > 0 ? (
            dataRole.data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="capitalize">{item.roleName ?? "-"}</TableCell>
                <TableCell>{item.description ?? "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Link href={`/peran-pengguna/peran/edit/${item.id}`}>
                      <EditIcon />
                    </Link>
                    <DeletePopup onDelete={() => handleDelete(item.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PeranPage;
