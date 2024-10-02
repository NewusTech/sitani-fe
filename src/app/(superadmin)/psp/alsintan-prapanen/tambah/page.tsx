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
        .min(1, "UPTD BPP wajib diisi")
        .transform((value) => Number(value)),
    tahun: z
        .string()
        .min(1, { message: "Tahun wajib diisi" }),
    tr_4_apbn: z.string()
        .optional(),
    tr_4_tp: z.string()
        .optional(),
    tr_4_apbd: z.string()
        .optional(),
    tr_2_apbn: z.string()
        .optional(),
    tr_2_tp: z.string()
        .optional(),
    tr_2_apbd: z.string()
        .optional(),
    rt_apbn: z.string()
        .optional(),
    rt_tp: z.string()
        .optional(),
    rt_apbd: z.string()
        .optional(),
    cornplanter_apbn: z.string()
        .optional(),
    cornplanter_tp: z.string()
        .optional(),
    cornplanter_apbd: z.string()
        .optional(),
    cultivator_apbn: z.string()
        .optional(),
    cultivator_tp: z.string()
        .optional(),
    cultivator_apbd: z.string()
    .min(1, { message: "Tahun wajib diisi" }),
    hand_sprayer_apbn: z.string()
        .optional(),
    hand_sprayer_tp: z.string()
        .optional(),
    hand_sprayer_apbd: z.string()
        .optional(),
    pompa_air_apbn: z.string()
        .optional(),
    pompa_air_tp: z.string()
        .optional(),
    pompa_air_apbd: z.string()
        .optional(),
    keterangan: z.string()
        .optional(),
});



type FormSchemaType = z.infer<typeof formSchema>;

