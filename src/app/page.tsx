"use client";

import { useState } from "react";
import { Dna, FidgetSpinner } from "react-loader-spinner";
import Form from "@/components/Form";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/navigation";

type Props = {};

export default function page({}: Props) {
    const [isCloned, setIsCloned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const router = useRouter();

    if (isError) {
        router.push(`/error`);
    }

    if (isLoading)
        return (
            <div className="h-screen flex items-center justify-center font-bold text-xl">
                <h2>Cloning repo in the cloning lab</h2>
                <Dna height="80" width="80" ariaLabel="loading" />
            </div>
        );

    if (isCloned)
        return (
            <div className="h-screen flex items-center justify-center font-bold text-xl">
                <h1>Testing - You will be redirected soon</h1>
                <FidgetSpinner
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="fidget-spinner-loading"
                    wrapperStyle={{}}
                    ballColors={["#ff0000", "#00ff00", "#0000ff"]}
                    backgroundColor="#F4442E"
                />
            </div>
        );

    return (
        <main className={styles.main}>
            <h1 className="font-bold text-4xl">BE Test Runner</h1>
            <Form
                setIsCloned={setIsCloned}
                setIsLoading={setIsLoading}
                setIsError={setIsError}
            />
        </main>
    );
}
