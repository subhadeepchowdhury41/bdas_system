package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// Block represents a block in the blockchain
type Block struct {
	Index     int
	Timestamp string
	Data      string
	PrevHash  string
	Hash      string
}

// Blockchain represents the blockchain
type Blockchain struct {
	Chain []Block
}

var nodes []string

func main() {
	// Initialize the blockchain
	blockchain := Blockchain{}
	blockchain.addGenesisBlock()

	// Start three nodes
	go runNode("localhost:3000", &blockchain)
	go runNode("localhost:3001", &blockchain)
	go runNode("localhost:3002", &blockchain)

	// Wait to keep the main program running
	select {}
}

func runNode(address string, blockchain *Blockchain) {
	nodes = append(nodes, address)

	// Create a new ServeMux for each node
	mux := http.NewServeMux()

	// Register handlers
	mux.HandleFunc("/mine", func(w http.ResponseWriter, r *http.Request) {
		mineBlock(blockchain)
		json.NewEncoder(w).Encode(blockchain)
	})

	mux.HandleFunc("/chain", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(blockchain)
	})

	// Create a new HTTP server for each node
	server := &http.Server{
		Addr:    address,
		Handler: mux,
	}

	// Start the server
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

func mineBlock(blockchain *Blockchain) {
	// Create a new block
	prevBlock := blockchain.getLastBlock()
	newBlock := Block{
		Index:     prevBlock.Index + 1,
		Timestamp: time.Now().String(),
		Data:      "Block data",
		PrevHash:  prevBlock.Hash,
	}

	// Calculate the hash of the new block
	newBlock.Hash = calculateHash(newBlock)

	// Add the new block to the blockchain
	blockchain.Chain = append(blockchain.Chain, newBlock)
}

func (bc *Blockchain) addGenesisBlock() {
	genesisBlock := Block{
		Index:     0,
		Timestamp: time.Now().String(),
		Data:      "Genesis Block",
		PrevHash:  "",
	}
	genesisBlock.Hash = calculateHash(genesisBlock)
	bc.Chain = append(bc.Chain, genesisBlock)
}

func (bc *Blockchain) getLastBlock() Block {
	return bc.Chain[len(bc.Chain)-1]
}

func calculateHash(block Block) string {
	record := fmt.Sprintf("%d%s%s%s", block.Index, block.Timestamp, block.Data, block.PrevHash)
	hash := sha256.New()
	hash.Write([]byte(record))
	return hex.EncodeToString(hash.Sum(nil))
}
