# Permit and Permit2 Approvals

*Last reviewed: 12 September 2025*

Permit and Permit2 are two related approaches designed to improve how token approvals are granted and managed. The original EIP-2612 Permit standard allows users to approve spending of ERC-20 tokens via an off-chain signature rather than an on-chain transaction. This can save gas and improve user experience but also creates new security considerations. Permit2, a newer model adopted by major decentralised exchanges, generalises the Permit concept to support multiple tokens and more flexible approvals.

From a security standpoint, off-chain signatures used by Permit and Permit2 can be powerful because they decouple the approval process from an immediate on-chain transaction. However, they also introduce risks if signatures are replayed or if users sign messages without understanding them. Permit2 in particular allows for batch approvals and more granular control, which, when combined with AllowanceGuard's monitoring, gives users a clearer picture of what they have authorised.

This documentation explains how AllowanceGuard reads Permit and Permit2 approvals where supported, highlights the differences between these mechanisms and traditional allowances, and clarifies which revocation strategies are effective. In some cases, revoking a Permit-based approval may involve sending a "cancel" transaction or letting a signed permit expire. AllowanceGuard provides guidance and references to official specifications so users can handle these cases safely.
