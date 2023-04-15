import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FaSpinner, FaWallet } from 'react-icons/fa';
import { useAccount, useContractWrite } from 'wagmi';

import useWorldIDStore from '@/state/world-id';
import { WorldCoinResolverABI } from '@/util/WorldCoinResolverABI';
import { decode } from '@/util/world-id';

function Transaction() {
    const router = useRouter();
    const { address } = useAccount();
    const { proof, name, nameHash } = useWorldIDStore();

    const { data, write, isLoading } = useContractWrite({
        address: '0xfeabaef48e7c7d8001ce229f35f73c613aaa371a',
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
        overrides: {
            gasLimit: 1000000,
        },
        chainId: 137,
    });

    useEffect(() => {
        if (proof && name) return;

        router.push('/onboarding/setup');
    }, [proof]);

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-full border-2 rounded-lg border-black">
                <div className="flex flex-col justify-center items-center">
                    <h3 className="text-gray-800 text-justify mt-4 font-bold text-xl">
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
                className="worldidbtn mt-4"
                onClick={() => write()}
                disabled={isLoading}
            >
                Sign Transaction
                <FaWallet className="ml-2" />
                <FaSpinner className="ml-2 animate-spin" />
            </button>
        </div>
    );
}

export default Transaction;
