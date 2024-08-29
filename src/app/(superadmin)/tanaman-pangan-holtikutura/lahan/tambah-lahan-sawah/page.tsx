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
import Link from 'next/link';

const formSchema = z.object({
  kecamatan: z
    .string()
    .min(1, "Please select a kecamatan"),
  desa: z
    .string()
    .min(1, { message: "Desa wajib diisi" }),
  irigasiTeknis: z
    .string()
    .min(1, { message: "Irigasi Teknis wajib diisi" }),
  irigasi1_2Teknis: z
    .string()
    .min(1, { message: "Irigasi 1/2 Teknis wajib diisi" }),
  irigasiDesan: z
    .string()
    .min(1, { message: "Irigasi Desan / Non PU wajib diisi" }),
  pasangSurut: z
    .string()
    .min(1, { message: "Irigasi Pasang Surut wajib diisi" }),
  lebak: z
    .string()
    .min(1, { message: "Lebak wajib diisi" }),
  lainnya: z
    .string()
    .min(1, { message: "Lainnya wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahLahanSawahPage = () => {
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
      <div className="text-primary text-2xl font-bold mb-5">Tambah Data Lahan Sawah</div>
      {/* Nama NIP Tempat Tanggal Lahir */}
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-[70vh] flex flex-col justify-between">
        <div className="wrap-form">
          {/* pilih kecamatan - desa */}
          <div className="mb-2">
            <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                <Select
                  onValueChange={(value) => setValue("kecamatan", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jabung">Jabung</SelectItem>
                    <SelectItem value="Pensiun">Way Jepara</SelectItem>
                  </SelectContent>
                </Select>
                {errors.kecamatan && (
                  <HelperError>{errors.kecamatan.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Pilih Desa" />
                <Select
                  onValueChange={(value) => setValue("desa", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Desa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jabung">Jabung</SelectItem>
                    <SelectItem value="way jepara">Way Jepara</SelectItem>
                  </SelectContent>
                </Select>
                {errors.kecamatan && (
                  <HelperError>{errors.kecamatan.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          {/* irigasi teknis - 1/2 */}
          <div className="mb-2">
            <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Irigasi Teknis" />
                <Input
                  autoFocus
                  type="number"
                  placeholder="Irigasi Teknis"
                  {...register('irigasiTeknis')}
                  className={`${errors.irigasiTeknis ? 'border-red-500' : ''}`}
                />
                {errors.irigasiTeknis && (
                  <HelperError>{errors.irigasiTeknis.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Irigasi 1/2 Teknis" />
                <Input
                  autoFocus
                  type="number"
                  placeholder="Irigasi 1/2 Teknis"
                  {...register('irigasi1_2Teknis')}
                  className={`${errors.irigasi1_2Teknis ? 'border-red-500' : ''}`}
                />
                {errors.irigasi1_2Teknis && (
                  <HelperError>{errors.irigasi1_2Teknis.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          {/* desan - pasang */}
          <div className="mb-2">
            <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Irigasi Desan / Non PU" />
                <Input
                  autoFocus
                  type="number"
                  placeholder="Irigasi Desan / Non PU"
                  {...register('irigasiDesan')}
                  className={`${errors.irigasiDesan ? 'border-red-500' : ''}`}
                />
                {errors.irigasiDesan && (
                  <HelperError>{errors.irigasiDesan.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Pasang Surut" />
                <Input
                  autoFocus
                  type="number"
                  placeholder="Pasang Surut"
                  {...register('pasangSurut')}
                  className={`${errors.pasangSurut ? 'border-red-500' : ''}`}
                />
                {errors.pasangSurut && (
                  <HelperError>{errors.pasangSurut.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          {/* lebak - lainnya */}
          <div className="mb-2">
            <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Lebak" />
                <Input
                  autoFocus
                  type="number"
                  placeholder="Lebak"
                  {...register('lebak')}
                  className={`${errors.lebak ? 'border-red-500' : ''}`}
                />
                {errors.lebak && (
                  <HelperError>{errors.lebak.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Lainnya" />
                <Input
                  autoFocus
                  type="number"
                  placeholder="Lainnya"
                  {...register('lainnya')}
                  className={`${errors.lainnya ? 'border-red-500' : ''}`}
                />
                {errors.lainnya && (
                  <HelperError>{errors.lainnya.message}</HelperError>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Button */}
        <div className="flex justify-end gap-3">
          <Link href="/kepegawaian/data-pegawai" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
            BATAL
          </Link>
          <Button type="submit" variant="primary" size="lg" className="w-[120px]">
            SIMPAN
          </Button>
        </div>
      </form>
    </>
  )
}

export default TambahLahanSawahPage