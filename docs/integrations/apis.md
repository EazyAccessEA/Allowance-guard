# API Integrations and External Services

*Last reviewed: 12 September 2025*

AllowanceGuard relies on external APIs to read blockchain data efficiently. By querying providers such as Etherscan, Alchemy, Infura and Covalent, the platform retrieves the complete list of token approvals for a given address. It then processes this data and stores user-defined alert policies in a Postgres database. When a user initiates a revocation, AllowanceGuard uses libraries such as ethers.js to construct the appropriate transaction and present it for signing.

Developers can extend AllowanceGuard or integrate it into their own workflows by using the same APIs and techniques. This documentation includes example endpoints, references to official API guides and explanations of best practices for handling rate limits, caching and error recovery. It also covers security considerations such as avoiding the storage of private keys on servers and ensuring that all API credentials are kept secure.
