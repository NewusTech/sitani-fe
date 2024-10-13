import useLocalStorage from "@/hooks/useLocalStorage";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface IComponentWithAccess {
  allowPermissions?: string[];
  children: React.ReactNode;
  toLogin?: boolean;  // jika true, redirect ke login
  toBack?: boolean;   // jika true, redirect ke halaman sebelumnya
  toNotFound?: boolean; // jika true, redirect ke halaman not found jika tidak ada akses
}

const ComponentWithAccess: React.FC<IComponentWithAccess> = ({
  allowPermissions = [],
  toLogin = false,
  toBack = false,
  toNotFound = false,  // tambahkan opsi toNotFound
  children,
}) => {
  const [permissions, setPermissions] = useLocalStorage("permissions", "");
  const [access, setAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // State loading
  const router = useRouter();

  useEffect(() => {
    // Pastikan kita memiliki permissions sebelum melakukan pengecekan
    if (permissions === "" || permissions === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    if (!loading) {
      // Cek apakah permissions ada di localStorage
      if (!permissions || permissions.length === 0) {
        // Jika tidak ada permissions, redirect ke login
        router.push("/login");
        return;
      }

      if (Array.isArray(allowPermissions) && Array.isArray(permissions)) {
        // Cek apakah ada izin yang cocok
        const hasAccess = allowPermissions.some((perm) => permissions.includes(perm));
        setAccess(hasAccess);

        // Jika tidak ada akses, arahkan ke halaman yang sesuai
        if (!hasAccess) {
          if (toLogin) {
            router.push("/login");
          } else if (toBack) {
            router.back();
          } else if (toNotFound) {
            router.push("/not-found");
          }
        }
      } else {
        // Jika permissions bukan array, redirect ke login
        router.push("/login");
      }
    }
  }, [permissions, router, allowPermissions, toBack, toLogin, toNotFound, loading]);

  if (loading) {
	return (
	  <div className="overlay halaman">
		<div className="spinner halaman"></div>
	  </div>
	);
  }

  return <>{access && children}</>;
};

export default ComponentWithAccess;
