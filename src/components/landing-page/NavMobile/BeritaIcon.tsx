import React from 'react';
import { usePathname } from 'next/navigation';

const BeritaIcon = () => {
    const pathname = usePathname();

    return (
        <svg className={`${pathname.startsWith("/berita") ? "fill-primary" : "fill-black"}`} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.77865 21.1407C2.13269 21.1407 1.5799 20.9109 1.12028 20.4513C0.660669 19.9917 0.43047 19.4385 0.429688 18.7917V2.34897C0.429688 1.703 0.659886 1.15021 1.12028 0.690596C1.58068 0.230982 2.13347 0.000782989 2.77865 0H15.698L21.5704 5.87242V18.7917C21.5704 19.4377 21.3406 19.9909 20.881 20.4513C20.4214 20.9117 19.8682 21.1415 19.2214 21.1407H2.77865ZM2.77865 18.7917H19.2214V7.0469H14.5235V2.34897H2.77865V18.7917ZM5.12762 16.4428H16.8725V14.0938H5.12762V16.4428ZM5.12762 7.0469H11V4.69793H5.12762V7.0469ZM5.12762 11.7448H16.8725V9.39587H5.12762V11.7448Z" />
        </svg>
    );
};

export default BeritaIcon;
