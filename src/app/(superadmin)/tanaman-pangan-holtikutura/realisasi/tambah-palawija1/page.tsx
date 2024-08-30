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
    .min(1, { message: "NIP wajib diisi" }),
  tanaman: z
    .string()
    .min(1, { message: "Tanaman wajib diisi" }),
  produktivitas: z
    .string()
    .min(1, { message: "Produktivitas wajib diisi" }),
  panen: z
    .string()
    .min(1, { message: "Panen wajib diisi" }),
  produksi: z
    .string()
    .min(1, { message: "Produksi wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahRealisasiPage = () => {
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
      <div className="text-primary text-xl md:text-2xl font-bold mb-5">Tambah Data Palawija 1</div>
      {/* Nama NIP Tempat Tanggal Lahir */}
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-[70vh] flex flex-col justify-between">
        <div className="wrap-form">
          {/* pilih kecamatan - desa */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                <Select
                  onValueChange={(value) => setValue("kecamatan", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Jabung</SelectItem>
                    <SelectItem value="pensiun">Way Jepara</SelectItem>
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
                    <SelectItem value="aktif">Jabung</SelectItem>
                    <SelectItem value="pensiun">Way Jepara</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {/* pilih tanaman - panen (ha) */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Pilih Tanaman" />
                <Select
                  onValueChange={(value) => setValue("tanaman", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tanaman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select1">Padi</SelectItem>
                    <SelectItem value="select2">Jagung</SelectItem>
                    <SelectItem value="select3">Kacang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Panen (ha)" />
                <Input
                  type="number"
                  placeholder="Panen"
                  {...register('panen')}
                  className={`${errors.panen ? 'border-red-500' : ''}`}
                />
                {errors.panen && (
                  <HelperError>{errors.panen.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          {/* produktivitas - produksi */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Produktivitas (ku/ha)" />
                <Input
                  type="number"
                  placeholder="Produktivitas (ku/ha)"
                  {...register('produktivitas')}
                  className={`${errors.produktivitas ? 'border-red-500' : ''}`}
                />
                {errors.produktivitas && (
                  <HelperError>{errors.produktivitas.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Produksi (ton)" />
                <Input
                  type="number"
                  placeholder="Produksi"
                  {...register('produksi')}
                  className={`${errors.produksi ? 'border-red-500' : ''}`}
                />
                {errors.produksi && (
                  <HelperError>{errors.produksi.message}</HelperError>
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

export default TambahRealisasiPage