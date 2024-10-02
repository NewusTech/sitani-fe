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
    chb_apbn: z.string()
        .optional(),
    chb_tp: z.string()
        .optional(),
    chb_apbd: z.string()
        .optional(),
    chk_apbn: z.string()
        .optional(),
    chk_tp: z.string()
        .optional(),
    chk_apbd: z.string()
        .optional(),
    power_thresher_apbn: z.string()
        .optional(),
    power_thresher_tp: z.string()
        .optional(),
    power_thresher_apbd: z.string()
        .optional(),
    corn_sheller_apbn: z.string()
        .optional(),
    corn_sheller_tp: z.string()
        .optional(),
    corn_sheller_apbd: z.string()
        .optional(),
    ptm_apbn: z.string()
        .optional(),
    ptm_tp: z.string()
        .optional(),
    ptm_apbd: z.string()
        .optional(),
    ptm_mobile_apbn: z.string()
        .optional(),
    ptm_mobile_tp: z.string()
        .optional(),
    ptm_mobile_apbd: z.string()
        .optional(),
    cs_mobile_apbn: z.string()
        .optional(),
    cs_mobile_tp: z.string()
        .optional(),
    cs_mobile_apbd: z.string()
        .optional(),
    keterangan: z.string()
        .optional(),
});



type FormSchemaType = z.infer<typeof formSchema>;

const PascaTambah = () => {
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
            await axiosPrivate.post("/psp/alsintan-pascapanen/create", data);
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
            navigate.push('/psp/alsintan-pascapanen');
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
                    <Label className='font-semibold mb-1' label="Jumlah CHB" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="CHB APBN" />
                            <Input
                                type="number"
                                placeholder="CHB APBN"
                                {...register('chb_apbn')}
                                className={`${errors.chb_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.chb_apbn && (
                                <HelperError>{errors.chb_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="CHB TP" />
                            <Input
                                type="number"
                                placeholder="CHB TP"
                                {...register('chb_tp')}
                                className={`${errors.chb_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.chb_tp && (
                                <HelperError>{errors.chb_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="CHB APBD" />
                            <Input
                                type="number"
                                placeholder="CHB APBD"
                                {...register('chb_apbd')}
                                className={`${errors.chb_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.chb_apbd && (
                                <HelperError>{errors.chb_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah CHK" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="CHK APBN" />
                            <Input
                                type="number"
                                placeholder="CHK APBN"
                                {...register('chk_apbn')}
                                className={`${errors.chk_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.chk_apbn && (
                                <HelperError>{errors.chk_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="CHK TP" />
                            <Input
                                type="number"
                                placeholder="CHK TP"
                                {...register('chk_tp')}
                                className={`${errors.chk_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.chk_tp && (
                                <HelperError>{errors.chk_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="CHK APBD" />
                            <Input
                                type="number"
                                placeholder="CHK APBD"
                                {...register('chk_apbd')}
                                className={`${errors.chk_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.chk_apbd && (
                                <HelperError>{errors.chk_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah Power Thresher" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Power Thresher APBN" />
                            <Input
                                type="number"
                                placeholder="Power Thresher APBN"
                                {...register('power_thresher_apbn')}
                                className={`${errors.power_thresher_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.power_thresher_apbn && (
                                <HelperError>{errors.power_thresher_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Power Thresher TP" />
                            <Input
                                type="number"
                                placeholder="Power Thresher TP"
                                {...register('power_thresher_tp')}
                                className={`${errors.power_thresher_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.power_thresher_tp && (
                                <HelperError>{errors.power_thresher_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Power Thresher APBD" />
                            <Input
                                type="number"
                                placeholder="Power Thresher APBD"
                                {...register('power_thresher_apbd')}
                                className={`${errors.power_thresher_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.power_thresher_apbd && (
                                <HelperError>{errors.power_thresher_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah Corn Sheller" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Corn Sheller APBN" />
                            <Input
                                type="number"
                                placeholder="Corn Sheller APBN"
                                {...register('corn_sheller_apbn')}
                                className={`${errors.corn_sheller_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.corn_sheller_apbn && (
                                <HelperError>{errors.corn_sheller_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Corn Sheller TP" />
                            <Input
                                type="number"
                                placeholder="Corn Sheller TP"
                                {...register('corn_sheller_tp')}
                                className={`${errors.corn_sheller_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.corn_sheller_tp && (
                                <HelperError>{errors.corn_sheller_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Corn Sheller APBD" />
                            <Input
                                type="number"
                                placeholder="Corn Sheller APBD"
                                {...register('corn_sheller_apbd')}
                                className={`${errors.corn_sheller_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.corn_sheller_apbd && (
                                <HelperError>{errors.corn_sheller_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah PTM" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="PTM APBN" />
                            <Input
                                type="number"
                                placeholder="PTM APBN"
                                {...register('ptm_apbn')}
                                className={`${errors.ptm_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.ptm_apbn && (
                                <HelperError>{errors.ptm_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="PTM TP" />
                            <Input
                                type="number"
                                placeholder="PTM TP"
                                {...register('ptm_tp')}
                                className={`${errors.ptm_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.ptm_tp && (
                                <HelperError>{errors.ptm_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="PTM APBD" />
                            <Input
                                type="number"
                                placeholder="PTM APBD"
                                {...register('ptm_apbd')}
                                className={`${errors.ptm_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.ptm_apbd && (
                                <HelperError>{errors.ptm_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah PTM Mobile" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="PTM Mobile APBN" />
                            <Input
                                type="number"
                                placeholder="PTM Mobile APBN"
                                {...register('ptm_mobile_apbn')}
                                className={`${errors.ptm_mobile_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.ptm_mobile_apbn && (
                                <HelperError>{errors.ptm_mobile_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="PTM Mobile TP" />
                            <Input
                                type="number"
                                placeholder="PTM Mobile TP"
                                {...register('ptm_mobile_tp')}
                                className={`${errors.ptm_mobile_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.ptm_mobile_tp && (
                                <HelperError>{errors.ptm_mobile_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="PTM Mobile APBD" />
                            <Input
                                type="number"
                                placeholder="CHB APBD"
                                {...register('ptm_mobile_apbd')}
                                className={`${errors.ptm_mobile_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.ptm_mobile_apbd && (
                                <HelperError>{errors.ptm_mobile_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    {/*  */}
                    <Label className='font-semibold mb-1' label="Jumlah CS Mobile" />
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="CS Mobile APBN" />
                            <Input
                                type="number"
                                placeholder="CS Mobile APBN"
                                {...register('cs_mobile_apbn')}
                                className={`${errors.cs_mobile_apbn ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.cs_mobile_apbn && (
                                <HelperError>{errors.cs_mobile_apbn.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="CS Mobile TP" />
                            <Input
                                type="number"
                                placeholder="CS Mobile TP"
                                {...register('cs_mobile_tp')}
                                className={`${errors.cs_mobile_tp ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.cs_mobile_tp && (
                                <HelperError>{errors.cs_mobile_tp.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="CS Mobile APBD" />
                            <Input
                                type="number"
                                placeholder="CS Mobile APBD"
                                {...register('cs_mobile_apbd')}
                                className={`${errors.cs_mobile_apbd ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.cs_mobile_apbd && (
                                <HelperError>{errors.cs_mobile_apbd.message}</HelperError>
                            )}
                        </div>
                    </div>
                    {/*  */}
                    <div className="mb-10 flex justify-end gap-3">
                        <Link href="/psp/alsintan-pascapanen" className='bg-white w-[90px] text-xs md:text-sm  rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium flex justify-center items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
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

export default PascaTambah