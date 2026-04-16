/**
 * Teams section — role-based access for shared monitoring.
 *
 * Extracted from DocsContentSecondary so that file stays under the 600-line
 * limit after the quiet-frame rewrites.
 *
 * Council:
 *  Kael: Paper surfaces only. No rounded-xl. No amber-500 icon frames.
 *  #13 UX writer: Roles as a two-column grid (name + permissions paragraph)
 *  Noor: amber-deep on paper is AA; no colour-coded role badges.
 */

export default function TeamsSection() {
  return (
    <div className="space-y-16">
      <section className="space-y-5">
        <h2 id="teams-collaboration" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
          Teams.
        </h2>
        <p className="font-plex text-lg text-ink-muted leading-[1.6]">
          Role-based access for DAOs, treasuries, and security teams. Add wallets, invite members, assign permissions.
        </p>
      </section>

      <section className="space-y-7">
        <h3 id="team-roles" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          Four roles.
        </h3>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Owner</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Full control. Adds and removes members, manages wallets, invites collaborators, transfers ownership, deletes the team.
            </p>
          </div>
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Admin</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Manages members and wallets, sends invites. Cannot remove the owner or delete the team.
            </p>
          </div>
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Editor</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Adds wallets, invites viewers, revokes approvals, configures monitoring. No member-management rights.
            </p>
          </div>
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Viewer</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Read-only access to approvals and scan results. Cannot revoke or change settings.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 id="getting-started-with-teams" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          Getting started.
        </h3>
        <ol className="space-y-5">
          <li className="flex gap-5">
            <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">01</span>
            <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
              <strong className="text-ink font-semibold">Sign in.</strong> Email magic-link authentication creates or opens your account. No password.
            </p>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">02</span>
            <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
              <strong className="text-ink font-semibold">Create a team.</strong> Click <em>New team</em>, enter a name. You become its owner.
            </p>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">03</span>
            <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
              <strong className="text-ink font-semibold">Add wallets.</strong> Paste any wallet addresses the team needs to monitor. Read-only by default.
            </p>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">04</span>
            <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
              <strong className="text-ink font-semibold">Invite members.</strong> Email invites with role assignment. Recipients accept via a signed link.
            </p>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 font-mono text-xs text-ink-whisper font-semibold pt-1.5 w-6 tabular-nums" aria-hidden="true">05</span>
            <p className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">
              <strong className="text-ink font-semibold">Manage access.</strong> Change roles, revoke invitations, or remove members from the team settings page.
            </p>
          </li>
        </ol>
      </section>

      <section className="space-y-7">
        <h3 id="team-features" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          What comes with a team.
        </h3>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Shared wallets</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Multiple wallet addresses under one team, with centralised scanning and a unified risk view.
            </p>
          </div>
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Email invites</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Signed-link invitations with explicit role assignment. Revocable before acceptance.
            </p>
          </div>
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Team monitoring</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Autonomous rescans across every team-managed wallet. One alert stream for the whole team.
            </p>
          </div>
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Audit trail</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Every role change and wallet addition is logged with actor, timestamp, and previous value.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
