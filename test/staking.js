const { expect, assert } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("staking", function () {
    let mindPay, staking, liquidity;
    let owner, addr1, addr2, addr3;
    let provider;

    before(async function () {
        provider = waffle.provider;

        const Liquidity = await ethers.getContractFactory("liquidity");
        liquidity = await Liquidity.deploy();
        
        const Staking = await ethers.getContractFactory("Staking");
        staking = await Staking.deploy(liquidity.address);
        await staking.deployed();
        const MINDPAY = await ethers.getContractFactory("MINDPAY");
        mindPay = await MINDPAY.deploy("MIND PAY", "MINDPAY", staking.address);
        await mindPay.deployed();

        await staking.setTokenAddress(mindPay.address);

        [owner, addr1, addr2, addr3] = await ethers.getSigners();
    })

    it("should invest into mindpay", async function () {
        let tx = await staking.connect(addr2).invest({ value: ethers.utils.parseEther("0.1") });
        assert.isOk(tx);
        let investmentData = await staking.connect(addr2).getInvestments();
        assert.equal( investmentData[1], "100000000000000000000");
        assert.equal( investmentData[2], "0");
    })

    it("should invest into mindpay & receive bonus if ether < 1 or > 5", async function () {
        let tx = await staking.connect(addr1).invest({ value: ethers.utils.parseEther("2") });
        assert.isOk(tx);

        let investmentData = await staking.connect(addr1).getInvestments();
        
        assert.equal( investmentData[1],"2000000000000000000000");
        assert.equal( investmentData[2],"200000000000000000000");
        
    })

    it("cancel investment and get 90%invest back and burn tokens", async function() {
        await network.provider.send("evm_increaseTime", [900])
        await network.provider.send("evm_mine")

        let balance = ethers.utils.formatEther(await ethers.provider.getBalance(addr1.address));
        // console.log("account1 balance: ", balance);

        let tx = await staking.connect(addr1).cancelInvestment();
        
        let updatedBalance = ethers.utils.formatEther(await ethers.provider.getBalance(addr1.address));
        // console.log("account1 updatedBalance: ", updatedBalance);

        assert.isOk(tx);
        assert.equal(Math.trunc(updatedBalance), Math.trunc(balance) + 2);
    })

    it("stake investment and send 90% investment to liquidityand stake 100% tokens", async function() {
        let tx = await staking.connect(addr3).invest({ value: ethers.utils.parseEther("2") });
        assert.isOk(tx);

        let investmentData = await staking.connect(addr3).getInvestments();
        
        await network.provider.send("evm_increaseTime", [900])
        await network.provider.send("evm_mine")

        let balance = ethers.utils.formatEther(await provider.getBalance(liquidity.address));
        // console.log("account1 balance: ", balance);

        tx = await staking.connect(addr3).stakeInvestment();
        
        let updatedBalance = ethers.utils.formatEther(await provider.getBalance(liquidity.address));
        // console.log("account1 updatedBalance: ", updatedBalance);

        assert.isOk(tx);
        assert.equal(Math.trunc(updatedBalance), Math.trunc(balance) + 2);
    })

});
