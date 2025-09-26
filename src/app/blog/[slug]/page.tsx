'use client'

import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import VideoBackground from '@/components/VideoBackground'

// Blog post interface
interface BlogPost {
  slug: string
  title: string
  subtitle: string
  content: string
  publishedAt: string
  readTime: string
  category: string
  featured: boolean
  tags?: string[]
}

// Break content into smaller chunks to avoid build process issues
const blogContent = {
  intro: `
    <p>In our ongoing discussion of Web3 security, we have focused on managing the permissions you grant to smart contracts. This is like curating the list of people allowed to enter a bank. It is a critical, essential practice. But what about the master key to the vault itself?</p>
    <p>That master key is your private key. The security of every asset you own rests on its secrecy. Most users keep this key in a "hot wallet"—a browser extension or mobile app. This is like leaving the vault key on the bank teller's desk: convenient, but constantly exposed to the risks of the outside world.</p>
      <p>True digital sovereignty requires a shift in mindset from digital convenience to physical security. By moving your private keys from software to specialized hardware and adopting multi-signature protocols, you create layers of defense that are nearly impossible for remote attackers to penetrate. This is how you elevate your security from a practice of hope to a fortress of certainty.</p>
      <p>This guide will explain the fundamental importance of hardware wallets and multisigs, how they work together, and how you can implement them to build an institutional-grade security setup for your own assets.</p>
  `,

  hotWallet: `
      <h2>The Hot Wallet Problem: Securing the Master Key</h2>
      <p>Your private key is a secret string of data that authorizes all actions from your wallet. Whoever has it has total control. A hot wallet stores this key on a device that is connected to the internet, such as your computer or smartphone. While incredibly convenient for daily use, this creates inherent vulnerabilities:</p>
      <ul>
      <li><strong>Malware Exposure:</strong> Malicious software like keyloggers, clipboard hijackers, or spyware can potentially find and steal your private key or seed phrase from your computer's memory or files.</li>
        <li><strong>Phishing Vulnerabilities:</strong> A sophisticated phishing site can trick you into signing a malicious transaction. Because the signing occurs within the browser environment, it can be difficult to spot the deception.</li>
        <li><strong>Remote Attacks:</strong> Any security flaw in your browser, operating system, or the wallet software itself could theoretically be exploited by a remote attacker.</li>
      </ul>
      <p>For daily transactions with small amounts, the convenience of a hot wallet is often an acceptable risk. But for storing significant value, it is an unnecessary gamble.</p>
  `,

  hardwareWallet: `
      <h2>The Hardware Wallet: A Vault for Your Private Key</h2>
      <p>A hardware wallet is a small, specialized physical device designed to do one thing: keep your private keys secure and offline. It creates an "air gap" between your keys and the internet-connected world, fundamentally changing the security game.</p>
      <h3>How It Works</h3>
      <p>The magic of a hardware wallet lies in its "secure element"—a hardened microcontroller chip that is designed to be tamper-resistant. Your private keys are generated and stored within this chip and are physically incapable of ever leaving it.</p>
      <p>When you want to make a transaction:</p>
      <ol>
        <li>The unsigned transaction is sent from your computer to the hardware wallet.</li>
        <li>The device uses the private key stored on its secure chip to sign the transaction internally.</li>
        <li>Only the signed, safe-to-broadcast transaction is sent back to your computer.</li>
        <li>Your private key is never exposed to your computer, your browser, or the internet.</li>
      </ol>
  `,

  protections: `
      <h3>The Core Protections a Hardware Wallet Provides</h3>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Hot Wallet (Browser Extension)</th>
            <th>Hardware Wallet</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Key Storage</strong></td>
            <td>On an internet-connected device (computer/phone).</td>
            <td>In an offline, secure chip on a dedicated device.</td>
          </tr>
          <tr>
            <td><strong>Malware Resistance</strong></td>
            <td>Vulnerable to keyloggers and spyware.</td>
            <td>Immune to remote software-based key theft.</td>
          </tr>
          <tr>
            <td><strong>Transaction Confirmation</strong></td>
            <td>A pop-up window in your browser.</td>
            <td>A mandatory physical button press on the device.</td>
          </tr>
          <tr>
            <td><strong>Phishing Defense</strong></td>
            <td>Low. A fake website can present a misleading transaction.</td>
          <td>High. The device's trusted display shows the true transaction details (amount, recipient) for verification.</td>
          </tr>
        </tbody>
      </table>
    <p>The trusted display is a critical, often-understated feature. Even if a phishing site tells you you're signing a transaction to mint an NFT, the hardware wallet's screen will show you the raw truth: you're about to approve a transaction that sends all of your WETH to an attacker's address. This gives you a final, reliable chance to catch the fraud and press "Reject."</p>
  `,

  multisig: `
      <h2>Multisignature Wallets: Security Through Shared Control</h2>
      <p>A hardware wallet protects your single key from being compromised. But what if that single device is lost, stolen, or destroyed? A multisignature wallet (or "multisig") solves this problem by eliminating the concept of a single point of failure entirely.</p>
      <p>A multisig is a smart contract wallet that requires multiple private keys to approve a single transaction. You define the rules, such as:</p>
      <ul>
        <li><strong>2-of-3:</strong> The wallet has three authorized keys (signers), and any two of them must approve a transaction for it to be executed.</li>
        <li><strong>3-of-5:</strong> The wallet has five signers, and any three must approve.</li>
      </ul>
      <p>This creates powerful resilience. In a 2-of-3 setup, if one key is lost or compromised, your funds remain safe because the attacker does not have the second required signature. You can then use your two remaining keys to remove the compromised key and secure your wallet.</p>
  `,

  personal: `
      <h2>The Personal Multisig: Beyond DAOs</h2>
      <p>Multisigs are not just for large DAOs managing treasuries. They are arguably the most robust security setup an individual can achieve. You can create a personal multisig where you control all the signing keys, but distribute them across different devices and locations.</p>
      <p>A powerful 2-of-3 personal setup might look like this:</p>
      <ul>
      <li><strong>Signer 1:</strong> Your primary hardware wallet (e.g., a <a href="https://shop.ledger.com/?r=c748f3b6c81b" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Ledger</a>), used for initiating transactions.</li>
      <li><strong>Signer 2:</strong> A second hardware wallet from a different brand (e.g., a <a href="https://trezor.io/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Trezor</a>), stored securely in a separate location like a safe deposit box or a trusted family member's home.</li>
        <li><strong>Signer 3:</strong> A hot wallet on your mobile phone, used only as a secondary confirmation device.</li>
      </ul>
      <p>With this structure, an attacker would need to compromise you in two different locations to steal your funds, a dramatically harder task.</p>
  `,

  goldStandard: `
      <h2>The Gold Standard: Combining Hardware with Multisig</h2>
      <p>For the highest level of security, you can combine these two concepts. By assigning each signer of your multisig wallet to its own dedicated hardware wallet, you create a setup that is both physically distributed and cryptographically secured.</p>
      <p>This means an attacker would need to physically steal multiple hardware devices from different locations and compromise their PINs or seed phrases to gain control. This is the model used by institutional custodians to secure billions of dollars in digital assets, and it is fully accessible to any individual user willing to adopt the practice.</p>
      <p>This approach, combined with diligent allowance management, creates a security posture where:</p>
      <ul>
        <li>Permissions are limited (via <a href="/" className="text-primary-accent hover:text-primary-accent/80 underline">AllowanceGuard</a>).</li>
        <li>Signatures are protected (via hardware wallets).</li>
        <li>Control is decentralized (via multisig).</li>
      </ul>
  `,

  gettingStarted: `
      <h2>A Practical Guide to Getting Started</h2>
      <p>Adopting this level of security is a gradual process. The goal is to progressively move your assets to safer storage as their value increases.</p>
      <h3>Setting Up Your First Hardware Wallet</h3>
      <ol>
      <li><strong>Buy Directly from the Manufacturer:</strong> Purchase your device only from the official websites of reputable brands like <a href="https://shop.ledger.com/?r=c748f3b6c81b" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Ledger</a>, <a href="https://trezor.io/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Trezor</a>, <a href="https://keyst.one/?rfsn=8853588.a928f0&utm_source=refersion&utm_medium=affiliate&utm_campaign=8853588.a928f0" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Keystone</a>, or <a href="https://gridplus.io/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">GridPlus</a>. This prevents supply chain attacks where a device is tampered with before it reaches you.</li>
      <li><strong>Verify the Packaging:</strong> Ensure the device's packaging is sealed and shows no signs of tampering.</li>
        <li><strong>Initialize the Device:</strong> Follow the official instructions carefully. During this process, the device will generate your new private key and show you a 24-word recovery phrase (seed phrase).</li>
        <li><strong>Secure Your Seed Phrase:</strong> Write down your seed phrase on paper or a steel plate. Never store it digitally (no photos, no text files, no password managers). Store your physical backup in a secure, private location. This phrase is the only backup for your funds if your device is lost or broken.</li>
        <li><strong>Perform a Test Transaction:</strong> Send a small amount of crypto to your new hardware wallet. Then, reset the device and restore it using your seed phrase to confirm your backup is correct. Once confirmed, you can move larger sums.</li>
      </ol>
  `,

  multisigSetup: `
      <h3>Creating Your First Personal Multisig</h3>
      <ol>
        <li><strong>Use a Trusted Platform:</strong> <a href="https://safe.global/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Safe{Wallet}</a> (formerly Gnosis Safe) is the battle-tested industry standard for creating multisig wallets. It is a user-friendly interface for deploying your own personal security contract.</li>
        <li><strong>Choose Your Signers:</strong> Decide which of your existing wallets will be the signers. You can start with a 2-of-2 setup using your browser wallet and a new hardware wallet.</li>
        <li><strong>Set Your Threshold:</strong> Define the policy (e.g., 2 out of 2 signatures required).</li>
        <li><strong>Deploy and Fund:</strong> Deploy the Safe contract to the blockchain. Once created, you will have a new address for your multisig. Send a small test amount to this address first before moving significant assets.</li>
      </ol>
  `,

  nextSteps: `
      <h2>Practical Next Steps</h2>
      <ol>
        <li><strong>Buy a Hardware Wallet:</strong> If you hold a meaningful amount of crypto in a browser wallet, make purchasing a hardware wallet your top security priority for this quarter.</li>
      <li><strong>Migrate Your Long-Term Holdings:</strong> Move any assets you don't need for daily trading or interaction to your new hardware wallet.</li>
        <li><strong>Experiment with a Test Multisig:</strong> Create a <a href="https://safe.global/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Safe{Wallet}</a> on a low-cost network (like Polygon or Arbitrum) with a few dollars. Practice sending and confirming transactions to understand the workflow before using it for high-value assets.</li>
        <li><strong>Build Your Personal Security Roadmap:</strong> Plan your evolution. Start with a hot wallet, graduate to a hardware wallet for storage, and aim for a personal multisig as your ultimate vault.</li>
      </ol>
    <p>Moving to hardware wallets and multisigs is the most significant step you can take to secure your digital sovereignty. It's a deliberate choice to trade a little convenience for a tremendous amount of security and peace of mind.</p>
  `
}

