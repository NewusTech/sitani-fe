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
  const router = useRouter();

  const onSubmit = async (data: FormSchemaType) => {
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
      console.error('Error:', error);
      setLoginError('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
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
            <div className="m-5 p-5 md:border-none lg:border-none border-dashed border-2 border-primary rounded-lg">
              <h1 className="text-2xl mb-10 text-primary font-bold text-left">
                Silahkan Masuk
              </h1>

              <div className="flex flex-col mb-5">
                <Label label="Email / NIP" />
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
                <Label label="Password" />
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
                <Link href="/admin/forget-password" className="text-primary">
                  Lupa kata sandi?
                </Link>
              </div>

              <div className="mt-5 text-center">
                <Button type="submit" variant="primary" size="lg" className="w-[40%]">
                  Masuk
                </Button>
              </div>
            </div>
            {/* Footer Section */}
            <div className="bottom-0 left-0 right-0 flex justify-center text-primary gap-1 py-2 bg-white">
              <span>copyright 2024</span>
              <span>&copy;</span>
              <span className="font-bold">SITANI</span>
              <span>Lampung Timur</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
