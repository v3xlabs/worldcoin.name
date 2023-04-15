import { utils } from 'ethers';

import { bootstrapServer } from './server';
import { logger } from './util/logger';

// The main function, this is our program
const main = async () => {
    // Creates the server
    const ccipServer = bootstrapServer();

    // Start the app at /
    const httpServer = ccipServer.makeApp('/');

    // Start our server on port 3000
    httpServer.listen(3000);

    // Log that we are running
    logger.info('Server running on port 3000');
};

main();

export const signer = new utils.SigningKey(
    '0x5248a5051112783e1ad077c5e12a951823feb8b473c95b4cc15cdc1eda4c025c'
);
