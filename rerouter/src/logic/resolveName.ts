import { HandlerFunc } from '@chainlink/ccip-read-server';
import { Contract, providers } from 'ethers';
import { namehash } from 'ethers/lib/utils';

import { WorldCoinResolverABI } from '../abi/WorldCoinResolverABI';
import { logger } from '../util/logger';

const provider = new providers.JsonRpcProvider('https://rpc.ankr.com/polygon');
const contract = new Contract(
    '0xFeAbAeF48E7c7D8001CE229f35F73C613aAA371A',
    WorldCoinResolverABI
);

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

    const vs = await contract.addr(namehash(name));

    logger.info(vs);

    // Return the result ([result, validUntil, sigData])
    return [vs, Date.now() + 10_000, '0x'];
};
