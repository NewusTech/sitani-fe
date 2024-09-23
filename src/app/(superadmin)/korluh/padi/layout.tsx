"use client";

import { PERMISSIONS } from "@/utils/permissions";
import ComponentWithAccess from "@/components/auth/componentWithAccess";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface LayoutKorluhProps {
	children: React.ReactNode;
	// title?: string;
}

const links = {
	padi: "/korluh/padi",
};

const LayoutKorluh = (props: LayoutKorluhProps) => {
	const [permissions, setPermissions] = useState<string[]>([
		PERMISSIONS.semua,
	]);
	const pathname = usePathname();

	useEffect(() => {
		if (pathname.startsWith(links.padi)) {
			setPermissions([PERMISSIONS.semua, ...PERMISSIONS.korluhPadi]);
		}
	}, [pathname]);

	return (
		<>
			<ComponentWithAccess allowPermissions={permissions} toLogin={true}>
				{props.children}
			</ComponentWithAccess>
		</>
	);
};

export default LayoutKorluh;
