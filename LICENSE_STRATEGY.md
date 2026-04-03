# AllowanceGuard License Strategy Decision

**Date**: April 2026
**Status**: Approved
**Decision**: Switch from GPL-3.0 to AGPL-3.0 + Commercial Dual License

---

## Background

AllowanceGuard was originally released under the GNU General Public License v3.0 (GPL-3.0). As the project transitions from a free donation-funded tool to a revenue-generating open-core product, the licensing strategy needs to align with business sustainability while preserving the open-source ethos.

## The Problem with GPL-3.0 for a Web Application

GPL-3.0 has a well-known limitation called the **"SaaS loophole"** (also known as the "ASP loophole"):

- GPL-3.0 only requires source code sharing when software is **distributed** (i.e., binary copies are given to others).
- Running software on a server and providing it as a web service is **not considered distribution** under GPL-3.0.
- This means a competitor could fork AllowanceGuard, add premium features, host it as a competing web service, and **never share their modifications** with the community.

For a Web3 security tool that runs primarily as a web application, this is a critical gap.

## Decision: AGPL-3.0 + Commercial Dual License

### Open Source License: AGPL-3.0

The GNU Affero General Public License v3.0 (AGPL-3.0) is identical to GPL-3.0 with one key addition:

> If you run a modified version of the software on a server and let users interact with it over a network, you must make the complete source code of your modified version available to those users.

This closes the SaaS loophole and ensures that anyone who builds on AllowanceGuard and offers it as a service must contribute their improvements back to the community.

### Commercial License

For organizations that cannot or do not wish to comply with AGPL-3.0 requirements (e.g., proprietary SaaS platforms, enterprise integrations), AllowanceGuard offers a **commercial license** that permits:

- Use without AGPL-3.0 copyleft obligations
- Integration into proprietary products
- Custom support and SLA agreements
- Private modifications without source disclosure

Commercial license inquiries: **legal.support@allowanceguard.com**

## Why This Is the Right Choice

| Factor | GPL-3.0 (Before) | AGPL-3.0 + Commercial (After) |
|--------|-------------------|-------------------------------|
| SaaS Protection | No — competitors can fork and host without sharing code | Yes — network use triggers copyleft |
| Open Source Community | Strong copyleft | Stronger copyleft (covers network use) |
| Enterprise Revenue | No path — enterprises avoid GPL anyway | Clear path — commercial license option |
| Contributor Protection | Moderate | Strong — CLA ensures dual-license rights |
| Community Trust | High | High — core remains fully open source |

## Precedent

Many successful open-core projects use AGPL + Commercial dual licensing:

- **MongoDB** (SSPL, evolved from AGPL)
- **Grafana** (AGPL-3.0)
- **Minio** (AGPL-3.0)
- **Nextcloud** (AGPL-3.0)

## What Changes

1. **LICENSE file**: Updated to AGPL-3.0 with commercial license notice
2. **package.json**: License field updated to `AGPL-3.0-or-later`
3. **Source file headers**: New files will include AGPL-3.0 header comment
4. **CLA (Contributor License Agreement)**: Contributors must sign a CLA granting AllowanceGuard the right to offer their contributions under both AGPL-3.0 and the commercial license
5. **Community communication**: Blog post explaining the change and why

## What Does NOT Change

- The core scanner remains **free and open source**
- All existing open-source features remain available under AGPL-3.0
- Individual users and non-commercial projects can use AllowanceGuard exactly as before
- The project remains on GitHub with full source code access
- Community contributions are welcome and encouraged

## Contributor License Agreement (CLA)

A CLA is required because dual licensing needs the copyright holder to have the right to offer code under both licenses. Without a CLA, each contributor retains copyright over their contributions, which would make commercial licensing legally impossible.

AllowanceGuard uses its own CLA documented in [`CLA.md`](./CLA.md). By submitting a pull request, contributors agree to the terms of the CLA. No third-party service is required.

The CLA grants AllowanceGuard:
- The right to distribute contributions under AGPL-3.0
- The right to distribute contributions under the commercial license
- A patent license covering contributed code
- Contributors retain full copyright ownership of their work

## Timeline

1. **April 2026**: License files updated, blog post published
2. **April 2026**: Custom CLA added to repository (`CLA.md`)
3. **Ongoing**: New source files include AGPL-3.0 headers
4. **Ongoing**: Commercial license available for enterprise customers

## Contact

- License questions: legal.support@allowanceguard.com
- Commercial licensing: legal.support@allowanceguard.com
- Community discussion: GitHub Discussions
