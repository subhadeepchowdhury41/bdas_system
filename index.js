import Web3 from 'web3';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

// Read the compiled contract ABI and bytecode
const web3 = new Web3('http://localhost:8545');

// Read the compiled contract ABI and bytecode
const contractAbi = JSON.parse(readFileSync('./build/contracts/store.sol/FaceRecognition.json', 'utf-8')).abi;

// Create a contract instance
const contract = new web3.eth.Contract(contractAbi, process.env.CONTRACT_ADDRESS);

// Register a new user
const registerUser = async (userId, faceEmbedding) => {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.registerUser(userId, faceEmbedding).send({ from: accounts[0] });
    console.log('User registered successfully');
};

// Match an input face embedding
const matchFace = async (inputFaceEmbedding) => {
    const accounts = await web3.eth.getAccounts();
    const matchedUserId = await contract.methods.matchFace(inputFaceEmbedding).call({ from: accounts[0] });
    console.log('Matched User ID:', matchedUserId);
};

// Example usage
const faceEmbedding = [1, 2, 3, 4, 5]; // Replace with the actual face embedding
let userId = "user123";

// Convert the string to bytes using TextEncoder
let encoder = new TextEncoder();
let myBytes = encoder.encode(userId);

// Pad or truncate the byte array to make it exactly 32 bytes
let byte32Array = new Uint8Array(32);
byte32Array.set(myBytes);

console.log(byte32Array);

registerUser(z, faceEmbedding);

// const inputFaceEmbedding = [2, 3, 4, 5, 6]; // Replace with the actual input face embedding
// matchFace(inputFaceEmbedding);