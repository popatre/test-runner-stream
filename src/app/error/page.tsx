import Error from "@/components/Error";
import React from "react";

export default function ErrorPage() {
    return <Error status={400} message="something went wrong" />;
}
