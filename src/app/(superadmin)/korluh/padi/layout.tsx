"use client";

import { PERMISSIONS } from "@/utils/permissions";
import ComponentWithAccess from "@/components/auth/componentWithAccess";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2"; // Import SweetAlert2 for loading spinner

interface LayoutKorluhProps {
  children: React.ReactNode;
}

const links = {
  padiDetail: "/korluh/padi/detail",
  padiTambah: "/korluh/padi/tambah",
  padiUbah: "/korluh/padi/tambah",
  padi: "/korluh/padi",
};

const LayoutKorluh = (props: LayoutKorluhProps) => {
  const [permissions, setPermissions] = useState<string[]>([
    PERMISSIONS.semua,
    ...PERMISSIONS.korluhPadi,
  ]);
  const [loading, setLoading] = useState(true); // Add loading state
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Show SweetAlert2 loading spinner
    Swal.fire({
      title: "Loading...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setLoading(true); // Start loading
    if (
      pathname.startsWith(links.padi) ||
      pathname.startsWith(links.padiDetail)
    ) {
      setPermissions([PERMISSIONS.semua, ...PERMISSIONS.korluhPadi]);
    } else if (pathname.startsWith(links.padiTambah)) {
      setPermissions([PERMISSIONS.semua, PERMISSIONS.korluhPadi[0]]);
    } else if (pathname.startsWith(links.padiUbah)) {
      setPermissions([PERMISSIONS.semua, PERMISSIONS.korluhPadi[2]]);
    } else {
      // If no matching route, redirect to 404
      router.push("/not-found");
    }

    // Simulate loading time or wait until permissions are updated
    setTimeout(() => {
      setLoading(false); // Stop loading
      Swal.close(); // Close SweetAlert2 when loading is done
    }, 1000); // Adjust this timeout as necessary
  }, [pathname, router]);

  if (loading) {
    return null; // Do not render children while loading
  }

  return (
    <ComponentWithAccess allowPermissions={permissions} toNotFound={true}>
      {props.children}
    </ComponentWithAccess>
  );
};

export default LayoutKorluh;
