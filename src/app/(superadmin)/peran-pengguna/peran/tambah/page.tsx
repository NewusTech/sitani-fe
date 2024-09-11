"use client"
import Label from '@/components/ui/label'
import React from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import { SWRResponse, mutate } from "swr";


const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Alamat email tidak sesuai" })
    .min(1, "Email wajib diisi"),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter" }),
  name: z
    .string()
    .min(1, { message: "Nama Teknis wajib diisi" }),
  nip: z
    .coerce.number()
    .min(1, { message: "NIP Teknis wajib diisi" }),
  pangkat: z
    .string()
    .min(1, { message: "Pangkat wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahPeran = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });


  // TAMBAH
  const axiosPrivate = useAxiosPrivate();
  const navigate = useRouter();
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    try {
      await axiosPrivate.post("/user/create", data);
      console.log(data)
      // push
      navigate.push('/peran-pengguna/peran');
      console.log("Success to create user:");
      reset()
    } catch (e: any) {
      console.log(data)
      console.log("Failed to create user:");
      return;
    }
    mutate(`/user/get`);
  };

  // TAMBAH
  return (
    <>
      <div className="text-primary md:text-2xl text-xl font-bold mb-5">Tambah Peran</div>
      {/* Nama NIP Tempat Tanggal Lahir */}
      <form onSubmit={handleSubmit(onSubmit)} className="gap-3 flex flex-col justify-between">
        <div className="wrap-form">
          <div className="wrap">
            {/* produksi - produktivitas */}
            <div className="mb-2 mt-4">
              <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Email" />
                  <Input
                    type="text"
                    placeholder="Email"
                    {...register('email')}
                    className={`${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <HelperError>{errors.email.message}</HelperError>
                  )}
                </div>
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Password" />
                  <Input
                    type="password"
                    placeholder="Password"
                    {...register('password')}
                    className={`${errors.password ? 'border-red-500' : ''}`}
                  />
                  {errors.password && (
                    <HelperError>{errors.password.message}</HelperError>
                  )}
                </div>
              </div>
            </div>
            {/* jumlah petani - bentuk hasil */}
            <div className="mb-2">
              <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Nama" />
                  <Input
                    type="text"
                    placeholder="Nama"
                    {...register('name')}
                    className={`${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <HelperError>{errors.name.message}</HelperError>
                  )}
                </div>
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="NIP" />
                  <Input
                    type="number"
                    placeholder="NIP"
                    {...register('nip')}
                    className={`${errors.nip ? 'border-red-500' : ''}`}
                  />
                  {errors.nip && (
                    <HelperError>{errors.nip.message}</HelperError>
                  )}
                </div>
              </div>
            </div>
            {/* keterangan */}
            <div className="mb-2">
              <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                <div className="flex flex-col mb-2 md:w-1/2 w-full md:pr-3">
                  <Label className='text-sm mb-1' label="Pangkat" />
                  <Input
                    type="text"
                    placeholder="Pangkat"
                    {...register('pangkat')}
                    className={`${errors.pangkat ? 'border-red-500' : ''}`}
                  />
                  {errors.pangkat && (
                    <HelperError>{errors.pangkat.message}</HelperError>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Button */}
        <div className="flex justify-end gap-3">
          <Link href="/peran-pengguna/peran" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
            Batal
          </Link>
          <Button type="submit" variant="primary" size="lg" className="w-[120px]">
            Simpan
          </Button>
        </div>
      </form>
    </>
  )
}

export default TambahPeran