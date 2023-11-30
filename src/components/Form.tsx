"use client";

import {
    ChangeEvent,
    Dispatch,
    FormEvent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/navigation";
// import { TICKET_DETAILS } from "@/constants/ticketOptions";

type Props = {
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setIsCloned: Dispatch<SetStateAction<boolean>>;
    setIsError: Dispatch<SetStateAction<boolean>>;
};

type Ticket = { ticketValue: string; body: string };

function Form({ setIsLoading, setIsCloned, setIsError }: Props) {
    const [input, setInput] = useState({
        repo: "",
        appType: "news",
        branch: "main",
        ticket: "all",
    });
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/tickets`
                );

                if (!response.ok) {
                    throw new Error();
                }

                const parsedResponse = await response.json();
                setTickets(parsedResponse.tickets);
                setIsLoading(false);
            } catch (error) {
                setIsError(true);
                setIsLoading(false);
            }
        };
        fetchTickets();
    }, []);

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
            <div className="flex-col">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Github repo link:
                </label>
                <input
                    value={input.repo}
                    name="repo"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>
            <div className="flex-col">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Branch name:
                </label>
                <input
                    type="text"
                    value={input.branch}
                    name="branch"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>
            <div className="flex-col">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    App type:
                </label>
                <select
                    name="appType"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option value="news">NC News</option>
                    {/* <option value="games">NC Games</option> */}
                </select>
            </div>

            <div className="flex-col">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select a ticket:
                </label>
                {tickets.length ? (
                    <select
                        name="ticket"
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        {tickets.map((ticket) => {
                            return (
                                <option
                                    key={ticket.ticketValue}
                                    value={ticket.ticketValue}
                                >
                                    {ticket.body}
                                </option>
                            );
                        })}
                    </select>
                ) : (
                    <select
                        disabled
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option>Loading tickets...</option>
                    </select>
                )}
            </div>
            {isFormComplete() && (
                <button disabled={!isFormComplete()} className={styles.button}>
                    Get Feedback
                </button>
            )}
        </form>
    );
}

export default Form;
