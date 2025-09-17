# Backup and Recovery Guide - Allowance Guard

## Overview

This document outlines the backup and recovery procedures for Allowance Guard production deployment using Neon PostgreSQL with Point-in-Time Recovery (PITR).

## Database Backup Strategy

### 1. Neon PITR (Point-in-Time Recovery)

**Status**: ✅ Enabled by default on Neon
**Recovery Window**: 7 days (free tier) / 30 days (paid tier)
**Location**: Neon automatically manages backups

#### How PITR Works
- Continuous backup with second-level granularity
- Automatic snapshots every 5 minutes
- No manual intervention required
- Cross-region replication available

### 2. Manual Backup Procedures

#### Quick Restore Drill (Monthly)

```bash
# 1. Create a restore branch at a specific timestamp
# Go to Neon Console → Branches → Create Branch
# Select "Point in time" and choose timestamp (e.g., 1 hour ago)
# Name: "restore-test-YYYY-MM-DD"

# 2. Get connection string for restore branch
DATABASE_URL_RESTORE="postgresql://user:pass@restore-branch-host/db?sslmode=require"

# 3. Test restore branch connectivity
psql "$DATABASE_URL_RESTORE" -c "SELECT COUNT(*) FROM allowances;"
psql "$DATABASE_URL_RESTORE" -c "SELECT COUNT(*) FROM donations;"
psql "$DATABASE_URL_RESTORE" -c "SELECT COUNT(*) FROM wallet_monitors;"

# 4. Verify data integrity
psql "$DATABASE_URL_RESTORE" -c "SELECT MAX(created_at) FROM allowances;"
psql "$DATABASE_URL_RESTORE" -c "SELECT MAX(created_at) FROM donations;"
```

#### Emergency Recovery Procedure

```bash
# 1. Create emergency restore branch
# In Neon Console: Create Branch → Point in time → Select incident time
# Name: "emergency-restore-YYYY-MM-DD-HH-MM"

# 2. Update environment variables
# In Vercel Dashboard → Environment Variables
# Update DATABASE_URL to point to restore branch

# 3. Redeploy application
vercel --prod

# 4. Verify application functionality
curl -f https://www.allowanceguard.com/api/healthz
```

### 3. Logical Backup (Optional)

#### Daily pg_dump Script

```bash
#!/bin/bash
# scripts/daily-backup.sh

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="allowance_guard_backup_${BACKUP_DATE}.sql"
S3_BUCKET="allowance-guard-backups"

# Create backup
pg_dump "$DATABASE_URL" > "/tmp/$BACKUP_FILE"

# Compress backup
gzip "/tmp/$BACKUP_FILE"

# Upload to S3 (requires AWS CLI configured)
aws s3 cp "/tmp/$BACKUP_FILE.gz" "s3://$S3_BUCKET/daily/"

# Clean up local file
rm "/tmp/$BACKUP_FILE.gz"

echo "Backup completed: $BACKUP_FILE.gz"
```

#### GitHub Actions Backup (Alternative)

```yaml
# .github/workflows/backup.yml
name: Daily Database Backup

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Install PostgreSQL client
        run: |
          sudo apt-get update
          sudo apt-get install -y postgresql-client

      - name: Create backup
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          pg_dump "$DATABASE_URL" | gzip > backup.sql.gz

      - name: Upload to S3
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1

      - name: Upload backup
        run: |
          aws s3 cp backup.sql.gz s3://allowance-guard-backups/daily/backup-$(date +%Y%m%d).sql.gz
```

## Recovery Testing

### Monthly Recovery Drill

1. **Create Test Branch**
   - Go to Neon Console
   - Create branch from 1 hour ago
   - Name: `recovery-test-YYYY-MM-DD`

2. **Test Connectivity**
   ```bash
   psql "$DATABASE_URL_RESTORE" -c "SELECT version();"
   ```

3. **Verify Data**
   ```bash
   psql "$DATABASE_URL_RESTORE" -c "SELECT COUNT(*) FROM allowances;"
   psql "$DATABASE_URL_RESTORE" -c "SELECT COUNT(*) FROM donations;"
   psql "$DATABASE_URL_RESTORE" -c "SELECT COUNT(*) FROM wallet_monitors;"
   ```

4. **Test Application**
   ```bash
   # Update DATABASE_URL temporarily
   export DATABASE_URL="$DATABASE_URL_RESTORE"
   npm run dev
   
   # Test key endpoints
   curl http://localhost:3000/api/healthz
   curl http://localhost:3000/api/allowances?wallet=0x0000000000000000000000000000000000000000
   ```

5. **Cleanup**
   - Delete test branch in Neon Console
   - Document results

### Recovery Time Objectives (RTO)

| Scenario | RTO | Procedure |
|----------|-----|-----------|
| Data corruption | 5 minutes | PITR branch + redeploy |
| Accidental deletion | 2 minutes | PITR branch + redeploy |
| Full database loss | 10 minutes | PITR branch + redeploy |
| Regional outage | 15 minutes | Cross-region failover |

## Monitoring and Alerts

### Database Health Monitoring

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check recent activity
SELECT COUNT(*) as recent_allowances 
FROM allowances 
WHERE created_at > NOW() - INTERVAL '1 hour';

-- Check for failed jobs
SELECT COUNT(*) as failed_jobs 
FROM jobs 
WHERE status = 'failed' 
AND created_at > NOW() - INTERVAL '1 hour';
```

### Automated Alerts

Set up monitoring for:
- Database connection failures
- Unusual data growth patterns
- Failed job processing
- Backup completion status

## Disaster Recovery Plan

### 1. Incident Response

1. **Assess Impact**
   - Check application health: `curl https://www.allowanceguard.com/api/healthz`
   - Review Vercel logs: `vercel logs --follow`
   - Check Neon dashboard for database status

2. **Immediate Actions**
   - Create PITR branch at last known good state
   - Update DATABASE_URL in Vercel
   - Redeploy application

3. **Verification**
   - Run smoke test script
   - Check critical user flows
   - Monitor error rates

### 2. Communication Plan

- **Internal**: Slack notification to team
- **External**: Status page update if needed
- **Users**: In-app notification for extended outages

### 3. Post-Incident

- Root cause analysis
- Update recovery procedures
- Test backup/restore process
- Document lessons learned

## Backup Retention Policy

| Backup Type | Retention | Location |
|-------------|-----------|----------|
| Neon PITR | 7-30 days | Neon managed |
| Daily dumps | 30 days | S3 bucket |
| Weekly dumps | 12 weeks | S3 bucket |
| Monthly dumps | 12 months | S3 bucket |

## Security Considerations

- All backups encrypted at rest
- Access logs maintained
- Regular access review
- Principle of least privilege
- Secure key rotation

## Cost Optimization

- Use Neon's free tier PITR for development
- Upgrade to paid tier for production (30-day retention)
- Compress logical backups
- Use S3 lifecycle policies for cost management
- Monitor backup storage costs

## Contact Information

- **Primary**: DevOps team
- **Secondary**: Development team
- **Emergency**: On-call engineer
- **Neon Support**: support@neon.tech
- **Vercel Support**: Vercel dashboard support

---

**Last Updated**: $(date)
**Next Review**: $(date -d "+1 month")
**Version**: 1.0
