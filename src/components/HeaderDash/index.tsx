import Link from 'next/link';
import React from 'react'

interface HeadDashProps {
    link?: string;
    label: string;
}

const HeaderDash = (props: HeadDashProps) => {
    return (
        <div className="head flex gap-3 justify-between">
            <div className="text-primary text-base md:text-lg font-semibold">
                {props.label || "label"}
            </div>
            <Link href={props.link || "/"} className="text-primary text-sm md:text-base font-medium hover:underline flex-shrink-0">
                View All
            </Link>
        </div>
    )
}


export default HeaderDash