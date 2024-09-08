import React, { useState, useEffect } from 'react';

interface propsDash {
    value?: number;
    label?: string;
}

const DashCard = ({ value = 0, label = "label" }: propsDash) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 2000; // Duration of the animation in milliseconds
        const increment = value / (duration / 10); // Calculate the increment for each step
        let currentVal = 0;

        const counter = setInterval(() => {
            currentVal += increment;
            if (currentVal >= value) {
                clearInterval(counter);
                setDisplayValue(value);
            } else {
                setDisplayValue(Math.floor(currentVal));
            }
        }, 10); // Interval speed

        return () => clearInterval(counter);
    }, [value]);

    return (
        <div className="card h-[110px] md:h-[130px] bg-[url('/../assets/images/card.png')] bg-no-repeat bg-center bg-cover rounded-lg p-3 py-4 text-white flex flex-col justify-between">
            <div className="font-semibold text-3xl md:text-4xl">{displayValue}</div>
            <div className="text-base">{label || "label"}</div>
        </div>
    );
}

export default DashCard;
