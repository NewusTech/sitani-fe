"use client"
import Label from '@/components/ui/label'
import React from 'react'
import { Input } from '@/components/ui/input'

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" }),
  nip: z
    .string()
    .min(1, { message: "NIP wajib diisi" }),
  tempatLahir: z
    .string()
    .min(1, { message: "Tempat Lahir wajib diisi" }),
  tanggalLahir: z
    .string()
    .min(1, { message: "Tanggal Lahir wajib diisi" }),
  pangkatGolRuang: z
    .string()
    .min(1, { message: "Pangkat/Gol Ruang wajib diisi" }),
  tmtPangkat: z
    .string()
    .min(1, { message: "TMT Pangkat wajib diisi" }),
  jabatan: z
    .string()
    .min(1, { message: "Jabatan wajib diisi" }),
  tmtJabatan: z
    .string()
    .min(1, { message: "TMT Jabatan wajib diisi" }),
  bidang: z
    .string(),
  statusAktifPensiun: z
    .string(),
  usia: z
    .string()
    .min(1, { message: "Usia wajib diisi" }),
  masaKerja: z
    .string()
    .min(1, { message: "Masa Kerja wajib diisi" }),
  keterangan: z
    .string()
    .min(1, { message: "Keterangan wajib diisi" }),
  namaPendidikanUmum: z
    .string()
    .min(1, { message: "Nama wajib diisi" }),
  tahunLulusPendidikanUmum: z
    .string()
    .min(1, { message: "Tahun Lulus wajib diisi" }),
  jenjangPendidikanUmum: z
    .string()
    .min(1, { message: "Jenjang wajib diisi" }),
  namaDiklat: z
    .string()
    .min(1, { message: "Nama Diklat wajib diisi" }),
  tanggalDiklat: z
    .string()
    .min(1, { message: "Tanggal Diklat wajib diisi" }),
  jamDiklat: z
    .string()
    .min(1, { message: "Jam Diklat wajib diisi" })
});

type FormSchemaType = z.infer<typeof formSchema>;

