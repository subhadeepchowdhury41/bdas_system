// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FaceRecognition {
    // Struct to store user information
    struct User {
        bytes32 userId;
        int[] faceEmbedding;
    }

    // Mapping to store user information by their Ethereum address
    mapping(address => User) public users;

    // Event emitted when a new user is registered
    event UserRegistered(address indexed userAddress, bytes32 userId);

    // Function to register a new user with their face embedding
    function registerUser(bytes32 _userId, int[] memory _faceEmbedding) public {
        require(users[msg.sender].userId == bytes32(0), "User already registered");
        
        User storage newUser = users[msg.sender];
        newUser.userId = _userId;
        newUser.faceEmbedding = _faceEmbedding;

        emit UserRegistered(msg.sender, _userId);
    }

    // Function to match an input face embedding and return the corresponding user ID
    function matchFace(int[] memory _inputFaceEmbedding) public view returns (bytes32) {
        bytes32 matchedUserId = bytes32(0);
        int minDistance = type(int).max;

        for (uint256 i = 0; i < 10; i++) {
            User storage user = users[address(uint160(i))];
            int distance = calculateDistance(user.faceEmbedding, _inputFaceEmbedding);

            if (distance < minDistance) {
                minDistance = distance;
                matchedUserId = user.userId;
            }
        }
        return matchedUserId;
    }

    // Function to calculate the Euclidean distance between two face embeddings
    function calculateDistance(int[] memory embedding1, int[] memory embedding2)
        internal
        pure
        returns (int)
    {
        require(embedding1.length == embedding2.length, "Embedding dimensions mismatch");

        int distanceSquared = 0;

        for (uint256 i = 0; i < embedding1.length; i++) {
            int diff = embedding1[i] - embedding2[i];
            distanceSquared += diff * diff;
        }

        return distanceSquared;
    }
}