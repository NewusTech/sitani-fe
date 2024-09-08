"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label';
import Emailicon from '../../../../public/icons/EmailIcon';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Alamat email tidak valid" }),
  password: z
    .string()
    .min(6, { message: "Password wajib diisi minimal harus 6 karakter" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormSchemaType) => {
    setLoading(true); // Set loading to true when the form is submitted
    setLoginError(null); // Reset any previous errors
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Login berhasil:', result);
        reset();
        router.push('/dashboard'); // Ganti dengan rute tujuan setelah login
      } else {
        setLoginError(result.message || 'Login gagal. Silakan coba lagi.');
      }
    } catch (error) {
      router.push('/dashboard');
      // alert
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Login!',
        text: 'Selamat Datang ✅',
        timer: 3000,
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
      // console.error('Error:', error);
      // setLoginError('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[60%_minmax(40%,_1fr)]">
        {/* Background Image Section */}
        <div className="hidden lg:block">
          <Image
            src="/assets/images/bg-login.png"
            width={300}
            height={300}
            alt="SITANI | Sistem Informasi Data Pertanian Lampung Timur"
            className="h-screen w-full"
          />
        </div>

        {/* Login Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center justify-center">
          <div className="w-full">
            <div className="left container mx-auto py-2 flex items-center gap-2">
              <div className="logo">
                <Image src="/assets/images/logo.png" alt="logo" width={100} height={100} unoptimized className='w-[50px]' />
              </div>
              <div className="teks">
                <div className="head font-bold text-xl md:text-3xl text-primary">SITANI</div>
                <div className="head text-sm md:text-base">Sistem Informasi Data Pertanian Lampung Timur</div>
              </div>
            </div>
            <div className="m-5 pl-5 pr-5 pt-5 pb-5 lg:pb-0 lg:pt-0  md:border-none lg:border-none  border-2 border-primary rounded-lg">
              <h1 className="text-xl lg:text-[24px] mb-5 md:mb-5 text-primary font-semibold text-left">
                Silahkan Masuk
              </h1>
              <div className="flex flex-col mb-2">
                <Label className='text-[14px] pb-1' label="Email / NIP" />
                <Input
                  autoFocus
                  leftIcon={<Emailicon />}
                  type="email"
                  placeholder="Email / NIP"
                  {...register('email')}
                  className={`${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <HelperError>{errors.email.message}</HelperError>
                )}
              </div>

              <div className="flex flex-col">
                <Label className='text-[14px] pb-1' label="Password" />
                <Input
                  type="password"
                  placeholder="Kata Sandi"
                  {...register('password')}
                  className={`${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && (
                  <HelperError>{errors.password.message}</HelperError>
                )}
              </div>

              {loginError && (
                <div className="text-red-500 mt-2">
                  {loginError}
                </div>
              )}

              <div className="text-left underline mt-2">
                <Link href="/admin/forget-password" className="text-primary text-[14px]">
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="mt-5 text-center">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading} // Disable button during loading
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    'Masuk'
                  )}
                </Button>
              </div>
              {/* <div className="mt-5 text-center w-full">
                <Link href="/dashboard" className="block w-full p-2 text-white bg-primary rounded-full">
                  Masuk
                </Link>
              </div>
            </div>
            {/* Footer Section */}
              <div className="text-[14px] lg:text-sm bottom-0 left-0 right-0 flex justify-center text-primary gap-1 py-2 bg-white">
                <span>copyright 2024</span>
                <span>&copy;</span>
                <span className="font-bold">SITANI</span>
                <span>Lampung Timur</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
