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

interface Data {
  id?: number;
  peran?: string;
  bidang?: string;
  nama?: string;
  email?: string;
  nip?: number;
  pangkat?: string;
}

const PenggunaPage = () => {
  const data: Data[] = [
    {
      id: 1,
      peran: "Kepala Bidang",
      bidang: "Ketahanan Pangan",
      nama: "Hardono, S.P",
      email: "hardono@gmail.com",
      nip: 23432425345,
      pangkat: "Penata 1"
    },
    {
      id: 2,
      peran: "Kepala Bidang",
      nama: "Hardono, S.P",
      bidang: "Ketahanan Pangan",
      email: "hardono@gmail.com",
      nip: 23432425345,
      pangkat: "Penata 1"
    },
    {
      id: 3,
      peran: "Kepala Bidang",
      nama: "Hardono, S.P",
      bidang: "Ketahanan Pangan",
      email: "hardono@gmail.com",
      nip: 23432425345,
      pangkat: "Penata 1"
    },
  ];
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
              Peran
            </TableHead>
            <TableHead className="text-primary py-3">
              Bidang
            </TableHead>
            <TableHead className="text-primary py-3">
              Nama
            </TableHead>
            <TableHead className="text-primary py-3 hidden md:table-cell">
              Email
            </TableHead>
            <TableHead className="text-primary py-3 hidden md:table-cell">
              NIP
            </TableHead>
            <TableHead className="text-primary py-3 hidden md:table-cell">
              Pangkat
            </TableHead>
            <TableHead className="text-primary py-3 text-center">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {index + 1}
              </TableCell>
              <TableCell>
                {item.peran}
              </TableCell>
              <TableCell>
                {item.bidang}
              </TableCell>
              <TableCell>
                {item.nama}
              </TableCell>
              <TableCell className='hidden md:table-cell'>
                {item.email}
              </TableCell>
              <TableCell className='hidden md:table-cell'>
                {item.nip}
              </TableCell>
              <TableCell className='hidden md:table-cell'>
                {item.pangkat}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Link className='' href="/peran-pengguna/pengguna/detail">
                    <EyeIcon />
                  </Link>
                  <Link className='' href="/peran-pengguna/pengguna/edit">
                    <EditIcon />
                  </Link>
                  <DeletePopup onDelete={() => { }} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* table */}
    </div>
  )
}

export default PenggunaPage