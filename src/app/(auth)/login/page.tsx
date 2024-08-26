import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import Label from '@/components/ui/label'
import Emailicon from '../../../../public/icons/EmailIcon'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Login = () => {
  return (
    <>
      <div className="grid grid-1 lg:grid-cols-[60%_minmax(40%,_1fr)]">
        <div className="hidden lg:block">
          <Image src="/assets/images/bg-login.png" width={300} height={300} alt="SITANI | Sistem Informasi Data Pertanian Lampung Timur" className="h-screen w-full" />
        </div>
        <div className="relative">
          <div className="bg-green-300 m-auto justify-center w-full p-10 lg:p-20">
            <h1 className='text-2xl mb-10 text-primary font-semibold'>Silahkan Masuk</h1>
            <div className="email flex flex-col mb-5">
              <Label label="Email / NIP" />
              <Input
                autoFocus
                leftIcon={<Emailicon />}
                type="email"
                placeholder="Email / NIP"
              />
            </div>
            <div className="email flex flex-col">
              <Label label="Password" />
              <Input
                type="password"
                placeholder="Kata Sandi"
              />
            </div>
            <div className="mt-2">
              <Link href="/admin/forget-password" className='text-primary'>Lupa kata sandi ?</Link>
            </div>
            <div className="mt-10">
              <Button type="submit" variant="primary" size="lg" className='m-auto flex' >Masuk</Button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center text-primary gap-1">
            <span>copyright 2024</span><span>&copy;</span><span className='font-bold'>SITANI</span><span>
              Lampung Timur</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login