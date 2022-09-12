import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import { useAddress, useContract } from "@thirdweb-dev/react";
import Login from "../components/Login";
import Loading from "../components/Loading";
import NextDraw from "../components/NextDraw";

const Home: NextPage = () => {
  const address = useAddress();
  const { contract, isLoading } = useContract(process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS);

  if (isLoading) return <Loading />;

  if (!address) return <Login />;

  return (
    <div className="bg-[#091818] min-h-screen flex flex-col flex-1">
      <Head>
        <title>Lottery App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <NextDraw contract={contract} address={address} />
    </div>
  );
};

export default Home;
