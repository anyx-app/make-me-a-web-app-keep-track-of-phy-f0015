# AnyX React Boilerplate - Multi-page Web App

A starter template for building scalable multi-page React applications with modern patterns and best practices.

## 🚀 Features

- React 19.1.0 with hooks support
- React Router DOM v6.28.0 for client-side routing
- TypeScript with predefined types and interfaces
- Tailwind CSS with CSS variables and utility-first styling
- Reusable UI components (Button, Header, Navigation, Footer)
- Custom utility functions (`cn`, `formatDate`)
- Folder structure for pages, components, hooks, utils, types, and styles
- ESLint configured for TypeScript and React Hooks
- Vite for fast builds and HMR

## 📁 Folder Structure
```
anyx-react-boilerplate/
├── public/                    # Static assets (e.g., index.html, images)
├── src/
│   ├── pages/                 # Route-based pages
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── components/
│   │   ├── ui/                # Core UI components & Radix UI primitives (Button.tsx, Input.tsx, Card.tsx, Dialog.tsx, Form.tsx, Label.tsx, Select.tsx, Textarea.tsx, Toast.tsx, plus 40+ additional UI primitives under this folder)
│   │   ├── layout/            # Layout components (Header, Navigation, Footer)
│   │   └── common/            # Common cross-cutting components
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions (cn, formatDate)
│   ├── types/                 # TypeScript definitions (User, ApiResponse)
│   ├── styles/                # Additional CSS or Tailwind layers
│   ├── App.tsx                # Root application with routing
│   ├── index.css              # Global styles and CSS variables
│   └── main.tsx               # App entry point
├── .eslintrc.cjs              # ESLint configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🧩 UI Components
We provide a self-contained set of core UI components under `src/components/ui`. These are built with Radix UI primitives, Tailwind CSS, and helper libraries.

Supported components:
- **Button**: Variants (`default`, `destructive`, `outline`, `ghost`, `link`) and sizes (`sm`, `default`, `lg`) via `class-variance-authority`.
- **Input** & **Textarea**: Styled form controls with focus, disabled, and placeholder states.
- **Card**: Container component with header, content, and footer parts for consistent layouts.
- **Dialog**: Modal dialogs with overlay, content, header/footer, title/description, and close triggers.
- **Form**: React Hook Form context provider for building form UIs.
- **Label**: Accessible labels with peer-disabled styling.
- **Select**: Headless select/dropdown using Radix primitives, customizable triggers and items.
- **Toast**: Global notification container using `react-hot-toast`.
- **Other Radix UI primitives** are also available under `@/components/ui`: Accordion, AlertDialog, Alert, AspectRatio, Avatar, Badge, Breadcrumb, Calendar, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, DropdownMenu, HoverCard, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, ToggleGroup, Toggle, Tooltip, useToast, Toaster.

Best practices:
1. Import components from `@/components/ui` to keep usage consistent.
2. Use the `cn` helper for composing or overriding styles: `<Button className="mt-4" />`.
3. For Radix-based components (`Dialog`, `Select`), wrap triggers with `asChild` to use custom elements.
4. Wrap form fields inside `<Form>` to enable React Hook Form features.
5. Leverage `variant` and `size` props where available for built-in styling options.
6. Customize theme tokens (`--radius`, colors) in `src/index.css` and `tailwind.config.ts` for branding.

## 🏁 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/mkisilenko/anyx-react-boilerplate-webapp.git my-app
   cd my-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**

   ```bash
   npm run preview
   ```
6. **Scaffold UI primitives**

   ```bash
   pnpm run scaffold:ui
   ```
   Regenerates stubs and re-exports for all UI primitives under `src/components/ui`.

## ⚙️ Customization

- **Add new pages**: Create files under `src/pages` and register routes in `src/App.tsx`.
- **UI Components**: Add reusable components in `src/components/ui` or common components in `src/components/common`.
- **Hooks**: Create custom hooks under `src/hooks`.
- **Utilities**: Add helper functions in `src/utils` and types in `src/types`.
- **Styling**: Customize CSS variables in `src/index.css` and extend Tailwind in `tailwind.config.ts`.

## 🤝 Contributing

Contributions welcome! Please open issues or pull requests. Keep code quality high and follow existing conventions.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details. 

## 📦 Anyx Common API SDK

This boilerplate includes a thin, typed SDK for the Anyx Common API.

- Location: `src/sdk/anyx.ts` (exported via `src/sdk/index.ts`)
- Methods:
  - `llm({ model, messages })`
  - `image({ prompt, size? })`
  - `email({ to, subject, html })`
  - `sms({ to, body })`
- Behavior:
  - Sends requests to your backend at `VITE_ANYX_SERVER_URL` (which should attach `x-api-key`), and includes `x-project-id` from `VITE_ANYX_PROJECT_ID`.
  - Maps errors to typed classes: `AuthError (401)`, `TierError (403)`, `CreditExceededError (402)`, `RateLimitedError (429)`, `ProviderError (5xx)`, `HttpError`.
  - Validates responses with `zod`.

### Environment

Add the following to your `.env` for browser access (Vite requires the `VITE_` prefix):

```env
VITE_ANYX_SERVER_URL=https://your-anyx-server.example.com
VITE_ANYX_PROJECT_ID=<your-project-id>
```

You can also override at runtime:

```ts
import { createAnyxClient } from '@/sdk'

const anyx = createAnyxClient({
  baseUrl: 'https://your-anyx-server.example.com',
  projectId: '<your-project-id>',
})
```

### Usage examples

```ts
import { createAnyxClient, TierError, CreditExceededError } from '@/sdk'

const anyx = createAnyxClient() // reads VITE_ANYX_SERVER_URL and VITE_ANYX_PROJECT_ID

// LLM
const llm = await anyx.llm({
  model: 'gpt-4.1-nano',
  messages: [{ role: 'user', content: 'Hello' }],
})

// Image (may throw TierError on lower tiers)
try {
  const img = await anyx.image({ prompt: 'a modern logo in blue', size: '1024x1024' })
} catch (e) {
  if (e instanceof TierError) {
    // handle upgrade CTA
  }
}

// Email / SMS (may throw CreditExceededError)
try {
  const email = await anyx.email({ to: 'user@example.com', subject: 'Welcome', html: '<b>Hello</b>' })
  const sms = await anyx.sms({ to: '+15555550123', body: 'Your code is 123456' })
} catch (e) {
  if (e instanceof CreditExceededError) {
    // handle out-of-credits
  }
}
```

### Integration tests (opt-in)

Integration tests live under `@tests/sdk/integration` and are disabled by default. They hit your configured server and may consume credits.

1) Ensure `.env` has:

```env
VITE_ANYX_SERVER_URL=https://your-anyx-server.example.com
VITE_ANYX_PROJECT_ID=<your-project-id>
```

2) Run tests explicitly:

```bash
# PowerShell
$env:RUN_ANYX_INTEGRATION='true'; pnpm test

# POSIX
RUN_ANYX_INTEGRATION=true pnpm test
```

Note: `@tests` is gitignored by default. For CI, remove or adjust the ignore rule.

### Images API notes

OpenAI Images accepts the following sizes only: `1024x1024`, `1024x1536`, `1536x1024`, or `auto`.
Use one of these values for `size`. If a different size is sent, the backend should respond with a clear `400` and the allowed list. The SDK types reflect the allowed set.