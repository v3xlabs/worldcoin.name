import { HandlerFunc } from '@chainlink/ccip-read-server';

import { logger } from '../util/logger';

function decodeDnsName(dnsname: Buffer) {
    const labels = [];
    let index = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const length = dnsname.readUInt8(index);

        if (length === 0) break;

        labels.push(
            dnsname.slice(index + 1, index + length + 1).toString('utf8')
        );
        index += length + 1;
    }

    return labels.join('.');
}

/**
 * This function handles resolution for ENS names when the gateway is prompted
 * @param input The encoded name aswell as contract data
 * @param request The RPCCall that triggered this function
 * @returns A signed off result for the users query
 */
export const resolveName: HandlerFunc = async (input, request) => {
    // Destructure the input
    const [encodedName, data] = input;

    // Debug log the input
    logger.debug('resolveName', { encodedName, data });

    const name = decodeDnsName(Buffer.from(encodedName.slice(2), 'hex'));

    logger.debug('NAMEEE', name);

    // Return the result ([result, validUntil, sigData])
    return [];
};
