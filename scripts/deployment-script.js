// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Liquidity = await hre.ethers.getContractFactory("liquidity");
  const liquidity = await Liquidity.deploy();
  await liquidity.deployed();
  console.log("   liquidity : ", liquidity.address);
  
  const STAKING = await hre.ethers.getContractFactory("Staking");
  const staking = await STAKING.deploy(liquidity.address);
  await staking.deployed();
  console.log("   staking : ", staking.address);

  const MINDPAY = await hre.ethers.getContractFactory("MINDPAY");
  const mindPay = await MINDPAY.deploy("MIND PAY", "MINDPAY", staking.address);
  await mindPay.deployed();
  console.log("   mindPay : ", mindPay.address);

  await staking.setTokenAddress(mindPay.address);
  await liquidity.setTokenAddress(mindPay.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
