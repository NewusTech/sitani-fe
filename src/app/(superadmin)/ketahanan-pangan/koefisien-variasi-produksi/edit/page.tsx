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
    panen: z
        .string()
        .min(1, { message: "Panen wajib diisi" }),
    gkpTkPetani: z
        .string()
        .min(1, { message: "GKP Tk. Petani wajib diisi" }),
    gkpTkPenggilingan: z
        .string()
        .min(1, { message: "GKP Tk. Penggilingan wajib diisi" }),
    gkgTkPenggilingan: z
        .string()
        .min(1, { message: "GKG Tk. Penggilingan wajib diisi" }),
    jpk: z
        .string()
        .min(1, { message: "JPK wajib diisi" }),
    cabaiMerahKeriting: z
        .string()
        .min(1, { message: "Cabai Merah Keriting wajib diisi" }),
    berasMedium: z
        .string()
        .min(1, { message: "Beras Medium wajib diisi" }),
    berasPremium: z
        .string()
        .min(1, { message: "Beras Premium wajib diisi" }),
    stokGkg: z
        .string()
        .min(1, { message: "Stok GKG wajib diisi" }),
    stokBeras: z
        .string()
        .min(1, { message: "Stok Beras wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const EditKoefisienVariasiProduksi = () => {
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
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen (%)" />
                            <Input
                                type="number"
                                placeholder="Panen (%)"
                                {...register('panen')}
                                className={`${errors.panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.panen && (
                                <HelperError>{errors.panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="GKP Tk.Petani" />
                            <Input
                                type="number"
                                placeholder="Masukkan GKP Tk.Petani"
                                {...register('gkpTkPetani')}
                                className={`${errors.gkpTkPetani ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.gkpTkPetani && (
                                <HelperError>{errors.gkpTkPetani.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="GKP Tk. Penggilingan" />
                            <Input
                                type="number"
                                placeholder="Masukkan GKP Tk. Penggilingan"
                                {...register('gkpTkPenggilingan')}
                                className={`${errors.gkpTkPenggilingan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.gkpTkPenggilingan && (
                                <HelperError>{errors.gkpTkPenggilingan.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="GKG Tk. Penggilingan" />
                            <Input
                                type="number"
                                placeholder="Masukkan GKG Tk. Penggilingan"
                                {...register('gkgTkPenggilingan')}
                                className={`${errors.gkgTkPenggilingan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.gkgTkPenggilingan && (
                                <HelperError>{errors.gkgTkPenggilingan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="JPK" />
                            <Input
                                type="number"
                                placeholder="Masukkan JPK"
                                {...register('jpk')}
                                className={`${errors.jpk ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.jpk && (
                                <HelperError>{errors.jpk.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Cabai Merah Keriting" />
                            <Input
                                type="number"
                                placeholder="Masukkan Cabai Merah Keriting"
                                {...register('cabaiMerahKeriting')}
                                className={`${errors.cabaiMerahKeriting ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.cabaiMerahKeriting && (
                                <HelperError>{errors.cabaiMerahKeriting.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Beras Medium" />
                            <Input
                                type="number"
                                placeholder="Masukkan Beras Medium"
                                {...register('berasMedium')}
                                className={`${errors.berasMedium ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.berasMedium && (
                                <HelperError>{errors.berasMedium.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Beras Premium" />
                            <Input
                                type="number"
                                placeholder="Masukkan Beras Premium"
                                {...register('berasPremium')}
                                className={`${errors.berasPremium ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.berasPremium && (
                                <HelperError>{errors.berasPremium.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Stok GKG" />
                            <Input
                                type="number"
                                placeholder="Masukkan Stok GKG"
                                {...register('stokGkg')}
                                className={`${errors.stokGkg ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.stokGkg && (
                                <HelperError>{errors.stokGkg.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Stok Beras" />
                            <Input
                                type="number"
                                placeholder="Masukkan Stok Beras"
                                {...register('stokBeras')}
                                className={`${errors.stokBeras ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.stokBeras && (
                                <HelperError>{errors.stokBeras.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-10 mt-3 flex justify-end gap-3">
                    <Link href="/ketahanan-pangan/koefisien-variasi-produksi" className='bg-white w-[120px] text-sm md:text-base  rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium flex justify-center items-center'>
                        BATAL
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
                        Edit
                    </Button>
                </div>
            </form>
        </>
    )
}

export default EditKoefisienVariasiProduksi