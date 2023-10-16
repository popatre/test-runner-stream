"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dna, FidgetSpinner } from "react-loader-spinner";

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
        } catch (error) {
            setIsError(true);
            setIsLoading(false);
        }
    };

    if (isError) return <p>Something went wrong</p>;

    return (
        <div>
            <button disabled={isLoading || isCloned} onClick={handleClick}>
                Click me
            </button>
            {isLoading && (
                <div>
                    <h2>Cloning repo in the cloning lab</h2>
                    <Dna height="80" width="80" ariaLabel="loading" />
                </div>
            )}
            {isCloned && (
                <div>
                    <h1>Testing - You will be redirected soon</h1>
                    <FidgetSpinner
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="dna-loading"
                        wrapperStyle={{}}
                        wrapperClass="dna-wrapper"
                        ballColors={["#ff0000", "#00ff00", "#0000ff"]}
                        backgroundColor="#F4442E"
                    />
                </div>
            )}
        </div>
    );
}
