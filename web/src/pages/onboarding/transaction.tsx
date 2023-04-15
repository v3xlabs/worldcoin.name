import confetti from 'canvas-confetti';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { FaSpinner, FaWallet } from 'react-icons/fa';
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
            <div className="w-full">
                <div className="flex flex-col justify-center items-center gap-3 text-base">
                    <p>You are only one step away from your worldname!</p>
                    <p>
                        By clicking the <b>"Claim"</b> button below you will:
                    </p>
                    <div className="font-bold border p-2 w-full text-center">
                        <div className="text-sm">Receive the name</div>
                        <div>
                            <span className="text-indigo-500">{name}</span>
                            .worldcoin.name
                        </div>
                    </div>
                    <div className="font-bold border p-2 w-full text-center">
                        <div className="text-sm">Prove you are</div>
                        <div>a unique human</div>
                    </div>
                    <div className="text-sm text-left">
                        The name will be sent to:{' '}
                        <a
                            href={`https://polygonscan.com/address/${address}`}
                            target="_blank"
                            className="break-all text-indigo-500 hover:underline"
                        >
                            {address}
                        </a>
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
