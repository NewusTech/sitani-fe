"use client"
import Label from '@/components/ui/label'
import React from 'react'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Textarea } from "@/components/ui/textarea"

const OPTIONS: Option[] = [
    { label: 'nextjs', value: 'nextjs' },
    { label: 'React', value: 'react' },
    { label: 'Remix', value: 'remix' },
    { label: 'Vite', value: 'vite' },
    { label: 'Nuxt', value: 'nuxt' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Angular', value: 'angular' },
    { label: 'Ember', value: 'ember', disable: true },
    { label: 'Gatsby', value: 'gatsby', disable: true },
    { label: 'Astro', value: 'astro' },
];

const formSchema = z.object({
    namaKecamatan: z
        .array(z.string())
        .min(1, { message: "Wilayah Desa Binaan wajib diisi" }).optional(),
    namaPenyuluh: z
        .string()
        .min(1, { message: "Nama wajib diisi" }),
    nip: z
        .string()
        .min(1, { message: "NIP wajib diisi" }),
    pangkat: z
        .string()
        .min(1, { message: "Pangkat wajib diisi" }),
    golongan: z
        .string()
        .min(1, { message: "Golongan wajib diisi" }),
    keterangan: z
        .string()
        .min(1, { message: "Keterangan wajib diisi" })
});

type FormSchemaType = z.infer<typeof formSchema>;

const PenyuluhanTambahDataKabupaten = () => {
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

    const handleSelectorChange = (selectedOptions: Option[]) => {
        setValue('namaKecamatan', selectedOptions.map(option => option.value));
    };

    const onSubmit = (data: FormSchemaType) => {
        console.log(data);
        reset();
    };

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Wilayah Desa Binaan (Kecamatan)" />
                            <MultipleSelector
                                className={`w-[98%] justify-between flex h-10 items-center rounded-full border border-primary bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${errors.namaKecamatan ? 'border-red-500' : ''}`}
                                defaultOptions={OPTIONS}
                                placeholder="Cari Kecamatan"
                                onChange={handleSelectorChange}
                                emptyIndicator={
                                    <p className="text-center text-lg leading-10 text-gray-600">
                                        Tidak ada data.
                                    </p>
                                }
                            />
                            {errors.namaKecamatan && (
                                <HelperError>{errors.namaKecamatan.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Nama" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Nama"
                                {...register('namaPenyuluh')}
                                className={`${errors.namaPenyuluh ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.namaPenyuluh && (
                                <HelperError>{errors.namaPenyuluh.message}</HelperError>
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
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pangkat" />
                            <Input
                                autoFocus
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
                                autoFocus
                                type="text"
                                placeholder="Golongan"
                                {...register('golongan')}
                                className={`${errors.golongan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.golongan && (
                                <HelperError>{errors.golongan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

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
                    <Link href="/penyuluhan/data-kabupaten" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
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

export default PenyuluhanTambahDataKabupaten