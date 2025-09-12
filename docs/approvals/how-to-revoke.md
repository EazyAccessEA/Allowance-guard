# How to Revoke Token Approvals

*Last reviewed: 12 September 2025*

Revoking an approval means changing its allowance to zero or otherwise invalidating a previously granted permission. This action severs the ability of a spender contract to move tokens without new authorisation. AllowanceGuard enables users to identify any approval and revoke it directly from the dashboard. When a user clicks "Revoke" next to a listed approval, the platform constructs the appropriate transaction for that token and network and presents it to the connected wallet for signing. Once signed and broadcast, the blockchain updates to reflect the zero allowance and the spender can no longer transfer tokens.

Revocation is not instantaneous in the sense of bypassing blockchain mechanics. It requires a signed transaction from the wallet owner and payment of gas fees on the relevant network. AllowanceGuard explains these costs clearly before the user confirms. The platform also provides guidance on situations where approvals may automatically be regranted by certain decentralised applications or where multiple allowances exist across chains.

This section of the documentation guides the user through the full revocation process, explains the security benefits and limitations, and offers references to alternative methods such as using Etherscan token approval checkers or native token interfaces. By following these steps, users can systematically reduce their attack surface and ensure only necessary approvals remain active.
