# What Are Token Approvals?

*Last reviewed: 12 September 2025*

In decentralised finance, when a user interacts with a token or smart contract, they often grant permission for that contract to spend or transfer their tokens. This mechanism, known as a token approval or allowance, allows decentralised applications to execute transactions on a user's behalf without asking for repeated confirmations. Approvals are encoded in standards such as ERC-20, ERC-721 and ERC-1155, where a spender address and an allowance value are recorded on-chain. Many decentralised applications request unlimited or "infinite" allowances, which simplifies their UX but exposes the user to ongoing risk.

An approval remains in effect until it is explicitly changed or revoked. This means that if a smart contract is compromised or turns malicious, it can spend the approved tokens without further confirmation from the wallet owner. AllowanceGuard addresses this by scanning the blockchain for every recorded approval linked to a user's wallet and displaying the spender addresses, token details and allowance amounts in a single, comprehensible dashboard. This transparency allows users to identify forgotten or high-risk approvals and take remedial action.

Understanding token approvals is critical because they represent the real control path to assets. Without visibility into allowances, users cannot know who may be able to move their tokens. AllowanceGuard's documentation explains the mechanics of approvals in depth, including how standards differ, what "unlimited" or "max uint" approvals mean in practice, and why revocation is the only reliable way to regain control.
