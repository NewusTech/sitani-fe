"use client"
import Label from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams, useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import Swal from 'sweetalert2';
import Loading from '@/components/ui/Loading';

const formSchema = z.object({
    minggu_1: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Minggu 1 wajib diisi" })),
    minggu_2: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Minggu 2 wajib diisi" })),
    minggu_3: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Minggu 3 wajib diisi" })),
    minggu_4: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Minggu 4 wajib diisi" })),
    minggu_5: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Minggu 5 wajib diisi" })),
});

type FormSchemaType = z.infer<typeof formSchema>;

const EditKuisionerPedagangEceran = () => {
    interface Komoditas {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface KepangPedagangEceran {
        tanggal: string;
    }

    interface Data {
        id: number;
        kepangPedagangEceranId: number;
        kepangMasterKomoditasId: number;
        minggu1: number;
        minggu2: number;
        minggu3: number;
        minggu4: number;
        minggu5: number;
        createdAt: string;
        updatedAt: string;
        komoditas: Komoditas;
        kepangPedagangEceran: KepangPedagangEceran;
    }

    interface Response {
        status: number;
        message: string;
        data: Data;
    }

    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { id } = params;

    const { data: dataKomoditas, error } = useSWR<Response>(
        `/kepang/pedagang-eceran/get/${id}`,
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                console.log('Berhasil Dapat Data');
                return response.data;
            } catch (error) {
                console.error('Failed to fetch data:', error);
                return null;
            }
        }
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        control,
        watch,
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (dataKomoditas) {
            setValue("minggu_1", dataKomoditas?.data?.minggu1);
            setValue("minggu_2", dataKomoditas?.data?.minggu2);
            setValue("minggu_3", dataKomoditas?.data?.minggu3);
            setValue("minggu_4", dataKomoditas?.data?.minggu4);
            setValue("minggu_5", dataKomoditas?.data?.minggu5);

        }
    }, [dataKomoditas, setValue]);

    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.put(`/kepang/pedagang-eceran/update/${id}`, data);
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
            console.log("Success to update data produsen dan eceran:", data);
            navigate.push('/ketahanan-pangan/kuisioner-pedagang-eceran');
            reset();
        } catch (error) {
            console.error('Failed to update data:', error);
        }
        mutate(`/kepang/pedagang-eceran/get`);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11, so we add 1

        return `${year}/${month}`;
    };

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Edit Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Komoditas" />
                            <Input
                                type="text"
                                placeholder="Komoditas"
                                disabled={true}
                                value={dataKomoditas?.data?.komoditas?.nama || ''}
                            />
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tahun/Bulan" />
                            <Input
                                type="text"
                                disabled={true}
                                placeholder="Masukkan Tanggal"
                                value={formatDate(dataKomoditas?.data?.kepangPedagangEceran?.tanggal || '')}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Minggu 1" />
                            <Input
                                type="number"
                                placeholder="Minggu 1"
                                {...register('minggu_1')}
                                className={`${errors.minggu_1 ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.minggu_1 && (
                                <HelperError>{errors.minggu_1.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Minggu 2" />
                            <Input
                                type="number"
                                placeholder="Minggu 2"
                                {...register('minggu_2')}
                                className={`${errors.minggu_2 ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.minggu_2 && (
                                <HelperError>{errors.minggu_2.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Minggu 3" />
                            <Input
                                type="number"
                                placeholder="Minggu 3"
                                {...register('minggu_3')}
                                className={`${errors.minggu_3 ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.minggu_3 && (
                                <HelperError>{errors.minggu_3.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Minggu 4" />
                            <Input
                                type="number"
                                placeholder="Minggu 4"
                                {...register('minggu_4')}
                                className={`${errors.minggu_4 ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.minggu_4 && (
                                <HelperError>{errors.minggu_4.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Minggu 5" />
                            <Input
                                type="number"
                                placeholder="Minggu 5"
                                {...register('minggu_5')}
                                className={`${errors.minggu_5 ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.minggu_5 && (
                                <HelperError>{errors.minggu_5.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 mt-3 flex justify-end gap-3">
                    <Link href="/ketahanan-pangan/kuisioner-pedagang-eceran" className='bg-white w-[120px] text-sm md:text-base  rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium flex justify-center items-center'>
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
    )
}

export default EditKuisionerPedagangEceran