import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

function Home() {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col justify-center items-center">
                <img src="/longlogo.svg" alt="logo" className="w-64" />
                <h3 className="text-gray-800 text-center mt-4">
                    Using WorldID just got a whole lot easier.
                </h3>
                <Link
                    className="worldidbtn cubic-bezier(.17,.67,.83,.67) hover:bg-black group"
                    href="/onboarding"
                >
                    <div className="flex justify-center items-center">
                        Get Started
                    </div>
                    <FiArrowRight className="ml-1 group-active:translate-x-72 group-active:cubic-bezier(.17,.67,.83,.67) transition-all duration-500" />
                </Link>
            </div>
        </div>
    );
}

export default Home;
