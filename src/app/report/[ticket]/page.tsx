import findInRepo from "@/utils/findInRepo";

type Props = { params: { ticket: string } };

export default async function Home({ params }: Props) {
    const { ticket } = params;

    const stream = await fetch(
        `http://localhost:3000/api/test?ticket=${ticket}`,
        {
            next: { revalidate: 0 },
            method: "GET",
        }
    );

    const parsedStreamData = await stream.json();

    const logsFound = await findInRepo(
        "console.log",
        `${__dirname}/../../../../../src/evaluations`
    );
    const testOnlysFound = findInRepo(
        "test.only",
        `${__dirname}/../../../../../src/evaluations`
    );
    const itOnlysFound = findInRepo(
        "it.only",
        `${__dirname}/../../../../../src/evaluations`
    );
    const describeOnlysFound = findInRepo(
        "describe.only",
        `${__dirname}/../../../../../src/evaluations`
    );
    const onlysFound = await Promise.all([
        testOnlysFound,
        itOnlysFound,
        describeOnlysFound,
    ]);

    const isOnlysPresent = (
        onlyResults: [
            string | undefined,
            string | undefined,
            string | undefined
        ]
    ) => {
        for (const result of onlyResults) {
            if (result && result.length > 0) {
                return true;
            }
        }
        return false;
    };

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
                            <h2>
                                {test.failure || test.error ? `❌` : `✅`}{" "}
                                {test.name}
                            </h2>

                            <p>{test.error && test.error.cause.name}</p>
                            <p>{test.failure && test.failure.cause.code}</p>
                            {/* <p>{test.failure && test?.failure.cause}</p> */}
                        </div>
                    )
                );
            })}

            <pre
                className=""
                style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            >
                <div
                    className={`text-white font-semibold text-lg border-solid border-black border-2 p-5 my-5 w-1/2 mr-auto ml-auto rounded-md ${
                        logsFound?.length ? `bg-red-500` : `bg-emerald-400`
                    }`}
                >
                    <h2 className="">Console logs found: </h2>
                    {logsFound?.length ? `${logsFound}` : "none"}
                </div>
            </pre>
            <pre
                className=""
                style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                }}
            >
                <div
                    className={`text-white font-semibold text-lg border-solid border-black border-2 p-5 my-5 w-1/2 mr-auto ml-auto rounded-md ${
                        isOnlysPresent(onlysFound)
                            ? `bg-red-500`
                            : `bg-emerald-400`
                    }`}
                >
                    <h2>.onlys found: </h2>
                    {isOnlysPresent(onlysFound)
                        ? onlysFound.map((result) => {
                              return <h2>{result}</h2>;
                          })
                        : `✅ none`}
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
