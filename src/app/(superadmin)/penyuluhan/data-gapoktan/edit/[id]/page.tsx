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
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Textarea } from '@/components/ui/textarea';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import { mutate } from 'swr';
import Loading from '@/components/ui/Loading';
import Swal from 'sweetalert2';
import SelectMultipleKecamatan from '@/components/superadmin/KecamatanMultiple';
import useSWR from 'swr';
import useLocalStorage from '@/hooks/useLocalStorage';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import DesaValue from '@/components/superadmin/SelectComponent/DesaValue';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export interface Kecamatan {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Desa {
    id: number;
    nama: string;
    kecamatanId: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface GabunganKelompokTani {
    id: number;
    kecamatanId: number;
    desaId: number;
    tahun: number;
    nama: string;
    ketua: string;
    sekretaris: string;
    bendahara: string;
    alamat: string;
    lahan: number;
    dibentuk: number;
    poktan: number;
    l: number;
    p: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    kecamatan: Kecamatan;
    desa: Desa;
  }
  
  export interface Response {
    status: number;
    message: string;
    data: GabunganKelompokTani;
  }
  


const formSchema = z.object({
    kecamatan_id: z
        .number()
        .min(0, "UPTD BPP wajib diisi")
        .transform((value) => Number(value)),
    desa_id: z
        .number()
        .min(0, "Desa wajib diisi")
        .transform((value) => Number(value)),
    tahun: z
        .string()
        .min(0, { message: "Tahun wajib diisi" }),
    nama: z
        .string()
        .min(0, { message: "Nama wajib diisi" }),
    ketua: z
        .string()
        .min(0, { message: "Ketua wajib diisi" }),
    sekretaris: z
        .string()
        .min(0, { message: "Sekretaris wajib diisi" }),
    bendahara: z
        .string()
        .min(0, { message: "Bendahara wajib diisi" }),
    alamat: z
        .string()
        .min(0, { message: "alamat wajib diisi" }),
    lahan: z
        .string()
        .min(0, { message: "lahan wajib diisi" }),
    dibentuk: z.string()
        .min(0, { message: "Dibentuk wajib diisi" }),
    l: z.string()
        .min(0, { message: "Laki-laki wajib diisi" }),
    p: z.string()
        .min(0, { message: "Perempuan wajib diisi" }),
    poktan: z
        .string()
        .min(0, { message: "Kelas wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const GapoktanEditDataKabupaten = () => {
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);

    const { register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
        control } = useForm<FormSchemaType>({
            resolver: zodResolver(formSchema),
        });

        // GET ONE
    const params = useParams();
    const { id } = params;

    const { data: dataUser, error } = useSWR<Response>(
        `penyuluh-gabungan-kelompok-tani/get/${id}`,
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch data:', error);
                return null;
            }
        }
    );
    // GET ONE

    const kecamatanId = watch("kecamatan_id");
    const [initialDesaId, setInitialDesaId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (dataUser) {
            const timeoutId = setTimeout(() => {
                setValue("kecamatan_id", dataUser.data.kecamatanId);
                setInitialDesaId(dataUser.data.desaId); // Save initial desa_id
                setValue("desa_id", dataUser.data.desaId); // Set default value
                setValue("lahan", dataUser.data.lahan.toString());
                setValue("tahun", dataUser.data.tahun.toString());
                setValue("nama", dataUser.data.nama);
                setValue("ketua", dataUser.data.ketua);
                setValue("sekretaris", dataUser.data.sekretaris);
                setValue("bendahara", dataUser.data.bendahara);
                setValue("alamat", dataUser.data.alamat);
                setValue("dibentuk", dataUser.data.dibentuk.toString());
                setValue("l", dataUser.data.l.toString());
                setValue("p", dataUser.data.p.toString());
                setValue("poktan", dataUser.data.poktan.toString());
            }, 300); // Set the delay time in milliseconds (e.g., 1000 ms = 1 second)

            // Cleanup function to clear the timeout if the component unmounts or dataUser changes
            return () => clearTimeout(timeoutId);
        }
    }, [dataUser, setValue]);

    useEffect(() => {
        // Clear desa_id when kecamatan_id changes
        setValue("desa_id", initialDesaId ?? 0); // Reset to initial desa_id or default to 0
    }, [kecamatanId, setValue, initialDesaId]);

    const kecamatanValue = watch("kecamatan_id");

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true);
        try {
            await axiosPrivate.put(`/penyuluh-gabungan-kelompok-tani/update/${id}`, data);
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil ditambahkan!',
                text: 'Data sudah disimpan sistem!',
                timer: 2000,
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
            navigate.push('/penyuluhan/data-gapoktan');
            reset();
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
            setLoading(false);
        }
        mutate(`/penyuluh-gabungan-kelompok-tani/get`);
    };

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-3 md:mb-5">Edit Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="wrap-form text-sm">
                    <div className="mb-2">
                        {/* kec desa */}
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Pilih UPTD BPP" />
                                <Controller
                                    name="kecamatan_id"
                                    control={control}
                                    render={({ field }) => (
                                        <KecValue
                                            // kecamatanItems={kecamatanItems}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                {errors.kecamatan_id && (
                                    <p className="text-red-500">{errors.kecamatan_id.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Pilih Desa" />
                                <Controller
                                    name="desa_id"
                                    control={control}
                                    render={({ field }) => (
                                        <DesaValue
                                            // desaItems={filteredDesaItems}
                                            value={field.value}
                                            onChange={field.onChange}
                                            kecamatanValue={kecamatanValue}
                                        />
                                    )}
                                />
                                {errors.desa_id && (
                                    <p className="text-red-500 mt-1">{errors.desa_id.message}</p>
                                )}
                            </div>
                        </div>
                        {/* id poktan, tahun */}
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full md:w-1/2 md:pr-3">
                                <Label className='text-sm mb-1' label="Tahun" />
                                <Input
                                    type="number"
                                    placeholder="Tahun"
                                    {...register('tahun')}
                                    className={`${errors.tahun ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.tahun && (
                                    <HelperError>{errors.tahun.message}</HelperError>
                                )}
                            </div>
                        </div>
                        {/* nama, ketua */}
                        <Label className='text-base md:text-base mb-1' label="Pengurus Kelompok Tani" />
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Nama Kelompok Tani" />
                                <Input
                                    type="text"
                                    placeholder="Nama Kelompok Tani"
                                    {...register('nama')}
                                    className={`${errors.nama ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.nama && (
                                    <HelperError>{errors.nama.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Ketua" />
                                <Input
                                    type="text"
                                    placeholder="Ketua"
                                    {...register('ketua')}
                                    className={`${errors.ketua ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.ketua && (
                                    <HelperError>{errors.ketua.message}</HelperError>
                                )}
                            </div>
                        </div>
                        {/* bendahara */}
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Sekretaris" />
                                <Input
                                    type="text"
                                    placeholder="Sekretaris"
                                    {...register('sekretaris')}
                                    className={`${errors.sekretaris ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.sekretaris && (
                                    <HelperError>{errors.sekretaris.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Bendahara" />
                                <Input
                                    type="text"
                                    placeholder="Bendahara"
                                    {...register('bendahara')}
                                    className={`${errors.sekretaris ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.sekretaris && (
                                    <HelperError>{errors.sekretaris.message}</HelperError>
                                )}
                            </div>
                        </div>
                        {/* Alamat, dibentuk */}
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Alamat Sekretariat" />
                                <Input
                                    type="text"
                                    placeholder="Alamat Sekretariat"
                                    {...register('alamat')}
                                    className={`${errors.alamat ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.alamat && (
                                    <HelperError>{errors.alamat.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Luas Lahan (Ha)" />
                                <Input
                                    type="number"
                                    step="0.001"
                                    placeholder="Luas Lahan (Ha)"
                                    {...register('lahan')}
                                    className={`${errors.lahan ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.lahan && (
                                    <HelperError>{errors.lahan.message}</HelperError>
                                )}
                            </div>
                        </div>
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Tahun Dibentuk" />
                                <Input
                                    type="number"
                                    placeholder="Tahun Dibentuk"
                                    {...register('dibentuk')}
                                    className={`${errors.dibentuk ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.dibentuk && (
                                    <HelperError>{errors.dibentuk.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Jumlah Poktan" />
                                <Input
                                    type="number"
                                    placeholder="Jumlah Poktan"
                                    {...register('poktan')}
                                    className={`${errors.poktan ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.poktan && (
                                    <HelperError>{errors.poktan.message}</HelperError>
                                )}
                            </div>
                        </div>
                        {/* jumlah anggota */}
                        <Label className='text-base md:text-base mb-1' label="Jumlah Anggota" />
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Laki-laki" />
                                <Input
                                    type="number"
                                    placeholder="Laki-laki"
                                    {...register('l')}
                                    className={`${errors.l ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.l && (
                                    <HelperError>{errors.l.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Perempuan" />
                                <Input
                                    type="number"
                                    placeholder="Perempuan"
                                    {...register('p')}
                                    className={`${errors.p ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.p && (
                                    <HelperError>{errors.p.message}</HelperError>
                                )}
                            </div>
                        </div>
                        {/* bendahara */}
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link
                        href="/penyuluhan/data-gapoktan"
                        className='bg-white text-sm md:text-base w-[90px] md:w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'
                    >
                        Batal
                    </Link>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-[90px] md:w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300"
                    >
                        {loading ? <Loading /> : "Simpan"}
                    </Button>
                </div>
            </form>
        </>
    );
}

export default GapoktanEditDataKabupaten;
