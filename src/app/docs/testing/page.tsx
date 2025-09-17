'use client'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import { useState } from 'react'
import { 
  TestTube, 
  Shield, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Settings
} from 'lucide-react'

export default function TestingPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const menuItems = [
    { id: 'overview', title: 'Testing Overview', icon: TestTube },
    { id: 'e2e-setup', title: 'E2E Testing Setup', icon: Play },
    { id: 'test-policies', title: 'Testing Policies', icon: Shield },
    { id: 'ci-cd', title: 'CI/CD Integration', icon: Settings },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: AlertTriangle }
  ]

  const testTypes = [
    { 
      type: "End-to-End (E2E)", 
      description: "Full application testing with Playwright",
      coverage: ["User workflows", "API endpoints", "Accessibility", "Payment flows"],
      tools: ["Playwright", "@axe-core/playwright"]
    },
    { 
      type: "Unit Testing", 
      description: "Individual component and function testing",
      coverage: ["Utility functions", "API routes", "Data processing"],
      tools: ["Jest", "React Testing Library"]
    },
    { 
      type: "Integration Testing", 
      description: "Testing component interactions",
      coverage: ["Database operations", "External API calls", "Service integrations"],
      tools: ["Supertest", "MSW"]
    },
    { 
      type: "Accessibility Testing", 
      description: "WCAG 2.0 AA compliance verification",
      coverage: ["Screen reader compatibility", "Keyboard navigation", "Color contrast"],
      tools: ["@axe-core/playwright", "Manual testing"]
    }
  ]

  const e2eFeatures = [
    { 
      feature: "Test Mode Switches", 
      description: "Environment-based testing controls",
      details: ["NEXT_PUBLIC_E2E=1", "E2E_FAKE_PAYMENTS=1", "E2E_FAKE_EMAIL=1"]
    },
    { 
      feature: "Fake Payment Modes", 
      description: "Mocked payment processing for testing",
      details: ["Stripe fake sessions", "Coinbase fake charges", "No external API calls"]
    },
    { 
      feature: "Fake Email Mode", 
      description: "Mocked email sending for testing",
      details: ["Console logging", "No real emails sent", "Fake success responses"]
    },
    { 
      feature: "Test Data Seeding", 
      description: "Controlled test data for consistent testing",
      details: ["Test wallet addresses", "Sample allowances", "Database seeding endpoint"]
    }
  ]

  const testPolicies = [
    {
      category: "Code Coverage",
      requirements: [
        "Minimum 80% code coverage for new features",
        "All API endpoints must have integration tests",
        "Critical user flows require E2E tests",
        "Accessibility tests for all UI components"
      ]
    },
    {
      category: "Testing Standards",
      requirements: [
        "All tests must be deterministic and repeatable",
        "Tests should not depend on external services",
        "Use descriptive test names and clear assertions",
        "Mock external dependencies appropriately"
      ]
    },
    {
      category: "CI/CD Requirements",
      requirements: [
        "All tests must pass before deployment",
        "E2E tests run on every pull request",
        "Accessibility tests are mandatory",
        "Performance regression tests for critical paths"
      ]
    },
    {
      category: "Security Testing",
      requirements: [
        "Input validation testing for all endpoints",
        "Authentication and authorization testing",
        "Rate limiting verification",
        "SQL injection and XSS prevention testing"
      ]
    }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="overview" className="text-2xl font-semibold text-ink mb-4">Testing Overview</h2>
              <p className="text-lg text-stone leading-relaxed mb-8">
                Allowance Guard implements a comprehensive testing strategy to ensure reliability, security, and accessibility. Our testing framework covers everything from individual components to full user workflows, with special emphasis on security and accessibility compliance.
              </p>
              
              <h3 id="testing-philosophy" className="text-xl font-semibold text-ink mb-4">Testing Philosophy</h3>
              <p className="text-base text-stone leading-relaxed mb-6">
                We believe in testing early, testing often, and testing comprehensively. Our testing strategy is built on the principle that quality is not an afterthought but an integral part of the development process. Every feature is tested at multiple levels to ensure it meets our high standards for security, performance, and user experience.
              </p>

              <h3 id="test-types" className="text-xl font-semibold text-ink mb-6">Test Types & Coverage</h3>
              <div className="space-y-6">
                {testTypes.map((test, index) => (
                  <div key={index} className="bg-white border border-line rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-cobalt/10 rounded-lg flex items-center justify-center">
                        <TestTube className="w-6 h-6 text-cobalt" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-ink mb-2">{test.type}</h4>
                        <p className="text-base text-stone mb-4">{test.description}</p>
                        <div className="space-y-2">
                          <div>
                            <h5 className="text-sm font-medium text-ink mb-1">Coverage:</h5>
                            <p className="text-sm text-stone">{test.coverage.join(', ')}</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-ink mb-1">Tools:</h5>
                            <p className="text-sm text-stone">{test.tools.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'e2e-setup':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="e2e-setup" className="text-2xl font-semibold text-ink mb-4">E2E Testing Setup</h2>
              <p className="text-lg text-stone leading-relaxed mb-8">
                Our End-to-End testing framework uses Playwright to test complete user workflows in a real browser environment. The framework includes sophisticated mocking capabilities to ensure tests run reliably without external dependencies.
              </p>

              <h3 id="installation" className="text-xl font-semibold text-ink mb-4">Installation & Setup</h3>
              <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                <pre className="text-sm text-gray-800 overflow-x-auto">
                  {`# Install Playwright and accessibility testing tools
pnpm add -D @playwright/test @axe-core/playwright

# Install browser dependencies
npx playwright install --with-deps

# Run tests
pnpm test:e2e`}
                </pre>
              </div>

              <h3 id="test-mode-features" className="text-xl font-semibold text-ink mb-6">Test Mode Features</h3>
              <div className="space-y-6">
                {e2eFeatures.map((feature, index) => (
                  <div key={index} className="bg-white border border-line rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-ink mb-2">{feature.feature}</h4>
                        <p className="text-base text-stone mb-4">{feature.description}</p>
                        <div className="space-y-1">
                          {feature.details.map((detail, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span className="text-sm text-stone">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 id="running-tests" className="text-xl font-semibold text-ink mb-4">Running Tests</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-line rounded-lg p-4">
                  <h4 className="font-medium text-ink mb-2">Local Development</h4>
                  <pre className="text-sm text-gray-800">
                    {`# Set environment variables
export NEXT_PUBLIC_E2E=1
export E2E_FAKE_PAYMENTS=1
export E2E_FAKE_EMAIL=1

# Run all tests
pnpm test:e2e

# Run with UI
pnpm test:e2e:ui

# Run specific test file
pnpm playwright test tests/scan.spec.ts`}
                  </pre>
                </div>
                <div className="bg-gray-50 border border-line rounded-lg p-4">
                  <h4 className="font-medium text-ink mb-2">Using Test Script</h4>
                  <pre className="text-sm text-gray-800">
                    {`# Run the convenience script
./scripts/test-e2e.sh`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )

      case 'test-policies':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="test-policies" className="text-2xl font-semibold text-ink mb-4">Testing Policies & Standards</h2>
              <p className="text-lg text-stone leading-relaxed mb-8">
                Our testing policies ensure consistent quality and reliability across all development work. These standards are mandatory for all contributors and help maintain the high security and performance standards that our users expect.
              </p>

              <div className="space-y-8">
                {testPolicies.map((policy, index) => (
                  <div key={index} className="bg-white border border-line rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-ink mb-4">{policy.category}</h3>
                        <ul className="space-y-2">
                          {policy.requirements.map((requirement, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span className="text-base text-stone">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 id="test-naming-conventions" className="text-xl font-semibold text-ink mb-4">Test Naming Conventions</h3>
              <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                <ul className="space-y-2 text-sm text-gray-800">
                  <li><strong>E2E Tests:</strong> <code>tests/[feature].spec.ts</code> (e.g., <code>scan.spec.ts</code>)</li>
                  <li><strong>Test Descriptions:</strong> Use descriptive names that explain the expected behavior</li>
                  <li><strong>Test IDs:</strong> Use <code>data-testid</code> attributes for reliable element selection</li>
                  <li><strong>File Organization:</strong> Group related tests in the same file</li>
                </ul>
              </div>

              <h3 id="security-testing" className="text-xl font-semibold text-ink mb-4">Security Testing Requirements</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">Critical Security Tests</h4>
                    <ul className="space-y-1 text-sm text-red-700">
                      <li>• All user inputs must be validated and sanitized</li>
                      <li>• Authentication bypass attempts must be tested</li>
                      <li>• Rate limiting must be verified on all endpoints</li>
                      <li>• SQL injection and XSS prevention must be tested</li>
                      <li>• Sensitive data must never be exposed in test outputs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'ci-cd':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="ci-cd" className="text-2xl font-semibold text-ink mb-4">CI/CD Integration</h2>
              <p className="text-lg text-stone leading-relaxed mb-8">
                Our continuous integration pipeline ensures that all code changes are thoroughly tested before deployment. The pipeline runs automatically on every pull request and push to the main branch.
              </p>

              <h3 id="github-actions" className="text-xl font-semibold text-ink mb-4">GitHub Actions Workflow</h3>
              <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                <pre className="text-sm text-gray-800 overflow-x-auto">
                  {`name: E2E
on:
  pull_request:
  push:
    branches: [ main ]
jobs:
  e2e:
    runs-on: ubuntu-latest
    env:
      NEXT_PUBLIC_E2E: "1"
      E2E_FAKE_PAYMENTS: "1"
      E2E_FAKE_EMAIL: "1"
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 18, cache: 'pnpm' }
      - run: corepack enable
      - run: pnpm i --frozen-lockfile
      - run: npx playwright install --with-deps
      - run: pnpm build
      - run: pnpm -s playwright test --reporter=list
    continue-on-error: true`}
                </pre>
              </div>

              <h3 id="deployment-gates" className="text-xl font-semibold text-ink mb-4">Deployment Gates</h3>
              <div className="space-y-4">
                <div className="bg-white border border-line rounded-lg p-6">
                  <h4 className="font-semibold text-ink mb-3">Pre-Deployment Checks</h4>
                  <ul className="space-y-2 text-sm text-stone">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      All E2E tests must pass
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Accessibility tests must pass
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Build must complete successfully
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      No critical security vulnerabilities
                    </li>
                  </ul>
                </div>
              </div>

              <h3 id="test-reports" className="text-xl font-semibold text-ink mb-4">Test Reports & Artifacts</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-3">Available Reports</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• <strong>HTML Report:</strong> Detailed test results with screenshots and videos</li>
                  <li>• <strong>Accessibility Report:</strong> WCAG compliance violations and fixes</li>
                  <li>• <strong>Performance Metrics:</strong> Test execution times and performance data</li>
                  <li>• <strong>Coverage Report:</strong> Code coverage analysis</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 'troubleshooting':
        return (
          <div className="space-y-8">
            <div>
              <h2 id="troubleshooting" className="text-2xl font-semibold text-ink mb-4">Testing Troubleshooting</h2>
              <p className="text-lg text-stone leading-relaxed mb-8">
                Common issues and solutions for testing problems. If you encounter issues not covered here, please check our GitHub issues or contact the development team.
              </p>

              <h3 id="common-issues" className="text-xl font-semibold text-ink mb-6">Common Issues & Solutions</h3>
              <div className="space-y-6">
                <div className="bg-white border border-line rounded-lg p-6">
                  <h4 className="font-semibold text-ink mb-3">Tests Fail to Start</h4>
                  <div className="space-y-2 text-sm text-stone">
                    <p><strong>Problem:</strong> Application fails to start during testing</p>
                    <p><strong>Solution:</strong> Check if port 3000 is available, verify build succeeds with <code>pnpm build</code></p>
                  </div>
                </div>

                <div className="bg-white border border-line rounded-lg p-6">
                  <h4 className="font-semibold text-ink mb-3">Database Connection Issues</h4>
                  <div className="space-y-2 text-sm text-stone">
                    <p><strong>Problem:</strong> Tests fail due to database connectivity</p>
                    <p><strong>Solution:</strong> Ensure <code>DATABASE_URL</code> is set, check database accessibility</p>
                  </div>
                </div>

                <div className="bg-white border border-line rounded-lg p-6">
                  <h4 className="font-semibold text-ink mb-3">Test Timeouts</h4>
                  <div className="space-y-2 text-sm text-stone">
                    <p><strong>Problem:</strong> Tests timeout during execution</p>
                    <p><strong>Solution:</strong> Increase timeout in <code>playwright.config.ts</code>, check for slow operations</p>
                  </div>
                </div>

                <div className="bg-white border border-line rounded-lg p-6">
                  <h4 className="font-semibold text-ink mb-3">Accessibility Violations</h4>
                  <div className="space-y-2 text-sm text-stone">
                    <p><strong>Problem:</strong> Accessibility tests report violations</p>
                    <p><strong>Solution:</strong> Review violations in test output, fix issues in components, update tests if violations are acceptable</p>
                  </div>
                </div>
              </div>

              <h3 id="debug-mode" className="text-xl font-semibold text-ink mb-4">Debug Mode</h3>
              <div className="bg-gray-50 border border-line rounded-lg p-6 mb-6">
                <pre className="text-sm text-gray-800">
                  {`# Run tests in debug mode
pnpm playwright test --debug

# Run specific test in debug mode
pnpm playwright test tests/scan.spec.ts --debug

# Show test report
pnpm exec playwright show-report`}
                </pre>
              </div>

              <h3 id="getting-help" className="text-xl font-semibold text-ink mb-4">Getting Help</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-3">Support Resources</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• <strong>GitHub Issues:</strong> Report bugs and request features</li>
                  <li>• <strong>Documentation:</strong> Check this guide and API docs</li>
                  <li>• <strong>Community:</strong> Join our Discord for discussions</li>
                  <li>• <strong>Email:</strong> Contact legal.support@allowanceguard.com for urgent issues</li>
                </ul>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white text-ink">
      
      {/* Hero Section */}
      <Section className="relative py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Testing Framework & Policies</H1>
          <p className="text-xl text-stone max-w-reading mb-8">
            Comprehensive testing documentation for Allowance Guard. Learn about our E2E testing framework, testing policies, CI/CD integration, and troubleshooting guide.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Navigation and Content */}
      <Section className="py-16">
        <Container>
          <div className="flex gap-8">
            {/* Sidebar Navigation */}
            <div className="w-64 flex-shrink-0">
              <nav className="sticky top-8">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                            activeSection === item.id
                              ? 'bg-cobalt text-white'
                              : 'text-stone hover:text-ink hover:bg-mist'
                          }`}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="prose prose-lg max-w-none">
                {renderContent()}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
