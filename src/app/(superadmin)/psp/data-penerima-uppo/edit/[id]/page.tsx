"use client"
import Label from '@/components/ui/label'
import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import { useParams } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { watch } from 'fs';

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

const EditDataPenerimaUppo = () => {
    // TES
    interface Kecamatan {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Desa {
        id: number;
        nama: string;
        kecamatanId: number;
        createdAt: string;
        updatedAt: string;
    }

    interface Data {
        id: number;
        kecamatanId: number;
        desaId: number;
        namaPoktan: string;
        ketuaPoktan: string;
        titikKoordinat: string;
        createdAt: string;
        updatedAt: string;
        kecamatan: Kecamatan;
        desa: Desa;
    }

    interface Pagination {
        page: number;
        perPage: number;
        totalPages: number;
        totalCount: number;
        links: {
            prev: string | null;
            next: string | null;
        };
    }

    interface Response {
        status: number;
        message: string;
        data: Data;
    }

    const [date, setDate] = React.useState<Date>()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    // const onSubmit = (data: FormSchemaType) => {
    //     console.log(data);
    //     reset();
    // };
    // Edit
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { id } = params;

    // Get user data
    const { data: dataUser, error } = useSWR<Response>(
        `psp/penerima-uppo/get/${id}`,
        async (url) => {
            try {
                const response = await axiosPrivate.get(url);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                return null;
            }
        },
        {
            // revalidateIfStale: false,
            // revalidateOnFocus: false,
            // revalidateOnReconnect: false
        }
    );

    // Set form values once data is fetched
    useEffect(() => {
        if (dataUser) {
            setValue("kecamatan_id", 1);
            setValue("desa_id", 2);
            setValue("nama_poktan", dataUser.data.namaPoktan);
            setValue("ketua_poktan", dataUser.data.ketuaPoktan);
            setValue("titik_koordinat", dataUser.data.titikKoordinat);
        }
    }, [dataUser, setValue]);

    // Handle form submission
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        try {
            await axiosPrivate.put(`/psp/penerima-uppo/update/${id}`, data); // Update endpoint as necessary
            console.log("Success to update user:", data);
            console.log(data)
            navigate.push('/psp/data-penerima-uppo');
            reset()
        } catch (error) {
            console.error('Failed to update user:', error);
            console.log(data)
        }
        mutate(`/psp/penerima-uppo/get?page=1&limit=10&search&kecamatan&startDate=&endDate`);
    };
    // Edit

    console.log(dataUser);

    return (
        <>
            <div className="text-primary text-2xl font-bold mb-5">Edit Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                            <Select
                                onValueChange={(value) => setValue("kecamatan_id", Number(value))} // Mengubah value menjadi number
                                value={(String(watch("kecamatan_id"))) || ""}
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
                                value={(String(watch("desa_id"))) || ""}
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
                        Edit
                    </Button>
                </div>
            </form>
        </>
    )
}

export default EditDataPenerimaUppo
