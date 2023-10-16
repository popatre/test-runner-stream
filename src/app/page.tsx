"use client";

import { useState } from "react";
import { Dna, FidgetSpinner } from "react-loader-spinner";
import Form from "@/components/Form";
import styles from "../styles/Home.module.css";

type Props = {};

export default function page({}: Props) {
    const [isCloned, setIsCloned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    if (isError) return <p>Something went wrong</p>;

    if (isLoading)
        return (
            <div>
                <h2>Cloning repo in the cloning lab</h2>
                <Dna height="80" width="80" ariaLabel="loading" />
            </div>
        );

    if (isCloned)
        return (
            <div>
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
            <h1>BE Test Runner</h1>
            <Form
                setIsCloned={setIsCloned}
                setIsLoading={setIsLoading}
                setIsError={setIsError}
            />
        </main>
    );
}
