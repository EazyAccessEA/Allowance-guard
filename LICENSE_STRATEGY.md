# AllowanceGuard License Strategy

> **Date**: April 2, 2026
> **Status**: Decision documented — pending final review
> **Current License**: GPL-3.0

## Context

AllowanceGuard is transitioning from a fully free, donation-funded tool to an open-core model with paid tiers (Pro, Sentinel, B2B API). The current GPL-3.0 license allows competitors to fork all premium features and serve them without open-sourcing their modifications.

## Options Considered

### Option 1: Keep GPL-3.0 (Current)
- **Pros**: Familiar to community, no disruption, simple
- **Cons**: Competitors can fork premium features and serve them as a hosted product without contributing back (the "SaaS loophole")

### Option 2: AGPL-3.0 for Open-Source Core (Recommended)
- **Pros**: Closes the SaaS loophole — anyone serving AllowanceGuard over a network must open-source their modifications. Still fully open source. Still allows self-hosting. Protects premium features from being forked into competing SaaS products.
- **Cons**: Some enterprises cannot use AGPL software internally. Requires updating all file headers and LICENSE file.

### Option 3: Dual License (AGPL-3.0 + Commercial)
- **Pros**: AGPL for open-source community use; commercial license for enterprises that cannot comply with AGPL. Proven model (used by MongoDB, Grafana, Minio, etc.). Enables enterprise sales.
- **Cons**: More complex to manage. Requires CLA (Contributor License Agreement) from open-source contributors.

## Recommendation

**Dual licensing: AGPL-3.0 (open source) + Commercial License (enterprise)**

This is the standard open-core model. The AGPL ensures the community benefits from any improvements. The commercial license enables enterprises with AGPL-incompatible policies to use AllowanceGuard legally.

## Implementation Steps (When Ready)

1. Update `LICENSE` file to AGPL-3.0
2. Update `package.json` license field to `AGPL-3.0`
3. Add AGPL header notice to source files
4. Create `LICENSE-COMMERCIAL.md` outlining commercial license terms
5. Add CLA for contributors (e.g., via CLA Assistant GitHub bot)
6. Update README with licensing section
7. Notify existing community via GitHub release notes and Discord
8. Enterprise customers contact `legal.support@allowanceguard.com` for commercial license

## Decision Status

**This is a business decision requiring owner review.** The code changes are straightforward but the strategic implications (community perception, enterprise sales, contributor policy) need stakeholder input.

### Action Required (Manual)
- [ ] Review and approve license strategy
- [ ] If approved: update LICENSE, package.json, file headers
- [ ] Set up CLA for contributors
- [ ] Draft commercial license terms (may need legal counsel)
- [ ] Communicate change to community
