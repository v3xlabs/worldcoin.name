import { motion } from 'framer-motion';
import { FC } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export const StatusIcon: FC<{
    state: 'loading' | 'error' | 'available' | 'taken' | 'none';
}> = ({ state }) => {
    switch (state) {
        case 'none':
            return;
        case 'loading':
            return (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    exit={{ scale: 0 }}
                >
                    <img
                        src="/logo.svg"
                        alt="loading"
                        className="animate-spin w-10"
                    />
                </motion.div>
            );
        case 'error':
            return (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    exit={{ scale: 0 }}
                >
                    <FiXCircle className="flex text-red-500 w-6 h-6" />{' '}
                </motion.div>
            );
        case 'available':
            return (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    exit={{ scale: 0 }}
                >
                    <FiCheckCircle className="flex text-green-500 w-6 h-6" />
                </motion.div>
            );
        // eslint-disable-next-line sonarjs/no-duplicated-branches
        case 'taken':
            return <FiXCircle className="flex text-red-500 w-6 h-6" />;
    }
};
