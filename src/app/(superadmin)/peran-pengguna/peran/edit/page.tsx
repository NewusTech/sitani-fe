"use client"
import Label from '@/components/ui/label'
import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { SWRResponse } from "swr";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Alamat email tidak sesuai" })
    .min(1, "Email wajib diisi"),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter" })
    .optional(),
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

const EditPeran = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  interface User {
    email: string;
    name: string;
    nip: number;
    pangkat: string;
  }

  interface Response {
    status: string;
    data: User;
    message: string;
  }

  const axiosPrivate = useAxiosPrivate();
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // Get user data
  const { data: dataUser, error } = useSWR<Response>(
    `user/get/${id}`,
    async (url) => {
      try {
        const response = await axiosPrivate.get(url);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
      }
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  // Set form values once data is fetched
  useEffect(() => {
    if (dataUser) {
      setValue("email", dataUser.data.email);
      setValue("name", dataUser.data.name);
      setValue("nip", dataUser.data.nip);
      setValue("pangkat", dataUser.data.pangkat);
    }
  }, [dataUser, setValue]);

  // Handle form submission
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    try {
      await axiosPrivate.put(`/user/update/${id}`, data); // Update endpoint as necessary
      console.log("Success to update user:", data);
      console.log(data)
      navigate.push('/peran-pengguna/peran');
    } catch (error) {
      console.error('Failed to update user:', error);
      console.log(data)

    }
  };

  return (
    <>
      <div className="text-primary md:text-2xl text-xl font-bold mb-5">Edit Peran</div>
      <form onSubmit={handleSubmit(onSubmit)} className="gap-3 flex flex-col justify-between">
        <div className="wrap-form">
          <div className="wrap">
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
              </div>
            </div>
            <div className="mb-2">
              <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                <div className="flex flex-col mb-2 md:w-1/2 w-full">
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
                <div className="flex flex-col mb-2 md:w-1/2 w-full">
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
        <div className="flex justify-end gap-3">
          <Link href="/kepegawaian/data-pegawai" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
            BATAL
          </Link>
          <Button type="submit" variant="primary" size="lg" className="w-[120px]">
            SIMPAN
          </Button>
        </div>
      </form>
    </>
  )
}

export default EditPeran
