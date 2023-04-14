import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { FiArrowRight, FiHelpCircle } from 'react-icons/fi';

import { WorldcoinModal } from '@/components/WorldcoinModal';

function Home() {
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
                    <b>Everyone </b> deserves to have an <b>ENS Name.</b> This
                    app serves as a demonstration of{' '}
                    <b>sybil resistant name issuance.</b> Simply sign in with
                    the button below, and claim your worldname!
                </h3>
                <h3 className="text-gray-800 text-justify mt-4 w-80">
                    Sybil Resistance is an important factor allowing for{' '}
                    <b>zero registration fees</b> and <b>no KYC</b>. This is a{' '}
                    <b>decentralized</b> application and your data stored on the{' '}
                    <b>Polygon blockchain.</b>
                </h3>
                <Link
                    href="/onboarding/setup"
                    className="worldidbtn hover:bg-black group"
                >
                    <div className="flex justify-center items-center">
                        Continue
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

export default Home;
