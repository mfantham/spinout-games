import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import SpinoutGame from "../islands/SpinoutGame.tsx";

export default define.page(function Home() {
  return (
    <>
      <Head>
        <title>Spinout Puzzle</title>
      </Head>
      <SpinoutGame />
    </>
  );
});