const PrapanenTambah = () => {
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
            await axiosPrivate.post("/psp/alsintan-prapanen/create", data);
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
            navigate.push('/psp/alsintan-prapanen');
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
            <div className="text-primary text-xl md:text-2xl font-bold mb-3 md:mb-5">Tambah Data</div>
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
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Keterangan" />
                            <Input
                                type="text"
                                placeholder="Keterangan"
                                {...register('keterangan')}
                                className={`${errors.keterangan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.keterangan && (
                                <HelperError>{errors.keterangan.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <Label className='font-semibold mb-1' label="Jumlah Alsintan" />
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah TR 4" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="TR 4 APBN" />
                            <Input
                                type="number"
                                placeholder="TR 4 APBN"
                                {...register('tr_4_apbn')}
                                className={`${errors.tr_4_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.tr_4_apbn && (
                                <HelperError>{errors.tr_4_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="TR 4 TP" />
                            <Input
                                type="number"
                                placeholder="TR 4 TP"
                                {...register('tr_4_tp')}
                                className={`${errors.tr_4_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.tr_4_tp && (
                                <HelperError>{errors.tr_4_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="TR 4 APBD" />
                            <Input
                                type="number"
                                placeholder="TR 4 APBD"
                                {...register('tr_4_apbd')}
                                className={`${errors.tr_4_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.tr_4_apbd && (
                                <HelperError>{errors.tr_4_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah TR 2" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="TR 2 APBN" />
                            <Input
                                type="number"
                                placeholder="TR 2 APBN"
                                {...register('tr_2_apbn')}
                                className={`${errors.tr_2_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.tr_2_apbn && (
                                <HelperError>{errors.tr_2_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="TR 2 TP" />
                            <Input
                                type="number"
                                placeholder="TR 2 TP"
                                {...register('tr_2_tp')}
                                className={`${errors.tr_2_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.tr_2_tp && (
                                <HelperError>{errors.tr_2_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="TR 2 APBD" />
                            <Input
                                type="number"
                                placeholder="TR 2 APBD"
                                {...register('tr_2_apbd')}
                                className={`${errors.tr_2_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.tr_2_apbd && (
                                <HelperError>{errors.tr_2_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah RT" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="RT APBN" />
                            <Input
                                type="number"
                                placeholder="RT APBN"
                                {...register('rt_apbn')}
                                className={`${errors.rt_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.rt_apbn && (
                                <HelperError>{errors.rt_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="RT TP" />
                            <Input
                                type="number"
                                placeholder="RT TP"
                                {...register('rt_tp')}
                                className={`${errors.rt_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.rt_tp && (
                                <HelperError>{errors.rt_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="RT APBD" />
                            <Input
                                type="number"
                                placeholder="RT APBD"
                                {...register('rt_apbd')}
                                className={`${errors.rt_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.rt_apbd && (
                                <HelperError>{errors.rt_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah Cornplanter" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Cornplanter APBN" />
                            <Input
                                type="number"
                                placeholder="Cornplanter APBN"
                                {...register('cornplanter_apbn')}
                                className={`${errors.cornplanter_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.cornplanter_apbn && (
                                <HelperError>{errors.cornplanter_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Cornplanter TP" />
                            <Input
                                type="number"
                                placeholder="Cornplanter TP"
                                {...register('cornplanter_tp')}
                                className={`${errors.cornplanter_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.cornplanter_tp && (
                                <HelperError>{errors.cornplanter_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Cornplanter APBD" />
                            <Input
                                type="number"
                                placeholder="Cornplanter APBD"
                                {...register('cornplanter_apbd')}
                                className={`${errors.cornplanter_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.cornplanter_apbd && (
                                <HelperError>{errors.cornplanter_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah Cultivator" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Cultivator APBN" />
                            <Input
                                type="number"
                                placeholder="Cultivator APBN"
                                {...register('cultivator_apbn')}
                                className={`${errors.cultivator_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.cultivator_apbn && (
                                <HelperError>{errors.cultivator_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Cultivator TP" />
                            <Input
                                type="number"
                                placeholder="Cultivator TP"
                                {...register('cultivator_tp')}
                                className={`${errors.cultivator_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.cultivator_tp && (
                                <HelperError>{errors.cultivator_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Cultivator APBD" />
                            <Input
                                type="number"
                                placeholder="Cultivator APBD"
                                {...register('cultivator_apbd')}
                                className={`${errors.cultivator_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.cultivator_apbd && (
                                <HelperError>{errors.cultivator_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah Hand Sprayer" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Hand Sprayer APBN" />
                            <Input
                                type="number"
                                placeholder="Hand Sprayer APBN"
                                {...register('hand_sprayer_apbn')}
                                className={`${errors.hand_sprayer_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.hand_sprayer_apbn && (
                                <HelperError>{errors.hand_sprayer_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Hand Sprayer TP" />
                            <Input
                                type="number"
                                placeholder="Hand Sprayer TP"
                                {...register('hand_sprayer_tp')}
                                className={`${errors.hand_sprayer_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.hand_sprayer_tp && (
                                <HelperError>{errors.hand_sprayer_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Hand Sprayer APBD" />
                            <Input
                                type="number"
                                placeholder="TR 4 APBD"
                                {...register('hand_sprayer_apbd')}
                                className={`${errors.hand_sprayer_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.hand_sprayer_apbd && (
                                <HelperError>{errors.hand_sprayer_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah Pompa Air" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pompa Air APBN" />
                            <Input
                                type="number"
                                placeholder="Pompa Air APBN"
                                {...register('pompa_air_apbn')}
                                className={`${errors.pompa_air_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.pompa_air_apbn && (
                                <HelperError>{errors.pompa_air_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pompa Air TP" />
                            <Input
                                type="number"
                                placeholder="Pompa Air TP"
                                {...register('pompa_air_tp')}
                                className={`${errors.pompa_air_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.pompa_air_tp && (
                                <HelperError>{errors.pompa_air_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pompa Air APBD" />
                            <Input
                                type="number"
                                placeholder="Pompa Air APBD"
                                {...register('pompa_air_apbd')}
                                className={`${errors.pompa_air_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.pompa_air_apbd && (
                                <HelperError>{errors.pompa_air_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    <div className="mb-10 flex justify-end gap-3">
                        <Link href="/psp/bantuan" className='bg-white w-[90px] text-xs md:text-sm  rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium flex justify-center items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                            Batal
                        </Link>
                        <Button type="submit" variant="primary" size="lg" className="w-[90px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 text-xs md:text-sm">
                            {loading ? (
                                <Loading />
                            ) : (
                                "Tambah"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default PrapanenTambah