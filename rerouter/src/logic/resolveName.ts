import { HandlerFunc } from '@chainlink/ccip-read-server';
import { Contract, providers, utils } from 'ethers';
import { hexConcat, namehash } from 'ethers/lib/utils';

import { signer } from '..';
import { WorldCoinResolverABI } from '../abi/WorldCoinResolverABI';
import { logger } from '../util/logger';
import { Resolver } from './interThing';

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

    try {
        const { signature, args } = Resolver.parseTransaction({ data });

        const vs = await contract.addr(namehash(name));

        logger.info(vs);

        logger.debug('response', signature, args);

        const result = Resolver.encodeFunctionResult(signature, vs);
        const validUntil = Math.floor(Date.now() / 1000 + 10_000);

        // Return the result ([result, validUntil, sigData])
        // Hash and sign the response
        const messageHash = utils.solidityKeccak256(
            ['bytes', 'address', 'uint64', 'bytes32', 'bytes32'],
            [
                '0x1900',
                request?.to,
                validUntil,
                utils.keccak256(request?.data || '0x'),
                utils.keccak256(result),
            ]
        );
        const sig = signer.signDigest(messageHash);
        const sigData = hexConcat([sig.r, sig.s, '0x' + sig.v.toString(16)]);

        console.log(sigData);

        return [result, validUntil, sigData];
    } catch (error) {
        logger.debug(error);

        return [[0], Date.now() + 10_000, '0x'];
    }
};
