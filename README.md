## Test Runner

## Prerequisites

Must use node 20.8.0 or above to use node test suite

## Setup

        npm install

## How to use

-   Start the server

          npm run dev

Server starts on localhost:3000

-   Copy the github link to the students repo, then copy the name of the branch they are working on.

-   Select the ticket they are currently working on

-   Run the test - anything in red is a failing test. This will require you to investigate further.

## Misc

-   Tests runs a regex to match the test name to the selected option. All tests start with the ticket number and route to enable them to be selected. Any changes made in the constants folder should be made to the test name too.
