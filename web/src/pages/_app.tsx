import 'tailwindcss/tailwind.css';
import '@/styles/styles.css';

import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { createClient, WagmiConfig } from 'wagmi';
import { polygon } from 'wagmi/chains';

import { Layout } from '@/components/layout';

const client = createClient(
    getDefaultClient({
        appName: 'Worldname',
        chains: [polygon],
    })
);

const inter = Inter({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
});

const App = ({ Component, pageProps }) => {
    const { pathname } = useRouter();

    // eslint-disable-next-line no-undef
    if (pathname === '/')
        return (
            <div className={inter.className}>
                <Component {...pageProps} />
            </div>
        );

    return (
        <WagmiConfig client={client}>
            <ConnectKitProvider theme="minimal" mode="light">
                <div className={inter.className}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </div>
            </ConnectKitProvider>
        </WagmiConfig>
    );
};

export default App;
