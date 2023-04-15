import dynamic from 'next/dynamic';

function WorldID() {
    const IDKitWidget = dynamic(
        () => import('@worldcoin/idkit').then((module_) => module_.IDKitWidget),
        { ssr: false }
    );

    return (
        <div>
            <IDKitWidget
                action="claim-domain"
                signal={''}
                onSuccess={(result) => console.log(result)}
                app_id="app_staging_fa67afc60c2f4f7563ee18665ae3b773" // obtain this from developer.worldcoin.org
            >
                {({ open }) => (
                    <button className="worldidbtn px-4" onClick={open}>
                        Sign-in with WorldID
                    </button>
                )}
            </IDKitWidget>
        </div>
    );
}

export default WorldID;