const TamabahPegawaiPage = () => {
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

  const onSubmit = (data: FormSchemaType) => {
    console.log(data);
    reset();
  };
  return (
    <>
      <div className="text-primary text-2xl font-bold mb-5">Tambah Data Pegawai</div>
      {/* Nama NIP Tempat Tanggal Lahir */}
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="mb-2">
          {/* <div className="text-primary text-lg font-bold mb-2">Nama, NIP, Tempat, Tanggal Lahir</div> */}
          <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Nama Lengkap" />
              <Input
                autoFocus
                type="text"
                placeholder="Nama Lengkap"
                {...register('name')}
                className={`${errors.name ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.name && (
                <HelperError>{errors.name.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="NIP" />
              <Input
                autoFocus
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
          <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Tempat Lahir" />
              <Input
                autoFocus
                type="text"
                placeholder="Tempat Lahir"
                {...register('tempatLahir')}
                className={`${errors.tempatLahir ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.tempatLahir && (
                <HelperError>{errors.tempatLahir.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Tanggal Lahir" />
              <Input
                autoFocus
                type="date"
                placeholder="Tanggal Lahir"
                {...register('tanggalLahir')}
                className={`${errors.tanggalLahir ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.tanggalLahir && (
                <HelperError>{errors.tanggalLahir.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Pangkat/Gol Ruang Tmt Pangkat */}
        <div className="mb-2">
          {/* <div className="text-primary text-lg font-bold mb-2">Pangkat / Gol, Ruang, TMT Pangkat</div> */}
          <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Pangkat / Gol Ruang " />
              <Input
                autoFocus
                type="text"
                placeholder="Pangkat Gol / Ruang"
                {...register('pangkatGolRuang')}
                className={`${errors.pangkatGolRuang ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.pangkatGolRuang && (
                <HelperError>{errors.pangkatGolRuang.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="TMT Pangkat" />
              <Input
                autoFocus
                type="date"
                placeholder="TMT Pangkat"
                {...register('tmtPangkat')}
                className={`${errors.tmtPangkat ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.tmtPangkat && (
                <HelperError>{errors.tmtPangkat.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Jabatan TMT Jabatan */}
        <div className="mb-2">
          {/* <div className="text-primary text-lg font-bold mb-2">Jabatan, TMT Jabatan</div> */}
          <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Jabatan" />
              <Input
                autoFocus
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
                autoFocus
                type="date"
                placeholder="TMT Jabatan"
                {...register('tmtJabatan')}
                className={`${errors.tmtJabatan ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.tmtJabatan && (
                <HelperError>{errors.tmtJabatan.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Bidang Status Aktif */}
        <div className="mb-2">
          {/* <div className="text-primary text-lg font-bold mb-2">Bidang Status Aktif</div> */}
          <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Bidang" />
              <Select
                onValueChange={(value) => setValue("bidang", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Bidang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select1">Select1</SelectItem>
                  <SelectItem value="select2">Select2</SelectItem>
                  <SelectItem value="select3">Select3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Status Aktif / Pensiunan" />
              <Select 
              onValueChange={(value) => setValue("statusAktifPensiun", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status Aktif / Pensiunan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="pensiun">Pensiun</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Usia */}
        <div className="mb-2">
          {/* <div className="text-primary text-lg font-bold mb-2">Usia</div> */}
          <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Usia" />
              <Input
                autoFocus
                type="text"
                placeholder="Usia"
                {...register('usia')}
                className={`${errors.usia ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.usia && (
                <HelperError>{errors.usia.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Masa Kerja */}
        <div className="mb-2">
          {/* <div className="text-primary text-lg font-bold mb-2">Masa Kerja</div> */}
          <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Masa Kerja" />
              <Input
                autoFocus
                type="text"
                placeholder="Masa Kerja"
                {...register('masaKerja')}
                className={`${errors.masaKerja ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.masaKerja && (
                <HelperError>{errors.masaKerja.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Keterangan */}
        <div className="mb-2">
          {/* <div className="text-primary text-lg font-bold mb-2">Keterangan</div> */}
          <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Keterangan" />
              <Input
                autoFocus
                type="name"
                placeholder="Keterangan"
                {...register('keterangan')}
                className={`${errors.keterangan ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.keterangan && (
                <HelperError>{errors.keterangan.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Pendidikan Umum */}
        <div className="mb-2">
          <div className="text-primary text-lg font-bold mb-2">Pendidikan Umum</div>
          <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Nama" />
              <Input
                autoFocus
                type="text"
                placeholder="Nama"
                {...register('namaPendidikanUmum')}
                className={`${errors.namaPendidikanUmum ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.namaPendidikanUmum && (
                <HelperError>{errors.namaPendidikanUmum.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Tahun Lulus" />
              <Input
                autoFocus
                type="date"
                placeholder="Tahun Lulus"
                {...register('tahunLulusPendidikanUmum')}
                className={`${errors.tahunLulusPendidikanUmum ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.tahunLulusPendidikanUmum && (
                <HelperError>{errors.tahunLulusPendidikanUmum.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Jenjang" />
              <Input
                autoFocus
                type="text"
                placeholder="Jenjang"
                {...register('jenjangPendidikanUmum')}
                className={`${errors.jenjangPendidikanUmum ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.jenjangPendidikanUmum && (
                <HelperError>{errors.jenjangPendidikanUmum.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        {/* Diklat Struktural */}
        <div className="mb-10">
          <div className="text-primary text-lg font-bold mb-2">Diklat Struktural</div>
          <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Nama Diklat" />
              <Input
                autoFocus
                type="text"
                placeholder="Nama Diklat"
                {...register('namaDiklat')}
                className={`${errors.namaDiklat ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.namaDiklat && (
                <HelperError>{errors.namaDiklat.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Tanggal Diklat" />
              <Input
                autoFocus
                type="date"
                placeholder="Tanggal  Diklat"
                {...register('tanggalDiklat')}
                className={`${errors.tanggalDiklat ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.tanggalDiklat && (
                <HelperError>{errors.tanggalDiklat.message}</HelperError>
              )}
            </div>
            <div className="flex flex-col mb-2 w-full">
              <Label className='text-sm mb-1' label="Jam Diklat" />
              <Input
                autoFocus
                type="time"
                placeholder="Jam Diklat"
                {...register('jamDiklat')}
                className={`${errors.jamDiklat ? 'border-red-500' : 'py-5 text-sm'}`}
              />
              {errors.jamDiklat && (
                <HelperError>{errors.jamDiklat.message}</HelperError>
              )}
            </div>
          </div>
        </div>

        <div className="mb-10 text-center">
          <Button type="submit" variant="primary" size="lg" className="w-[40%]">
            Tambah
          </Button>
        </div>
      </form>
    </>
  )
}

export default TamabahPegawaiPage