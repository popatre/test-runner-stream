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

function Form({ setIsLoading, setIsCloned, setIsError }: Props) {
    const [input, setInput] = useState({
        repo: "",
        appType: "news",
        branch: "main",
        ticket: "all",
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
            const response = await fetch(
                `http://localhost:3000/api/clone?repo=${input.repo}&branch=${input.branch}&app=${input.appType}`
            );

            if (!response.ok) {
                throw new Error();
            }

            setIsCloned(true);
            setIsLoading(false);

            router.push(`/report/${input.ticket}`);
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
            <label>
                Select a ticket:
                <select name="ticket" onChange={handleChange}>
                    <option value="all">All tickets</option>
                    <option value="ticket-3">#3 - GET /api/topics</option>
                    <option value="ticket-4">
                        #4 - GET /api/articles/:article_id
                    </option>
                    <option value="ticket-5">#5 - GET /api/articles</option>
                    <option value="ticket-6">
                        #6 - GET /api/articles/:article_id/comments
                    </option>
                    <option value="ticket-7">
                        #7 - POST /api/articles/:article_id/comments
                    </option>
                    <option value="ticket-8">
                        #8 - PATCH /api/articles/:article_id
                    </option>
                    <option value="ticket-9">
                        #9 - DELETE /api/comments/:comment_id
                    </option>
                    <option value="ticket-10">#10 - GET /api/users</option>
                    <option value="ticket-11">
                        #11 - GET /api/articles (queries)
                    </option>
                    <option value="ticket-12">
                        #12 - GET /api/articles/:article_id (comment_count)
                    </option>
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
