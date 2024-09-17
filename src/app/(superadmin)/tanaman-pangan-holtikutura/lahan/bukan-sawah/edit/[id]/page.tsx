"use client"
import Label from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import Swal from "sweetalert2";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { useRouter, useParams } from "next/navigation";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import Loading from '@/components/ui/Loading';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useSWR from 'swr';

interface TphLahanBukanSawah {
    id: number;
    tahun: number;
    createdAt: string;
    updatedAt: string;
}

interface Kecamatan {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
}

interface LahanBukanSawahData {
    id: number;
    tphLahanBukanSawahId: number;
    kecamatanId: number;
    tegal: number;
    ladang: number;
    perkebunan: number;
    hutanRakyat: number;
    padangPengembalaanRumput: number;
    hutanNegara: number;
    smtTidakDiusahakan: number;
    lainnya: number;
    jumlahLahanBukanSawah: number;
    lahanBukanPertanian: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    tphLahanBukanSawah: TphLahanBukanSawah;
    kecamatan: Kecamatan;
}

interface Response {
    status: number;
    message: string;
    data: LahanBukanSawahData;
}



const formSchema = z.object({
    tegal: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    ladang: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    perkebunan: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    hutan_rakyat: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    padang_pengembalaan_rumput: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    hutan_negara: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    smt_tidak_diusahakan: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lainnya: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lahan_bukan_pertanian: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
});

type FormSchemaType = z.infer<typeof formSchema>;

