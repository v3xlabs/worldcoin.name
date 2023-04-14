import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { FiArrowRight, FiHelpCircle } from 'react-icons/fi';

import { WorldcoinModal } from '@/components/WorldcoinModal';

function OnboardingSetup() {
    const [showModal, setShowModal] = useState(false);

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
            <div className="flex flex-col justify-center items-center">
                <h3 className="text-gray-800 text-justify mt-4 w-80">
                    You can claim a <b>Worldname</b> by signing in with WorldID.
                    It is free because it is <b>sybil resistant</b>.
                </h3>
                <form className="mt-4 w-80 border-black border-2  focus:outline-none flex">
                    <input
                        className="text-sm flex w-full focus:outline-none p-3 text-right pr-0 text-indigo-700 placeholder:text-left"
                        placeholder="Enter your Worldname"
                    ></input>
                    <div className="flex justify-end text-sm group p-3 pl-0">
                        .worldcoin.name
                    </div>
                </form>
                <Link
                    href="/onboarding/setup"
                    className="worldidbtn hover:bg-black group"
                >
                    <div className="flex justify-center items-center">
                        Claim name
                    </div>
                    <FiArrowRight className="ml-1 group-active:cubic-bezier(.17,.67,.83,.67) group-active:translate-x-72 transition-all duration-200 duration-500" />
                </Link>
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
