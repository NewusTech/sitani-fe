"use client"
import Label from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import { watch } from 'fs';
import Loading from '@/components/ui/Loading';
import Swal from 'sweetalert2';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formSchema = z.object({
  nama: z.string().min(1, { message: "Nama wajib diisi" }),
  nip: z
    .preprocess((val) => Number(val), z.number().min(1, { message: "NIP wajib diisi" })),
  tempat_lahir: z.string().min(1, { message: "Tempat Lahir wajib diisi" }),
  tgl_lahir: z.preprocess(
    (val) => typeof val === "string" ? formatDate(val) : val,
    z.string().min(1, { message: "Tanggal Lahir wajib diisi" })
  ),
  pangkat: z.string().min(1, { message: "Pangkat wajib diisi" }),
  golongan: z.string().min(1, { message: "Golongan wajib diisi" }),
  tmt_pangkat: z.preprocess(
    (val) => typeof val === "string" ? formatDate(val) : val,
    z.string().min(1, { message: "TMT Pangkat wajib diisi" })
  ),
  jabatan: z.string().min(1, { message: "Jabatan wajib diisi" }),
  tmt_jabatan: z.preprocess(
    (val) => typeof val === "string" ? formatDate(val) : val,
    z.string().min(1, { message: "TMT Jabatan wajib diisi" })
  ),
  nama_diklat: z.string().min(1, { message: "Nama Diklat wajib diisi" }),
  tgl_diklat: z.preprocess(
    (val) => typeof val === "string" ? formatDate(val) : val,
    z.string().min(1, { message: "Tanggal Diklat wajib diisi" })
  ),
  total_jam: z
    .preprocess((val) => Number(val), z.number().min(1, { message: "Total Jam wajib diisi" })),
  nama_pendidikan: z.string().min(1, { message: "Nama Pendidikan wajib diisi" }),
  tahun_lulus: z
    .preprocess((val) => Number(val), z.number().min(1, { message: "Tahun Lulus wajib diisi" })),
  jenjang_pendidikan: z.string().min(1, { message: "Jenjang Pendidikan wajib diisi" }),
  usia: z.string().min(1, { message: "Usia wajib diisi" }),
  masa_kerja: z.string().min(1, { message: "Masa Kerja wajib diisi" }),
  keterangan: z.string().min(1, { message: "Keterangan wajib diisi" }),
});


