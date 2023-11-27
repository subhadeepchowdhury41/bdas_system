require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  "paths": {
    "sources": "./contracts",
    "artifacts": "./build"
  }
};
