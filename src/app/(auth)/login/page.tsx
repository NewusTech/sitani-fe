import React from 'react'
import Image from 'next/image'

const LoginPage = () => {
  return (
    <>
      <div className="grid grid-cols-[700px_minmax(400px,_1fr)]">
        <div className="bg-blue-300">
          <Image src={"/assets/images/bg-login.png"} width={500} height={500} alt="SITANI | Sistem Informasi Data Pertanian Lampung Timur" className="h-full w-full object-cover"/>
        </div>
        <div className="bg-green-300">test</div>
      </div>
    </>
  )
}

export default LoginPage