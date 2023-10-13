import Reader from "@/components/Reader";
import ReaderContainer from "@/components/TextContainer";
import { Suspense } from "react";

export default async function Home() {
    const stream = await fetch("http://localhost:3000/api/test", {
        next: { revalidate: 0 },
        method: "GET",
    });

    const reader = stream.body?.getReader();

    if (!reader) return <p>something went wrong</p>;

    return (
        <Suspense fallback={<Loading />}>
            <Reader reader={reader} />
        </Suspense>
    );
}

function Loading() {
    return <h2>Loading...</h2>;
}
