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
  tegalKebun: z
    .string()
    .min(1, { message: "Tegal / Kebun Teknis wajib diisi" }),
  ladangHuma: z
    .string()
    .min(1, { message: "Ladang / Huma Teknis wajib diisi" }),
  hutanRakyat: z
    .string()
    .min(1, { message: "Hutan Rakyat Desan / Non PU wajib diisi" }),
  padangRumput: z
    .string()
    .min(1, { message: "Padang Penggembalaan Rumput Surut wajib diisi" }),
  hutanNegara: z
    .string()
    .min(1, { message: "Hutan Negara wajib diisi" }),
  lainnya: z
    .string()
    .min(1, { message: "Lainnya wajib diisi" }),
  jalan: z
    .string()
    .min(1, { message: "Jalan wajib diisi" }),
  pemukiman: z
    .string()
    .min(1, { message: "Pemukiman wajib diisi" }),
  perkantoran: z
    .string()
    .min(1, { message: "Perkantoran wajib diisi" }),
  sungai: z
    .string()
    .min(1, { message: "Sungai wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahBukanSawahPage = () => {
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
      <div className="text-primary text-2xl font-bold mb-5">Tambah Data Lahan Bukan Sawah</div>
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
          <div className="wrap">
            <div className="text-primary text-xl font-bold my-2">
              Lahan Bukan Sawah
            </div>
            {/* irigasi teknis - 1/2 */}
            <div className="mb-2">
              <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Tegal / Kebun" />
                  <Input
                    autoFocus
                    type="number"
                    placeholder="Tegal / Kebun"
                    {...register('tegalKebun')}
                    className={`${errors.tegalKebun ? 'border-red-500' : ''}`}
                  />
                  {errors.tegalKebun && (
                    <HelperError>{errors.tegalKebun.message}</HelperError>
                  )}
                </div>
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Ladang / Huma" />
                  <Input
                    autoFocus
                    type="number"
                    placeholder="Ladang / Huma"
                    {...register('ladangHuma')}
                    className={`${errors.ladangHuma ? 'border-red-500' : ''}`}
                  />
                  {errors.ladangHuma && (
                    <HelperError>{errors.ladangHuma.message}</HelperError>
                  )}
                </div>
              </div>
            </div>
            {/* desan - pasang */}
            <div className="mb-2">
              <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Hutan Rakyat" />
                  <Input
                    autoFocus
                    type="number"
                    placeholder="Hutan Rakyat"
                    {...register('hutanRakyat')}
                    className={`${errors.hutanRakyat ? 'border-red-500' : ''}`}
                  />
                  {errors.hutanRakyat && (
                    <HelperError>{errors.hutanRakyat.message}</HelperError>
                  )}
                </div>
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Padang Penggembalaan Rumput" />
                  <Input
                    autoFocus
                    type="number"
                    placeholder="Padang Penggembalaan Rumput"
                    {...register('padangRumput')}
                    className={`${errors.padangRumput ? 'border-red-500' : ''}`}
                  />
                  {errors.padangRumput && (
                    <HelperError>{errors.padangRumput.message}</HelperError>
                  )}
                </div>
              </div>
            </div>
            {/* lebak - lainnya */}
            <div className="mb-2">
              <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Hutan Negara" />
                  <Input
                    autoFocus
                    type="number"
                    placeholder="Hutan Negara"
                    {...register('hutanNegara')}
                    className={`${errors.hutanNegara ? 'border-red-500' : ''}`}
                  />
                  {errors.hutanNegara && (
                    <HelperError>{errors.hutanNegara.message}</HelperError>
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
          {/*  */}
          <div className="wrap">
            <div className="text-primary text-xl font-bold my-2">
              Lahan Bukan Pertanian
            </div>
            {/* irigasi teknis - 1/2 */}
            <div className="mb-2">
              <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Jalan" />
                  <Input
                    autoFocus
                    type="number"
                    placeholder="Jalan"
                    {...register('jalan')}
                    className={`${errors.jalan ? 'border-red-500' : ''}`}
                  />
                  {errors.jalan && (
                    <HelperError>{errors.jalan.message}</HelperError>
                  )}
                </div>
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Pemukiman" />
                  <Input
                    autoFocus
                    type="number"
                    placeholder="Pemukiman"
                    {...register('pemukiman')}
                    className={`${errors.pemukiman ? 'border-red-500' : ''}`}
                  />
                  {errors.pemukiman && (
                    <HelperError>{errors.pemukiman.message}</HelperError>
                  )}
                </div>
              </div>
            </div>
            {/* desan - pasang */}
            <div className="mb-2">
              <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Perkantoran" />
                  <Input
                    autoFocus
                    type="number"
                    placeholder="Perkantoran"
                    {...register('perkantoran')}
                    className={`${errors.perkantoran ? 'border-red-500' : ''}`}
                  />
                  {errors.perkantoran && (
                    <HelperError>{errors.perkantoran.message}</HelperError>
                  )}
                </div>
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Sungai" />
                  <Input
                    autoFocus
                    type="number"
                    placeholder="Sungai"
                    {...register('sungai')}
                    className={`${errors.sungai ? 'border-red-500' : ''}`}
                  />
                  {errors.sungai && (
                    <HelperError>{errors.sungai.message}</HelperError>
                  )}
                </div>
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

export default TambahBukanSawahPage