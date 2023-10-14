import Reader from "@/components/Reader";
import ReaderContainer from "@/components/TextContainer";
import { Suspense } from "react";

export default async function Home() {
    const stream = await fetch("http://localhost:3000/api/test", {
        next: { revalidate: 0 },
        method: "GET",
    });

    const parsedStreamData = await stream.json();
    console.log(parsedStreamData, "&*&*&*&*&*");

    return (
        <div>
            {parsedStreamData.report.tests.map((test: any) => {
                console.log(test, "((((9");
                return (
                    <div className="border-solid border-black border-2 p-5 my-5 w-4/5 ">
                        <h2>{test.name}</h2>
                        <h2>{test.failure || test.error ? `❌` : `✅`}</h2>
                        <p>{test.error && test.error.cause.name}</p>
                        <p>{test.failure && test.failure.cause.code}</p>
                        {/* <p>{test.failure && test?.failure.cause}</p> */}
                    </div>
                );
            })}
        </div>
    );

    // const reader = stream.body?.getReader();

    // if (!reader) return <p>something went wrong</p>;

    // return (
    //     <Suspense fallback={<Loading />}>
    //         <Reader reader={reader} />
    //     </Suspense>
    // );
}

function Loading() {
    return <h2>Loading...</h2>;
}
