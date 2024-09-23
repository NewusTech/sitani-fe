// components/ComponentWithAccess.tsx
import useLocalStorage from "@/hooks/useLocalStorage";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface IComponentWithAccess {
	allowPermissions?: string[];
	children: React.ReactNode;
	toLogin?: boolean;
	toBack?: boolean;
}

const ComponentWithAccess: React.FC<IComponentWithAccess> = ({
	allowPermissions = [],
	toLogin = false,
	toBack = false,
	children,
}) => {
	const [permissions, setPermissions] = useLocalStorage("permissions", "");
	const [access, setAccess] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		if (Array.isArray(allowPermissions) && Array.isArray(permissions)) {
			const temp = allowPermissions.some((i) => permissions.includes(i));
			setAccess(temp);
			if (!temp) {
				if (toLogin) {
					router.push("/login");
				} else if (toBack) {
					router.back();
				}
			}
		} else {
			router.push("/login");
		}
	}, [permissions, router, allowPermissions, toBack, toLogin]);

	return <>{access && children}</>;
};

export default ComponentWithAccess;
