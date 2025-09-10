'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    question: "What is Allowance Guard?",
    answer: "Allowance Guard is a security tool that helps you monitor and manage token approvals across your wallets. It scans your wallet addresses to find active token approvals and helps you revoke risky or unnecessary permissions to protect your assets.",
    category: "General"
  },
  {
    question: "How does Allowance Guard work?",
    answer: "Allowance Guard connects to your wallet and scans for active token approvals across multiple blockchain networks. It identifies which contracts have permission to spend your tokens and helps you revoke permissions that are no longer needed or pose security risks.",
    category: "General"
  },
  {
    question: "Is Allowance Guard safe to use?",
    answer: "Yes, Allowance Guard is designed with security in mind. We only read your wallet's approval data - we never ask for your private keys or seed phrases. All operations are performed through your connected wallet using standard blockchain transactions.",
    category: "Security"
  },
  {
    question: "Can I recover stolen assets using Allowance Guard?",
    answer: "No. Allowance Guard is a preventative security tool that helps you practice proper wallet hygiene by revoking risky approvals. It cannot recover stolen funds, but it can help prevent future theft by removing dangerous permissions.",
    category: "Security"
  },
  {
    question: "What if I have a 'sweeper bot' stealing my ETH?",
    answer: "If you have a bot that steals ETH as soon as it's deposited, your seed phrase was compromised. Revoking approvals won't help in this case. You should abandon this wallet and create a new one with a fresh seed phrase.",
    category: "Security"
  },
  {
    question: "Is disconnecting my wallet enough instead of revoking approvals?",
    answer: "No. Disconnecting your wallet from a website only prevents that website from seeing your address. Your token approvals remain active and can still be exploited. You must explicitly revoke approvals to remove permissions.",
    category: "Security"
  },
  {
    question: "Do hardware wallets protect against approval exploits?",
    answer: "Hardware wallets protect your private keys but offer no extra protection against approval exploits. Since approvals don't require your private keys to be stolen, hardware wallets cannot prevent these attacks. You still need to manage your approvals carefully.",
    category: "Security"
  },
  {
    question: "How much does it cost to use Allowance Guard?",
    answer: "Allowance Guard is free to use, but revoking approvals requires gas fees for blockchain transactions. Gas costs vary by network and current conditions. You can choose when to revoke approvals based on gas prices.",
    category: "Costs"
  },
  {
    question: "Why does my wallet show 'approve' when I'm revoking?",
    answer: "Token contracts use the same function for both approving and revoking. When revoking, you're setting the approval amount to 0. You can verify this by checking the transaction details in your wallet - it should show the approval being set to 0.",
    category: "Technical"
  },
  {
    question: "What happens to my staked tokens when I revoke approvals?",
    answer: "Revoking approvals doesn't affect your staked or deposited tokens. They remain staked and you can still withdraw them. However, you'll need to grant new approvals if you want to add more tokens to your staked position.",
    category: "Technical"
  },
  {
    question: "Which approvals should I revoke?",
    answer: "Focus on revoking approvals for unknown or suspicious contracts. Well-known protocols like Uniswap are generally safe to keep active. Consider revoking approvals for contracts you no longer use or trust. It's a balance between security and convenience.",
    category: "Best Practices"
  },
  {
    question: "Do I need to revoke approvals on testnets?",
    answer: "Generally no. Testnet tokens have no real value, so testnet approvals don't pose security risks to your mainnet assets. Each approval only applies to the specific token on the specific network where it was granted.",
    category: "Technical"
  },
  {
    question: "Which networks does Allowance Guard support?",
    answer: "Allowance Guard currently supports Ethereum, Arbitrum, and Base networks. We're working on adding support for more EVM-compatible networks. Check our documentation for the most up-to-date list of supported networks.",
    category: "Technical"
  },
  {
    question: "How often should I check my approvals?",
    answer: "We recommend checking your approvals monthly or after using new DeFi protocols. Set up email alerts to be notified of new approvals automatically. Regular monitoring helps you maintain good wallet hygiene and catch suspicious activity early.",
    category: "Best Practices"
  },
  {
    question: "Can I set up alerts for new approvals?",
    answer: "Yes! Allowance Guard can send you email alerts when new approvals are detected on your monitored wallets. You can customize alert settings to receive notifications for all approvals or only high-risk ones.",
    category: "Features"
  }
]

const categories = ["All", "General", "Security", "Technical", "Best Practices", "Features", "Costs"]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const filteredFAQs = selectedCategory === "All" 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory)

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-First Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Everything you need to know about Allowance Guard and token approval security.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        {/* Mobile-First Category Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile-First FAQ Items */}
        <div className="space-y-3 sm:space-y-4">
          {filteredFAQs.map((faq, index) => {
            const isOpen = openItems.has(index)
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-4 py-4 sm:px-6 text-left flex items-start justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-900 font-medium pr-4 text-left leading-tight">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-6 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed pt-4 text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile-First Contact Section */}
        <div className="mt-12 sm:mt-16">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-center">
              <a
                href="/docs"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center text-sm sm:text-base"
              >
                View Documentation
              </a>
              <a
                href="mailto:support@allowanceguard.com"
                className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center text-sm sm:text-base"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
