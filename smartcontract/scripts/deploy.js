const hre = require("hardhat");

async function main() {

//  const contract = await hre.ethers.deployContract("MyToken", { gasLimit: "40000000" });
  const contract = await hre.ethers.deployContract("MyToken");
  console.log(contract.target);  
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

