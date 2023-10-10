import { Suspense } from "react";

export default async function Home() {
    const fetched = await fetch("http://localhost:3000/api/test");

    const reader = fetched.body?.getReader();

    if (!reader) return <p>something went wrong</p>;

    return (
        <Suspense>
            <Reader reader={reader} />
        </Suspense>
    );
}

async function Reader({
    reader,
}: {
    reader: ReadableStreamDefaultReader<any>;
}) {
    const { done, value } = await reader.read();

    if (done) {
        return null;
    }

    const text = new TextDecoder().decode(value);
    const testResults = text.split("#");
    const lines = testResults.map((text) => text.split("\n"));
    return (
        <span>
            {lines.map((line) => {
                return <h2>{line[1]}</h2>;
            })}
            <Suspense>
                <Reader reader={reader} />
            </Suspense>
        </span>
    );
}
