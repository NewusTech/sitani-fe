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

const formSchema = z.object({
    dagingSapi: z
        .string()
        .min(1, { message: "Daging Sapi wajib diisi" }),
    dagingAyam: z
        .string()
        .min(1, { message: "Daging Ayam wajib diisi" }),
    telurAyam: z
        .string()
        .min(1, { message: "Telur Ayam wajib diisi" })
});

type FormSchemaType = z.infer<typeof formSchema>;

const TamabahPenyuluhDataKecamatan = () => {
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
                            <Label className='text-sm mb-1' label="Daging Sapi Tingkat Pemotong / RPH" />
                            <Input
                                type="number"
                                placeholder="Daging Sapi Tingkat Pemotong / RPH"
                                {...register('dagingSapi')}
                                className={`${errors.dagingSapi ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.dagingSapi && (
                                <HelperError>{errors.dagingSapi.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Daging Ayam Ras" />
                            <Input
                                type="number"
                                placeholder="Masukkan Daging Ayam Ras"
                                {...register('dagingAyam')}
                                className={`${errors.dagingAyam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.dagingAyam && (
                                <HelperError>{errors.dagingAyam.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Telur Ayam Ras" />
                            <Input
                                type="number"
                                placeholder="Masukkan Telur Ayam Ras"
                                {...register('telurAyam')}
                                className={`${errors.telurAyam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.telurAyam && (
                                <HelperError>{errors.telurAyam.message}</HelperError>
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

export default TamabahPenyuluhDataKecamatan