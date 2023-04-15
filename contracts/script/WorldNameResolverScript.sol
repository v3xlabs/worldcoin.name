// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {WorldNameResolver} from "../src/WorldNameResolver.sol";
import {IWorldID} from "../src/interfaces/IWorldID.sol";

contract WorldNameResolverScript is Script {
    function setUp() public {}

    function run() public {
        uint256 seedPhrase = vm.envUint("TOTAL_KEY");
        // uint256 privateKey = vm.deriveKey(seedPhrase, 0);

        vm.startBroadcast(seedPhrase);

        IWorldID worldId = IWorldID(0xD81dE4BCEf43840a2883e5730d014630eA6b7c4A);

        WorldNameResolver controller = new WorldNameResolver(
            worldId,
            "app_staging_fa67afc60c2f4f7563ee18665ae3b773",
            "claim-domain",
            "WorldName",
            "WRLD",
            "https://metadata.worldcoin.name/"
        );

        // WorldNameResolver controller = WorldNameResolver(0xFeAbAeF48E7c7D8001CE229f35F73C613aAA371A);

        controller.adminOverwriteLmeow(
            0x54211e959068718996a3adf8d126fbded5d0a7fcb0c2eea0a0bd856a3c60c5eb
        );

        vm.stopBroadcast();
    }
}
