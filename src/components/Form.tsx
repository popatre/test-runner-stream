"use client";

import {
    ChangeEvent,
    Dispatch,
    FormEvent,
    SetStateAction,
    useState,
} from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/navigation";

type Props = {
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setIsCloned: Dispatch<SetStateAction<boolean>>;
    setIsError: Dispatch<SetStateAction<boolean>>;
};

// add the test they are doing
// pass to api query

function Form({ setIsLoading, setIsCloned, setIsError }: Props) {
    const [input, setInput] = useState({
        repo: "",
        appType: "news",
        branch: "main",
    });
    const router = useRouter();

    const handleChange = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setInput((prevInput) => {
            return { ...prevInput, [name]: value };
        });
    };

    const isFormComplete = () => {
        return input.repo && input.appType && input.branch;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await fetch("http://localhost:3000/api/clone");
            setIsCloned(true);
            setIsLoading(false);

            router.push(`/report`);
        } catch (error) {
            setIsError(true);
            setIsLoading(false);
        }
    };
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <label>
                Github repo link:
                <input value={input.repo} name="repo" onChange={handleChange} />
            </label>
            <label>
                Branch name:
                <input
                    type="text"
                    value={input.branch}
                    name="branch"
                    onChange={handleChange}
                />
            </label>
            <label>
                App type:
                <select name="appType" onChange={handleChange}>
                    <option value="news">NC News</option>
                    {/* <option value="games">NC Games</option> */}
                </select>
            </label>
            {isFormComplete() && (
                <button disabled={!isFormComplete()} className={styles.button}>
                    Get Feedback
                </button>
            )}
        </form>
    );
}

export default Form;
