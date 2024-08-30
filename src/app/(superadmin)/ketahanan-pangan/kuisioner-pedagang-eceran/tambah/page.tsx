"use client"
import Label from '@/components/ui/label'
import React from 'react'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
    komoditas: z
        .string()
        .min(1, { message: "Komoditas wajib diisi" }),
    bulan: z
        .string()
        .min(1, { message: "Bulan wajib diisi" }),
    pilihMinggu: z
        .string()
        .min(1, { message: "Mingguwajib diisi" }),
    harga: z
        .string()
        .min(1, { message: "Harga wajib diisi" }),

});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahKuisionerPedagangEceran = () => {
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
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Komoditas" />
                            <Input
                                type="text"
                                placeholder="Komoditas"
                                {...register('komoditas')}
                                className={`${errors.komoditas ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.komoditas && (
                                <HelperError>{errors.komoditas.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Bulan" />
                            <Select
                                onValueChange={(value) => setValue("bulan", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="select1">Select1</SelectItem>
                                    <SelectItem value="select2">Select2</SelectItem>
                                    <SelectItem value="select3">Select3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Minggu" />
                            <Select
                                onValueChange={(value) => setValue("pilihMinggu", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="select1">Select1</SelectItem>
                                    <SelectItem value="select2">Select2</SelectItem>
                                    <SelectItem value="select3">Select3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Harga" />
                            <Input
                                type="number"
                                placeholder="Masukkan Harga"
                                {...register('harga')}
                                className={`${errors.harga ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.harga && (
                                <HelperError>{errors.harga.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 mt-3 flex justify-end gap-3">
                    <Link href="/ketahanan-pangan/produsen-dan-eceran" className='bg-white w-[120px] text-sm md:text-base  rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium flex justify-center items-center'>
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

export default TambahKuisionerPedagangEceran