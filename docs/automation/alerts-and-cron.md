# Alerts and Automated Monitoring

*Last reviewed: 12 September 2025*

The alerting and automation features of AllowanceGuard are built to provide ongoing monitoring even when users are not actively checking the dashboard. Alert policies, once configured, are stored in Neon Postgres and evaluated on a schedule. A cron-based system such as cron-job.org calls AllowanceGuard's API at defined intervals, triggering scans and sending notifications when thresholds are met.

This documentation describes how to configure these alerts, how the system determines when a notification should be sent and how integrations such as Slack webhooks and email work. It also explains the reliability measures built into the system, including retries and backoff strategies, and the limitations imposed by network rate limits. By using this automation layer, users can maintain continuous vigilance over their wallet permissions without manual intervention.
