"use client"
import Label from '@/components/ui/label'
import React from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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

const formSchema = z.object({
    kecamatan_id: z
        .number()
        .min(1, { message: "Kecamatan wajib diisi" }), 
    desa_id: z
        .number()
        .min(1, { message: "Desa wajib diisi" }), 
    nama_poktan: z
        .string()
        .min(1, { message: "Nama Poktan wajib diisi" }),
    ketua_poktan: z
        .string()
        .min(1, { message: "Nama Ketua wajib diisi" }),
    titik_koordinat: z
        .string()
        .min(1, { message: "Titik Koordinat wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahDataPenerimaUppo = () => {
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
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        try {
            await axiosPrivate.post("/psp/penerima-uppo/create", data);
            console.log(data)
            // push
            navigate.push('/psp/data-penerima-uppo');
            console.log("Success to create user:");
            reset()
        } catch (e: any) {
            console.log(data)
            console.log("Failed to create user:");
            return;
        }
        mutate(`/psp/penerima-uppo/get?page=1&limit=10&search&kecamatan&startDate=&endDate`);
    };

    // TAMBAH

    return (
        <>
            <div className="text-primary text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                            <Select
                                onValueChange={(value) => setValue("kecamatan_id", Number(value))} // Mengubah value menjadi number
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Kecamatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Kecamatan 1</SelectItem> {/* Ubah value menjadi angka */}
                                    <SelectItem value="2">Kecamatan 2</SelectItem> {/* Ubah value menjadi angka */}
                                    <SelectItem value="3">Kecamatan 3</SelectItem> {/* Ubah value menjadi angka */}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Desa" />
                            <Select
                                onValueChange={(value) => setValue("desa_id", Number(value))} // Mengubah value menjadi number
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Desa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Desa 1</SelectItem> {/* Ubah value menjadi angka */}
                                    <SelectItem value="2">Desa 2</SelectItem> {/* Ubah value menjadi angka */}
                                    <SelectItem value="3">Desa 3</SelectItem> {/* Ubah value menjadi angka */}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Nama Poktan" />
                            <Input
                                type="text"
                                placeholder="Pilih Nama Poktan"
                                {...register('nama_poktan')}
                                className={`${errors.nama_poktan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.nama_poktan && (
                                <HelperError>{errors.nama_poktan.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Nama Ketua" />
                            <Input
                                type="text"
                                placeholder="Nama Ketua"
                                {...register('ketua_poktan')}
                                className={`${errors.ketua_poktan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.ketua_poktan && (
                                <HelperError>{errors.ketua_poktan.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-1/2">
                            <Label className='text-sm mb-1' label="Titik Koordinat" />
                            <Input
                                type="number"
                                placeholder="Pilih Titik Koordinat"
                                {...register('titik_koordinat')}
                                className={`${errors.titik_koordinat ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.titik_koordinat && (
                                <HelperError>{errors.titik_koordinat.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/psp/data-penerima-uppo" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
                        Simpan
                    </Button>
                </div>
            </form>
        </>
    )
}

export default TambahDataPenerimaUppo
