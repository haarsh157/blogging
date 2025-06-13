"use client";
import Link from "next/link";

const SetupPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-[100vw] max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-[100vw] justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by Signing in&nbsp;
        </p>
        <div className="fixed bottom-0 left-0 flex h-32 w-[100vw] items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none backdrop-filter backdrop-blur-xl">
          <span className="cursor-pointer flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0">
            <Link
              href="/dashboard"
              className=" cursor-pointer px-4 py-2 rounded-full  relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:text-slate-800 text-xl font-extrabold bg-slate-300 "
            >
              Sign-in
            </Link>
          </span>
        </div>
      </div>

      <div className="after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px] animate-pulse duration-5000">
        <p className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:text-white md:text-9xl text-6xl mb-14 mt-10 font-extrabold ">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Blog
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
            Circle
          </span>
        </p>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
    </main>
  );
};

export default SetupPage;
