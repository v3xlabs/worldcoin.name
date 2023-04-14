import 'tailwindcss/tailwind.css';
import '@/styles/styles.css';

import { Inter } from 'next/font/google';

const inter = Inter({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
});

const App = ({ Component, pageProps }) => {
    return (
        <div className={inter.className}>
            <Component {...pageProps} />
        </div>
    );
};

export default App;
