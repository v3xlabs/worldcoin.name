import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaSpinner, FaWallet } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';

import useWorldIDStore from '@/state/world-id';
import { decode } from '@/util/world-id';
import { WorldCoinResolverABI } from '@/util/WorldCoinResolverABI';

function Transaction() {
    const router = useRouter();
    const { address } = useAccount();
    const { proof, name, nameHash } = useWorldIDStore();
    const [isWalletLoading, setIsWalletLoading] = useState(false);

    const { data, write } = useContractWrite({
        address: '0xfe8100e8ca8d2d41203cc498aa9e6b7d87fd0d5b',
        functionName: 'claimSubname',
        abi: WorldCoinResolverABI,
        mode: 'recklesslyUnprepared',
        args: [
            nameHash,
            address,
            proof?.merkle_root,
            proof?.nullifier_hash,
            proof && decode<BigInt[]>('uint256[8]', proof?.proof),
        ],
        chainId: 137,
    });

    const register = useCallback(() => {
        setIsWalletLoading(true);
        write();
    }, [write]);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    useEffect(() => {
        if (!isSuccess) return;

        confetti({
            particleCount: 125,
            spread: 50,
            startVelocity: 35,
            origin: {
                y: 0.8,
            },
            zIndex: 10,
        });
    }, [isSuccess]);

    useEffect(() => {
        if (proof && name) return;

        router.push('/onboarding/setup');
    }, [proof]);

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-full border-2 rounded-lg border-black">
                <div className="flex flex-col justify-center items-center">
                    <h3 className="text-gray-800 text-justify mt-4 font-bold text-2xl underline">
                        Confirm
                    </h3>
                    <h3 className="text-gray-800 text-justify px-7 justify-center flex break-all w-full p-4">
                        Please confirm the transaction in your wallet.
                    </h3>
                    <h3 className="text-gray-800 text-justify flex justify-center break-all w-full p-4">
                        You are about to claim the domain:{' '}
                    </h3>
                    <div className="flex font-bold">
                        <div className="text-indigo-500">{name}</div>
                        .worldcoin.name
                    </div>{' '}
                    <div className="mt-6 flex items-center justify-center flex-col">
                        for the address:{' '}
                        <div className="break-all px-8 mt-2 pb-4 text-indigo-500">
                            {address}
                        </div>
                    </div>
                </div>
            </div>

            <button
                className="worldidbtn mt-4 z-20 relative"
                onClick={register}
                disabled={isLoading}
            >
                Sign Transaction
                {!isSuccess &&
                    (isWalletLoading || isLoading ? (
                        <FaSpinner className="ml-2 animate-spin" />
                    ) : (
                        <FaWallet className="ml-2" />
                    ))}
            </button>
        </div>
    );
}

export default Transaction;
