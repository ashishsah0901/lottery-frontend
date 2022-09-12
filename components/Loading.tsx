import Head from "next/head";
import React from "react";
import PropagateLoader from "react-spinners/PropagateLoader";

const Loading = () => {
  return (
    <div className="bg-[#091818] min-h-screen flex flex-col items-center justify-center">
      <Head>
        <title>Loading...</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center space-x-2 mb-10">
        <img className="h-20 w-20 rounded-full" src="https://cdn-icons-png.flaticon.com/512/536/536139.png" alt="" />
        <h1 className="text-lg text-white font-bold">Loading The Lottery App</h1>
      </div>
      <PropagateLoader color="white" size={30} />
    </div>
  );
};

export default Loading;
