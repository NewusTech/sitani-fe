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
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import DesaValue from '@/components/superadmin/SelectComponent/DesaValue';
import { Textarea } from '@/components/ui/textarea';
import Loading from '@/components/ui/Loading';
import Swal from 'sweetalert2';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Format tanggal yang diinginkan (yyyy-mm-dd)
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formSchema = z.object({
    kecamatan_id: z
        .number()
        .transform((value) => Number(value)), // Convert string to number
    desa_id: z
        .number()
        .transform((value) => Number(value))
        .optional(), // Allow undefined values
    jenis_bantuan: z.string().min(1, { message: "Jenis Bantuan wajib diisi" }),
    periode: z.preprocess(
        (val) => typeof val === "string" ? formatDate(val) : val,
        z.string().min(1, { message: "Periode Penerimaan wajib diisi" })
    ),
    keterangan: z.string().min(1, { message: "Keterangan wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const BantuanEdit = () => {
    interface Kecamatan {
        nama: string;
    }
    interface Desa {
        nama: string;
    }
    interface Bantuan {
        kecamatan: Kecamatan;
        kecamatanId: number;
        desaId: number;
        periode: string;
        jenisBantuan: string;
        keterangan: string;
    }

    interface Response {
        status: string;
        data: Bantuan;
        message: string;
    }

    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { id } = params;

    const { data: dataBantuan, error } = useSWR<Response>(
        `psp/bantuan/get/${id}`,
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

    const kecamatanId = watch("kecamatan_id");
    const [initialDesaId, setInitialDesaId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (dataBantuan) {
            const timeoutId = setTimeout(() => {
                setValue("periode", new Date(dataBantuan.data.periode).toISOString().split('T')[0]);
                setValue("keterangan", dataBantuan.data.keterangan);
                setValue("jenis_bantuan", dataBantuan.data.jenisBantuan);
                setValue("kecamatan_id", dataBantuan.data.kecamatanId);
                setInitialDesaId(dataBantuan.data.desaId); // Save initial desa_id
                setValue("desa_id", dataBantuan.data.desaId); // Set default value
            }, 100); // 2 seconds timeout

            // Clean up the timeout if the component is unmounted or dataUser changes
            return () => clearTimeout(timeoutId);

        }
    }, [dataBantuan, setValue]);

    useEffect(() => {
        // Clear desa_id when kecamatan_id changes
        setValue("desa_id", initialDesaId); // Reset to initial desa_id
    }, [kecamatanId, setValue, initialDesaId]);
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.put(`psp/bantuan/update/${id}`, data);
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
            console.log("Success to update data:", data);
            navigate.push('/psp/bantuan');
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
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/psp/bantuan/get?page=1`);
    };

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-3 md:mb-5">Edit Data</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Kecamatan" />
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
                                <p className="text-red-500 mt-1">{errors.desa_id.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Jenis Bantuan" />
                            <Select
                                onValueChange={(value) => setValue("jenis_bantuan", String(value))}
                                value={String(watch('jenis_bantuan')) || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="jenis_bantuan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Subsidi">Subsidi</SelectItem>
                                    <SelectItem value="Non-Subsidi">Non Subsidi</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.jenis_bantuan && (
                                <HelperError>{errors.jenis_bantuan.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Periode Penerimaan" />
                            <Input
                                type="date"
                                placeholder="Periode Penerimaan"
                                {...register('periode')}
                                className={`${errors.periode ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.periode && (
                                <HelperError>{errors.periode.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Keterangan" />
                            <Textarea
                                {...register('keterangan')}
                                className={`${errors.keterangan ? 'border-red-500' : 'py-2 text-sm h-[120px]'}`}
                            />
                            {errors.keterangan && (
                                <HelperError>{errors.keterangan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/psp/bantuan" className='bg-white text-sm md:text-base w-[90px] md:w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Batal
                    </Link> 
                    <Button type="submit" variant="primary" size="lg" className="w-[90px] md:w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                        {loading ? (
                            <Loading />
                        ) : (
                            "Simpan"
                        )}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default BantuanEdit;
