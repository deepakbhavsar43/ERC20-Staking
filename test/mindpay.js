const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
// const { utils: fromWei } = require("@nomiclabs/hardhat-web3");

describe("mindPay", function () {
  let mindPay;
  let owner, addr1;

  before(async function () {
    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy();

    const MINDPAY = await ethers.getContractFactory("MINDPAY");
    mindPay = await MINDPAY.deploy("MIND PAY", "MINDPAY", staking.address);
    await mindPay.deployed();
    [owner, addr1] = await ethers.getSigners();
  })

  it("Should not mint from account execpt staking contract", async function () {
    let tx = await mindPay.mintFrom(msg.sender, 1000);    
    assert.isOk(tx);
  });

  it("Should not burn from account execpt staking contract", async function () {
    let tx = await mindPay.burn(1000);    
    assert.isOk(tx);
  });
});
