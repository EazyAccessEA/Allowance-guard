# AllowanceGuard CLA — Legal Review Checklist

**Status**: Pending review
**Owner**: EazyAccessEA
**Created**: April 2026

This checklist covers items that require **your personal action** before the CLA is fully enforceable. The CLA document (`CLA.md`) and automation are in place, but a qualified lawyer should review these areas.

---

## Lawyer Review Items

- [ ] **Governing law (Section 10)** — Currently set to "England and Wales". Confirm this is correct for your legal entity. If EazyAccessEA is registered elsewhere, update accordingly.

- [ ] **Patent grant (Section 3)** — Confirm the patent grant language is appropriate for your jurisdiction and business model. The defensive termination clause (patents revoke if a contributor sues) is standard but should be validated.

- [ ] **"Sign-by-PR" enforceability (Section 8)** — Confirm that a pull request submission constitutes valid acceptance of the CLA in your jurisdiction. Some jurisdictions may require more explicit consent (e.g., click-through or email confirmation).

- [ ] **Copyright assignment vs. license grant (Section 2)** — The CLA currently uses a **license grant** (contributor keeps ownership). If you need a **copyright assignment** instead (full transfer of ownership to EazyAccessEA), the CLA must be rewritten. License grants are more contributor-friendly and more commonly accepted.

- [ ] **Sublicensing scope (Section 2)** — The CLA grants sublicensing rights. Confirm this is broad enough for your commercial license model (e.g., if you offer white-label or OEM deals).

- [ ] **Organization contributions (Section 8)** — Confirm that a PR comment from an authorized representative is sufficient for corporate CLA acceptance, or whether you need a separate corporate CLA process.

- [ ] **Termination clause (Section 9)** — Currently, the CLA can only be terminated by "mutual written agreement" and doesn't affect previously licensed contributions. Confirm this is enforceable and sufficient.

## Infrastructure Items (Already Done)

- [x] CLA document created (`CLA.md`)
- [x] CONTRIBUTING.md updated with CLA section
- [x] PR template includes CLA checkbox (`.github/PULL_REQUEST_TEMPLATE.md`)
- [x] GitHub Action enforces CLA on all PRs (`.github/workflows/cla-check.yml`)
- [x] Signature tracking file created (`.github/cla-signatures.json`)
- [x] LICENSE_STRATEGY.md updated to reference custom CLA
- [x] Project owner added as exempt signatory

## Optional Enhancements (Future)

- [ ] **Separate corporate CLA** — Create a dedicated document for organizations contributing, with fields for company name, authorized signer, and corporate email.
- [ ] **CLA re-trigger on comment** — Extend the GitHub Action to listen for `issue_comment` events so the CLA check re-runs when a contributor posts their agreement comment (currently requires a new push or PR reopen).
- [ ] **CLA dashboard page** — Add a `/cla` page on allowanceguard.com explaining the CLA in plain language for contributors.
- [ ] **Email-based CLA signing** — For contributors who prefer not to use GitHub comments, offer an email-based signing process via legal.support@allowanceguard.com.

---

## Contact

- Legal questions: legal.support@allowanceguard.com
- Commercial licensing: legal.support@allowanceguard.com
