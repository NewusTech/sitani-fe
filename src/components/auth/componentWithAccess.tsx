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
		let action = true;
		let count = 0;
		if (Array.isArray(allowPermissions) && Array.isArray(permissions)) {
			for (let i of allowPermissions) {
				if (permissions?.includes(i)) {
					setAccess(true);
					action = false;
					break;
				}
				count++;
			}
		}
		if (action && count === allowPermissions.length) {
			if (toLogin) {
				router.push("/login");
			} else if (toBack) {
				router.back();
			}
		}
	}, [permissions, router, allowPermissions, toBack, toLogin]);

	return <>{access && children}</>;
};

export default ComponentWithAccess;
