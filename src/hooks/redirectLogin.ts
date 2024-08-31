import { useRouter } from "next/router"

export default function redirectLogin(condition: boolean, router: any, role: string = 'admin'): void {
    if (condition) router.push('/login/' + role);
}
