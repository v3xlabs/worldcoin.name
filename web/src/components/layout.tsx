import { AnimatePresence } from 'framer-motion';
import { FC, PropsWithChildren } from 'react';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="h-screen w-screen flex flex-col">
            <a
                href="/"
                className="flex justify-center items-center px-10 mt-44 py-4"
            >
                <img
                    src="/logounofficial.svg"
                    alt="logo"
                    className="w-96 mb-2"
                />
            </a>
            <div className="w-full max-w-sm mx-auto md:px-0 px-6 text-lg">
                <AnimatePresence>{children}</AnimatePresence>
            </div>
            <div className="absolute bottom-0 right-0 items-center pb-2 pr-2">
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
