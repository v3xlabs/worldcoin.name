import { AnimatePresence } from 'framer-motion';
import { FC, PropsWithChildren } from 'react';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="h-screen w-screen flex flex-col">
            <a
                href="/"
                className="flex justify-center items-center px-10 mt-44 py-4"
            >
                <img src="/longlogo.svg" alt="logo" className="w-64 mb-2" />
            </a>
            <div className="w-full max-w-xs mx-auto">
                <AnimatePresence>{children}</AnimatePresence>
            </div>
            <div className="absolute bottom-0 right-0 items-center">
                <div>
                    <span className="text-gray-500 text-sm mr-2">
                        Made with 💕 by{' '}
                        <a
                            className="hover:underline hover:cursor-pointer"
                            href="https://twitter.com/AnaArsonist"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Ana
                        </a>{' '}
                        and{' '}
                        <a
                            className="hover:underline hover:cursor-pointer"
                            href="https://twitter.com/LucemansNL"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Luc
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
};
