"use client"

import React from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
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
import EyeIcon from '../../../../../public/icons/EyeIcon'
import useSWR, { SWRResponse, mutate } from "swr";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useLocalStorage from "@/hooks/useLocalStorage";
import Swal from 'sweetalert2';

interface UserRole {
  user_id: number;
  role_id: number;
}

interface Role {
  id: number;
  roleName: string;
  description: string;
  user_roles: UserRole;
}

interface UserKecamatan {
  user_id: number;
  kecamatan_id: number;
}

interface Kecamatan {
  id: number;
  nama: string;
  createdAt: string;
  updatedAt: string;
  user_kecamatan: UserKecamatan;
}

interface User {
  id: number;
  email: string;
  nip: string;
  name: string;
  pangkat: string;
  createdAt: string;
  updatedAt: string;
  kecamatans: Kecamatan[];
  roles: Role[];
}

interface Response {
  status: number;
  message: string;
  data: User[];
}


const PenggunaPage = () => {
  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();

  const { data: dataUser }: SWRResponse<Response> = useSWR(
    `/user/get`,
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
      await axiosPrivate.delete(`/user/delete/${id}`, {
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
    } mutate(`/user/get`);
  };


  return (
    <div>
      {/* title */}
      <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">Pengguna</div>
      {/* title */}
      {/* top */}
      <div className="header flex gap-2 justify-between items-center">
        <div className="search md:w-[50%]">
          <Input
            type="text"
            placeholder="Cari"
            rightIcon={<SearchIcon />}
            className='border-primary py-2'
          />
        </div>
        <div className="right">
          <Link href="/peran-pengguna/pengguna/tambah" className='bg-primary text-sm px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
            Tambah Data
          </Link>
        </div>
      </div>
      {/* table */}
      <Table className='border border-slate-200 mt-5'>
        <TableHeader className='bg-primary-600'>
          <TableRow>
            <TableHead className="text-primary py-3">
              No
            </TableHead>
            <TableHead className="text-primary py-3">
              Nama
            </TableHead>
            <TableHead className="text-primary py-3 hidden md:table-cell">
              NIP
            </TableHead>
            <TableHead className="text-primary py-3 hidden md:table-cell">
              Email
            </TableHead>
            <TableHead className="text-primary py-3 hidden md:table-cell">
              Pangkat
            </TableHead>
            <TableHead className="text-primary py-3">
              Peran
            </TableHead>
            <TableHead className="text-primary py-3 text-center">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataUser?.data && dataUser.data.length > 0 ? (
            dataUser.data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {index + 1}
                </TableCell>
                <TableCell>
                  {item?.name ?? "-"}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {item?.nip ?? "-"}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {item?.email ?? "-"}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {item?.pangkat ?? "-"}
                </TableCell>
                <TableCell>
                  {item?.roles[0]?.roleName ?? "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    {/* <Link className='' href={`/peran-pengguna/pengguna/detail/${item.id}`}>
                      <EyeIcon />
                    </Link> */}
                    <Link className='' href={`/peran-pengguna/pengguna/edit/${item.id}`}>
                      <EditIcon />
                    </Link>
                    <DeletePopup onDelete={() => handleDelete(item.id.toString())} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* table */}
    </div>
  )
}

export default PenggunaPage