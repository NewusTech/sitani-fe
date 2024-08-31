// "use server"
import React from 'react'
import { cookies } from 'next/headers'
import { AxiosResponse } from 'axios';
type Props = {
    data: AxiosResponse
}
const useCookies = ({data}: Props): void => {
    cookies().set({
        name: "refreshToken",
        value: data.data.data.refresh_token,
        httpOnly: true,
        path: "/",
    });
    console.log(cookies().getAll());
}

export default useCookies