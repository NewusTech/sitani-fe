import Link from 'next/link';
import React from 'react'

interface HeadDashProps {
    link?: string;
    label: string;
}

const HeaderDash = (props: HeadDashProps) => {
    return (
        <div className="head flex justify-between">
            <div className="text-primary text-lg font-semibold">
                {props.label || "label"}
            </div>
            <Link href={props.link || "/"} className="text-primary font-medium hover:underline">
                View All
            </Link>
        </div>
    )
}


export default HeaderDash