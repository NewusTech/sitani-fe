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
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
    kecamatan: z
        .string(),
    desa: z
        .string(),
    jenisBantuan: z
        .string()
        .min(1, { message: "Nama wajib diisi" }),
    periodePenerimaan: z
        .string()
        .min(1, { message: "Periode Penerimaan wajib diisi" }),
    keterangan: z
        .string()
        .min(1, { message: "Keterangan wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const BantuanTambah = () => {
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
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Kecamatan" />
                            <Select
                                onValueChange={(value) => setValue("kecamatan", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Kecamatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="select1">Select1</SelectItem>
                                    <SelectItem value="select2">Select2</SelectItem>
                                    <SelectItem value="select3">Select3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Desa" />
                            <Select
                                onValueChange={(value) => setValue("desa", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Desa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="select1">Select1</SelectItem>
                                    <SelectItem value="select2">Select2</SelectItem>
                                    <SelectItem value="select3">Select3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Jenis Bantuan" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Jenis Bantuan"
                                {...register('jenisBantuan')}
                                className={`${errors.jenisBantuan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.jenisBantuan && (
                                <HelperError>{errors.jenisBantuan.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Periode Penerimaan" />
                            <Input
                                autoFocus
                                type="date"
                                placeholder="Periode Penerimaan"
                                {...register('periodePenerimaan')}
                                className={`${errors.periodePenerimaan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.periodePenerimaan && (
                                <HelperError>{errors.periodePenerimaan.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
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
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
                        SIMPAN
                    </Button>
                    <Link href="/penyuluhan/data-kabupaten" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                        BATAL
                    </Link>
                </div>
            </form>
        </>
    )
}

export default BantuanTambah