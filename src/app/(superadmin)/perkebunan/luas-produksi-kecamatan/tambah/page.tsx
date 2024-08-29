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
        .min(1, "Kecamatan wajib diisi"),
    kategoriPanen: z
        .string()
        .min(1, { message: "Kategori wajib diisi" }),
    komoditi: z
        .string()
        .min(1, { message: "Komoditi Teknis wajib diisi" }),
    tbm: z
        .string()
        .min(1, { message: "TBM Teknis wajib diisi" }),
    tm: z
        .string()
        .min(1, { message: "TM wajib diisi" }),
    tr: z
        .string()
        .min(1, { message: "TR Surut wajib diisi" }),
    produksi: z
        .string()
        .min(1, { message: "Produksi wajib diisi" }),
    produktivitas: z
        .string()
        .min(1, { message: "Produktivitas wajib diisi" }),
    jumlahPetani: z
        .string()
        .min(1, { message: "Jumlah Petani Perkebun wajib diisi" }),
    bentukHasil: z
        .string()
        .min(1, { message: "Bentuk Hasil wajib diisi" }),
    keterangan: z
        .string()
        .min(1, { message: "Keterangan wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahKecPage = () => {
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
            <div className="text-primary text-2xl font-bold mb-5">Tambah Data</div>
            {/* Nama NIP Tempat Tanggal Lahir */}
            <form onSubmit={handleSubmit(onSubmit)} className="min-h-[70vh] flex flex-col justify-between">
                <div className="wrap-form">
                    {/* pilih kecamatan - katagori panen */}
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
                                <Label className='text-sm mb-1' label="Pilih Kategori Panen" />
                                <Select
                                    onValueChange={(value) => setValue("kategoriPanen", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Kategori Panen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Tan. Tahunan">Tan. Tahunan</SelectItem>
                                        <SelectItem value="Tan. Semusim">Tan. Semusim</SelectItem>
                                        <SelectItem value="Tan. Rempah">Tan. Rempah</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.kecamatan && (
                                    <HelperError>{errors.kecamatan.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* pilih komoditi */}
                    <div className="mb-2">
                        <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-1/2 pr-3">
                                <Label className='text-sm mb-1' label="Pilih Komiditi" />
                                <Select
                                    onValueChange={(value) => setValue("komoditi", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Komoditi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Aren">Aren</SelectItem>
                                        <SelectItem value="Karet">Karet</SelectItem>
                                        <SelectItem value="Cengkeh">Cengkeh</SelectItem>
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
                            Komposisi Luas Areal
                        </div>
                        {/* tbm - tm */}
                        <div className="mb-2">
                            <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Tanaman Belum Menghasilkan" />
                                    <Input
                                        type="number"
                                        placeholder="Tanaman Belum Menghasilkan"
                                        {...register('tbm')}
                                        className={`${errors.tbm ? 'border-red-500' : ''}`}
                                    />
                                    {errors.tbm && (
                                        <HelperError>{errors.tbm.message}</HelperError>
                                    )}
                                </div>
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Tanaman Menghasilkan" />
                                    <Input
                                        type="number"
                                        placeholder="Tanaman Menghasilkan"
                                        {...register('tm')}
                                        className={`${errors.tm ? 'border-red-500' : ''}`}
                                    />
                                    {errors.tm && (
                                        <HelperError>{errors.tm.message}</HelperError>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* tr */}
                        <div className="mb-2">
                            <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                                <div className="flex flex-col mb-2 w-1/2 pr-3">
                                    <Label className='text-sm mb-1' label="Tanaman Rusak" />
                                    <Input
                                        type="number"
                                        placeholder="Tanaman Rusak"
                                        {...register('tr')}
                                        className={`${errors.tr ? 'border-red-500' : ''}`}
                                    />
                                    {errors.tr && (
                                        <HelperError>{errors.tr.message}</HelperError>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* produksi - produktivitas */}
                        <div className="mb-2 mt-4">
                            <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Produksi (TON)" />
                                    <Input
                                        type="number"
                                        placeholder="Produksi (TON)"
                                        {...register('produksi')}
                                        className={`${errors.produksi ? 'border-red-500' : ''}`}
                                    />
                                    {errors.produksi && (
                                        <HelperError>{errors.produksi.message}</HelperError>
                                    )}
                                </div>
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Produktivitas (Kg/Ha)" />
                                    <Input
                                        type="number"
                                        placeholder="Produktivitas (Kg/Ha)"
                                        {...register('produktivitas')}
                                        className={`${errors.produktivitas ? 'border-red-500' : ''}`}
                                    />
                                    {errors.produktivitas && (
                                        <HelperError>{errors.produktivitas.message}</HelperError>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* jumlah petani - bentuk hasil */}
                        <div className="mb-2">
                            <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Jumlah Petani Perkebun" />
                                    <Input
                                        type="number"
                                        placeholder="Jumlah Petani Perkebun"
                                        {...register('jumlahPetani')}
                                        className={`${errors.jumlahPetani ? 'border-red-500' : ''}`}
                                    />
                                    {errors.jumlahPetani && (
                                        <HelperError>{errors.jumlahPetani.message}</HelperError>
                                    )}
                                </div>
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Bentuk Hasil" />
                                    <Input
                                        type="number"
                                        placeholder="Bentuk Hasil"
                                        {...register('bentukHasil')}
                                        className={`${errors.bentukHasil ? 'border-red-500' : ''}`}
                                    />
                                    {errors.bentukHasil && (
                                        <HelperError>{errors.bentukHasil.message}</HelperError>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* keterangan */}
                        <div className="mb-2">
                            <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                                <div className="flex flex-col mb-2 w-1/2 pr-3">
                                    <Label className='text-sm mb-1' label="Keterangan" />
                                    <Input
                                        type="number"
                                        placeholder="Keterangan"
                                        {...register('keterangan')}
                                        className={`${errors.keterangan ? 'border-red-500' : ''}`}
                                    />
                                    {errors.keterangan && (
                                        <HelperError>{errors.keterangan.message}</HelperError>
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

export default TambahKecPage