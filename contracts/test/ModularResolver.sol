// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {ModularResolver} from "../src/ModularResolver.sol";

contract ModularResolverTest is Test {
    ModularResolver public controller;

    function setUp() public {
        controller = new ModularResolver();
    }
}
