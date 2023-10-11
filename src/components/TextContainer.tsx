"use client";

type Props = {};

export default function TextContainer({ text }: { text: any }) {
    return (
        <div className=" my-5 w-4/5 ml-auto mr-auto p-2">
            <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
        </div>
    );
}
