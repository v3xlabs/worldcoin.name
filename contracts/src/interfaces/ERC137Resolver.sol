// SPDX-License-Identifier: AGPL-3.0-only

// Something something insert interface here
interface ERC137Resolver {
    event AddrChanged(bytes32 indexed node, address a);

    function addr(bytes32 node) external returns (address);

    // function setAddr(bytes32 node, address addr) external;
}

interface EIP2304 {
    event AddressChanged(bytes32 indexed node, uint coinType, bytes newAddress);

    function addr(bytes32 node, uint coinType) external view returns(bytes memory);

    function setAddr(bytes32 node, uint coinType, bytes calldata addr) external;
}