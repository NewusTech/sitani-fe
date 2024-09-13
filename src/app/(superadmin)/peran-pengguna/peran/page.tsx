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

const PeranPage = () => {
  // Dummy data
  const dummyPeran = [
    {
      id: "1",
      name: "Superadmin",
      permission: ["Create", "Read", "Update", "Delete"],
    },
    {
      id: "2",
      name: "Admin",
      permission: ["Create", "Read", "Update", "Delete"],
    },
  ];

  interface User {
    id: string;
    name: string;
    permission: string[];
  }

  interface Response {
    status: string;
    data: User[];
    message: string;
  }

  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();

  // Simulate API data using dummy data
  const { data: dataUser }: SWRResponse<Response> = useSWR("/user/get", () =>
    Promise.resolve({
      status: "success",
      data: dummyPeran,
      message: "Data fetched successfully",
    })
  );

  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/user/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(id);
      mutate("/user/get");
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  console.log(dataUser);

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
            <TableHead className="text-primary py-3">Hak Akses</TableHead>
            <TableHead className="text-primary py-3">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataUser?.data && dataUser.data.length > 0 ? (
            dataUser.data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.permission.join(", ")}</TableCell>
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
