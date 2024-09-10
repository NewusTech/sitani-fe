"use client"
import Label from '@/components/ui/label'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import { SWRResponse, mutate } from "swr";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Loading from '@/components/ui/Loading';
import Swal from 'sweetalert2';

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
    jenis_pupuk: z
        .string(),
    kandungan_pupuk: z
        .string(),
    keterangan: z
        .string()
        .min(1, { message: "Keterangan wajib diisi" }),
    harga_pupuk: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Harga pupuk wajib diisi" })),
});

type FormSchemaType = z.infer<typeof formSchema>;

const PupukTambah = () => {
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

    // const onSubmit = (data: FormSchemaType) => {
    //     console.log(data);
    //     reset();
    // };

    // TAMBAH
    const [loading, setLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.post("/psp/pupuk/create", data);
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil ditambahkan!',
                text: 'Data sudah disimpan sistem!',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
                customClass: {
                    title: 'text-2xl font-semibold text-green-600',
                    icon: 'text-green-500 animate-bounce',
                    timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400', // Gradasi warna yang lembut
                },
                backdrop: `rgba(0, 0, 0, 0.4)`,
            });
            // alert
            console.log(data)
            // push
            navigate.push('/psp/pupuk');
            console.log("Success to create user:");
            reset()
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal menambahkan data!';
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan!',
                text: errorMessage,
                showConfirmButton: true,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                customClass: {
                    title: 'text-2xl font-semibold text-red-600',
                    icon: 'text-red-500 animate-bounce',
                },
                backdrop: 'rgba(0, 0, 0, 0.4)',
            });
            console.error("Failed to create user:", error);
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/psp/pupuk/get?page=1&limit=10&search&startDate=&endDate`);
    };
    // TAMBAH

    return (
        <>
            <div className="text-primary text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Jenis Pupuk" />
                            <Input
                                type="text"
                                placeholder="Jenis Pupuk"
                                {...register('jenis_pupuk')}
                                className={`${errors.jenis_pupuk ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.jenis_pupuk && (
                                <HelperError>{errors.jenis_pupuk.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Kandungan Pupuk" />
                            <Input
                                type="text"
                                placeholder="Kandungan Pupuk"
                                {...register('kandungan_pupuk')}
                                className={`${errors.kandungan_pupuk ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.kandungan_pupuk && (
                                <HelperError>{errors.kandungan_pupuk.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Keterangan" />
                            <Select
                                onValueChange={(value) => setValue("keterangan", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Keterangan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Subsidi">Subsidi</SelectItem>
                                    <SelectItem value="Non-Subsidi">Non Subsidi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Harga Pupuk/Kg" />
                            <Input
                                type="number"
                                placeholder="Harga Pupuk/Kg"
                                {...register('harga_pupuk')}
                                className={`${errors.harga_pupuk ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.harga_pupuk && (
                                <HelperError>{errors.harga_pupuk.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/psp/pupuk" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                        {loading ? (
                            <Loading />
                        ) : (
                            "Tambah"
                        )}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default PupukTambah