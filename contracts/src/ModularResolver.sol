// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import {ERC137Resolver} from "./ERC137Resolver.sol";

/**
 * @title ModularResolver
 * @dev This contract is the first version of the modular resolver.
 * @author luc.eth
 */
contract ModularResolver is ERC137Resolver {
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
    ///                                  STRUCTS                                ///
    ///////////////////////////////////////////////////////////////////////////////

    /// @notice Data stored about certain nodes and how they should resolve
    struct CCIPSettings {
        string[] urls; // URLs of CCIP gateways
        string pubKey; // Public Key to accept signature of
        // other stuff here
    }

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

    bytes4 public selector = this.callbackAddr.selector;

    /// @notice The mapping of node to CCIPSettings
    mapping(bytes32 => CCIPSettings) public nodeToSettings;

    string[] urls = ["http://localhost:3000"];

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

    function addr(bytes32 node) public view returns (address) {        
        revert OffchainLookup(
            address(this),
            urls,
            bytes(""), // calldata
            selector,
            abi.encode(node)
        );
    }

    function callbackAddr(
        bytes calldata response,
        bytes calldata extraData
    ) public view returns (address) {
        // Something something callback
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///                                COMPATABILITY                            ///
    ///////////////////////////////////////////////////////////////////////////////

    // TODO: make nice lmeow
    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return
            interfaceId == 0x0 ||
            interfaceId == 0x3b3b57de || // addr(bytes32 node)
            interfaceId == 0x691f3431 || // name
            interfaceId == 0x2203ab56 || // ABI
            interfaceId == 0xc8690233; // pubkey
        // super.supportsInterface(interfaceId);
    }
}
