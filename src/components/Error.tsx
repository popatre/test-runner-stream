import React from "react";

type Props = {
    status: number;
    message: string;
};

export default function Error({ status, message }: Props) {
    return (
        <div>
            <h2>
                {status}: {message}
            </h2>
        </div>
    );
}
