import findInRepo from "@/utils/findInRepo";

export default async function Home() {
    const stream = await fetch("http://localhost:3000/api/test", {
        next: { revalidate: 0 },
        method: "GET",
    });

    const parsedStreamData = await stream.json();

    const logsFound = await findInRepo(
        "console.log",
        `${__dirname}/../../../server`
    );
    const testOnlysFound = findInRepo(
        "test.only",
        `${__dirname}/../../../server`
    );
    const itOnlysFound = findInRepo("it.only", `${__dirname}/../../../server`);
    const describeOnlysFound = findInRepo(
        "describe.only",
        `${__dirname}/../../../server`
    );
    const onlysFound = await Promise.all([
        testOnlysFound,
        itOnlysFound,
        describeOnlysFound,
    ]);
    console.log(onlysFound, "))))))))))))");

    return (
        <div>
            {parsedStreamData.report.tests.map((test: any) => {
                const resultColourStyles =
                    test.failure || test.error
                        ? `bg-red-500`
                        : `bg-emerald-400`;

                return (
                    !test.skip && (
                        <div
                            className={`text-white font-semibold text-lg border-solid border-black border-2 p-5 my-5 w-1/2 mr-auto ml-auto rounded-md ${resultColourStyles}`}
                        >
                            <h2>{test.name}</h2>
                            <h2>{test.failure || test.error ? `❌` : `✅`}</h2>
                            <p>{test.error && test.error.cause.name}</p>
                            <p>{test.failure && test.failure.cause.code}</p>
                            {/* <p>{test.failure && test?.failure.cause}</p> */}
                        </div>
                    )
                );
            })}
            {/* <h2>{logsFound}</h2> */}

            <pre className="" style={{ whiteSpace: "pre-wrap" }}>
                <div
                    className={`font-semibold text-lg border-solid border-black border-2 p-5 my-5 w-1/2 mr-auto ml-auto rounded-md`}
                >
                    <h2>Console logs found: </h2>
                    {logsFound}
                </div>
            </pre>
            <pre className="" style={{ whiteSpace: "pre-wrap" }}>
                <div
                    className={`font-semibold text-lg border-solid border-black border-2 p-5 my-5 w-1/2 mr-auto ml-auto rounded-md`}
                >
                    <h2>.onlys found: </h2>
                    {onlysFound.map((result) => {
                        return <h2>{result}</h2>;
                    })}
                </div>
            </pre>
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
