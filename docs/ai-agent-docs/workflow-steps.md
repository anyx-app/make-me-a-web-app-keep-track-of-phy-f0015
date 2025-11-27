# Standard Development Workflow

## 🚀 OPTIMIZED: Initial Git Setup (Use This!)

**For NEW repository setup** (when starting fresh):
```bash
# SINGLE COMMAND - Sets up everything at once:
git init && \
git remote add origin https://${GITHUB_TOKEN}@github.com/${GITHUB_ORG}/${GITHUB_REPO}.git && \
git config user.name "Anyx Agent" && \
git config user.email "ai@anyx.app" && \
git fetch origin && \
git checkout -b main origin/main && \
git checkout -b ${TASK_BRANCH} origin/${TASK_BRANCH} && \
git merge origin/main --no-edit
```

**Replace placeholders:**
- `${GITHUB_TOKEN}` → Your GitHub token (available in env)
- `${GITHUB_ORG}` → Organization name (e.g., `anyx-app`)
- `${GITHUB_REPO}` → Repository name (from task instructions)
- `${TASK_BRANCH}` → Your task branch name (from task instructions)

**Benefits:**
- ✅ 1 command instead of 7 separate ones
- ✅ Reduces token usage by ~85%
- ✅ No opportunity for errors between steps
- ✅ Git config already set correctly

---

## Pre-Task Setup

1. **Install pnpm** (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. **Verify environment**:
   ```bash
   pnpm --version
   node --version  # Should be LTS
   ```

---

## ⚠️ BEFORE YOU START: Critical Routing Check

**READ THIS FIRST** to avoid the #1 deployment failure:

**Q: Is this a single-page landing page OR a multi-page app?**

### ✅ Single-Page Landing Page (Marketing, Portfolio, etc.):
**Action**: Replace `src/pages/Index.tsx` content directly  
**Do NOT**: Modify `App.tsx` or add routing  
**Result**: Your page shows immediately ✓

### ✅ Multi-Page App (Dashboard, Admin Panel, etc.):
**Action**: Add routing to `src/App.tsx` (see core-guidelines.md)  
**Do NOT**: Leave placeholder Index.tsx as default route  
**Result**: All your pages are accessible ✓

**See detailed instructions**: `core-guidelines.md` → "Routing Setup"

---

## Task Workflow (Follow Exactly)

### Step 1: Branch Checkout & Sync
```bash
# If repository is already set up, just checkout and sync:
git checkout <task.branchName>
git fetch origin main
git merge origin/main --no-edit
# Resolve conflicts if any, then proceed
```

### Step 3: Implementation

**🚨 EFFICIENCY RULES (Reduce Cost by 50%)**:

1. **File Reading Limits** (Prevent wasted tokens):
   - ❌ DON'T re-read files after editing them
   - ❌ DON'T read entire large files (>200 lines)
   - ✅ USE `view_range` parameter for specific sections
   - ✅ MAX 2 reads per file total
   - ✅ Trust your changes - don't verify by re-reading

2. **Editing Strategy** (Use right tool):
   - ✅ **USE `sed`** for simple one-line replacements:
     ```bash
     sed -i 's/old text/new text/' src/file.tsx
     ```
   - ❌ **AVOID `str_replace_editor`** for simple changes (often fails with "path is not a directory")
   - ✅ **USE `str_replace_editor`** only for complex multi-line edits

3. **Write Lint-Free Code** (Avoid iteration):
   - **BEFORE coding**, anticipate common errors:
     - Remove unused variables/imports
     - Define interfaces (NO `any` types)
     - Use optional chaining (`data?.map`)
     - Add default values (`data = []`)
   
   - **BATCH fix all lint errors together**:
     ```bash
     # ❌ BAD: Fix one error at a time (10+ LLM calls)
     sed -i 's/unused1//' file1.tsx
     # run lint
     sed -i 's/unused2//' file2.tsx
     # run lint again...
     
     # ✅ GOOD: Fix all errors at once (1 LLM call)
     sed -i 's/unused1//' file1.tsx
     sed -i 's/unused2//' file2.tsx
     sed -i 's/unused3//' file3.tsx
     # run lint once
     ```

4. **Defensive Coding Checklist** (Before commit):
   - [ ] All imports used
   - [ ] No `any` types (define interfaces)
   - [ ] Optional chaining on arrays (`.map()` → `?.map()`)
   - [ ] Default values for props/state
   - [ ] No console.log statements

**Implementation**:
- Make your code changes
- Follow component-based architecture
- Use existing libraries (see package.json)
- Keep components small and focused

### Step 4: Documentation
Update **both** files:

**`repo.md`:**
```markdown
# Project Context
[Keep project description current]

## Latest Changes
- [What you just implemented]
- [Key decisions made]

## Known Issues
- [Any pending items]
```

**`README.md`:**
- Update if features/setup changed
- Keep installation/usage instructions current

### Step 5: Quality Checks
```bash
# Run in order:
pnpm install        # Install any new deps
pnpm lint           # Must pass
pnpm build          # Must succeed
```

If errors occur:
- Fix and re-test (max 3 attempts)
- If still failing, report with structured output

### Step 6: Commit & Push
```bash
git add .
git commit -m "feat: [concise description]" --author="Anyx Agent <ai@anyx.app>"
git push origin <task.branchName>
```

### Step 7: Create Pull Request
- **Create PR** from your branch to `main`
- **Link to issue**: Use the provided GitHub issue URL
- **Status**: Always "ready for review" (NEVER draft)
- **Use exact branch name** from task instructions

### Step 8: Structured Output
Provide completion JSON (see `structured-output.md`) with:
- `task_status`: "completed" | "stuck" | "needs_help"
- All required fields filled
- List of modified files
- Testing status

## Pull Request Standards

**Title Format**: `[Type]: Brief description`
- Types: `feat`, `fix`, `refactor`, `docs`
- Example: `feat: Add user profile page with avatar upload`

**Description Template**:
```markdown
## Changes
- [What was implemented]
- [Key components added/modified]

## Testing
- ✅ Lint passed
- ✅ Build succeeded
- ✅ Manually verified: [what you checked]

## Notes
- [Any important context for reviewer]
```

## Common Pitfalls

❌ **Don't:**
- Create draft PRs
- Skip lint/build checks
- Forget to update repo.md
- Commit to wrong branch
- Edit forbidden files
- Run git setup as 7 separate commands (use optimized single command above!)

✅ **Do:**
- Use the optimized git setup command at the top of this file
- Always sync with main first
- Test before committing
- Keep documentation current
- Use proper git author
- Ask for help if stuck (after 3 attempts)

