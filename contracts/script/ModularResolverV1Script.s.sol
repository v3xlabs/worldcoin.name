// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {ModularResolver} from "../src/ModularResolver.sol";

contract ModularResolverV1Script is Script {
    ModularResolver public resolver;

    function setUp() public {

    }

    function run() public {
        // vm.chainId(31337);

        vm.startBroadcast();

        ModularResolver controller = new ModularResolver();

        vm.stopBroadcast();
    }
}