const EditLahanBukanSawahPage = () => {
    const [date, setDate] = React.useState<Date>()

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
        setValue
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });


    // Submit handler for form
    const [loading, setLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { id } = params;
    const [activeTab, setActiveTab] = useState("bukanSawah");


    const { data: dataLahanSawah, error } = useSWR<Response>(
        `tph/lahan-bukan-sawah/get/${id}`,
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                return response.data;
            } catch (error) {
                console.error("Failed to fetch data:", error);
                return null;
            }
        }
    );

    useEffect(() => {
        if (dataLahanSawah && dataLahanSawah.data) {
            const { tegal, ladang, perkebunan, hutanRakyat, padangPengembalaanRumput, hutanNegara, smtTidakDiusahakan, lainnya, lahanBukanPertanian } = dataLahanSawah.data;

            setValue('tegal', tegal);
            setValue('ladang', ladang);
            setValue('perkebunan', perkebunan);
            setValue('hutan_rakyat', hutanRakyat);
            setValue('padang_pengembalaan_rumput', padangPengembalaanRumput);
            setValue('hutan_negara', hutanNegara);
            setValue('smt_tidak_diusahakan', smtTidakDiusahakan);
            setValue('lainnya', lainnya);
            setValue('lahan_bukan_pertanian', lahanBukanPertanian);
        }
    }, [dataLahanSawah, setValue]);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.put(`/tph/lahan-bukan-sawah/update/${id}`, data);
            localStorage.setItem('activeTab', activeTab);

            // console.log("data= ", data)

            // Success alert
            Swal.fire({
                icon: "success",
                title: "Data berhasil ditambahkan!",
                text: "Data sudah disimpan dalam sistem!",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                showClass: {
                    popup: "animate__animated animate__fadeInDown",
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp",
                },
                customClass: {
                    title: "text-2xl font-semibold text-green-600",
                    icon: "text-green-500 animate-bounce",
                    timerProgressBar: "bg-gradient-to-r from-blue-400 to-green-400",
                },
                backdrop: `rgba(0, 0, 0, 0.4)`,
            });

            navigate.push("/tanaman-pangan-holtikutura/lahan");
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
    };
    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Edit Data Lahan Bukan Sawah</div>
            {/* Nama NIP Tempat Tanggal Lahir */}
            <form onSubmit={handleSubmit(onSubmit)} className="min-h-[70vh] flex flex-col justify-between">
                <div className="wrap-form">
                    <div className="mb-2">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Tahun" />
                                <Input
                                    autoFocus
                                    type="number"
                                    step="0.000001"
                                    placeholder="Tahun"
                                    value={dataLahanSawah?.data.tphLahanBukanSawah.tahun}
                                    disabled
                                />
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                                <KecValue
                                    disabled
                                    value={dataLahanSawah?.data.kecamatanId}
                                    onChange={() => { }} // Empty function for onChange
                                />
                            </div>
                        </div>
                    </div>
                    {/* irigasi teknis - 1/2 */}
                    <div className="mb-2">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Tegal / Kebun" />
                                <Input
                                    autoFocus
                                    type="number"
                                    step="0.000001"
                                    placeholder="Tegal / Kebun"
                                    {...register('tegal')}
                                    className={`${errors.tegal ? 'border-red-500' : ''}`}
                                />
                                {errors.tegal && (
                                    <HelperError>{errors.tegal.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Ladang / Huma" />
                                <Input
                                    autoFocus
                                    type="number"
                                    step="0.000001"
                                    placeholder="Ladang / Huma"
                                    {...register('ladang')}
                                    className={`${errors.ladang ? 'border-red-500' : ''}`}
                                />
                                {errors.ladang && (
                                    <HelperError>{errors.ladang.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* desan - pasang */}
                    <div className="mb-2">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Perkebunan" />
                                <Input
                                    autoFocus
                                    type="number"
                                    step="0.000001"
                                    placeholder="Perkebunan"
                                    {...register('perkebunan')}
                                    className={`${errors.perkebunan ? 'border-red-500' : ''}`}
                                />
                                {errors.perkebunan && (
                                    <HelperError>{errors.perkebunan.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Hutan Rakyat" />
                                <Input
                                    autoFocus
                                    type="number"
                                    step="0.000001"
                                    placeholder="Hutan Rakyat"
                                    {...register('hutan_rakyat')}
                                    className={`${errors.hutan_rakyat ? 'border-red-500' : ''}`}
                                />
                                {errors.hutan_rakyat && (
                                    <HelperError>{errors.hutan_rakyat.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* padang_pengembalaan_rumput - hutan_negara */}
                    <div className="mb-2">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Padang Penggembalaan Rumput" />
                                <Input
                                    autoFocus
                                    type="number"
                                    step="0.000001"
                                    placeholder="Padang Penggembalaan Rumput"
                                    {...register('padang_pengembalaan_rumput')}
                                    className={`${errors.padang_pengembalaan_rumput ? 'border-red-500' : ''}`}
                                />
                                {errors.padang_pengembalaan_rumput && (
                                    <HelperError>{errors.padang_pengembalaan_rumput.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Hutan Negara" />
                                <Input
                                    autoFocus
                                    type="number"
                                    step="0.000001"
                                    placeholder="Hutan Negara"
                                    {...register('hutan_negara')}
                                    className={`${errors.hutan_negara ? 'border-red-500' : ''}`}
                                />
                                {errors.hutan_negara && (
                                    <HelperError>{errors.hutan_negara.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <div className="mb-2">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Smt. Tidak Diusahakan" />
                                <Input
                                    autoFocus
                                    type="number"
                                    step="0.000001"
                                    placeholder="Smt. Tidak Diusahakan"
                                    {...register('smt_tidak_diusahakan')}
                                    className={`${errors.smt_tidak_diusahakan ? 'border-red-500' : ''}`}
                                />
                                {errors.smt_tidak_diusahakan && (
                                    <HelperError>{errors.smt_tidak_diusahakan.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Lainnya Tambak, Kolam Empang" />
                                <Input
                                    autoFocus
                                    type="number"
                                    step="0.000001"
                                    placeholder="Lainnya Tambak, Kolam Empang"
                                    {...register('lainnya')}
                                    className={`${errors.lainnya ? 'border-red-500' : ''}`}
                                />
                                {errors.lainnya && (
                                    <HelperError>{errors.lainnya.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <div className="mb-2">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 md:w-1/2 md:pr-3 w-full">
                                <Label className='text-sm mb-1' label="Lahan Bukan Pertanian" />
                                <Input
                                    autoFocus
                                    type="number"
                                    step="0.000001"
                                    placeholder="Lahan Bukan Pertanian"
                                    {...register('lahan_bukan_pertanian')}
                                    className={`${errors.lahan_bukan_pertanian ? 'border-red-500' : ''}`}
                                />
                                {errors.lahan_bukan_pertanian && (
                                    <HelperError>{errors.lahan_bukan_pertanian.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Button */}
                <div className="flex justify-end gap-3">
                    <Link href="/tanaman-pangan-holtikutura/lahan" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer">
                        {loading ? (
                            <Loading />
                        ) : (
                            "Simpan"
                        )}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default EditLahanBukanSawahPage