const EdithPegawaiPage = () => {
  const [date, setDate] = React.useState<Date>()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  // TAMBAH
  // const axiosPrivate = useAxiosPrivate();
  // const navigate = useRouter();
  // const onSubmit = (data: FormSchemaType) => {
  //   console.log(data);
  //   // reset();
  // };

  // Edit
  type FormSchemaType = z.infer<typeof formSchema>;

  interface Response {
    status: string;
    message: string;
    data: Data;
  }

  interface Data {
    id?: number;
    nama?: string;
    nip?: number;
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
    createdAt?: string;
    updatedAt?: string;
  }

  const axiosPrivate = useAxiosPrivate();
  const navigate = useRouter();
  const params = useParams();
  const { id } = params;

  const { data: dataKepegawaian, error } = useSWR<Response>(
    `kepegawaian/get/${id}`,
    async (url: string) => {
      try {
        const response = await axiosPrivate.get(url);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
      }
    }
  );

  useEffect(() => {
    if (dataKepegawaian) {
      const formattedTglLahir = formatDate(dataKepegawaian.data.tglLahir || '');
      const formattedTmtPangkat = formatDate(dataKepegawaian.data.tmtPangkat || '');
      const formattedTmtJabatan = formatDate(dataKepegawaian.data.tmtJabatan || '');
      const formattedTglDiklat = formatDate(dataKepegawaian.data.tglDiklat || '');

      setValue("nama", dataKepegawaian.data.nama || '');
      setValue("nip", dataKepegawaian.data.nip || 0);
      setValue("tempat_lahir", dataKepegawaian.data.tempatLahir || '');
      setValue("tgl_lahir", formattedTglLahir);
      setValue("pangkat", dataKepegawaian.data.pangkat || '');
      setValue("golongan", dataKepegawaian.data.golongan || '');
      setValue("tmt_pangkat", formattedTmtPangkat);
      setValue("jabatan", dataKepegawaian.data.jabatan || '');
      setValue("tmt_jabatan", formattedTmtJabatan);
      setValue("nama_diklat", dataKepegawaian.data.namaDiklat || '');
      setValue("tgl_diklat", formattedTglDiklat);
      setValue("total_jam", dataKepegawaian.data.totalJam || 0);
      setValue("nama_pendidikan", dataKepegawaian.data.namaPendidikan || '');
      setValue("tahun_lulus", dataKepegawaian.data.tahunLulus || 0);
      setValue("jenjang_pendidikan", dataKepegawaian.data.jenjangPendidikan || '');
      setValue("usia", dataKepegawaian.data.usia || '');
      setValue("masa_kerja", dataKepegawaian.data.masaKerja || '');
      setValue("keterangan", dataKepegawaian.data.keterangan || '');
    }
  }, [dataKepegawaian, setValue]);


  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true); // Set loading to true when the form is submitted
    try {
      await axiosPrivate.put(`/kepegawaian/update/${id}`, data);
      // alert
      Swal.fire({
        icon: 'success',
        title: 'Data berhasil di edit!',
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
      console.log("Success to update user:", data);
      navigate.push('/kepegawaian/data-pegawai');
      reset();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
    mutate(`/kepegawaian/get`);
  };
  // Edit

  // const onSubmit = (data: FormSchemaType) => {
  //     console.log(data);
  // };

  return (
    <>
      <div className="text-primary text-xl md:text-2xl font-bold mb-5">Edit Data Pegawai</div>
      {/* Nama NIP Tempat Tanggal Lahir */}
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="mb-2">
          {/* <div className="text-primary text-lg font-bold mb-2">Nama, NIP, Tempat, Tanggal Lahir</div> */}
          <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Nama Lengkap" />
              <Input
                type="text"
                placeholder="Nama Lengkap"
                {...register('nama')}
                className={`${errors.nama ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.nama && (
                <HelperError>{errors.nama.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="NIP" />
              <Input
                type="number"
                placeholder="NIP"
                {...register('nip')}
                className={`${errors.nip ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.nip && (
                <HelperError>{errors.nip.message}</HelperError>
              )}
            </div>
          </div>
          <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Tempat Lahir" />
              <Input
                type="text"
                placeholder="Tempat Lahir"
                {...register('tempat_lahir')}
                className={`${errors.tempat_lahir ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.tempat_lahir && (
                <HelperError>{errors.tempat_lahir.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Tanggal Lahir" />
              <Input
                type="date"
                placeholder="Tanggal Lahir"
                {...register('tgl_lahir')}
                className={`${errors.tgl_lahir ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.tgl_lahir && (
                <HelperError>{errors.tgl_lahir.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Pangkat/Gol Ruang Tmt Pangkat */}
        <div className="mb-2">
          {/* <div className="text-primary text-lg font-bold mb-2">Pangkat / Gol, Ruang, TMT Pangkat</div> */}
          <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Pangkat" />
              <Input
                type="text"
                placeholder="Pangkat"
                {...register('pangkat')}
                className={`${errors.pangkat ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.pangkat && (
                <HelperError>{errors.pangkat.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Golongan" />
              <Input
                type="text"
                placeholder="Golongan"
                {...register('golongan')}
                className={`${errors.golongan ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.golongan && (
                <HelperError>{errors.golongan.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="TMT Pangkat" />
              <Input
                type="date"
                placeholder="TMT Pangkat"
                {...register('tmt_pangkat')}
                className={`${errors.tmt_pangkat ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.tmt_pangkat && (
                <HelperError>{errors.tmt_pangkat.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Jabatan TMT Jabatan */}
        <div className="mb-2">
          {/* <div className="text-primary text-lg font-bold mb-2">Jabatan, TMT Jabatan</div> */}
          <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Jabatan" />
              <Input
                type="text"
                placeholder="Jabatan"
                {...register('jabatan')}
                className={`${errors.jabatan ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.jabatan && (
                <HelperError>{errors.jabatan.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="TMT Jabatan" />
              <Input
                type="date"
                placeholder="TMT Jabatan"
                {...register('tmt_jabatan')}
                className={`${errors.tmt_jabatan ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.tmt_jabatan && (
                <HelperError>{errors.tmt_jabatan.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Diklat Struktural */}
        <div className="mb-5">
          <div className="text-primary text-lg font-bold mb-2">Diklat Struktural</div>
          <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Nama Diklat" />
              <Input
                type="text"
                placeholder="Nama Diklat"
                {...register('nama_diklat')}
                className={`${errors.nama_diklat ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.nama_diklat && (
                <HelperError>{errors.nama_diklat.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Tanggal Diklat" />
              <Input
                type="date"
                placeholder="Tanggal  Diklat"
                {...register('tgl_diklat')}
                className={`${errors.tgl_diklat ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.tgl_diklat && (
                <HelperError>{errors.tgl_diklat.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col w-full">
              <Label className='text-sm mb-1' label="Jam Diklat" />
              <Input
                type="number"
                placeholder="Jam Diklat"
                {...register('total_jam')}
                className={`${errors.total_jam ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.total_jam && (
                <HelperError>{errors.total_jam.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Pendidikan Umum */}
        <div className="">
          <div className="text-primary text-lg font-bold mb-2">Pendidikan Umum</div>
          <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Nama" />
              <Input
                type="text"
                placeholder="Nama"
                {...register('nama_pendidikan')}
                className={`${errors.nama_pendidikan ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.nama_pendidikan && (
                <HelperError>{errors.nama_pendidikan.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Tahun Lulus" />
              <Input
                type="number"
                placeholder="Tahun Lulus"
                {...register('tahun_lulus')}
                className={`${errors.tahun_lulus ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.tahun_lulus && (
                <HelperError>{errors.tahun_lulus.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Jenjang" />
              <Input
                type="text"
                placeholder="Jenjang"
                {...register('jenjang_pendidikan')}
                className={`${errors.jenjang_pendidikan ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.jenjang_pendidikan && (
                <HelperError>{errors.jenjang_pendidikan.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Usia Masa Kerja */}
        <div className="mb-2">
          {/* <div className="text-primary text-lg font-bold mb-2">Bidang Status Aktif</div> */}
          <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Usia" />
              <Input
                type="text"
                placeholder="Usia"
                {...register('usia')}
                className={`${errors.usia ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.usia && (
                <HelperError>{errors.usia.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Masa Kerja" />
              <Input
                type="text"
                placeholder="Masa Kerja"
                {...register('masa_kerja')}
                className={`${errors.masa_kerja ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.masa_kerja && (
                <HelperError>{errors.masa_kerja.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Keterangan */}
        <div className="mb-2">
          <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Keterangan" />
              <Textarea  {...register('keterangan')}
                className={`${errors.keterangan ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.keterangan && (
                <HelperError>{errors.keterangan.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        <div className="mb-10 flex justify-end gap-3">
          <Link href="/kepegawaian/data-pegawai" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
            Batal
          </Link>
          <Button type="submit" variant="primary" size="lg" className="w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
            {loading ? (
              <Loading />
            ) : (
              "Edit"
            )}
          </Button>
        </div>
      </form>
    </>
  )
}

export default EdithPegawaiPage