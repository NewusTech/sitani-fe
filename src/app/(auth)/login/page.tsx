import React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label';
import Emailicon from '../../../../public/icons/EmailIcon';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Login = () => {
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
        <form className="flex items-center justify-center">
          <div className="w-full">
            <div className="m-14">
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
                />
              </div>

              <div className="flex flex-col">
                <Label label="Password" />
                <Input
                  type="password"
                  placeholder="Kata Sandi"
                />
              </div>

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