// Combine content chunks
const fullContent = Object.values(blogContent).join('\n')


// Blog posts data - in a real app, this would come from a CMS or database
const blogPosts: BlogPost[] = [
  {
    slug: 'hardware-wallets-and-multisigs-elevating-your-security',
    title: 'Hardware Wallets and Multisigs: Elevating Your Security',
    subtitle: 'From Digital Convenience to Physical Security',
    content: fullContent,
    publishedAt: '2024-12-19',
    readTime: '12 min read',
    category: 'Security',
    featured: true
  },
  {
    slug: 'understanding-smart-contract-risk-beyond-allowances',
    title: 'Understanding Smart Contract Risk Beyond Allowances',
    subtitle: 'The Hidden Dangers in the Code You Trust',
    content: `
      <p>Managing your token allowances is like diligently locking the doors and windows of your home. It&apos;s a fundamental, non-negotiable step in securing your assets. But what if the building itself has a cracked foundation? What if the landlord can enter and change the locks at any time, without warning?</p>

      <p>This is the reality of smart contract risk. While allowances control who can access your tokens, the underlying smart contracts define what can be done with them. These contracts are not static blocks of code; they are often living, upgradeable, and deeply interconnected programs. A bug, a malicious upgrade, or a vulnerability in a connected protocol can create a security failure that no amount of allowance management can prevent on its own.</p>

      <p>To truly secure your on-chain presence, you must look beyond allowances and develop a deeper understanding of the contracts you interact with. This guide will teach you how to assess contract-level risk, identify hidden dangers like proxies and composability, and build a more resilient security strategy.</p>

      <h2>The Living Code You Place Your Trust In</h2>
      
      <p>When you use a decentralized application (dapp), you are not just interacting with a website. You are sending your assets to be managed by one or more smart contracts. These autonomous programs are responsible for everything:</p>

      <ul>
        <li><strong>Custody:</strong> They hold your tokens in liquidity pools, staking vaults, or lending protocols.</li>
        <li><strong>Execution:</strong> They contain the logic that executes your swaps, calculates your yield, or issues your loans.</li>
        <li><strong>Interaction:</strong> They can call other smart contracts across the ecosystem to perform complex, multi-step operations.</li>
      </ul>

      <p>Your trust is not in the dapp&apos;s brand or its user interface; it is a direct trust in the integrity of its underlying code. If that code is flawed or can be changed maliciously, your assets are at risk, regardless of how carefully you manage your approvals.</p>

      <h2>The Double-Edged Sword of Upgradeable Contracts</h2>
      
      <p>In the early days of Ethereum, most smart contracts were immutable—once deployed, their code could never be changed. This created a rigid but predictable security environment. Today, most major protocols use upgradeable contracts to allow for bug fixes and new features without requiring a massive, disruptive user migration.</p>

      <p>This is typically achieved using a proxy pattern. Imagine your home address is permanent (the proxy contract), but an architect can swap out the entire internal layout and structure overnight (the implementation contract).</p>

      <p>While convenient for developers, this introduces a significant new risk vector for users. A contract you reviewed and trusted today could be replaced by a completely different, potentially malicious, version tomorrow. Your existing token approval would still be valid for the same proxy address, but it would now point to dangerous new logic.</p>

      <p>Here are common proxy patterns you will encounter:</p>

      <table>
        <thead>
          <tr>
            <th>Proxy Pattern</th>
            <th>How It Works</th>
            <th>The Primary Risk for Users</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Transparent Proxy</strong></td>
            <td>The proxy contract holds the assets and user state, but forwards all logic-related calls to a separate implementation contract.</td>
            <td>The protocol&apos;s administrators can unilaterally change the implementation contract, altering the core logic that governs your funds.</td>
          </tr>
          <tr>
            <td><strong>Beacon Proxy</strong></td>
            <td>Multiple proxy contracts point to a single "beacon" contract, which in turn points to the implementation logic.</td>
            <td>A single upgrade to the beacon can change the rules for every user of every proxy simultaneously, creating a systemic risk.</td>
          </tr>
          <tr>
            <td><strong>Diamond (EIP-2535)</strong></td>
            <td>A single proxy contract routes calls to many smaller, modular logic contracts called "facets."</td>
            <td>While highly flexible, this pattern significantly increases the contract&apos;s complexity and attack surface, making a full security audit more difficult.</td>
          </tr>
        </tbody>
      </table>

      <p>An upgradeable contract is not inherently bad, but it requires a higher degree of trust in the team that controls the upgrade keys.</p>

      <h2>Hidden Dangers: Composability and Chained Risk</h2>
      
      <p>DeFi is often described as "money Legos" because of composability—the ability for protocols to seamlessly plug into and build upon one another. A yield aggregator can deposit funds into a lending protocol, which might use a decentralized exchange for liquidations.</p>

      <p>This powerful feature also creates chained risk. Your risk exposure is not limited to the protocol you interact with directly; it is the sum of the risks of every protocol in the chain.</p>

      <p>Consider this common scenario:</p>

      <p><strong>You → Yield Aggregator (Protocol A) → Lending Protocol (Protocol B) → Oracle (Protocol C)</strong></p>

      <p>Even if Protocol A is perfectly audited and secure, you are still exposed to risks from B and C:</p>

      <ul>
        <li><strong>Counterparty Risk:</strong> A bug or exploit in the lending protocol (B) could lead to a loss of the aggregator&apos;s (A) funds—which includes your deposit.</li>
        <li><strong>Dependency Risk:</strong> If the lending protocol (B) relies on a price oracle (C) that gets manipulated, it could trigger improper liquidations, causing losses that flow back up the chain to you.</li>
        <li><strong>Bridge Risk:</strong> If a protocol uses wrapped assets from a cross-chain bridge, a hack of that bridge can make the wrapped tokens worthless, impacting the protocol and its users.</li>
      </ul>

      <p>When you deposit into a composable protocol, you are implicitly trusting its entire stack of dependencies.</p>

      <h2>A Practical Toolkit for Risk Assessment</h2>
      
      <p>You do not need to be a Solidity developer to perform a basic risk assessment of a smart contract. Using free, public tools, you can gather enough information to make a more informed decision.</p>

      <h3>1. Check for Reputable Audits</h3>
      
      <p>Audits are a crucial signal, but not all are created equal.</p>

      <ul>
        <li>Look for multiple audits from well-known security firms (e.g., Trail of Bits, OpenZeppelin, ConsenSys Diligence, Certik). A single audit, especially from an unknown firm, is a weak signal.</li>
        <li>Read the audit summary. Pay attention to any high-severity findings that were not resolved by the development team.</li>
      </ul>

      <h3>2. Verify Open-Source Code</h3>
      
      <p>Trustworthy projects publish their source code for public review.</p>

      <p>On a block explorer like Etherscan, navigate to the contract&apos;s address and click the "Contract" tab. Look for a green checkmark indicating that the source code is verified and matches the deployed bytecode. If the code is not verified, it is a significant red flag.</p>

      <h3>3. Identify Upgradeability and Admin Keys</h3>
      
      <p>This is perhaps the most important check you can perform.</p>

      <ul>
        <li><strong>Is it a proxy?</strong> On the "Contract" tab in Etherscan, look for buttons labeled "Read as Proxy" or "Write as Proxy." If you see them, the contract is upgradeable. Click through to find the address of the current implementation contract.</li>
        <li><strong>Who holds the keys?</strong> Investigate the admin address that has the power to upgrade the contract. Is it a single person&apos;s wallet (an EOA, or Externally Owned Account)? This is extremely high-risk. A better setup is a multi-signature wallet controlled by several parties. The best-case scenario is a timelock, where all upgrades are subject to a mandatory public delay, giving users time to review changes and withdraw funds if necessary.</li>
      </ul>

      <h2>Building Your Own Risk Scorecard</h2>
      
      <p>You can track these factors in a simple spreadsheet to compare protocols and manage your exposure.</p>

      <table>
        <thead>
          <tr>
            <th>Factor</th>
            <th>Low Risk</th>
            <th>Medium Risk</th>
            <th>High Risk</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Upgradeability</strong></td>
            <td>Immutable (Not a proxy)</td>
            <td>Upgradeable via a DAO with a timelock</td>
            <td>Upgradeable by a single wallet or small multi-sig with no delay</td>
          </tr>
          <tr>
            <td><strong>Audit Coverage</strong></td>
            <td>Multiple audits from top-tier firms</td>
            <td>One reputable audit, or audits from newer firms</td>
            <td>No public audits, or unresolved critical findings</td>
          </tr>
          <tr>
            <td><strong>Source Code</strong></td>
            <td>Verified, open-source, and well-documented</td>
            <td>Verified but complex and poorly documented</td>
            <td>Unverified ("black box")</td>
          </tr>
          <tr>
            <td><strong>Admin Control</strong></td>
            <td>Fully decentralized (no admin keys) or a large, diverse DAO</td>
            <td>Controlled by a multi-sig of 3-7 known parties</td>
            <td>Controlled by a single anonymous EOA</td>
          </tr>
          <tr>
            <td><strong>Contract Age</strong></td>
            <td>>1 year, battle-tested through high-volume usage</td>
            <td>3-12 months old, gaining traction</td>
            <td><3 months old, unaudited, or recently launched</td>
          </tr>
        </tbody>
      </table>

      <h2>Layering Your Defenses</h2>
      
      <p>Understanding smart contract risk does not replace the need for diligent allowance management—it enhances it. These two practices form a powerful, layered security strategy.</p>

      <ul>
        <li><strong>Allowance management</strong> is your first line of defense, controlling access at your wallet&apos;s edge.</li>
        <li><strong>Contract risk assessment</strong> is your second line of defense, helping you decide which protocols are trustworthy enough to interact with in the first place.</li>
      </ul>

      <p>When you combine these, your security posture becomes proactive. If you see a governance proposal to remove a timelock or a suspicious upgrade to a contract you use, you can immediately use a tool like <a href="/" className="text-primary-accent hover:text-primary-accent/80 underline">AllowanceGuard</a> to revoke your approval before any potential damage is done.</p>

      <h2>Practical Next Steps</h2>
      
      <p>Knowledge is most powerful when put into practice. Take these steps this week to begin assessing risk beyond allowances.</p>

      <ol>
        <li><strong>Pick One Dapp You Use Daily:</strong> Go to its contract address on a block explorer. Use the guide above to determine if it is an upgradeable proxy.</li>
        <li><strong>Identify the Admin:</strong> Find out who controls the upgrade keys. Is it a single address or a multi-sig with a timelock?</li>
        <li><strong>Check Its Audit History:</strong> Look for the project&apos;s security audits. Have they been audited by reputable firms?</li>
        <li><strong>Make an Informed Decision:</strong> Based on your findings, decide if your current level of exposure to this protocol aligns with your risk tolerance. Adjust your position or revoke allowances if you are uncomfortable.</li>
      </ol>

      <p>By expanding your focus from just allowances to the full architecture of a smart contract, you move from being a passive user to an informed and empowered participant in the decentralized ecosystem.</p>
    `,
    publishedAt: '2024-12-19',
    readTime: '10 min read',
    category: 'Security',
    featured: false
  },
  {
    slug: 'gas-fees-and-revocations-making-security-cost-effective',
    title: 'Gas, Fees, and Revocations: Making Security Cost-Effective',
    subtitle: 'Transforming Security from Expensive Chore to Low-Cost Habit',
    content: `
      <p>Security is like insurance. Everyone understands its importance, but paying the premium can feel like a burden. In Web3, the "premium" for securing your wallet is often paid in gas fees. The cost to revoke a single token allowance, especially during peak network times, can be enough to make anyone pause. This hesitation is a vulnerability. Attackers rely on our reluctance to spend a little today to protect ourselves from a catastrophic loss tomorrow.</p>

      <p>But what if you could significantly lower that premium?</p>

      <p>Effective on-chain security should not be a luxury reserved for those who can afford high transaction fees. By understanding the mechanics of gas, adopting a few strategic practices, and using the right tools, you can transform security from an expensive chore into a low-cost, systematic habit. Protecting your assets doesn&apos;t have to break the bank.</p>

      <p>This guide will deconstruct gas fees, provide actionable strategies to minimize your security costs, and offer a framework for making intelligent, cost-effective decisions about your on-chain safety.</p>

      <h2>Deconstructing the Gas Bill: A Simple Guide</h2>

      <p>Every action on a blockchain, from a token swap to an allowance revocation, requires computational effort. Gas is the unit used to measure that effort, and the fee is the price you pay in the network&apos;s native currency (like ETH) to get your transaction processed.</p>

      <p>The total fee you pay is determined by a simple equation:</p>

      <p><code>(Base Fee + Priority Fee) x Gas Units Used</code></p>

      <p>Let&apos;s break this down with an analogy: sending a package.</p>

      <ul>
        <li><strong>Gas Units Used (The Package Size):</strong> This is the total computational work your transaction requires. A simple <code>revoke</code> is a small, lightweight package. A complex multi-step DeFi transaction is a large, heavy one. This is a fixed property of the transaction itself.</li>
        <li><strong>Base Fee (The Standard Shipping Cost):</strong> This is the minimum fee required for your transaction to be included in a block. It&apos;s set by the network and fluctuates based on overall demand (congestion). When everyone is trying to send packages at once, the standard shipping cost goes up for everyone.</li>
        <li><strong>Priority Fee (The Express Shipping Tip):</strong> This is an optional tip you add to incentivize validators (the postal workers) to prioritize your package over others. A higher tip gets your transaction processed faster.</li>
      </ul>

      <p>For a simple <code>revoke</code> transaction, the package size is small. Therefore, the <strong>Base Fee</strong> is the primary driver of your total cost. Your path to saving money lies in managing when and how you pay it. You can monitor current network fees using a tool like the <a href="https://etherscan.io/gastracker" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Etherscan Gas Tracker</a>.</p>

      <h2>Four Strategies for Affordable Security</h2>

      <p>You have several powerful levers to pull to dramatically reduce the cost of maintaining your wallet&apos;s security.</p>

      <h3>1. Change Your Location: Use Layer 2 Networks</h3>

      <p>The most impactful way to save on gas is to transact on a <strong>Layer 2 (L2)</strong> network. L2s are scaling solutions like <a href="https://arbiscan.io/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Arbitrum</a>, <a href="https://optimistic.etherscan.io/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Optimism</a>, <a href="https://basescan.org/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Base</a>, and <a href="https://polygonscan.com/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Polygon</a> that are built on top of Ethereum. They process transactions separately and then bundle them together, inheriting the security of the main network while offering significantly lower fees.</p>

      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Estimated Cost on Ethereum Mainnet (High Congestion)</th>
            <th>Estimated Cost on an L2 Network (Arbitrum)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Revoke a single token allowance</strong></td>
            <td>$15 - $30</td>
            <td>$0.10 - $0.25</td>
          </tr>
        </tbody>
      </table>

      <p>The cost difference is staggering. By choosing to interact with applications and tokens on L2s, you reduce the cost of security maintenance by 99% or more. Explore the ecosystem of active L2 networks on a site like <a href="https://l2beat.com/scaling/tvl" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">L2BEAT</a> to find where your favorite dapps are deployed.</p>

      <h3>2. Ship in Bulk: Batch Your Revocations</h3>

      <p>Think back to our shipping analogy. If you have ten small items to send, it&apos;s far cheaper to put them all in one big box than to ship ten separate packages. Each separate shipment would incur its own base fee.</p>

      <p><strong>Batching revocations</strong> applies the same logic. Instead of submitting a dozen separate transactions to revoke a dozen different allowances, you can use a tool like AllowanceGuard to group them into a single, efficient transaction. You only pay the base fee once, spreading that cost across all the revocations. This is an incredibly effective strategy, especially for cleanups on more expensive networks like Ethereum mainnet.</p>

      <h3>3. Travel During Off-Peak Hours: Time Your Transactions</h3>

      <p>Blockchain network activity follows predictable human patterns. Congestion, and therefore the base fee, is often highest during standard business hours in Europe and the US. It tends to drop significantly during evenings, nights, and weekends.</p>

      <p>By simply timing your non-urgent security maintenance for these off-peak periods, you can often cut your costs by 30-50% or more. Use a gas price forecasting tool, like the one offered by <a href="https://www.blocknative.com/gas-estimator" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Blocknative</a>, to identify the cheapest times to submit your transactions. Patience is a powerful cost-saving tool.</p>

      <h3>4. Don&apos;t Pay for Overnight Shipping: Set a Sensible Priority Fee</h3>

      <p>Is revoking an allowance for a dapp you haven&apos;t used in six months an emergency? Almost certainly not. It doesn&apos;t need to be confirmed in the very next block.</p>

      <p>Most wallets default to a priority fee that aims for fast confirmation. However, in the wallet&apos;s "Advanced" settings, you can manually lower this tip. By setting a lower, non-urgent priority fee, you signal to the network that you are willing to wait a few minutes (or longer, during high congestion) for your transaction to be included. For routine maintenance, this is a perfectly safe and sensible way to save a little extra on every transaction.</p>

      <h2>A Framework for Prioritization: Cost vs. Risk</h2>

      <p>When gas fees are high, you may need to prioritize. Not all allowances carry the same level of risk. Use this framework to decide what to do now versus what can wait for a cheaper time.</p>

      <table>
        <thead>
          <tr>
            <th>Risk Level</th>
            <th>Example Scenario</th>
            <th>Potential Loss</th>
            <th>Recommended Action (During High Gas)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Critical</strong></td>
            <td>An unlimited approval to a protocol that has just been publicly exploited or rugged.</td>
            <td>100% of the approved token balance, imminently.</td>
            <td><strong>Revoke immediately.</strong> Pay the high gas fee. The cost of inaction is too great.</td>
          </tr>
          <tr>
            <td><strong>High</strong></td>
            <td>An old, unlimited approval to an unaudited or abandoned dapp you no longer use.</td>
            <td>100% of the approved token balance.</td>
            <td><strong>Revoke as soon as possible.</strong> Try to time it for a daily low in gas prices, but do not postpone for more than 24 hours.</td>
          </tr>
          <tr>
            <td><strong>Medium</strong></td>
            <td>An active but unlimited approval to a reputable, audited DeFi protocol you use regularly.</td>
            <td>100% of the approved token balance (if the protocol is exploited).</td>
            <td><strong>Plan to address it.</strong> Either revoke the approval and re-approve with a specific amount on your next use, or add it to your next scheduled batch revocation.</td>
          </tr>
          <tr>
            <td><strong>Low</strong></td>
            <td>A small, fixed-amount approval to a battle-tested protocol (e.g., Uniswap).</td>
            <td>The specific amount approved.</td>
            <td><strong>Add to your next batch revocation.</strong> There is no urgency. Wait for the most cost-effective time to clean it up.</td>
          </tr>
        </tbody>
      </table>

      <h2>A Shared Responsibility: How Developers Can Help</h2>

      <p>Users shouldn&apos;t bear the full cost and burden of security. Developers and dapp builders can play a crucial role in making the ecosystem safer and more affordable for everyone.</p>

      <ul>
        <li><strong>Build on Layer 2 First:</strong> Prioritizing L2 deployments makes security maintenance affordable by default for users.</li>
        <li><strong>Implement User-Friendly Allowance Logic:</strong> Instead of requesting unlimited approvals, contracts can be designed to request only what is needed for a transaction or to automatically decrease the allowance after use.</li>
        <li><strong>Provide a Native Revoke Button:</strong> A simple "Revoke" button within a dapp&apos;s UI empowers users to clean up their permissions without needing to use a third-party tool.</li>
      </ul>

      <h2>Practical Next Steps</h2>
      
      <p>Transforming security from a costly chore into an efficient habit starts today.</p>

      <ol>
        <li><strong>Identify Your High-Risk Allowances:</strong> Use an allowance checker to find the top three oldest or riskiest unlimited approvals in your wallet.</li>
        <li><strong>Schedule Your First Revocation:</strong> Use a gas tracker to find a low-cost time in the next 24 hours (likely a weekend or late at night) and revoke those high-risk permissions.</li>
        <li><strong>Migrate Activity to an L2:</strong> For your next DeFi interaction, try using the same protocol on a Layer 2 network. Experience the difference in fees firsthand.</li>
        <li><strong>Plan a Batch Cleanup:</strong> Make a list of all your low-risk, "nice-to-have" revocations. Plan to use a batch revocation tool during the next network-wide quiet period to clean them all up in one go.</li>
      </ol>

      <p>By being intentional and strategic, you can achieve a state of high security at a low cost. The peace of mind that comes from a clean, well-managed wallet is worth every cent.</p>
    `,
    publishedAt: '2024-12-19',
    readTime: '8 min read',
    category: 'Security',
    featured: false
  },
  {
    slug: 'understanding-layer-2-networks-how-they-work',
    title: 'Understanding Layer 2 Networks: How They Work',
    subtitle: 'A Deeper Dive into the Technology Behind Scalable Ethereum',
    content: `
      <p>To understand Layer 2 solutions, we first need to understand the fundamental challenge they are designed to solve: the <strong>Blockchain Trilemma</strong>.</p>

      <p>The trilemma states that it is incredibly difficult for a blockchain to excel at all three of its core properties simultaneously:</p>

      <ol>
        <li><strong>Security:</strong> The network must be resistant to attacks and unauthorized changes.</li>
        <li><strong>Decentralization:</strong> Control of the network should be distributed among many participants, not concentrated in a single entity.</li>
        <li><strong>Scalability:</strong> The network must be able to process a high volume of transactions quickly and affordably.</li>
      </ol>

      <p>Ethereum&apos;s Layer 1 (L1), also known as the mainnet, was designed to prioritize <strong>security</strong> and <strong>decentralization</strong>. It achieves this through a global network of validators, all of whom must process every single transaction. This makes it incredibly robust and censorship-resistant. However, it also creates a bottleneck.</p>

      <p>Think of Ethereum L1 as a single, incredibly secure, four-lane motorway. When only a few cars (transactions) are on it, traffic flows smoothly. But as millions of users join, the motorway becomes congested. This leads to two problems:</p>

      <ul>
        <li><strong>Slow Speeds:</strong> Transactions take longer to be confirmed.</li>
        <li><strong>High Costs:</strong> Users must bid against each other with higher "tolls" (gas fees) to get their transaction included in the next block.</li>
      </ul>

      <p>Layer 2 networks are the solution to this traffic jam. Instead of trying to widen the main motorway—a complex and slow process—L2s build an entire network of express highways and local roads that run alongside it. They handle the vast majority of traffic off the main road and then periodically settle their final records back on the secure L1 motorway.</p>

      <p>The core principle is this: <strong>L2s execute transactions off-chain, but post proof and data of those transactions on-chain.</strong> This allows them to inherit the security and decentralization of Ethereum L1 while achieving far greater scalability.</p>

      <p>The dominant type of Layer 2 technology today is the <strong>Rollup</strong>.</p>

      <h2>Understanding Rollups</h2>

      <p>As the name suggests, rollups "roll up" or bundle hundreds, or even thousands, of individual L2 transactions into a single, compressed batch. This single batch is then submitted to the Ethereum L1. By doing this, the fixed cost of an L1 transaction is split across all the users in that batch, making it exponentially cheaper for everyone.</p>

      <p>There are two primary types of rollups, and they differ in how they prove to the L1 that the transactions in their batch are valid.</p>

      <h3>1. Optimistic Rollups</h3>

      <p>Optimistic rollups operate on a principle of "innocent until proven guilty."</p>

      <ul>
        <li><strong>How they work:</strong> An L2 operator bundles thousands of transactions and posts the batch to the L1, asserting that all transactions within it are valid. The rollup optimistically <em>assumes</em> the batch is correct without proving it upfront.</li>
        <li><strong>The Fraud Proof System:</strong> After the batch is posted, a "challenge period" begins (typically lasting about seven days). During this window, anyone on the network (called a verifier) can examine the batch. If they find a fraudulent transaction, they can submit a <strong>fraud proof</strong> to the L1. If the proof is valid, the fraudulent batch is reverted, and the malicious operator is penalized (by losing their staked collateral). The verifier who submitted the proof is rewarded.</li>
        <li><strong>Analogy:</strong> Imagine a bank teller who accepts a large stack of cheques for deposit. To save time, they don&apos;t verify every single signature on the spot. They optimistically add the total to the account balance and publish the result. For the next seven days, the bank&apos;s fraud department has the right to review the cheques. If they find a forgery, they reverse the deposit and penalize the fraudulent account.</li>
        <li><strong>User Impact:</strong> This system is highly efficient. The main drawback is the long withdrawal time. When you want to move your funds from an Optimistic Rollup back to Ethereum L1, you must wait for the seven-day challenge period to expire to ensure the transaction is final. (Though third-party "bridge" services often offer faster, fee-based withdrawals).</li>
        <li><strong>Examples:</strong> <a href="https://arbitrum.io/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Arbitrum</a>, <a href="https://www.optimism.io/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Optimism</a>, <a href="https://www.base.org/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Base</a>.</li>
      </ul>

      <h3>2. Zero-Knowledge (ZK) Rollups</h3>

      <p>ZK-Rollups operate on the opposite principle: "mathematically proven to be guilty or innocent."</p>

      <ul>
        <li><strong>How they work:</strong> Before a batch of transactions is submitted to the L1, the L2 operator uses immense computational power to generate a special cryptographic proof called a <strong>validity proof</strong> (often a SNARK or a STARK). This proof mathematically guarantees that every single transaction in the batch is valid.</li>
        <li><strong>The Validity Proof System:</strong> The L1 smart contract only needs to verify this small, elegant proof. It doesn&apos;t need to re-execute any of the thousands of transactions in the batch. If the proof is valid, the batch is instantly accepted as final. There is no challenge period.</li>
        <li><strong>Analogy:</strong> Imagine a student turning in a 1,000-question math exam. Instead of the teacher re-solving every single problem to check the work, the student provides a special cryptographic "answer key" that, in a single check, mathematically proves that all 1,000 answers are correct. The teacher&apos;s job becomes incredibly fast.</li>
        <li><strong>User Impact:</strong> The key advantage is speed and finality. Since the validity of transactions is proven upfront, there is no need for a long challenge period. Withdrawals from a ZK-Rollup back to Ethereum L1 can be processed as soon as the L1 contract verifies the proof, which is typically just minutes.</li>
        <li><strong>Examples:</strong> <a href="https://polygon.technology/polygon-zkevm" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Polygon zkEVM</a>, <a href="https://zksync.io/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">zkSync</a>, <a href="https://www.starknet.io/" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-primary-accent/80 underline">Starknet</a>.</li>
      </ul>

      <h2>Comparison Table: Optimistic vs. ZK-Rollups</h2>

      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Optimistic Rollups</th>
            <th>Zero-Knowledge (ZK) Rollups</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Core Principle</strong></td>
            <td>Innocent until proven guilty</td>
            <td>Mathematically proven to be valid</td>
          </tr>
          <tr>
            <td><strong>Proof Method</strong></td>
            <td>Fraud Proofs (submitted only if there&apos;s a problem)</td>
            <td>Validity Proofs (submitted with every batch)</td>
          </tr>
          <tr>
            <td><strong>Withdrawal Time (to L1)</strong></td>
            <td>Long (~7 days), due to challenge period</td>
            <td>Fast (~minutes-hours), once proof is verified</td>
          </tr>
          <tr>
            <td><strong>Pros</strong></td>
            <td>High EVM compatibility, currently lower operator costs.</td>
            <td>Faster finality, no withdrawal delay, strong security guarantees.</td>
          </tr>
          <tr>
            <td><strong>Cons</strong></td>
            <td>Long withdrawal times for users.</td>
            <td>Historically more complex for developers, can have higher operator costs due to intense computation.</td>
          </tr>
        </tbody>
      </table>

      <h2>What This Means For You as a User</h2>

      <ol>
        <li><strong>Lower Costs, Faster Speeds:</strong> The most immediate benefit is that your transactions (swaps, approvals, mints, revokes) will cost cents instead of many dollars, and they will confirm in seconds.</li>
        <li><strong>Bridging is Required:</strong> To use an L2, you must first move your assets from Ethereum L1 to the L2 network using a "bridge." This is a special smart contract that locks your assets on L1 and mints an equivalent version on the L2.</li>
        <li><strong>L2s are Separate Networks:</strong> Your funds on Arbitrum are separate from your funds on Optimism. You need to use a bridge to move assets between them or back to L1. It is critical to ensure you are connected to the correct network in your wallet when interacting with a dapp.</li>
      </ol>

      <p>In summary, Layer 2 networks are the key to unlocking Ethereum&apos;s scalability. By taking the heavy computational work off-chain and using L1 for security and data availability, they allow the ecosystem to grow to millions of users without sacrificing the core principles of decentralization and security that make it so valuable.</p>
    `,
    publishedAt: '2024-12-19',
    readTime: '12 min read',
    category: 'Education',
    featured: false
  },
  {
    slug: 'red-team-yourself-simulating-an-attack-on-your-wallet',
    title: 'Red Team Yourself: Simulating an Attack on Your Wallet',
    subtitle: 'Your Personal Flight Simulator for Web3 Security',
    content: `
      <p>Commercial pilots spend hundreds of hours in flight simulators, practicing their response to engine failures, system malfunctions, and severe weather. They rehearse for catastrophic events in a controlled environment so that if the worst ever happens, their actions are automatic, precise, and calm—not panicked.</p>

      <p>Why should we treat our digital wealth with any less seriousness?</p>

      <p>Most Web3 security advice focuses on building strong defenses: using hardware wallets, managing allowances, and avoiding suspicious links. This is the equivalent of building a sturdy aircraft. But it&apos;s not enough. You must also know how to fly it through a storm.</p>

      <p>This is where "red teaming" comes in. In professional cybersecurity, a red team is hired to simulate a real-world attack on a company&apos;s defenses. By adopting the mindset of an adversary, they uncover blind spots, test response procedures, and expose vulnerabilities before a real attacker can. You can apply this same powerful methodology to your own security.</p>

      <p>This guide will walk you through how to safely and effectively red team your own wallet and habits. It&apos;s your personal flight simulator for Web3 security—a way to build the reflexes of a seasoned defender before you ever face a real threat.</p>

      <h2>Adopting the Attacker&apos;s Mindset</h2>

      <p>To red team yourself is to ask a simple, powerful question: <strong>"If I wanted to steal my own funds, how would I do it?"</strong></p>

      <p>This requires a psychological shift. For a moment, you must stop thinking like a defender and start thinking like an attacker. An attacker doesn&apos;t care about your intentions; they care about your mistakes. They look for the path of least resistance.</p>

      <p>Ask yourself:</p>

      <ul>
        <li>Where am I lazy? Do I skip verifying contract addresses when I&apos;m in a hurry?</li>
        <li>What do I trust too easily? Do I automatically click links from people I follow on X (formerly Twitter)?</li>
        <li>What are my emotional triggers? Would a promise of a "free, limited-edition airdrop" (greed) or a fake "security alert" (fear) cause me to rush and make a mistake?</li>
        <li>What is my single biggest point of failure? Is it a single hot wallet holding everything? An unverified seed phrase backup?</li>
      </ul>

      <p>The goal of this exercise is not to be paranoid, but to be objective. By looking at your own habits through this adversarial lens, you can identify the cracks in your fortress that are invisible from the inside.</p>

      <h2>The Red Team Playbook: Four Drills for Your Wallet</h2>

      <p>A red team exercise is not a theoretical review; it is a practical drill. Here are four simulations you can run to test different aspects of your security.</p>

      <p><strong>Important Safety Note:</strong> These drills are designed to be safe simulations. Some involve a trusted friend. Before starting any drill, establish a clear "safe word" (e.g., "STOP DRILL") that, when spoken, immediately ends the simulation and confirms you are no longer in the test scenario.</p>

      <h3>Drill #1: The Social Engineering Simulation</h3>

      <p><strong>Objective:</strong> To test your real-world reflexes against a convincing phishing attempt.</p>

      <ol>
        <li><strong>Setup:</strong> Enlist one trusted, tech-savvy friend. Explain the drill and establish your safe word. Ask them to craft a realistic phishing attempt targeted at you. This could be a direct message on Discord or Telegram, or an email. The message should use urgency or promise of reward, such as:
          <ul>
            <li>"Security Alert: A suspicious transaction was detected from your wallet. Click here to revoke permissions now."</li>
            <li>"Congratulations! You are eligible for the exclusive airdrop from [New Hot Project]. Connect your wallet to claim before it&apos;s too late."</li>
      </ul>
        </li>
        <li><strong>Execution:</strong> Your friend sends the message at an unexpected time. Your job is to react exactly as you normally would. Do not change your behaviour because you know it&apos;s a test.</li>
        <li><strong>Debrief:</strong> After the drill (and after using the safe word), review your actions with your friend.
          <ul>
            <li>Did you feel a sense of panic or excitement?</li>
            <li>Did you instinctively move to click the link?</li>
            <li>Did you take the time to hover over the URL to see its true destination?</li>
            <li>Did you check the sender&apos;s profile or email address for authenticity?</li>
          </ul>
        </li>
      </ol>

      <p>This drill is powerful because it moves phishing from an abstract concept to a felt experience, training your brain to pause and verify even when under emotional pressure.</p>

      <h3>Drill #2: The Approval Audit Under Pressure</h3>

      <p><strong>Objective:</strong> To determine if your security standards decline when faced with FOMO (Fear Of Missing Out).</p>

      <ol>
        <li><strong>Setup:</strong> Find a real, but safe, contract to interact with. This could be a well-known application like Uniswap on a testnet, or even on mainnet if you are comfortable. The key is to <em>simulate</em> urgency. Set a 60-second timer and tell yourself, "I have one minute to complete this swap or I&apos;ll miss the opportunity."</li>
        <li><strong>Execution:</strong> Go through the motions of the transaction. When your wallet pops up with the approval request, pay close attention to your automatic response.</li>
        <li><strong>Debrief:</strong>
          <ul>
            <li>Did you read what you were approving? Or did you just click "Confirm"?</li>
            <li>Did the dapp request an <strong>unlimited approval</strong>? Did you consider changing it to a specific amount?</li>
            <li>Did you take even five seconds to copy the contract address and verify it on a block explorer?</li>
      </ul>
        </li>
      </ol>

      <p>This drill exposes your default security posture. The goal is to make diligent approval checks an unbreakable habit, no matter how rushed you feel.</p>

      <h3>Drill #3: The "Disaster" Recovery Test</h3>

      <p><strong>Objective:</strong> To verify that your backup and recovery plan is not just a theory, but a functional reality.</p>

      <ol>
        <li><strong>Setup:</strong> You will need a spare, clean device (an old laptop or phone you can wipe) and your physical seed phrase backup. <strong>Never perform this drill on your primary, everyday devices.</strong></li>
        <li><strong>Execution (Hardware Wallet):</strong>
          <ul>
            <li>Pretend your primary hardware wallet has been lost or destroyed.</li>
            <li>Take your securely stored seed phrase backup.</li>
            <li>On the clean, spare device, install a software wallet like MetaMask or Rabby.</li>
            <li>Attempt to restore your wallet using the seed phrase.</li>
      </ul>
        </li>
        <li><strong>Execution (Multisig):</strong>
          <ul>
            <li>Simulate the loss or compromise of one of your signer keys.</li>
            <li>Attempt to create and execute a transaction (e.g., sending a small amount of ETH) using only the remaining required signers.</li>
            <li>Go through the process of replacing the "lost" signer with a new, secure one.</li>
          </ul>
        </li>
        <li><strong>Debrief:</strong> This is often the most revealing drill.
          <ul>
            <li>Was your seed phrase backup easily accessible and legible? (No smudged ink or forgotten locations).</li>
            <li>Did the recovery work as expected? Did you encounter any unexpected technical hurdles?</li>
            <li>For a multisig, was the process of coordinating signers and replacing a key clear and straightforward?</li>
          </ul>
        </li>
      </ol>

      <p>A backup you haven&apos;t tested is not a backup; it&apos;s a hope. This drill replaces hope with certainty.</p>

      <h2>Documenting Your Findings: The Personal Security Worksheet</h2>

      <p>After each drill, document your findings. This turns the experience into a structured plan for improvement. Create a simple table like this:</p>

      <table>
        <thead>
          <tr>
            <th>Attack Vector / Scenario</th>
            <th>My Vulnerability / Weak Point</th>
            <th>Current Defense</th>
            <th>Actionable Improvement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Phishing DM from a "friend"</strong></td>
            <td>I almost clicked the link because the branding looked real and it created a sense of urgency.</td>
            <td>I generally try to be careful.</td>
            <td><strong>Rule:</strong> Never click a link in a DM. Always go to the project&apos;s official website via a bookmark.</td>
          </tr>
          <tr>
            <td><strong>"Limited Mint" Pressure</strong></td>
            <td>I granted an unlimited approval to save time without thinking about it.</td>
            <td>I use AllowanceGuard to review approvals later.</td>
            <td><strong>Habit:</strong> Always click "Edit Permission" in my wallet to set a custom spending cap for new approvals.</td>
          </tr>
          <tr>
            <td><strong>Hardware Wallet Recovery</strong></td>
            <td>It took me 20 minutes to find my seed phrase, and I realized word #17 was hard to read.</td>
            <td>Seed phrase stored on paper in a drawer.</td>
            <td><strong>Action:</strong> Re-write the seed phrase clearly. Store it on a steel plate in a fireproof safe. Test recovery again next quarter.</td>
          </tr>
          <tr>
            <td><strong>High Gas Fees</strong></td>
            <td>I saw a $50 fee to revoke an old, risky allowance and decided to "wait for a better time."</td>
            <td>I know I should revoke it.</td>
            <td><strong>Plan:</strong> Use a batch revocation tool to bundle this with other cleanups, making the gas cost more efficient. Prioritize L2s for new activity.</td>
          </tr>
        </tbody>
      </table>

      <h2>Making It a Routine</h2>

      <p>Like a fire drill, a personal red team exercise is most effective when it&apos;s done periodically.</p>
      
      <ul>
        <li><strong>Quarterly:</strong> If you are highly active in DeFi or NFTs, a short drill each quarter is a wise investment.</li>
        <li><strong>Annually:</strong> For all users, a comprehensive annual review including a recovery test is a critical security check-up.</li>
      </ul>

      <p>Security is not a static achievement; it is a dynamic practice. Your habits, the tools you use, and the threats you face will all evolve. Red teaming is how you ensure your defenses evolve with them. By rehearsing for an attack, you are training your mind and your habits to protect you automatically, turning you from a potential target into a hardened defender.</p>

      <h2>Practical Next Steps</h2>
      
      <ol>
        <li><strong>Schedule Your First Drill:</strong> Open your calendar now and block out 90 minutes in the next month for a "Wallet Security Drill."</li>
        <li><strong>Start with Recovery:</strong> The disaster recovery drill is the most critical and can be done on your own. Make this your first priority.</li>
        <li><strong>Enlist Your Ally:</strong> Reach out to a trusted friend and ask if they would be willing to help you with a controlled phishing simulation.</li>
        <li><strong>Perform a Post-Drill Cleanup:</strong> After your drills, use a tool like <a href="/" className="text-primary-accent hover:text-primary-accent/80 underline">AllowanceGuard</a> to immediately act on your findings, revoking the risky allowances and cleaning up the vulnerabilities you discovered.</li>
      </ol>
    `,
    publishedAt: '2024-12-19',
    readTime: '10 min read',
    category: 'Security',
    featured: false
  },
  {
    slug: 'from-dapp-user-to-security-advocate-building-community-trust',
    title: 'From Dapp User to Security Advocate: Building Community Trust',
    subtitle: 'How to Become a Force Multiplier for Web3 Security',
    content: `
      <p>In the early days of a frontier town, safety is an individual concern. You lock your own door, you watch your own back. But as the town grows into a city, a new understanding emerges: the safety of the community is a shared responsibility. Residents form a neighbourhood watch, share information about threats, and teach newcomers how to stay safe. The collective vigilance of the many creates a level of security that no single individual could achieve on their own.</p>

      <p>Web3 is that frontier town, rapidly growing into a global city. For too long, we have treated security as a purely personal problem. We&apos;ve learned to manage our own allowances, secure our own private keys, and assess our own risks. These are the essential skills of self-preservation. But to build a truly resilient and trustworthy ecosystem, we must take the next step.</p>

      <p>It&apos;s time to move from being a passive user to an active steward. By sharing your knowledge, modelling good habits, and advocating for safer practices, you do more than just protect yourself. You become a force multiplier for security, strengthening the entire network and building a culture of collective defence. This is how we transition from a collection of individuals to a secure community.</p>

      <p>This guide will show you how to make that leap—how to safely and effectively share your knowledge, empower your peers, and become a trusted security advocate in the Web3 space.</p>

      <h2>The Network Effect of Shared Security</h2>

      <p>In a decentralized world, there is no central authority for safety. There is no Web3 police force. The security of the ecosystem is the emergent property of the actions of its millions of users. When you choose to step into an advocate role, you create powerful, positive ripple effects.</p>

      <h3>You Raise the Bar for Attackers</h3>

      <p>Every time you teach someone how to spot a phishing link or revoke an unlimited approval, you make scams marginally less profitable. When an entire community becomes vigilant, the cost and effort for attackers to succeed skyrockets. They are forced to move on to easier targets.</p>

      <h3>You Build Your On-Chain Reputation</h3>

      <p>In an ecosystem where trust is paramount, your reputation is one of your most valuable assets. By consistently providing clear, level-headed, and helpful security advice, you build immense social capital. You become a more valuable DAO member, a more trusted collaborator, and a respected voice that people turn to for guidance.</p>

      <h3>You Create a Social Immune System</h3>

      <p>A community of advocates acts like a biological immune system. When one person identifies a "virus"—a new scam, a malicious contract, a compromised front-end—and responsibly reports it, the entire "body" can develop defences. Alerts are shared, wallets are warned, and the threat is neutralized far faster than any single user could react on their own.</p>

      <h2>The Advocate&apos;s Toolkit: Sharing Safely and Effectively</h2>

      <p>Your first duty as an advocate is to protect yourself. You can be a powerful educator without ever compromising your own operational security (OpSec).</p>

      <h3>Principle 1: Educate, Don&apos;t Expose</h3>

      <p>Sharing knowledge should never mean sharing your personal information. Your wallet address, balances, and transaction history are private. To learn the fundamentals of digital privacy beyond Web3, the Electronic Frontier Foundation&apos;s Surveillance Self-Defense guide is an excellent starting point.</p>

      <ul>
        <li><strong>Use a Dedicated Persona:</strong> Consider using a pseudonymous account (on X, Discord, etc.) specifically for sharing security content. This separates your public advocacy from your private on-chain activity.</li>
        <li><strong>Demonstrate with Clean Wallets:</strong> When creating tutorials or screenshots, use a fresh, empty wallet. Fund it with a tiny amount of ETH for gas from a privacy-preserving service if needed.</li>
        <li><strong>Blur Everything:</strong> Before posting any screenshot, meticulously blur or black out any potentially identifying information: ENS names, full wallet addresses, balances, and specific transaction hashes. The lesson is in the process (how to revoke), not in your personal holdings.</li>
      </ul>

      <h3>Principle 2: Report Responsibly, Not Recklessly</h3>

      <p>When you discover a potential threat, your first instinct may be to sound the alarm publicly. This can sometimes cause more harm than good, creating panic or tipping off an attacker before a project can implement a fix. Follow the professional standard of responsible disclosure.</p>

      <ul>
        <li><strong>Verify First:</strong> Is the threat real? Don&apos;t amplify FUD (Fear, Uncertainty, and Doubt). Cross-reference the suspicious contract on multiple block explorers. Check for official announcements from the project. See if others in trusted security communities are discussing it.</li>
        <li><strong>Notify the Team Privately:</strong> This is the most critical step. Look for a dedicated security contact on the project&apos;s website (often a security@ email address) or in their documentation. If they have a bug bounty program on a platform like Immunefi, the leading bug bounty platform for Web3, use that official channel. This gives the team a chance to investigate and patch the vulnerability without causing a public firestorm.</li>
        <li><strong>Escalate Publicly Only If Necessary:</strong> If the project team is unresponsive after a reasonable amount of time, or if they are dismissive of a credible and urgent threat, a calm, evidence-based public post is warranted. Stick to the facts and avoid sensationalism.</li>
      </ul>

      <h3>Principle 3: Make Security Social and Accessible</h3>

      <p>The best way to raise the security bar of your community is to make it a shared, accessible activity rather than a solitary, intimidating chore.</p>

      <ul>
        <li><strong>Host a "Revocation Party":</strong> In your DAO or favorite Discord, schedule a recurring monthly event. A trusted member can share their screen (using a clean wallet) and walk everyone through the process of checking their allowances on a tool like AllowanceGuard, Revoke.cash, or the native Etherscan Token Approval Checker. It turns a boring task into a social get-together and ensures everyone&apos;s security hygiene stays high.</li>
        <li><strong>Create a Pinned "Safety Message":</strong> Work with the admins of your group to create a comprehensive, pinned message in the main channel. It should include:
          <ul>
            <li>Links to official project websites, Twitter accounts, and contracts.</li>
            <li>A direct link to a trusted allowance checker.</li>
            <li>A clear warning: "Admins will NEVER DM you first. Never share your seed phrase."</li>
            <li>A list of official admin usernames.</li>
          </ul>
        </li>
      </ul>

      <h2>Scaling Your Impact: Content is the Great Multiplier</h2>

      <p>To reach beyond your immediate circle, you need to create content that is easy to find, easy to understand, and easy to share. Consistency is more important than creating one perfect, epic guide. A steady "slow drip" of helpful tips keeps security top-of-mind for your audience.</p>
      
      <table>
        <thead>
          <tr>
            <th>Content Format</th>
            <th>Why It&apos;s Effective</th>
            <th>Example Topic</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tweet Thread / X Post</strong></td>
            <td>Breaks down a single complex topic into a series of simple, digestible points. Highly shareable.</td>
            <td>"What&apos;s a Proxy Contract? A 5-tweet explainer on why your favorite dapp can change its code."</td>
          </tr>
          <tr>
            <td><strong>Short Video (30-60s)</strong></td>
            <td>Visually demonstrates a specific action. Perfect for showing, not just telling.</td>
            <td>A screen recording showing exactly how to edit an "unlimited" approval to a specific amount in MetaMask.</td>
          </tr>
          <tr>
            <td><strong>Infographic</strong></td>
            <td>Uses visuals to explain relationships and flows that are difficult to describe with text alone.</td>
            <td>A flowchart showing how a phishing scam works, from the fake DM to the malicious signature request.</td>
          </tr>
          <tr>
            <td><strong>Simple Checklist (PDF)</strong></td>
            <td>A practical, downloadable resource that users can refer to repeatedly.</td>
            <td>"My Quarterly Wallet Security Checklist" covering allowance review, hardware wallet firmware, etc.</td>
          </tr>
        </tbody>
      </table>
      
      <h2>The Ethos of an Advocate: Humility and Honesty</h2>

      <p>The final, most important part of being a trusted advocate is building credibility. This comes not from claiming to be an all-knowing expert, but from being an honest and humble guide.</p>

      <ul>
        <li><strong>Never Guarantee Safety:</strong> A responsible advocate never says, "This protocol is 100% safe." They use nuanced language: "This protocol has been audited by multiple firms and uses a timelock for upgrades, which significantly reduces risk. However, no smart contract is ever entirely without risk."</li>
        <li><strong>Admit What You Don&apos;t Know:</strong> If someone asks a question you can&apos;t answer, the best response is, "That&apos;s a great question. I&apos;m not an expert on that specific topic, but here is a resource from a security researcher who is." Pointing to experts builds more trust than pretending to be one. Build a library of trusted, expert sources you can share, such as the technical blog from OpenZeppelin Security or the foundational OWASP Smart Contract Top 10.</li>
        <li><strong>Emphasize Habits Over Tools:</strong> Tools are essential, but they are not a substitute for good judgment. Always remind your community that even the best security setup can be defeated by a single moment of carelessness. Technology is the seatbelt; user vigilance is the careful driver.</li>
      </ul>
      
      <h2>Practical Next Steps</h2>

      <p>Becoming an advocate is a journey that starts with a single step. You don&apos;t need a massive following to make a difference.</p>

      <ol>
        <li><strong>Start in Your Own Circle:</strong> The next time a friend asks about a new project, don&apos;t just talk about the potential gains. Spend 30 seconds showing them how to check its contract on Etherscan.</li>
        <li><strong>Create One Piece of Content:</strong> Write a short, simple guide on the single security habit that has helped you the most. It could be about wallet segmentation, using a hardware wallet, or your process for evaluating new contracts. Share it in your favorite Discord.</li>
        <li><strong>Propose a "Revocation Party":</strong> Reach out to a moderator in a DAO or community you&apos;re a part of and suggest organizing a group allowance-checking session.</li>
        <li><strong>Curate a Resource List:</strong> Compile a simple list of your top 5 trusted security resources (tools, researchers to follow, educational sites) and share it.</li>
      </ol>
      
      <p>By evolving from a user to an advocate, you complete the final stage of your Web3 journey. You not only secure your own future on the decentralized web but also become an architect of its collective safety. In this ecosystem, we are all the neighborhood watch. Lead by example.</p>
    `,
    publishedAt: '2024-12-19',
    readTime: '12 min read',
    category: 'Community',
    featured: false
  },
  {
    slug: 'what-are-token-allowances',
    title: 'What Are Token Allowances and Why They Matter',
    subtitle: 'The Silent Permission You\'re Probably Giving Away',
    content: `
      <p>Every time you connect a wallet to a DeFi app, swap on a DEX, or stake in a protocol, you&apos;re asked to approve something. Most people click "Approve" without thinking. That click gives the app a token allowance—a standing permission to move your assets on your behalf.</p>

      <p>Think of it like giving someone a key to your house. You might trust them to water your plants while you&apos;re away, but that key gives them access to everything inside. In Web3, token allowances work the same way. They&apos;re not just for the specific transaction you&apos;re making—they&apos;re often permanent, unlimited permissions that can be used anytime.</p>

      <p>This guide will explain what token allowances are, why they matter for your security, and how to manage them effectively. Understanding allowances is the foundation of Web3 security, and it&apos;s something every DeFi user needs to master.</p>

      <h2>What Are Token Allowances?</h2>
      
      <p>A token allowance is a smart contract permission that allows one address (like a DeFi protocol) to spend tokens from another address (your wallet) up to a specified limit. It&apos;s like writing a check with a blank amount—you&apos;re giving someone permission to withdraw money from your account, but you&apos;re not specifying how much.</p>

      <p>When you approve a token allowance, you&apos;re essentially saying: "This smart contract can move up to X amount of my tokens whenever it wants." The key word here is "whenever"—most allowances don&apos;t expire and can be used repeatedly until you revoke them.</p>

      <h3>How Allowances Work</h3>
      
      <p>Here&apos;s the technical process:</p>

      <ol>
        <li><strong>You initiate a transaction</strong> (like swapping tokens on Uniswap)</li>
        <li><strong>The dapp requests an allowance</strong> for the tokens you want to swap</li>
        <li><strong>You approve the allowance</strong> by signing a transaction</li>
        <li><strong>The dapp can now move your tokens</strong> up to the approved amount</li>
        <li><strong>The allowance remains active</strong> until you revoke it</li>
      </ol>

      <p>The problem is that most users approve allowances without understanding what they&apos;re doing. They see "Approve USDC" and click "Confirm" without realizing they&apos;re giving the protocol permission to spend their USDC indefinitely.</p>

      <h2>Why Allowances Matter for Security</h2>
      
      <p>Token allowances are one of the biggest security risks in DeFi. Here&apos;s why:</p>

      <h3>1. They&apos;re Often Unlimited</h3>
      
      <p>Many protocols request unlimited allowances to avoid asking for permission on every transaction. This means you&apos;re giving them access to your entire token balance, not just what you need for the current transaction.</p>

      <h3>2. They Don&apos;t Expire</h3>
      
      <p>Unlike traditional banking permissions, token allowances don&apos;t have expiration dates. Once you approve an allowance, it remains active until you manually revoke it.</p>

      <h3>3. They Can Be Exploited</h3>
      
      <p>If a protocol is compromised or turns malicious, your allowances can be used to drain your wallet. Even if you stop using the protocol, your allowances remain active.</p>

      <h3>4. They&apos;re Hard to Track</h3>
      
      <p>Most wallets don&apos;t show you your active allowances, making it easy to forget about them. You might have dozens of active allowances without realizing it.</p>

      <h2>Common Allowance Scenarios</h2>
      
      <p>Here are some common situations where you&apos;ll encounter token allowances:</p>

      <h3>DEX Trading</h3>
      
      <p>When you swap tokens on Uniswap, SushiSwap, or other DEXs, you need to approve the tokens you&apos;re selling. This allows the DEX to move your tokens from your wallet to the liquidity pool.</p>

      <h3>Lending Protocols</h3>
      
      <p>When you deposit tokens into Aave, Compound, or other lending protocols, you approve them to hold your tokens. This allows them to lend your tokens to other users.</p>

      <h3>Yield Farming</h3>
      
      <p>When you stake tokens in yield farming pools, you approve the farming contract to manage your tokens. This allows them to move your tokens between different protocols to maximize yield.</p>

      <h3>NFT Marketplaces</h3>
      
      <p>When you list NFTs for sale on OpenSea or other marketplaces, you approve them to transfer your NFTs when they&apos;re sold.</p>

      <h2>How to Manage Your Allowances</h2>
      
      <p>Managing token allowances is crucial for your security. Here&apos;s how to do it effectively:</p>

      <h3>1. Review Before Approving</h3>
      
      <p>Always check what you&apos;re approving before signing the transaction. Look for:</p>
      <ul>
        <li>The amount being approved (is it unlimited?)</li>
        <li>The protocol requesting the allowance</li>
        <li>Whether you trust the protocol</li>
      </ul>

      <h3>2. Use Specific Amounts</h3>
      
      <p>Instead of approving unlimited allowances, approve only what you need for your current transaction. This limits your risk if the protocol is compromised.</p>

      <h3>3. Revoke Unused Allowances</h3>
      
      <p>Regularly review and revoke allowances you&apos;re no longer using. This reduces your attack surface and keeps your wallet secure.</p>

      <h3>4. Use Allowance Management Tools</h3>
      
      <p>Tools like Allowance Guard can help you track and manage your allowances. They show you all your active allowances and make it easy to revoke them.</p>

      <h2>Best Practices for Allowance Security</h2>
      
      <p>Here are some best practices to keep your allowances secure:</p>

      <h3>1. Principle of Least Privilege</h3>
      
      <p>Only approve the minimum amount necessary for your transaction. If you&apos;re swapping $100 worth of tokens, don&apos;t approve unlimited allowances.</p>

      <h3>2. Regular Audits</h3>
      
      <p>Set a reminder to review your allowances monthly. Revoke any you&apos;re not actively using.</p>

      <h3>3. Use Multiple Wallets</h3>
      
      <p>Consider using separate wallets for different activities. Keep your main assets in a wallet with minimal allowances.</p>

      <h3>4. Stay Informed</h3>
      
      <p>Follow security news and be aware of protocol hacks. If a protocol you use is compromised, revoke your allowances immediately.</p>

      <h2>The Bottom Line</h2>
      
      <p>Token allowances are a necessary part of DeFi, but they&apos;re also a significant security risk. By understanding how they work and managing them properly, you can use DeFi safely while protecting your assets.</p>

      <p>Remember: every allowance you approve is a potential attack vector. Be selective, be specific, and be vigilant. Your security depends on it.</p>
    `,
    publishedAt: '2024-12-18',
    readTime: '8 min read',
    category: 'Security',
    featured: false
  }
]

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = React.use(params)
  const { slug } = resolvedParams

  // Find the blog post
  const post = blogPosts.find(p => p.slug === slug)
  
  if (!post) {
    notFound()
  }

  // Find the current post index for navigation
  const currentIndex = blogPosts.findIndex(p => p.slug === slug)
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null

  return (
    <>
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Back to blog link */}
              <Link 
                href="/blog"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-accent transition-colors duration-200 mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="default" className="text-sm">
                  {post.category}
                </Badge>
                {post.featured && (
                  <Badge variant="outline" className="text-sm">
                    Featured
                  </Badge>
                )}
              </div>
              
              <H1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                {post.title}
              </H1>
              
              <p className="text-xl text-text-secondary mb-6">
                {post.subtitle}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>

              {/* Tags - Optional */}
              {post.tags && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>
          </div>
        </Container>
      </Section>

      <div className="border-t border-border-primary" />

      {/* Article Content with Alternating Backgrounds */}
      <Section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Article content */}
            <article 
              className="prose max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Call to action */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-2xl p-8 mb-12 shadow-sm">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Ready to Secure Your Token Allowances?
              </h3>
              <p className="text-text-secondary mb-6">
                Don&apos;t wait for an attack to happen. Start monitoring and managing your token allowances today with AllowanceGuard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-accent text-white font-semibold rounded-lg hover:bg-primary-accent/90 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link 
                  href="/docs"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary-accent text-primary-accent font-semibold rounded-lg hover:bg-primary-accent/10 transition-colors duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-8 border-t border-border-primary bg-white rounded-lg p-6 shadow-sm">
              {prevPost ? (
                <Link 
                  href={`/blog/${prevPost.slug}`}
                  className="group flex items-center gap-3 text-text-secondary hover:text-primary-accent transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  <div>
                    <p className="text-sm font-medium">Previous</p>
                    <p className="text-sm">{prevPost.title}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              
              {nextPost ? (
                <Link 
                  href={`/blog/${nextPost.slug}`}
                  className="group flex items-center gap-3 text-text-secondary hover:text-primary-accent transition-colors duration-200 ml-auto"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium">Next</p>
                    <p className="text-sm">{nextPost.title}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}