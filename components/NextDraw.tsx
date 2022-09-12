import React, { useEffect, useState } from "react";
import { useContractCall, useContractData } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { ClipLoader } from "react-spinners";
import { ethers } from "ethers";
import { Currency } from "../Constants";
import CountDownTimer from "./CountDownTimer";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import AdminControls from "./AdminControls";

interface Props {
  contract?: SmartContract | null;
  address?: string;
}

const NextDraw = ({ contract, address }: Props) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [userTickets, setUserTickets] = useState<number>(0);
  const { isLoading, data: remainingTickets } = useContractData(contract, "RemainingTickets");
  const { data: currentWinningReward } = useContractData(contract, "CurrentWinningReward");
  const { data: ticketPrice } = useContractData(contract, "ticketPrice");
  const { data: ticketCommission } = useContractData(contract, "ticketCommission");
  const { data: expiration } = useContractData(contract, "expiration");
  const { mutateAsync: BuyTickets } = useContractCall(contract, "BuyTickets");
  const { data: tickets } = useContractData(contract, "getTickets");
  const { data: winnings } = useContractData(contract, "getWinningsForAddress", address);
  const { mutateAsync: WithdrawWinnings } = useContractCall(contract, "WithdrawWinnings");
  const { data: lastWinner } = useContractData(contract, "lastWinner");
  const { data: lastWinnerAmount } = useContractData(contract, "lastWinnerAmount");
  const { data: lotteryOperator } = useContractData(contract, "lotteryOperator");

  useEffect(() => {
    if (!tickets) return;
    const totalTickets: string[] = tickets;
    const numberOfUserTickets = totalTickets.reduce((total, ticketAddress) => (ticketAddress === address ? total + 1 : total), 0);
    setUserTickets(numberOfUserTickets);
  }, [tickets, address]);

  const handleBuyTickets = async () => {
    if (!ticketPrice) return;
    const notification = toast.loading("Buying your Tickets...");
    try {
      await BuyTickets([
        {
          value: ethers.utils.parseEther((Number(ethers.utils.formatEther(ticketPrice)) * quantity).toString()),
        },
      ]);

      toast.success("Tickets purchased successfully!", {
        id: notification,
      });
    } catch (errors) {
      toast.error("Oops! Something went wrong!", {
        id: notification,
      });
      console.error("Error while buying tickets", errors);
    }
  };

  const onWithDrawWinnings = async () => {
    if (winnings <= 0) return;
    const notification = toast.loading("Withdrawing Winnings...");
    try {
      await WithdrawWinnings([{}]);
      toast.success("Winnings withdrawn successfully!", {
        id: notification,
      });
    } catch (errors) {
      toast.error("Oops! Something went wrong!", {
        id: notification,
      });
      console.error("Error while withdrawing winnings", errors);
    }
  };

  return isLoading ? (
    <div className="flex-1 flex items-center justify-center">
      <ClipLoader color="white" size={50} className="flex items-center justify-center" />
    </div>
  ) : (
    <>
      <Marquee gradient={false} speed={100} className="bg-[#091F1C] p-5 mb-5">
        <div className="flex space-x-2 mx-10">
          <h4 className="text-white font-bold">Last Winner: {lastWinner?.toString()}</h4>
          <h4 className="text-white font-bold">Pervious Winnings: {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}</h4>
        </div>
      </Marquee>
      {lotteryOperator === address && (
        <div className="flex justify-center">
          <AdminControls contract={contract} />
        </div>
      )}
      {winnings > 0 && (
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
          <button onClick={onWithDrawWinnings} className="p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full">
            <p className="font-bold">Winner Winner Chicken Dinner!!</p>
            <p>
              Total Winnings {ethers.utils.formatEther(winnings.toString())} {Currency}
            </p>
            <br />
            <p className="font-semibold">Click here to withdraw</p>
          </button>
        </div>
      )}
      <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
        <div className="stats-container">
          <h1 className="text-5xl text-white font-semibold text-center">The Next Draw</h1>
          <div className="flex justify-between p-2 space-x-2">
            <div className="stats">
              <h2 className="text-sm">Total Poll</h2>
              <p className="text-xl">{currentWinningReward && ethers.utils.formatEther(currentWinningReward.toString()) + " " + Currency}</p>
            </div>
            <div className="stats">
              <h2 className="text-sm">Tickets Remaining</h2>
              <p className="text-xl">{remainingTickets?.toNumber()}</p>
            </div>
          </div>
          <div className="mt-5 mb-3">
            <CountDownTimer expiration={expiration.toNumber()} />
          </div>
        </div>
        <div className="stats-container space-y-2">
          <div className="stats-container">
            <div className="flex justify-between items-center text-white pb-2">
              <h2>Price per Ticket</h2>
              <p>{ticketPrice && ethers.utils.formatEther(ticketPrice.toString()) + " " + Currency}</p>
            </div>
            <div className="flex text-white items-center space-x-2 border p-4 bg-[#091818] border-[#004337]">
              <p>TICKETS</p>
              <input type="number" min={1} max={10} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="flex w-full bg-transparent text-right outline-none" />
            </div>
            <div className="space-y-2 mt-5">
              <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
                <p>Total cost of tickets </p>
                <p>{ticketPrice && " " + Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity + " " + Currency}</p>
              </div>
              <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                <p>Service fees</p>
                <p>{ticketCommission && ethers.utils.formatEther(ticketCommission.toString()) + " " + Currency}</p>
              </div>
              <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                <p>Network fees</p>
                <p>T&C</p>
              </div>
            </div>
            <button onClick={handleBuyTickets} disabled={expiration?.toString() < Date.now().toString() || remainingTickets?.toNumber() === 0} className="mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed disabled:text-gray-100 font-semibold">
              Buy {quantity} Tickets for {ticketPrice && " " + Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity + " " + Currency}
            </button>
          </div>
          {userTickets > 0 && (
            <div className="stats">
              <p className="text-lg mb-2">You have {userTickets} Tickets in this draw.</p>
              <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                {Array(userTickets)
                  .fill("")
                  .map((_, index) => (
                    <p key={index} className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic">
                      {index + 1}
                    </p>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NextDraw;
