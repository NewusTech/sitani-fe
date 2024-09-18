"use client";

import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Label from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import Loading from '@/components/ui/Loading';
import Link from 'next/link';
import Swal from 'sweetalert2';

const schema = z.object({
    nama: z.string().min(1, { message: 'Title is required' }),
});

type FormSchemaType = z.infer<typeof schema>;

const TambahBidang = () => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormSchemaType>({
        resolver: zodResolver(schema),
    });

    // TAMBAH
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true);
        try {
            await axiosPrivate.post("/bidang/create", data);
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
                    timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400',
                },
                backdrop: `rgba(0, 0, 0, 0.4)`,
            });
            // alert
            console.log(data)
            // push
            navigate.push('/data-master/kelola-bidang');
            console.log("Success to create user:");
            reset()
        } catch (error: any) {
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
        mutate(`/bidang/get`);
    };
    // TAMBAH

    return (
        <div className="">
            <form onSubmit={handleSubmit(onSubmit)} className="text-sm" encType="multipart/form-data">
                <div className="mb-4">
                    <Label className='text-sm mb-1' label="Nama Bidang" />
                    <Input
                        type="text"
                        placeholder="Nama Bidang"
                        {...register('nama')}
                        className={`${errors.nama ? 'border-red-500' : ''}`}
                    />
                    {errors.nama && (
                        <HelperError>{errors.nama.message}</HelperError>
                    )}
                </div>
                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/data-master/kelola-bidang" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
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
        </div>
    );
};

export default TambahBidang;
