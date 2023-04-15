import WorldID from '@/components/worldid';

function Verify() {
    return (
        <div className="flex flex-col justify-center items-center">
            <h3 className="text-gray-800 text-justify mt-4">
                You can claim a <b>Worldname</b> by signing in with WorldID. It
                is free because it is <b>sybil resistant</b>.
            </h3>
            <WorldID />
        </div>
    );
}

export default Verify;
