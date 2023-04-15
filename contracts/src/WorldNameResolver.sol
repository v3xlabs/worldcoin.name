// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.13;

import {ERC721} from "solmate/tokens/ERC721.sol";

import {ERC137Resolver, EIP2304} from "./interfaces/ERC137Resolver.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";
import {ByteHasher} from "./helpers/ByteHasher.sol";

/**
 * @title WorldNameResolver
 * @dev This contract is the first version of the worlcoin.name resolver.
 * @author luc.eth
 */
contract WorldNameResolver is ERC137Resolver, ERC721 {
    using ByteHasher for bytes;

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  ERRORS                                 ///
    ///////////////////////////////////////////////////////////////////////////////

    /// @notice Throws if called by any account other than the contract supervisor.
    error NotSupervisor();

    /// @notice Throws if the nullifier is invalid.
    error InvalidNullifier();

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  STRUCTS                                ///
    ///////////////////////////////////////////////////////////////////////////////

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

    /// @notice The base token URI
    string public baseTokenURI;

    /// @notice This stores a reference to the worldcoin smartcontracts
    IWorldID public worldID;

    /// @notice The mapping of used nullifier
    mapping(uint256 => bool) internal nullifierHashes;

    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev The contract's external nullifier hash
    uint256 internal immutable externalNullifier;

    /// @dev Linking between tokenId and bytes32
    /// TODO: this is probably hella inneficient and im going to ask a mentor how to do it better lol, please dont let me forget about this comment
    mapping(uint256 => bytes32) internal tokenIdToNode;
    mapping(bytes32 => uint256) internal nodeToTokenId;

    /// @dev Current index of tokenId
    uint256 internal lastTokenId = 1;

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  METHODS                                ///
    ///////////////////////////////////////////////////////////////////////////////

    /// @notice this is the constructor lmeow
    constructor(
        IWorldID _worldID,
        string memory _appId,
        string memory _action,
        string memory _name,
        string memory _symbol,
        string memory _baseTokenURI
    ) ERC721(_name, _symbol) {
        worldID = _worldID;
        baseTokenURI = _baseTokenURI;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _action)
            .hashToField();
    }

    /// @notice Changes the supervisor of the contract to `_supervisor`.
    /// @dev Can only be called by the current supervisor.
    /// @param _supervisor The address of the new supervisor.
    function updateSupervisor(address _supervisor) public payable {
        if (supervisor != msg.sender) revert NotSupervisor();

        supervisor = _supervisor;
        emit SupervisorUpdated(_supervisor);
    }

    /// @notice Changes the tokenURI of the contract
    /// @dev Can only be called by the current supervisor.
    /// @param _baseTokenURI The new base token URI
    function updateBaseTokenURI(string memory _baseTokenURI) public payable {
        if (supervisor != msg.sender) revert NotSupervisor();

        baseTokenURI = _baseTokenURI;
    }

    /// @notice Changes the worldcoin smartcontracts to `_worldID`.
    /// @dev Can only be called by the current supervisor.
    /// @param _worldID The address of the new worldcoin smartcontracts.
    function updateWorldID(IWorldID _worldID) public payable {
        if (supervisor != msg.sender) revert NotSupervisor();

        worldID = _worldID;
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///                                 CLAIM LOGIC                             ///
    ///////////////////////////////////////////////////////////////////////////////

    /// @notice Claims a name
    /// @param node The node to claim
    /// @param root The root of the merkle tree
    /// @param nullifier The nullifier of the claim
    /// @param proof The proof of the claim
    function claimSubname(
        bytes32 node,
        address to,
        uint256 root,
        uint256 nullifier,
        uint256[8] calldata proof
    ) public payable {
        if (nullifierHashes[nullifier]) revert InvalidNullifier();

        worldID.verifyProof(
            root,
            groupId,
            abi.encodePacked(to, node).hashToField(),
            nullifier,
            externalNullifier,
            proof
        );

        nullifierHashes[nullifier] = true;

        tokenIdToNode[lastTokenId] = node;
        nodeToTokenId[node] = lastTokenId;

        _mint(to, lastTokenId++);
    }

    function adminOverwriteLmeow(bytes32 node) public payable {
        if (supervisor != msg.sender) revert NotSupervisor();

        tokenIdToNode[lastTokenId] = node;
        nodeToTokenId[node] = lastTokenId;

        _mint(supervisor, lastTokenId++);
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  MODIFIERS                              ///
    ///////////////////////////////////////////////////////////////////////////////

    /// @notice Name Ownership modifier
    /// @param node The node to check
    modifier onlyOwner(bytes32 node) {
        require(
            ownerOf(nodeToTokenId[node]) == msg.sender,
            "Only owner can call this function."
        );
        _;
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  SET LOGIC                              ///
    ///////////////////////////////////////////////////////////////////////////////

    /// @notice Sets the addr of a node
    /// @param node The node to set
    /// @param addr The address to set
    function setAddr(bytes32 node, address addr) public onlyOwner(node) {
        revert("Not implemented");
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  ERC721                                 ///
    ///////////////////////////////////////////////////////////////////////////////

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    baseTokenURI,
                    tokenId,
                    "/",
                    tokenIdToNode[tokenId],
                    ".json"
                )
            );
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  RESOLUTION                             ///
    ///////////////////////////////////////////////////////////////////////////////

    function addr(bytes32 node) public view returns (address) {
        return ownerOf(nodeToTokenId[node]);
    }

    function isNameTaken(bytes32 node) public view returns (bool) {
        return nodeToTokenId[node] != 0;
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///                                COMPATABILITY                            ///
    ///////////////////////////////////////////////////////////////////////////////

    // TODO: make nice lmeow
    function supportsInterface(
        bytes4 interfaceId
    ) public pure override returns (bool) {
        return interfaceId == 0x0 || interfaceId == 0x3b3b57de; // addr(bytes32 node)
        // interfaceId == 0x691f3431 || // name
        // interfaceId == 0x2203ab56 || // ABI
        // interfaceId == 0xc8690233; // pubkey
        // super.supportsInterface(interfaceId);
    }
}
