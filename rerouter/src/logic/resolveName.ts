import { HandlerFunc } from '@chainlink/ccip-read-server';
import { Contract, providers, utils } from 'ethers';
import { namehash } from 'ethers/lib/utils';

import { ENS_Resolver_ABI } from '../abi/ENS_Resolver_ABI';
import { WorldCoinResolverABI } from '../abi/WorldCoinResolverABI';
import { logger } from '../util/logger';

const provider = new providers.JsonRpcProvider('https://rpc.ankr.com/polygon');
const contract = new Contract(
    '0x1f159dad0f918c3a84785ee6f090b5e9ee911dd2',
    WorldCoinResolverABI,
    provider
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

const Resolver = new utils.Interface(ENS_Resolver_ABI);

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

    // Parse the data nested inside the second argument to `resolve`
    const { signature, args } = Resolver.parseTransaction({ data });

    try {
        const vs = await contract.addr(namehash(name));

        logger.info(vs);
        const response = Resolver.encodeFunctionResult(signature, [vs]);

        logger.debug('response', response);

        // Return the result ([result, validUntil, sigData])
        return [response, Date.now() + 10_000, '0x'];
    } catch (error) {
        logger.debug(error);

        return [[0], Date.now() + 10_000, '0x'];
    }
};
