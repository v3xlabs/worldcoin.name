// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {CCIPResolver} from "../src/CCIPResolver.sol";

contract ModularResolverV1Script is Script {
    function setUp() public {

    }

    function run() public {
        uint256 seedPhrase = vm.envUint("TOTAL_KEY");
        // uint256 privateKey = vm.deriveKey(seedPhrase, 0);

        vm.startBroadcast(seedPhrase);

        CCIPResolver controller = new CCIPResolver();

        vm.stopBroadcast();
    }
}
