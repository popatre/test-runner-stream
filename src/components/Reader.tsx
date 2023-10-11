import { Suspense } from "react";
import TextContainer from "./TextContainer";

export default async function Reader({
    reader,
}: {
    reader: ReadableStreamDefaultReader<any>;
}) {
    const { done, value } = await reader.read();

    if (done) {
        console.log(done, "********");
        console.log('all done, "&&&&&');
        return <p>Finished</p>;
        return null;
    }

    const text = new TextDecoder().decode(value);

    return (
        <span>
            <TextContainer text={text} />
            <Suspense>
                <Reader reader={reader} />
            </Suspense>
        </span>
    );
}
