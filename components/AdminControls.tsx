import { ArrowPathIcon, ArrowUturnDownIcon, CurrencyDollarIcon, StarIcon } from "@heroicons/react/24/solid";
import { useContractCall, useContractData } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import React from "react";
import { Currency } from "../Constants";
import toast from "react-hot-toast";

interface Props {
  contract?: SmartContract | null;
}

const AdminControls = ({ contract }: Props) => {
  const { data: totalCommission } = useContractData(contract, "operatorTotalCommission");
  const { mutateAsync: RefundAll } = useContractCall(contract, "RefundAll");
  const { mutateAsync: restartDraw } = useContractCall(contract, "restartDraw");
  const { mutateAsync: WithdrawCommission } = useContractCall(contract, "WithdrawCommission");
  const { mutateAsync: DrawWinnerTicket } = useContractCall(contract, "DrawWinnerTicket");

  const drawWinner = async () => {
    const notification = toast.loading("Drawing Winner...");
    try {
      await DrawWinnerTicket([{}]);

      toast.success("Winner drawn successfully!", {
        id: notification,
      });
    } catch (errors) {
      toast.error("Oops! Something went wrong!", {
        id: notification,
      });
      console.error("Error while drawing winner", errors);
    }
  };

  const withdrawCommission = async () => {
    const notification = toast.loading("Withdrawing Commission...");
    try {
      await WithdrawCommission([{}]);

      toast.success("Commission withdrawn successfully!", {
        id: notification,
      });
    } catch (errors) {
      toast.error("Oops! Something went wrong!", {
        id: notification,
      });
      console.error("Error while withdrawing commission", errors);
    }
  };

  const restart = async () => {
    const notification = toast.loading("Restarting Draw...");
    try {
      await restartDraw([{}]);

      toast.success("Draw restarted successfully!", {
        id: notification,
      });
    } catch (errors) {
      toast.error("Oops! Something went wrong!", {
        id: notification,
      });
      console.error("Error while restarting draw", errors);
    }
  };

  const refund = async () => {
    const notification = toast.loading("Refunding All...");
    try {
      await RefundAll([{}]);

      toast.success("Refunded All successfully!", {
        id: notification,
      });
    } catch (errors) {
      toast.error("Oops! Something went wrong!", {
        id: notification,
      });
      console.error("Error while refunding all", errors);
    }
  };
  return (
    <div className="text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border">
      <h2 className="font-bold">Admin Controls</h2>
      <p className="mb-5">
        Total Commission to be withdrawn: {totalCommission && ethers.utils.formatEther(totalCommission?.toString())} {Currency}
      </p>
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <button onClick={drawWinner} className="admin-buttons">
          <StarIcon className="h-6 mx-auto mb-2" />
          Draw Winner
        </button>
        <button onClick={withdrawCommission} className="admin-buttons">
          <CurrencyDollarIcon className="h-6 mx-auto mb-2" />
          Withdraw Commission
        </button>
        <button onClick={restart} className="admin-buttons">
          <ArrowPathIcon className="h-6 mx-auto mb-2" />
          Restart Draw
        </button>
        <button onClick={refund} className="admin-buttons">
          <ArrowUturnDownIcon className="h-6 mx-auto mb-2" />
          Refund All
        </button>
      </div>
    </div>
  );
};

export default AdminControls;
