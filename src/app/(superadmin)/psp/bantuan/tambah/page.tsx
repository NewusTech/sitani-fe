"use client"
import Label from '@/components/ui/label'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import useSWR, { SWRResponse, mutate } from "swr";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useLocalStorage from '@/hooks/useLocalStorage';
import InputComponent from '@/components/ui/InputKecDesa';
import Loading from '@/components/ui/Loading';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import DesaValue from '@/components/superadmin/SelectComponent/DesaValue';
import Swal from 'sweetalert2';


// Format tanggal yang diinginkan (yyyy-mm-dd)
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
};

const formSchema = z.object({
    kecamatan_id: z
        .number()
        .min(0, "Kecamatan is required")
        .transform((value) => Number(value)), // Convert string to number

    desa_id: z
        .number()
        .min(0, "Desa is required")
        .transform((value) => Number(value)), // Convert string to number

    jenis_bantuan: z
        .string()
        .min(0, { message: "Nama wajib diisi" }),

    periode: z
        .string()
        .min(0, { message: "Periode Penerimaan wajib diisi" })
        .transform((val) => formatDate(val)),

    keterangan: z
        .string()
        .min(0, { message: "Keterangan wajib diisi" }),
});


type FormSchemaType = z.infer<typeof formSchema>;

const BantuanTambah = () => {
    const [date, setDate] = React.useState<Date>()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
        control,
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const kecamatanValue = watch("kecamatan_id");

    // const onSubmit = (data: FormSchemaType) => {
    //     console.log(data);
    //     // reset();
    // };


    // TAMBAH
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();

    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.post("/psp/bantuan/create", data);
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil di tambahkan!',
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
            navigate.push('/psp/bantuan');
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
        mutate(`/psp/bantuan/get?page=1`);
    };

    // TAMBAH

    return (
        <>
            <div className="text-primary text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Kecamatan" />
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
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Jenis Bantuan" />
                            <Select
                                onValueChange={(value) => setValue("jenis_bantuan", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Keterangan" />
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
                                autoFocus
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
                            <Textarea  {...register('keterangan')}
                                className={`${errors.keterangan ? 'border-red-500' : ''} py-2 text-sm h-[120px]`}
                            />
                            {errors.keterangan && (
                                <HelperError>{errors.keterangan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/psp/bantuan" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
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

export default BantuanTambah