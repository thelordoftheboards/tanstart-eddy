#!/bin/sh
set -x  # Enable verbose output

current_dir=$(pwd)
echo "Post build actions running from: $current_dir"


for script in src/*/devtools/post-build-actions.sh; do
  if [ -f "$script" ]; then
    echo "Running sub-module post-build script: $script"
    (cd "$(dirname "$script")/../../.." && sh "$script")
  fi
done


mkdir ./.output/drizzle
cp -r ./drizzle/. ./.output/drizzle/


bun ./devtools/update-server-version.ts


echo "Post build actions complete."
