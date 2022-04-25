// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Game is Ownable{
    event Played(uint256 sendAmount);

    uint256 lastHash;
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    
    constructor() {      
    }

    function deposit() public payable onlyOwner{
    }

    function withdraw(uint amount) public onlyOwner{
        payable(owner()).transfer(amount);
    }

    //true for red, false for blue
    function play(bool select) public payable{
        require(msg.value >= (10 ether), "You must pay at least 10CRO for betting");
        require(msg.value <= (200 ether), "You can't bet more than 200 CRO once");
        require(address(this).balance >= msg.value * 2, "Not enough CRO in stock for this");

        
        uint256 blockValue = uint256(blockhash(block.number - 1));
        if (lastHash == blockValue) {
            revert();
        }
        lastHash = blockValue;
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;
        uint sendAmount = 0;
        // if(address(this).balance > 1000 ether)
        if(side == select) {
            sendAmount = msg.value * 198 / 100;
            payable(msg.sender).transfer(sendAmount);
        }
        emit Played(sendAmount);
    }

    function getBalance () public view returns(uint){
        return address(this).balance;
    }
}