// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.13;

import {ERC137Resolver} from "./interfaces/ERC137Resolver.sol";

interface IExtendedResolver {
    function resolve(bytes memory name, bytes memory data) external view returns(bytes memory);
}

interface IResolverService {
    function resolve(bytes calldata name, bytes calldata data) external view returns(bytes memory result, uint64 expires, bytes memory sig);
}

/**
 * @title CCIPResolver
 * @dev This contract is the first version of the ccip resolver for worldcoin.name
 * @author luc.eth
 */
contract CCIPResolver is IExtendedResolver {
    ///////////////////////////////////////////////////////////////////////////////
    ///                                  ERRORS                                 ///
    ///////////////////////////////////////////////////////////////////////////////

    /// @notice Throws if called by any account other than the contract supervisor.
    error NotSupervisor();

    /// @notice this is how the CCIP magic happens, read more in EIP-3668.
    error OffchainLookup(
        address sender,
        string[] urls,
        bytes callData,
        bytes4 callbackFunction,
        bytes extraData
    );

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  EVENTS                                 ///
    ///////////////////////////////////////////////////////////////////////////////

    /// @notice Emitted when the supervisor of the contract changes.
    /// @param supervisor The address of the new supervisor.
    event SupervisorUpdated(address supervisor);

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  STORAGE                                ///
    ///////////////////////////////////////////////////////////////////////////////

    /// @notice The address of the supervisor.
    address public supervisor = msg.sender;

    bytes4 public selector = this.resolve.selector;

    string[] urls = ["https://api.worldcoin.name/{sender}/{data}.json"];

    bytes32 publicKey;

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  METHODS                                ///
    ///////////////////////////////////////////////////////////////////////////////

    /// @notice this is the constructor lmeow
    constructor() {}

    /// @notice Changes the supervisor of the contract to `_supervisor`.
    /// @dev Can only be called by the current supervisor.
    /// @param _supervisor The address of the new supervisor.
    function updateSupervisor(address _supervisor) public payable {
        if (supervisor != msg.sender) revert NotSupervisor();

        supervisor = _supervisor;
        emit SupervisorUpdated(_supervisor);
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  RESOLUTION                             ///
    ///////////////////////////////////////////////////////////////////////////////

    function resolve(
        bytes calldata name,
        bytes calldata data
    ) external view returns (bytes memory) {
        bytes memory callData = abi.encodeWithSelector(
            IResolverService.resolve.selector,
            name,
            data
        );

        revert OffchainLookup(
            address(this),
            urls,
            callData,
            CCIPResolver.resolveWithProof.selector,
            callData
        );
    }

    function resolveWithProof(
        bytes calldata response,
        bytes calldata extraData
    ) external view returns (bytes memory) {
        // Something something callback
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///                                COMPATABILITY                            ///
    ///////////////////////////////////////////////////////////////////////////////

    // TODO: make nice lmeow
    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return
            interfaceId == 0x0 ||
            interfaceId == type(IExtendedResolver).interfaceId;
            // interfaceId == 0x3b3b57de || // addr(bytes32 node)
            // interfaceId == 0x691f3431 || // name
            // interfaceId == 0x2203ab56 || // ABI
            // interfaceId == 0xc8690233; // pubkey
        // super.supportsInterface(interfaceId);
    }
}
