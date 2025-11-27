# Social Media Meta Tags - Backend Integration

## Overview

The `index.html` template contains placeholder variables for social sharing meta tags (Open Graph, Twitter Cards). The backend must replace these during project generation.

---

## Placeholders to Replace

### In `index.html`:

| Placeholder | Description | Example Value | Source |
|------------|-------------|---------------|--------|
| `{{PROJECT_NAME}}` | Project display name | "ZenithFI" | `brand.name` |
| `{{PROJECT_DESCRIPTION}}` | Short description (150-160 chars) | "Modern financial dashboard for tracking investments" | `brand.description` or generate from name |
| `{{PROJECT_URL}}` | Deployed project URL | "https://zenithfi.vercel.app" | Vercel deployment URL |
| ~~`{{PROJECT_FAVICON_URL}}`~~ | Favicon image URL | "/anyx-logo.png" | **Always uses Anyx logo (not a placeholder)** |
| `{{PROJECT_THEME_COLOR}}` | Browser theme color (hex) | "#3b82f6" | `brand.colors.primary` |
| `{{PROJECT_OG_IMAGE_URL}}` | Social share preview image (1200×630px) | "https://zenithfi.vercel.app/og-image.png" | Generate or use default |

---

## Implementation Steps

### 1. Template Replacement Function

```typescript
// Example backend code
function injectMetaTags(htmlTemplate: string, project: Project): string {
  return htmlTemplate
    .replace(/\{\{PROJECT_NAME\}\}/g, project.brand.name)
    .replace(/\{\{PROJECT_DESCRIPTION\}\}/g, getProjectDescription(project))
    .replace(/\{\{PROJECT_URL\}\}/g, project.deploymentUrl)
    .replace(/\{\{PROJECT_THEME_COLOR\}\}/g, project.brand.colors.primary)
    .replace(/\{\{PROJECT_OG_IMAGE_URL\}\}/g, project.ogImageUrl || `${project.deploymentUrl}/anyx-logo.png`);
}

function getProjectDescription(project: Project): string {
  return project.description 
    || `${project.brand.name} - Built with Anyx.app`;
}
```

### 2. When to Inject

**Option A: During Project Generation**
- Replace placeholders when writing files to repo
- ✅ Simple, one-time operation
- ⚠️ Can't update without redeployment

**Option B: During Vercel Deployment**
- Use build hook to inject at deploy time
- ✅ Can update dynamically
- ⚠️ More complex

**Recommendation**: Option A (during generation)

### 3. Fallback Values

If project-specific values aren't available:

```typescript
const defaults = {
  PROJECT_NAME: 'Built with Anyx',
  PROJECT_DESCRIPTION: 'A modern SaaS application built with Anyx.app',
  PROJECT_URL: 'https://anyx.app',
  PROJECT_THEME_COLOR: '#000000',
  PROJECT_OG_IMAGE_URL: 'https://anyx.app/og-image.png'
};

// Note: Favicon always uses /anyx-logo.png (not configurable)
```

---

## Testing Social Sharing

### 1. Local Testing
```bash
# After replacing placeholders, check generated HTML
cat dist/index.html | grep "og:"
```

### 2. Social Media Debuggers

**LinkedIn Post Inspector**:
- https://www.linkedin.com/post-inspector/
- Paste project URL, click "Inspect"

**Twitter Card Validator**:
- https://cards-dev.twitter.com/validator
- Paste project URL

**Facebook Sharing Debugger**:
- https://developers.facebook.com/tools/debug/
- Paste project URL, click "Scrape Again"

**Open Graph Preview**:
- https://www.opengraph.xyz/
- Quick visual preview

### 3. Expected Results

When sharing project URL on LinkedIn/Twitter/Slack:
- ✅ Shows project name (not "Anyx.app")
- ✅ Shows project description
- ✅ Shows project logo/OG image
- ✅ Shows correct URL

---

## OG Image Generation (Optional Enhancement)

For better social sharing, generate custom OG images (1200×630px) with:
- Project name
- Brand colors
- Logo

**Options**:
1. **Static Template**: Photoshop template backend fills in
2. **Dynamic Generation**: Use Vercel OG Image or similar
3. **Use Project Logo**: Simple fallback

**Example using Vercel OG**:
```typescript
// Edge function to generate OG images
export default async function handler(req: Request) {
  const { name, color } = getProjectFromUrl(req.url);
  return new ImageResponse(
    <div style={{ background: color, width: '100%', height: '100%' }}>
      <h1>{name}</h1>
    </div>
  );
}
```

---

## Database Schema Addition (If Needed)

If storing meta tag values:

```sql
ALTER TABLE projects ADD COLUMN meta_title TEXT;
ALTER TABLE projects ADD COLUMN meta_description TEXT;
ALTER TABLE projects ADD COLUMN og_image_url TEXT;
ALTER TABLE projects ADD COLUMN favicon_url TEXT;
```

---

## Example: Before vs After

### Before (Current):
```html
<title>Anyx.app - The easiest way to build your SaaS</title>
<meta property="og:title" content="Anyx.app - The easiest way to build your SaaS" />
```

### After (Generated Project):
```html
<title>ZenithFI</title>
<meta property="og:title" content="ZenithFI" />
<meta property="og:description" content="Modern financial dashboard for tracking investments" />
<meta property="og:image" content="https://zenithfi.vercel.app/og-image.png" />
```

---

## Frontend Changes Made

**File**: `index.html`
- ✅ Added 5 placeholder variables
- ✅ Added Open Graph meta tags
- ✅ Added Twitter Card meta tags
- ✅ Favicon uses Anyx logo (not configurable)

**No code changes required** - purely HTML template modification.

---

## Questions?

Contact frontend team or see:
- `index.html` - Template with placeholders
- `docs/BRAND_FLAVORS.md` - Brand configuration reference
- `config/brand.ts` - Brand data structure

