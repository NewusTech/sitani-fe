"use client"

import Label from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import useSWR, { SWRResponse, mutate } from 'swr';
import InputComponent from '@/components/ui/InputKecDesa';
import useLocalStorage from '@/hooks/useLocalStorage';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import DesaValue from '@/components/superadmin/SelectComponent/DesaValue';
import Loading from '@/components/ui/Loading';
import Swal from 'sweetalert2';

const formSchema = z.object({
    kecamatan_id: z
        .number()
        .transform((value) => Number(value)), // Convert string to number
    desa_id: z
        .number()
        .transform((value) => Number(value))
        .optional(),
    nama_poktan: z.string().min(1, { message: "Nama Poktan wajib diisi" }).optional(),
    ketua_poktan: z.string().min(1, { message: "Nama Ketua wajib diisi" }).optional(),
    titik_koordinat: z.string().min(1, { message: "Titik Koordinat wajib diisi" }).optional(),
});


type FormSchemaType = z.infer<typeof formSchema>;

const EditDataPenerimaUppo = () => {
    interface Kecamatan {
        id: number;
        nama: string;
    }

    interface Desa {
        id: number;
        nama: string;
        kecamatanId: number;
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

    interface Response {
        status: number;
        message: string;
        data: Data;
    }

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const { id } = useParams();


    const { data: dataKecamatan }: SWRResponse<{ status: string; data: Kecamatan[]; message: string }> = useSWR(
        `kecamatan/get`,
        (url: string) =>
            axiosPrivate.get(url, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }).then(res => res.data)
    );

    const { data: dataDesa }: SWRResponse<{ status: string; data: Desa[]; message: string }> = useSWR(
        `desa/get`,
        (url: string) =>
            axiosPrivate.get(url, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }).then(res => res.data)
    );

    const { register, handleSubmit, reset, formState: { errors }, setValue, watch, control } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const selectedKecamatan = Number(watch("kecamatan_id"));

    const kecamatanOptions = dataKecamatan?.data.map(kecamatan => ({
        id: kecamatan.id.toString(),
        name: kecamatan.nama,
    }));

    const desaOptions = dataDesa?.data
        .filter(desa => desa.kecamatanId === selectedKecamatan)
        .map(desa => ({
            id: desa.id.toString(),
            name: desa.nama,
        }));

    const { data: dataUser, error } = useSWR<Response>(
        `psp/penerima-uppo/get/${id}`,
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                return null;
            }
        }
    );

    const kecamatanId = watch("kecamatan_id");
    const [initialDesaId, setInitialDesaId] = useState<number | undefined>(undefined);


    useEffect(() => {
        if (dataUser) {
            const timeoutId = setTimeout(() => {
                setValue("kecamatan_id", dataUser.data.kecamatanId);
                setInitialDesaId(dataUser.data.desaId); // Save initial desa_id
                setValue("desa_id", dataUser.data.desaId); // Set default value
                setValue("nama_poktan", dataUser.data.namaPoktan);
                setValue("ketua_poktan", dataUser.data.ketuaPoktan);
                setValue("titik_koordinat", dataUser.data.titikKoordinat);
            }, 100); // 2 seconds timeout
    
            // Clean up the timeout if the component is unmounted or dataUser changes
            return () => clearTimeout(timeoutId);
        }
    }, [dataUser, setValue]);
    
    useEffect(() => {
        // Clear desa_id when kecamatan_id changes
        setValue("desa_id", initialDesaId); // Reset to initial desa_id
    }, [kecamatanId, setValue, initialDesaId]);
    const [loading, setLoading] = useState(false);


    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted

        try {
            await axiosPrivate.put(`/psp/penerima-uppo/update/${id}`, data);
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil di edit!',
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
            console.log("Success to update user:", data);
            navigate.push('/psp/data-penerima-uppo');
            reset();
        } catch (error) {
            console.error('Failed to update user:', error);
            console.log(data);
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/psp/penerima-uppo/get?page=1&limit=10&search&kecamatan&startDate=&endDate`);
    };

    const valueDesa = dataUser?.data.desaId.toString();
    console.log("value desa = ", valueDesa);


    // const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    //     console.log(data);
    //     // reset();
    // };

    return (
        <>
            <div className="text-primary text-2xl font-bold mb-5">Edit Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                            <Controller
                                name="kecamatan_id"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Controller
                                            name="kecamatan_id"
                                            control={control}
                                            render={({ field }) => (
                                                <KecValue
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(Number(value))} // Ensure value is a number
                                                />
                                            )}
                                        />
                                    </>

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
                                        value={field.value ?? 0} // Provide a default value if undefined
                                        onChange={(value) => field.onChange(Number(value))} // Ensure value is a number
                                        kecamatanValue={kecamatanId}
                                    />
                                )}
                            />

                            {errors.desa_id && (
                                <p className="text-red-500">{errors.desa_id.message}</p>
                            )}
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
                                type="text"
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
                    <Link href="/psp/data-penerima-uppo" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                        {loading ? (
                            <Loading />
                        ) : (
                            "Edit"
                        )}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default EditDataPenerimaUppo;
