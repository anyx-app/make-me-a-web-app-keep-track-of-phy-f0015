# Structured Output Schema

## When to Provide

**MANDATORY** - Provide this JSON when you:
- ✅ Complete a task
- ❌ Get stuck or blocked
- ❓ Have questions about requirements
- 🆘 Need help or guidance

## JSON Schema

```json
{
  "task_status": "completed|stuck|needs_help|questions",
  "task_completion": {
    "task_title": "[The task title from instructions]",
    "branch_used": "[Branch name you worked on]",
    "files_modified": [
      "src/components/ComponentName.tsx",
      "src/pages/PageName.tsx",
      "src/utils/helper.ts"
    ],
    "key_changes": [
      "Implemented responsive user profile component with avatar upload",
      "Added form validation using react-hook-form and zod",
      "Integrated Supabase storage for image uploads"
    ],
    "testing_status": "All tests passing - lint clean, build successful",
    "pr_ready": true,
    "pr_is_draft": false,
    "repo_md_updated": true
  },
  "issues_encountered": {
    "is_stuck": false,
    "blockers": [
      "API endpoint returning 404 for user profile",
      "TypeScript compilation errors in form component"
    ],
    "questions": [
      "Should I use Context API or Zustand for global state?",
      "What's the preferred pattern for error boundaries?"
    ],
    "help_needed": "code_review|clarification|technical_guidance|testing_help|design_feedback",
    "time_spent_minutes": 45,
    "attempts_made": 2,
    "alternative_approaches_tried": [
      "Tried CSS modules but had styling conflicts with Tailwind",
      "Attempted custom hook but encountered re-render issues"
    ]
  },
  "confidence_level": "high|medium|low",
  "next_steps": {
    "ready_for_review": true,
    "estimated_complexity": "low|medium|high",
    "additional_notes": "Component is fully typed, responsive, and follows accessibility guidelines. Ready for production."
  }
}
```

## Field Descriptions

### task_status (Required)
- `completed`: Task finished, PR ready
- `stuck`: Blocked, can't proceed
- `needs_help`: Need code review or guidance
- `questions`: Need clarification on requirements

### task_completion (Required - All Fields)
- **task_title**: Exact task name from instructions
- **branch_used**: Git branch name
- **files_modified**: Array of file paths (relative to project root)
- **key_changes**: Human-readable summary of what changed
- **testing_status**: Results of `pnpm lint` and `pnpm build`
- **pr_ready**: Boolean - is PR created and ready?
- **pr_is_draft**: Boolean - MUST be `false` (no draft PRs)
- **repo_md_updated**: Boolean - did you update `repo.md`?

### issues_encountered (Required if stuck/need_help)
- **is_stuck**: Boolean - are you blocked?
- **blockers**: Specific technical issues preventing progress
- **questions**: Clarifying questions about requirements
- **help_needed**: Type of assistance required
- **time_spent_minutes**: Actual time working on task
- **attempts_made**: How many times you tried to fix issues
- **alternative_approaches_tried**: What else did you attempt?

### confidence_level (Required)
Your confidence in the solution:
- `high`: Confident, tested, ready for production
- `medium`: Works but may need review
- `low`: Uncertain, definitely needs review

### next_steps (Required)
- **ready_for_review**: Boolean - can reviewer merge this?
- **estimated_complexity**: Your assessment of task difficulty
- **additional_notes**: Important context for reviewer

## Examples

### ✅ Success Example
```json
{
  "task_status": "completed",
  "task_completion": {
    "task_title": "Implement user authentication flow",
    "branch_used": "feature/auth-flow",
    "files_modified": [
      "src/pages/Login.tsx",
      "src/pages/Register.tsx",
      "src/components/AuthForm.tsx",
      "src/hooks/useAuth.ts",
      "src/lib/supabase.ts"
    ],
    "key_changes": [
      "Created login and registration pages with form validation",
      "Implemented useAuth hook for authentication state management",
      "Added Supabase integration for auth operations",
      "Included error handling and loading states"
    ],
    "testing_status": "All tests passing - lint clean, build successful, manually tested login/logout flow",
    "pr_ready": true,
    "pr_is_draft": false,
    "repo_md_updated": true
  },
  "issues_encountered": {
    "is_stuck": false,
    "blockers": [],
    "questions": [],
    "help_needed": null,
    "time_spent_minutes": 60,
    "attempts_made": 1,
    "alternative_approaches_tried": []
  },
  "confidence_level": "high",
  "next_steps": {
    "ready_for_review": true,
    "estimated_complexity": "medium",
    "additional_notes": "Auth flow is production-ready. Includes proper error handling, loading states, and responsive design. Tested all edge cases."
  }
}
```

### ❌ Stuck Example
```json
{
  "task_status": "stuck",
  "task_completion": {
    "task_title": "Integrate Stripe payment processing",
    "branch_used": "feature/stripe-integration",
    "files_modified": [
      "src/pages/Checkout.tsx",
      "src/components/PaymentForm.tsx"
    ],
    "key_changes": [
      "Created checkout page layout",
      "Started Stripe Elements integration"
    ],
    "testing_status": "Build fails - TypeScript errors in payment component",
    "pr_ready": false,
    "pr_is_draft": false,
    "repo_md_updated": false
  },
  "issues_encountered": {
    "is_stuck": true,
    "blockers": [
      "Stripe Elements types not compatible with React 19",
      "Payment intent creation endpoint returns 401 Unauthorized"
    ],
    "questions": [
      "Should I use @stripe/stripe-js or @stripe/react-stripe-js?",
      "Is there a proxy endpoint for Stripe API calls?"
    ],
    "help_needed": "technical_guidance",
    "time_spent_minutes": 90,
    "attempts_made": 3,
    "alternative_approaches_tried": [
      "Tried downgrading @stripe/react-stripe-js to v2",
      "Attempted creating custom payment form without Elements"
    ]
  },
  "confidence_level": "low",
  "next_steps": {
    "ready_for_review": false,
    "estimated_complexity": "high",
    "additional_notes": "Need guidance on Stripe integration approach. Waited for team lead assistance."
  }
}
```

## Notes

- Provide output **immediately** when status changes
- Be honest about confidence level
- Don't hide blockers - report early
- Include sufficient detail for reviewer to understand context

