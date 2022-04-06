#!/bin/bash

date=$(date +%Y-%m-%d)

ssh root@188.166.116.102 << EOF
  su - postgres -c "pg_dump postgres > /tmp/postgres-$date.sql"
EOF

scp "root@188.166.116.102:/tmp/postgres-$date.sql" "./scripts/backups/postgres-$date.sql"

ssh root@188.166.116.102 << EOF
  rm /tmp/postgres-$date.sql
EOF

# scp ./scripts/backups/postgres.sql root@188.166.116.102:/tmp/postgres.sql
# sudo -su postgres
# psql postgres < postgres.sql
