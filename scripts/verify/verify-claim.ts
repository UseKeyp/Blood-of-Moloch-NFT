import hre, { ethers } from "hardhat";
import fs from "fs/promises";

async function main() {
  const contractName = "BloodOfMolochClaimNFT";
  const constructorArgs: any[] = [];

  const { name: networkName } = hre.network
  const deployments = JSON.parse(await fs.readFile(`./deployments/${networkName}.json`, 'utf-8'))
  const address = deployments[contractName]
  const { chainId } = hre.network.config

  if (chainId !== 31337) {
    try {
      const code = await ethers.provider.getCode(address);
      if (code === "0x") {
        console.log(`${contractName} contract deployment has not completed. waiting to verify...`);
      }
      await hre.run("verify:verify", {
        address,
        contract: `contracts/${contractName}.sol:${contractName}`,
        constructorArguments: constructorArgs,
      });
    } catch (error: any) {
      const { message } = error
      if ((message).includes("already verified")) {
        console.log("Reason: Already Verified");
      }
      console.error(message);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});