import { useMetamask } from "@thirdweb-dev/react";
import Head from "next/head";
import React from "react";

const Login = () => {
  const connectWithMetaMask = useMetamask();

  return (
    <div className="bg-[#091818] min-h-screen flex flex-col justify-center items-center text-center">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center mb-50">
        <img className="rounded-full h-56 w-56 mb-10" src="https://cdn-icons-png.flaticon.com/512/536/536139.png" alt="" />
        <h1 className="text-6xl text-white font-bold">The Lottery App</h1>
        <h2 className="text-white mt-5">Get Started by logging in with your Metamask</h2>
        <button onClick={connectWithMetaMask} className="bg-white px-8 py-5 mt-10 rounded-lg font-bold shadow-lg">Login With MetaMask</button>
      </div>
    </div>
  );
};

export default Login;
