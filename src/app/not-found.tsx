import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function notFound() {
  return (
    <section className="container min-h-screen flex flex-col py-[5rem] justify-center items-center">

      <h2 className="text-center text-xl mb-2">
        Opps... Sepertinya halaman yang anda cari tidak ditemukan
      </h2>
      <Link href="/" className=" text-center mt-4 mb-[5rem] rounded-full py-2 bg-primary text-white px-10 transition ease-in-out delay-150 hover:-translate-y-1">
        Kembali Kehalaman Utama
      </Link>
    </section>
  );
}
