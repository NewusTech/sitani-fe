"use client"

import React from 'react';
import BerandaIcon from './BerandaIcon';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import BeritaIcon from './BeritaIcon';
import GaleriIcon from './GaleriIcon';
import MoreIcon from './MoreIcon';

interface MenuProps {
  link: string;
  icon: React.ReactNode;
  name: string;
}

const MenuItem = ({ link, icon, name }: MenuProps) => {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <Link href={link}>
      <div className={`menu flex-col flex-shrink-0 w-[70px] h-full flex justify-center items-center ${isActive ? 'border-t-4 border-primary' : ''}`}>
        <div className="icon">
          {icon}
        </div>
        <div className={`text-sm ${isActive ? 'text-primary' : 'text-black'}`}>{name}</div>
      </div>
    </Link>
  );
};

const NavMobile = () => {
  return (
      <div className="nav bg-white shadow-slate-900 shadow-2xl md:hidden w-full h-[80px] fixed bottom-0">
        <div className="wrap-menu flex justify-evenly h-full ">
          <MenuItem link="/beranda" icon={<BerandaIcon />} name="Beranda" />
          <MenuItem link="/berita" icon={<BeritaIcon />} name="Berita" />
          <MenuItem link="/galeri" icon={<GaleriIcon />} name="Galeri" />
          <MenuItem link="/lainnya" icon={<MoreIcon />} name="Lainnya" />
        </div>
    </div>
  );
};

export default NavMobile;
