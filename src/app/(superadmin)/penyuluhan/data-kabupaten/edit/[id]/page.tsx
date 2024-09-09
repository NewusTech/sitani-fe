"use client";
import Label from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import { mutate } from 'swr';
import Loading from '@/components/ui/Loading';
import Swal from 'sweetalert2';
import useSWR from 'swr';
import useLocalStorage from '@/hooks/useLocalStorage';
import SelectMultipleKecamatan from '@/components/superadmin/KecamatanMultiple';

const formSchema = z.object({
    kecamatan_list: z
        .array(z.preprocess(val => Number(val), z.number()))
        .min(0, { message: "Wilayah Desa Binaan wajib diisi" })
        .optional(),
    nama: z.string().min(0, { message: "Nama wajib diisi" }),
    nip: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "NIP wajib diisi" })),
    pangkat: z.string().min(0, { message: "Pangkat wajib diisi" }),
    golongan: z.string().min(0, { message: "Golongan wajib diisi" }),
    keterangan: z.string().min(0, { message: "Keterangan wajib diisi" })
});

type FormSchemaType = z.infer<typeof formSchema>;

interface KecamatanOption {
    id: number;
    nama: string;
}

interface ResponseKecamatan {
    status: string;
    data: KecamatanOption[];
    message: string;
}

interface Penyuluh {
    nama: string,
    nip: number,
    pangkat: string,
    golongan: string,
    keterangan: string;
    kecamatan: {
        nama: string;
    }

}

interface ResponsePenyuluh {
    status: string;
    data: Penyuluh;
    message: string;
}

const PenyuluhanEditDataKabupaten = () => {
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const { data: dataKecamatan, error: kecamatanError } = useSWR<ResponseKecamatan>(
        "kecamatan/get",
        (url: string) =>
            axiosPrivate.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then(res => res.data)
    );

    const { data: dataPenyuluh, error: penyuluhError } = useSWR<ResponsePenyuluh>(
        id ? `/penyuluh-kabupaten/get/${id}` : null,
        (url: string) =>
            axiosPrivate.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then(res => res.data)
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        control
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (dataPenyuluh && dataPenyuluh.data) {
            // Ensure kecamatan_list is an array of numbers
            const kecamatanList = Array.isArray(dataPenyuluh.data.kecamatan)
                ? dataPenyuluh.data.kecamatan.map(item => item.id)
                : [];
            setValue('kecamatan_list', kecamatanList);
            setValue('nama', dataPenyuluh.data.nama || '');
            setValue('nip', dataPenyuluh.data.nip || 0);
            setValue('pangkat', dataPenyuluh.data.pangkat || '');
            setValue('golongan', dataPenyuluh.data.golongan || '');
            setValue('keterangan', dataPenyuluh.data.keterangan || '');
        }
    }, [dataPenyuluh, setValue]);




    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true);
        try {
            await axiosPrivate.put(`/penyuluh-kabupaten/update/${id}`, data);
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil diperbarui!',
                text: 'Data sudah diperbarui di sistem!',
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                customClass: {
                    title: 'text-2xl font-semibold text-green-600',
                    icon: 'text-green-500 animate-bounce',
                    timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400',
                },
                backdrop: 'rgba(0, 0, 0, 0.4)',
            });
            navigate.push('/penyuluhan/data-kabupaten');
            reset();
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal memperbarui data!';
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
            setLoading(false);
        }
        mutate(`/penyuluh-kabupaten/get`);
    };

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Edit Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Wilayah Desa Binaan (Kecamatan)" />
                            <Controller
                                name="kecamatan_list"
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                    const selectedKecamatan = dataKecamatan?.data.filter(option =>
                                        value?.includes(option.id)
                                    ) || [];
                                    return (
                                        <SelectMultipleKecamatan
                                            kecamatanOptions={dataKecamatan?.data || []}
                                            selectedKecamatan={selectedKecamatan}
                                            onChange={(selected: KecamatanOption[]) => onChange(selected.map(d => d.id))}
                                        />
                                    );
                                }}
                            />
                            {errors.kecamatan_list && (
                                <p className="text-red-500">{errors.kecamatan_list.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Nama" />
                            <Input
                                type="text"
                                placeholder="Nama"
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
                            <Textarea
                                {...register('keterangan')}
                                className={`${errors.keterangan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.keterangan && (
                                <HelperError>{errors.keterangan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/penyuluhan/data-kabupaten" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Batal
                    </Link>
                    <Button type="submit" disabled={loading} size="lg" className="w-[120px]">
                        {loading ? <Loading /> : 'Simpan'}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default PenyuluhanEditDataKabupaten;
