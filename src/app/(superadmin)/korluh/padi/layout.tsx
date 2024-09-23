"use client";

import { PERMISSIONS } from "@/utils/permissions";
import ComponentWithAccess from "@/components/auth/componentWithAccess";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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
	const pathname = usePathname();

	useEffect(() => {
		if (
			pathname.startsWith(links.padi) ||
			pathname.startsWith(links.padiDetail)
		) {
			setPermissions([PERMISSIONS.semua, ...PERMISSIONS.korluhPadi]);
		} else if (pathname.startsWith(links.padiTambah)) {
			setPermissions([PERMISSIONS.semua, PERMISSIONS.korluhPadi[0]]);
		} else if (pathname.startsWith(links.padiUbah)) {
			setPermissions([PERMISSIONS.semua, PERMISSIONS.korluhPadi[2]]);
		}
	}, [pathname]);

	return (
		<>
			<ComponentWithAccess allowPermissions={permissions}>
				{props.children}
			</ComponentWithAccess>
		</>
	);
};

export default LayoutKorluh;
