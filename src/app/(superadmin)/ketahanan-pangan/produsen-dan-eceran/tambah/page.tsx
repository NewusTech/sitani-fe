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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
    komoditas: z
        .string()
        .min(1, { message: "Komoditas wajib diisi" }).optional(),
    harga: z
        .string()
        .min(1, { message: "Harga wajib diisi" }).optional(),
    keterangan: z
        .string()
        .min(1, { message: "Keterangan wajib diisi" })
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
            <div className="text-primary text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Komoditas" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Masukkan Komoditas"
                                {...register('komoditas')}
                                className={`${errors.komoditas ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.komoditas && (
                                <HelperError>{errors.komoditas.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Harga Komoditas ( Rp / Kg)" />
                            <Input
                                autoFocus
                                type="number"
                                placeholder="Masukkan Harga Komoditas ( Rp / Kg)"
                                {...register('harga')}
                                className={`${errors.harga ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.harga && (
                                <HelperError>{errors.harga.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
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
                    <Link href="/ketahanan-pangan/produsen-dan-eceran" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                        BATAL
                    </Link>
                </div>
            </form>
        </>
    )
}

export default TamabahPenyuluhDataKecamatan