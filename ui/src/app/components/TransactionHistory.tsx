import React, { useState, useRef } from "react";
import {
  useTransactionManager,
  useWaitForTransaction,
} from "@starknet-react/core";
import { TxStatus } from "./TxStatus";
import { Metadata } from "../types";
import { Button } from "./Button";
import { padAddress, shortenHex } from "../lib/utils";
import useOnClickOutside from "../hooks/useOnClickOutside";
import useLoadingStore from "../hooks/useLoadingStore";
import useAdventurerStore from "../hooks/useAdventurerStore";
import { processNotification } from "./NotificationDisplay";
import { useQueriesStore } from "../hooks/useQueryStore";
import useCustomQuery from "../hooks/useCustomQuery";
import { useMediaQuery } from "react-responsive";
import useUIStore from "../hooks/useUIStore";
import { MdClose } from "react-icons/md";

const TransactionHistory = () => {
  const wrapperRef = useRef<HTMLDivElement>(null); // Update the type here
  useOnClickOutside(wrapperRef, () => setIsOpen(false));
  const { adventurer } = useAdventurerStore();

  const { hashes, transactions, addTransaction } = useTransactionManager();
  const [isOpen, setIsOpen] = useState(false);
  const [hash, setHash] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useWaitForTransaction({
    hash,
    watch: true,
  });
  const { data: queryData } = useQueriesStore();
  const displayHistory = useUIStore((state) => state.displayHistory);
  const setDisplayHistory = useUIStore((state) => state.setDisplayHistory);

  const beasts = queryData.beastsByAdventurerQuery
    ? queryData.beastsByAdventurerQuery.beasts
    : [];

  const method = (transactions[0]?.metadata as Metadata)?.method;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const history = useLoadingStore((state) => state.history);

  return (
    <>
      {displayHistory ? (
        transactions ? (
          <div
            ref={wrapperRef}
            className="absolute m-auto right-8 sm:right-16 top-20 sm:top-32 z-10 w-[300px] sm:w-[650px] h-[250px] p-4 bg-terminal-black border border-terminal-green overflow-x-auto table-scroll"
          >
            <div className="flex flex-row justify-between">
              <p className="text-2xl">Ledger</p>
              <button
                onClick={() => setDisplayHistory(false)}
                className="text-red-500 hover:text-red-700"
              >
                <MdClose size={40} />
              </button>
            </div>
            <div className="w-full border border-terminal-green" />
            <ul>
              {transactions
                .slice()
                .reverse()
                .map((tx, i) => {
                  const response = history.find(
                    (response) => response.hash == tx.hash
                  );
                  let notification: React.ReactNode = null;
                  const battles = queryData.battlesByBeastQuery
                    ? queryData.battlesByBeastQuery.battles
                    : [];
                  const beast = queryData.beastByIdQuery
                    ? queryData.beastByIdQuery.beasts[0]
                    : [];
                  if (response) {
                    notification = processNotification(
                      response.type,
                      response.notificationData,
                      adventurer,
                      battles,
                      !!adventurer?.beastId,
                      beast,
                      beasts
                    );
                  }
                  return (
                    <li
                      key={i}
                      className="p-1 m-1 border border-terminal-green"
                    >
                      <div className="flex flex-col">
                        <div className="flex flex-row justify-between border-b border-terminal-green">
                          {/* <div className="flex flex-wrap gap-1"> */}
                          <p className="text-lg text-terminal-yellow">
                            {(tx?.metadata as Metadata)?.method}
                          </p>
                          {/* </div> */}
                          <div className="mr-4 text-lg">
                            Hash:{" "}
                            <a
                              href={`https://testnet.starkscan.co/tx/${padAddress(
                                tx.hash
                              )}`}
                              target="_blank"
                            >
                              {shortenHex(tx.hash)}
                            </a>
                          </div>
                          <TxStatus hash={tx.hash} />
                        </div>
                        {response && notification}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : (
          <div className="absolute right-0 z-10 border top-10 w-96 h-96 bg-terminal-black border-terminal-green">
            <p className="p-2 text-white">No transactions</p>
          </div>
        )
      ) : null}
    </>
  );
};

export default TransactionHistory;
