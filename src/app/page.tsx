"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {};

export default function page({}: Props) {
    const [isCloned, setIsCloned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const router = useRouter();

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await fetch("http://localhost:3000/api/clone");
            setIsCloned(true);
            setIsLoading(false);
            router.push("/report");
        } catch (error) {}
    };

    return (
        <div>
            <button onClick={handleClick}>Click me</button>
            {isLoading && <p>Loading...</p>}
            {isCloned && <h1>Cloned successfully</h1>}
        </div>
    );
}
