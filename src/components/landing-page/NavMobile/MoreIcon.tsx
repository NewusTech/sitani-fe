import React from 'react';
import { usePathname } from 'next/navigation';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link';


const MoreIcon = () => {
    const pathname = usePathname();

    return (
        <>
            <Sheet>
                <SheetTrigger>
                    <svg className={`${pathname.startsWith("/lainnya") ? "stroke-primary" : "stroke-black"}`} width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.2699 1.47034H2.8099C2.56856 1.47034 2.33709 1.56621 2.16644 1.73687C1.99578 1.90753 1.8999 2.13899 1.8999 2.38034V7.84034C1.8999 8.08168 1.99578 8.31315 2.16644 8.4838C2.33709 8.65446 2.56856 8.75034 2.8099 8.75034H8.2699C8.51125 8.75034 8.74271 8.65446 8.91337 8.4838C9.08403 8.31315 9.1799 8.08168 9.1799 7.84034V2.38034C9.1799 2.13899 9.08403 1.90753 8.91337 1.73687C8.74271 1.56621 8.51125 1.47034 8.2699 1.47034ZM8.2699 12.3903H2.8099C2.56856 12.3903 2.33709 12.4862 2.16644 12.6569C1.99578 12.8275 1.8999 13.059 1.8999 13.3003V18.7603C1.8999 19.0017 1.99578 19.2331 2.16644 19.4038C2.33709 19.5745 2.56856 19.6703 2.8099 19.6703H8.2699C8.51125 19.6703 8.74271 19.5745 8.91337 19.4038C9.08403 19.2331 9.1799 19.0017 9.1799 18.7603V13.3003C9.1799 13.059 9.08403 12.8275 8.91337 12.6569C8.74271 12.4862 8.51125 12.3903 8.2699 12.3903ZM19.1899 1.47034H13.7299C13.4886 1.47034 13.2571 1.56621 13.0864 1.73687C12.9158 1.90753 12.8199 2.13899 12.8199 2.38034V7.84034C12.8199 8.08168 12.9158 8.31315 13.0864 8.4838C13.2571 8.65446 13.4886 8.75034 13.7299 8.75034H19.1899C19.4312 8.75034 19.6627 8.65446 19.8334 8.4838C20.004 8.31315 20.0999 8.08168 20.0999 7.84034V2.38034C20.0999 2.13899 20.004 1.90753 19.8334 1.73687C19.6627 1.56621 19.4312 1.47034 19.1899 1.47034Z" strokeWidth="1.89803" strokeLinejoin="round" />
                        <path d="M12.8198 12.3904H20.0998M16.4598 16.0304H20.0998M12.8198 19.6704H20.0998" strokeWidth="1.89803" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </SheetTrigger>
                <SheetContent className='bg-primary-600'>
                    <SheetHeader>
                        {/* <SheetTitle className='mt-10'>Menu Lainnya</SheetTitle> */}
                        <SheetDescription className='mt-10'>
                            <div className="flex flex-col items-end gap-3">
                                <Link href={"/data/harga-produsen-dan-eceran"} className="opacity-1 w-full">
                                    <div className="p-3 ease-in duration-300 hover:bg-primary hover:text-white hover:font-semibold bg-white w-full rounded-full  text-primary">
                                        Daftar harga produsen
                                        dan eceran
                                    </div>
                                </Link>
                                <Link href={"/data/koefisien-variasi-produksi"} className="opacity-1 w-full">
                                    <div className="p-3 ease-in duration-300 hover:bg-primary hover:text-white hover:font-semibold bg-white w-full rounded-full  text-primary">
                                        Koefesian variasi tingkat
                                        produksi
                                    </div>
                                </Link>
                                <Link href={"/data/koefisien-variasi-produsen"} className="opacity-1 w-full">
                                    <div className="p-3 ease-in duration-300 hover:bg-primary hover:text-white hover:font-semibold bg-white w-full rounded-full  text-primary">
                                        Koefesian variasi tingkat
                                        produsen
                                    </div>
                                </Link>
                                <Link href={"/data/perbandingan-komoditas-harga-panen"} className="opacity-1 w-full">
                                    <div className="p-3 ease-in duration-300 hover:bg-primary hover:text-white hover:font-semibold bg-white w-full rounded-full  text-primary">
                                        Perbandingan komoditas
                                        harga panen tingkat
                                        eceran
                                    </div>
                                </Link>
                                <Link href={"/login"} className='mt-5 bg-primary w-full rounded-full  text-white p-3'>
                                    Login
                                </Link>
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default MoreIcon;
