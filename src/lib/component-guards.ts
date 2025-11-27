/**
 * Component Guards - Runtime validation to prevent production errors
 * 
 * These guards protect against common mistakes that cause React errors:
 * - Error #31: Passing objects instead of strings/components
 * - TypeError: Calling .map on non-arrays
 * - Invalid prop types
 */

/**
 * Ensures value is an array, returns empty array if not
 */
export function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.warn('[Component Guard] Expected array, received:', typeof value, value)
  }
  
  return []
}

/**
 * Ensures value is a valid React child (string, number, ReactElement, null, undefined)
 * Returns null if invalid
 */
export function ensureValidChild(value: unknown): React.ReactNode {
  // Valid primitives
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }
  
  // Valid React elements
  if (
    typeof value === 'object' &&
    value !== null &&
    '$$typeof' in value
  ) {
    return value as React.ReactNode
  }
  
  // Invalid - likely an object
  if (process.env.NODE_ENV === 'development') {
    console.error(
      '[Component Guard] Invalid React child:',
      value,
      '\nObjects are not valid as React children. Did you pass a config object instead of a string/component?'
    )
  }
  
  return null
}

/**
 * Ensures value is a string, returns default if not
 */
export function ensureString(value: unknown, defaultValue = ''): string {
  if (typeof value === 'string') {
    return value
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.warn('[Component Guard] Expected string, received:', typeof value, value)
  }
  
  return defaultValue
}

/**
 * Ensures value is a function, returns no-op if not
 */
export function ensureFunction<T extends (...args: unknown[]) => unknown>(
  value: unknown
): T | (() => void) {
  if (typeof value === 'function') {
    return value as T
  }
  
  if (value !== undefined && process.env.NODE_ENV === 'development') {
    console.warn('[Component Guard] Expected function, received:', typeof value, value)
  }
  
  return () => {}
}

/**
 * Validates and sanitizes button props (common Error #31 source)
 */
export interface SafeButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function sanitizeButtonProps(props: unknown): SafeButtonProps {
  if (!props || typeof props !== 'object') {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Component Guard] Invalid button props:', props)
    }
    return { children: 'Button' }
  }
  
  const obj = props as Record<string, unknown>
  
  return {
    children: ensureValidChild(obj.children) || 'Button',
    onClick: obj.onClick ? ensureFunction(obj.onClick) : undefined,
    variant: typeof obj.variant === 'string' ? obj.variant as SafeButtonProps['variant'] : undefined,
    size: typeof obj.size === 'string' ? obj.size as SafeButtonProps['size'] : undefined,
    className: typeof obj.className === 'string' ? obj.className : undefined,
  }
}

/**
 * Validates array of items for mapping (prevents .map errors)
 */
export function validateMapItems<T>(
  items: unknown,
  componentName: string
): T[] {
  if (!Array.isArray(items)) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[${componentName}] Expected array for mapping, received:`,
        typeof items,
        items,
        '\nThis will cause ".map is not a function" error.'
      )
    }
    return []
  }
  
  return items
}

/**
 * Safe object access - prevents "Cannot read property of undefined"
 */
export function safeGet<T>(
  obj: unknown,
  path: string,
  defaultValue: T
): T {
  if (!obj || typeof obj !== 'object') {
    return defaultValue
  }
  
  const keys = path.split('.')
  let current: Record<string, unknown> = obj as Record<string, unknown>
  
  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return defaultValue
    }
    current = current[key]
  }
  
  return current as T
}

/**
 * Validates component props in development
 */
export function validateProps<T extends Record<string, unknown>>(
  props: T,
  required: (keyof T)[],
  componentName: string
): boolean {
  if (process.env.NODE_ENV !== 'development') {
    return true
  }
  
  const missing = required.filter(key => !(key in props) || props[key] === undefined)
  
  if (missing.length > 0) {
    console.error(
      `[${componentName}] Missing required props:`,
      missing,
      '\nReceived props:',
      props
    )
    return false
  }
  
  return true
}

