import { IDKitWidget } from '@worldcoin/idkit';
import { utils } from 'ethers';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { FiAlertTriangle, FiArrowRight, FiHelpCircle } from 'react-icons/fi';
import { useDebounce } from 'use-debounce';
import { useAccount, useContractRead, useDisconnect } from 'wagmi';

import { StatusIcon } from '@/components/StatusIcon';
import { WorldcoinModal } from '@/components/WorldcoinModal';
import { WorldCoinResolverABI } from '@/util/WorldCoinResolverABI';

const cleanName = (v) => {
    return v.replace(/[^\da-z]/g, '').toLowerCase();
};

function OnboardingSetup() {
    const [showModal, setShowModal] = useState(false);

    const { disconnect } = useDisconnect();

    const { isConnected, address } = useAccount();

    const { push } = useRouter();

    useEffect(() => {
        if (!isConnected) {
            push('/onboarding');
        }
    }, [isConnected]);

    // TO DO: write function that redirects the user to /onboarding/verify, once they've chosen an available domain

    const [domain, setDomain] = useState('');
    const [value] = useDebounce(domain, 200);

    const nameHash = useMemo(() => {
        try {
            return utils.namehash(value + '.worldcoin.name');
        } catch {
            console.log('Happy little trees!');
        }
    }, [value]);

    const { isFetching, isError, isSuccess, error, data } = useContractRead({
        chainId: 137,
        args: [nameHash],
        address: '0xfeabaef48e7c7d8001ce229f35f73c613aaa371a',
        abi: WorldCoinResolverABI,
        functionName: 'isNameTaken',
    });

    const loadingState = useMemo(() => {
        if (value.length === 0) return 'none';

        if (isFetching) return 'loading';

        if (isError) return 'error';

        if (isSuccess) {
            return !data ? 'available' : 'taken';
        }

        return 'error';
    }, [data, isSuccess, isError, isFetching, value]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{
                duration: 0.5,
                type: 'spring',
                stiffness: 260,
                damping: 20,
            }}
        >
            <div className="flex gap-3 flex-col justify-center items-center">
                <p className="text-gray-800 text-justify mt-4">
                    You can claim a <b>Worldname</b> by signing in with WorldID.
                    It is free because it is <b>sybil resistant</b>.
                </p>
                <p className="w-full break-all text-sm">
                    You are signed in as{' '}
                    <span className="font-semibold">{address}</span>,{' '}
                    <button
                        className="inline font-medium hover:underline text-indigo-600"
                        onClick={() => disconnect()}
                    >
                        sign in with a different wallet
                    </button>
                </p>
                <form className="mt-4 border-black border-2 w-full focus:outline-none flex items-center">
                    <div className="pl-2">
                        <StatusIcon state={loadingState} />
                    </div>
                    <input
                        className="text-xl flex w-full focus:outline-none p-2 text-right pr-0 text-indigo-700 placeholder:text-left placeholder:text-base"
                        placeholder="Enter your Worldname"
                        onChange={(event) => {
                            setDomain(cleanName(event.target.value));
                        }}
                    ></input>
                    <div className="flex justify-end text-lg group p-3 pl-0">
                        .worldcoin.name
                    </div>
                </form>
                <IDKitWidget
                    action="claim-domain"
                    signal={''}
                    onSuccess={(result) => console.log(result)}
                    app_id="app_staging_fa67afc60c2f4f7563ee18665ae3b773" // obtain this from developer.worldcoin.org
                >
                    {({ open }) => (
                        <button
                            className="worldidbtn hover:bg-black group"
                            onClick={open}
                        >
                            <div className="flex justify-center items-center">
                                Reserve name
                            </div>
                            <FiArrowRight className="ml-1 group-active:cubic-bezier(.17,.67,.83,.67) group-active:translate-x-72 transition-all duration-200 duration-500" />
                        </button>
                    )}
                </IDKitWidget>
                <div className="text-red-600 text-sm text-justify mt-4 flex gap-2 items-center">
                    <FiAlertTriangle className="w-4 h-4" />
                    <p>
                        Warning, you can only claim a Worldname once, choose
                        carefully.
                    </p>
                </div>
                <div className="text-red-600 text-sm text-justify flex gap-2 items-center">
                    <FiAlertTriangle className="w-6 h-6" />
                    <p>
                        Make sure to use an external wallet, NOT the Worldcoin
                        wallet as it is not yet supported for transfers.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowModal(true);
                    }}
                    className="flex flex-row justify-center items-center mt-4 text-sm group hover:cursor-pointer"
                >
                    {' '}
                    What is
                    <span className="text-indigo-700 ml-1 group-hover:underline">
                        {' '}
                        Worldcoin?
                    </span>
                    <FiHelpCircle className="ml-1" />
                </button>
            </div>

            <WorldcoinModal
                showModal={showModal}
                onClose={() => {
                    setShowModal(false);
                }}
            />
        </motion.div>
    );
}

export default OnboardingSetup;
