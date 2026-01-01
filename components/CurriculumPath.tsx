# 1. Force Git to acknowledge casing (Linux-safe)
git mv components/CurriculumPath.tsx components/__CURRICULUMPATH_TMP__.tsx
git mv components/__CURRICULUMPATH_TMP__.tsx components/CurriculumPath.tsx

# 2. Remove any lingering case variants (defensive sweep)
find components -type f -iname "curriculumpath.tsx" ! -name "CurriculumPath.tsx" -delete

# 3. Validate filesystem state (must return exactly ONE result)
ls components | grep -i curriculumpath

# 4. Enforce import correctness across entire codebase
grep -R "components/curriculumpath" -n . && exit 1 || true
grep -R "components/Curriculumpath" -n . && exit 1 || true

# 5. Commit the normalized state
git add components
git commit -m "Normalize CurriculumPath casing for Linux/Netlify compatibility"

# 6. Push canonical tree
git push
