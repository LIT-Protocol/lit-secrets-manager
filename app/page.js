"use client";
import { LockIcon, ShieldIcon, KeyIcon, ServerIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      title: "Encrypted Storage",
      description:
        "Your secrets are encrypted using Lit Protocol's advanced cryptographic network. Each secret is encrypted with unique access conditions that you define.",
      icon: <LockIcon className="w-8 h-8 mb-4 text-orange-600" />,
    },
    {
      title: "Decentralized Security",
      description:
        "Leverage Lit Protocol's decentralized node network for encryption and access control. No single point of failure and no central authority.",
      icon: <ShieldIcon className="w-8 h-8 mb-4 text-orange-600" />,
    },
    {
      title: "Programmable Access",
      description:
        "Define complex access conditions using Lit Actions. Control who can access your secrets based on wallet addresses, token ownership, or custom logic.",
      icon: <KeyIcon className="w-8 h-8 mb-4 text-orange-600" />,
    },
  ];

  const whyChooseItems = [
    {
      title: "Safe Encryption",
      description:
        "Your secrets are protected using advanced cryptographic techniques that are resistant to attacks.",
    },
    {
      title: "Conditional Access",
      description:
        "Grant access to secrets based on on-chain conditions, NFT ownership, DAO membership, or custom criteria.",
    },
    {
      title: "Cross-Chain Compatibility",
      description:
        "Works seamlessly across multiple blockchain networks with unified access control.",
    },
  ];

  const useCases = [
    {
      title: "Secure Key Management",
      description:
        "Store API keys, private keys, and sensitive credentials with programmatic access control.",
    },
    {
      title: "DAO Governance",
      description:
        "Manage privileged access to DAO resources and sensitive organizational information.",
    },
    {
      title: "DApp Security",
      description: "Protect user data and application secrets in decentralized applications.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="bg-white/80 backdrop-blur-sm fixed top-0 w-full z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LockIcon className="w-6 h-6 text-orange-600" />
            Lit Secrets
          </h1>
          <a
            href="/createSecrets"
            className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md hover:shadow-lg transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Secret
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Secure Your Secrets with{" "}
            <span className="text-orange-600 relative">
              Lit Protocol
              <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-600/20"></span>
            </span>
          </h2>
          <p className="text-xl mb-8 text-gray-700 leading-relaxed">
            The decentralized secret manager powered by Lit Protocol encryption network. Store,
            manage, and share your sensitive data with confidence.
          </p>
          <a
            href="/createSecrets"
            className="inline-flex items-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Secret
          </a>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Why Choose Lit Protocol?</h3>
            <ul className="space-y-6">
              {whyChooseItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-orange-600 mr-3">•</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Use Cases</h3>
            <ul className="space-y-6">
              {useCases.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-orange-600 mr-3">•</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-orange-600 text-white p-12 rounded-xl shadow-xl mb-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join the growing community of developers and organizations securing their secrets with
              Lit Protocol.
            </p>
            <a
              href="/createSecrets"
              className="inline-flex items-center px-8 py-4 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Secret
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-white shadow-md mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-700">
            <p className="mb-2 flex items-center justify-center gap-2">
              <ShieldIcon className="w-4 h-4 text-orange-600" />
              Built on Lit Protocol
            </p>
            <p className="text-sm">© 2024 Lit Secrets. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
