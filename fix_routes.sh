#!/bin/bash
find apps/astro-web/src -type f -name "*.tsx" -o -name "*.astro" -o -name "*.ts" | xargs sed -i 's|href="/repos"|href="/repositories"|g'
find apps/astro-web/src -type f -name "*.tsx" -o -name "*.astro" -o -name "*.ts" | xargs sed -i 's|href={`/repo/|href={`/repositories/|g'
find apps/astro-web/src -type f -name "*.tsx" -o -name "*.astro" -o -name "*.ts" | xargs sed -i 's|href={`/repo/${|href={`/repositories/${|g'
find apps/astro-web/src -type f -name "*.tsx" -o -name "*.astro" -o -name "*.ts" | xargs sed -i 's|href="/repo/|href="/repositories/|g'
find apps/astro-web/src -type f -name "*.tsx" -o -name "*.astro" -o -name "*.ts" | xargs sed -i 's|href="/ai"|href="/ai-projects"|g'
find apps/astro-web/src -type f -name "*.tsx" -o -name "*.astro" -o -name "*.ts" | xargs sed -i 's|Astro.redirect("/repos")|Astro.redirect("/repositories")|g'
