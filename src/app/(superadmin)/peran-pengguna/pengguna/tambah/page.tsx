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
    peran: z
        .string()
        .min(1, { message: "Peran wajib diisi" }),
    bidang: z
        .string()
        .min(1, { message: "Harga wajib diisi" }),
    email: z
        .string()
        .min(1, { message: "Email wajib diisi" }),
    password: z
        .string()
        .min(6, { message: "Password minimal 6 karakter" }),
    nama: z
        .string()
        .min(1, { message: "Nama wajib diisi" }),
    nip: z
        .string()
        .min(1, { message: "NIP wajib diisi" }),
    pangkat: z
        .string()
        .min(1, { message: "Pangkat wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahPengguna = () => {
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
            <div className="text-primary text-xl md:text-2xl font-bold mb-3 md:mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="wrap-form flex-col gap-2">
                    {/* pilih peran - katagori bidang */}
                    <div className="mb-2">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Pilih Peran" />
                                <Select
                                    onValueChange={(value) => setValue("peran", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Peran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="kepala-bidang">Kepala Bidang</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.peran && (
                                    <HelperError>{errors.peran.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Pilih Bidang" />
                                <Select
                                    onValueChange={(value) => setValue("bidang", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Bidang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ketanan Pangan">Ketahanan Pangan</SelectItem>
                                        <SelectItem value="Kepegawaian">Kepegawaian</SelectItem>
                                        <SelectItem value="Perkebunan">Perkebunan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.bidang && (
                                    <HelperError>{errors.bidang.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Email" />
                                <Input
                                    type="text"
                                    placeholder="Masukkan Email"
                                    {...register('email')}
                                    className={`${errors.email ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.email && (
                                    <HelperError>{errors.email.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Password" />
                                <Input
                                    type="password"
                                    placeholder="Masukkan Password"
                                    {...register('password')}
                                    className={`${errors.password ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.password && (
                                    <HelperError>{errors.password.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Nama" />
                                <Input
                                    type="text"
                                    placeholder="Masukkan Nama"
                                    {...register('nama')}
                                    className={`${errors.nama ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.nama && (
                                    <HelperError>{errors.nama.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="NIP" />
                                <Input
                                    type="number"
                                    placeholder="Masukkan NIP"
                                    {...register('nip')}
                                    className={`${errors.nip ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.nip && (
                                    <HelperError>{errors.nip.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 md:w-1/2 md:pr-3 w-full">
                                <Label className='text-sm mb-1' label="Pangkat" />
                                <Input
                                    type="text"
                                    placeholder="Masukkan Pangkat"
                                    {...register('pangkat')}
                                    className={`${errors.pangkat ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.pangkat && (
                                    <HelperError>{errors.pangkat.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-10 mt-3 flex justify-end gap-3">
                    <Link href="/peran-pengguna/pengguna" className='bg-white w-[120px] text-sm md:text-base  rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium flex justify-center items-center'>
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

export default TambahPengguna