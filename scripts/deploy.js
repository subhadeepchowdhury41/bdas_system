import { readFileSync, writeFileSync } from 'fs';
import Web3 from 'web3';

// Connect to the local Ethereum node
const web3 = new Web3('http://localhost:8545');

// Read the compiled contract ABI and bytecode
const contractAbi = JSON.parse(readFileSync('./build/contracts/store.sol/FaceRecognition.json', 'utf-8')).abi;
const contractBytecode = JSON.parse(readFileSync('./build/contracts/store.sol/FaceRecognition.json', 'utf-8')).bytecode;

console.log(contractBytecode);

// Create a contract instance
const contract = new web3.eth.Contract(contractAbi);

// Deploy the contract
const deployContract = async () => {
    const accounts = await web3.eth.getAccounts();
    const deploy = contract.deploy({ data: contractBytecode });
    const deployedContract = await deploy.send({ from: accounts[0], gas: '1000000' });
    // write the contract address to .env file
    writeFileSync('./.env', `CONTRACT_ADDRESS=${deployedContract.options.address}`);
    console.log('Contract deployed to:', deployedContract.options.address);
};

deployContract();