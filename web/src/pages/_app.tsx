import 'tailwindcss/tailwind.css';
import '@/styles/styles.css';

import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';

import { Layout } from '@/components/layout';

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
        <div className={inter.className}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </div>
    );
};

export default App;
