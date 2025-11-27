# AI Agent Validation Rules

**Critical validation rules for AI code generation to prevent production errors.**

This document should be integrated into your **backend AI controller** to validate generated code before deployment.

---

## 🚨 Automatic Validation Checks

### 1. React Error #31 Prevention

**Rule**: Never pass objects as React children

```typescript
function validateNoObjectChildren(code: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Pattern 1: {someObject} in JSX
  const objectChildPattern = /<\w+[^>]*>\s*\{[\w.]+\}\s*<\/\w+>/g
  const matches = code.matchAll(objectChildPattern)
  
  for (const match of matches) {
    // Exclude valid patterns: {string}, {number}, {array.map}
    if (!match[0].includes('.') && !match[0].includes('map(')) {
      errors.push({
        type: 'ERROR_31_RISK',
        line: getLineNumber(code, match.index!),
        message: 'Potential object as React child',
        code: match[0],
        fix: 'Extract property: {obj.propertyName}'
      })
    }
  }
  
  return errors
}
```

### 2. Array.map() Validation

**Rule**: Always validate arrays before calling .map()

```typescript
function validateArrayMap(code: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Find all .map() calls
  const mapPattern = /(\w+)\.map\(/g
  const matches = code.matchAll(mapPattern)
  
  for (const match of matches) {
    const variable = match[1]
    
    // Check if there's array validation before this map
    const hasArrayCheck = 
      code.includes(`Array.isArray(${variable})`) ||
      code.includes(`ensureArray(${variable})`) ||
      code.includes(`${variable} || []`)
    
    if (!hasArrayCheck) {
      errors.push({
        type: 'MAP_ERROR_RISK',
        line: getLineNumber(code, match.index!),
        message: `.map() called without array validation on '${variable}'`,
        code: match[0],
        fix: `(${variable} || []).map(` or `ensureArray(${variable}).map(`
      })
    }
  }
  
  return errors
}
```

### 3. JSX Default Parameters

**Rule**: Never use JSX as default parameter values

```typescript
function validateNoJsxDefaults(code: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Pattern: = <Component or = <div
  const jsxDefaultPattern = /=\s*<[A-Z]\w*/g
  const matches = code.matchAll(jsxDefaultPattern)
  
  for (const match of matches) {
    errors.push({
      type: 'JSX_DEFAULT_PARAM',
      line: getLineNumber(code, match.index!),
      message: 'JSX used as default parameter (causes React errors)',
      code: match[0],
      fix: 'Move default to component body: icon || <Icon />'
    })
  }
  
  return errors
}
```

### 4. Component Guards Usage

**Rule**: Use guards for all risky props

```typescript
function validateComponentGuards(code: string): ValidationError[] {
  const warnings: ValidationError[] = []
  
  // Check if component uses guards for array/string props
  const hasMapCalls = code.includes('.map(')
  const hasGuards = 
    code.includes('ensureArray') ||
    code.includes('ensureString') ||
    code.includes('validateMapItems')
  
  if (hasMapCalls && !hasGuards) {
    warnings.push({
      type: 'MISSING_GUARDS',
      severity: 'warning',
      message: 'Component uses .map() but no guards imported',
      fix: 'Import guards: import { ensureArray } from "@/lib/component-guards"'
    })
  }
  
  return warnings
}
```

---

## 🔧 Backend Integration

### Express.js Example

```typescript
import { validateGeneratedCode } from './validators'

app.post('/api/generate-component', async (req, res) => {
  const { prompt } = req.body
  
  // Generate code with AI
  const generatedCode = await ai.generateComponent(prompt)
  
  // Validate before returning
  const validation = validateGeneratedCode(generatedCode)
  
  if (validation.errors.length > 0) {
    // CRITICAL ERRORS - Fix automatically or reject
    const fixedCode = await ai.fixErrors(generatedCode, validation.errors)
    
    return res.json({
      code: fixedCode,
      warnings: validation.warnings,
      autoFixed: true
    })
  }
  
  if (validation.warnings.length > 0) {
    // WARNINGS - Return with warnings
    return res.json({
      code: generatedCode,
      warnings: validation.warnings
    })
  }
  
  // All good!
  return res.json({
    code: generatedCode,
    status: 'perfect'
  })
})
```

### Complete Validator

```typescript
interface ValidationError {
  type: string
  severity?: 'error' | 'warning'
  line?: number
  message: string
  code?: string
  fix?: string
}

interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  score: number  // 0-100
}

export function validateGeneratedCode(code: string): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []
  
  // Run all validators
  errors.push(...validateNoObjectChildren(code))
  errors.push(...validateArrayMap(code))
  errors.push(...validateNoJsxDefaults(code))
  warnings.push(...validateComponentGuards(code))
  warnings.push(...validatePropTypes(code))
  warnings.push(...validateAccessibility(code))
  
  // Calculate quality score
  const score = calculateQualityScore(code, errors, warnings)
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    score
  }
}

function calculateQualityScore(
  code: string,
  errors: ValidationError[],
  warnings: ValidationError[]
): number {
  let score = 100
  
  // Deduct points for errors
  score -= errors.length * 20  // -20 per error
  score -= warnings.length * 5  // -5 per warning
  
  // Bonus points for best practices
  if (code.includes('ErrorBoundary')) score += 5
  if (code.includes('ensureArray') || code.includes('ensureString')) score += 5
  if (code.includes('validateProps')) score += 3
  if (code.includes('aria-')) score += 2
  
  return Math.max(0, Math.min(100, score))
}
```

---

## 📋 Pre-Generation Checklist

Add to AI system prompt:

```markdown
Before generating code, verify:

1. [ ] All array props use ensureArray() or Array.isArray()
2. [ ] No objects passed as React children
3. [ ] No JSX in default parameters
4. [ ] All .map() calls have array validation
5. [ ] String props use ensureString() for safety
6. [ ] Required props are validated
7. [ ] Component wrapped in ErrorBoundary
8. [ ] TypeScript types are correct
```

---

## 🎯 Quality Gates

Reject generated code if:

- **Score < 60**: Too many errors
- **Critical errors > 0**: Must fix Error #31 and .map() issues
- **TypeScript errors > 0**: Code must compile

Accept with warnings if:

- **Score 60-79**: Code works but has warnings
- **Warnings only**: No critical errors

Auto-approve if:

- **Score 80-100**: High quality code
- **No errors, minimal warnings**: Production ready

---

## 🚀 Auto-Fix Strategies

### Fix #1: Object as Child

```typescript
function autoFixObjectChildren(code: string): string {
  // Before: <div>{userData}</div>
  // After: <div>{userData?.name || 'Unknown'}</div>
  
  return code.replace(
    /<(\w+)[^>]*>\{([\w.]+)\}<\/\1>/g,
    (match, tag, variable) => {
      // Smart detection of object properties
      if (variable.includes('.')) return match  // Already accessing property
      
      // Suggest common properties
      return `<${tag}>{${variable}?.name || ${variable}?.title || String(${variable})}</${tag}>`
    }
  )
}
```

### Fix #2: Array .map()

```typescript
function autoFixArrayMap(code: string): string {
  // Before: items.map(...)
  // After: (items || []).map(...)
  
  return code.replace(
    /(\w+)\.map\(/g,
    (match, variable) => {
      // Check if already wrapped
      if (code.includes(`(${variable} || [])`)) return match
      if (code.includes(`ensureArray(${variable})`)) return match
      
      return `(${variable} || []).map(`
    }
  )
}
```

### Fix #3: JSX Defaults

```typescript
function autoFixJsxDefaults(code: string): string {
  // Before: icon = <Icon />
  // After: icon, and {icon || <Icon />} in JSX
  
  return code.replace(
    /(\w+)\s*=\s*(<[A-Z][^>]*\/>)/g,
    (match, param, jsxDefault) => {
      // Remove default from parameter
      // Add note to use it in render
      return `${param} /* Default: ${jsxDefault} */`
    }
  )
}
```

---

## 📊 Monitoring

Track validation metrics:

```typescript
// Track over time
analytics.track('code_generation', {
  validation_score: result.score,
  errors_count: result.errors.length,
  warnings_count: result.warnings.length,
  auto_fixed: result.autoFixed,
  model: 'gpt-4',
  prompt_type: req.body.type
})

// Alert if quality drops
if (result.score < 70) {
  alert.send('Code quality below threshold', {
    score: result.score,
    errors: result.errors
  })
}
```

---

## ✅ Summary

**Backend must validate:**

1. ✅ No objects as React children (Error #31)
2. ✅ All .map() calls have array validation
3. ✅ No JSX in default parameters
4. ✅ Component guards are used
5. ✅ Quality score > 60
6. ✅ Auto-fix when possible
7. ✅ Track metrics over time

**Result:** AI-generated code that doesn't break in production! 🎉

