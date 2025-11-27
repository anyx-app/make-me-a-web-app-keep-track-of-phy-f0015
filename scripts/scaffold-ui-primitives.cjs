#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const uiDir = path.resolve(__dirname, '../src/components/ui');
if (!fs.existsSync(uiDir)) {
  console.error('UI directory not found:', uiDir);
  process.exit(1);
}

// Configuration for Radix primitives
const primitives = {
  'accordion': {
    pkg: '@radix-ui/react-accordion',
    exports: [
      { name: 'Root', alias: 'Accordion' },
      { name: 'Item', alias: 'AccordionItem' },
      { name: 'Trigger', alias: 'AccordionTrigger' },
      { name: 'Content', alias: 'AccordionContent' }
    ]
  },
  'alert-dialog': {
    pkg: '@radix-ui/react-alert-dialog',
    exports: [
      { name: 'Root', alias: 'AlertDialog' },
      { name: 'Trigger', alias: 'AlertDialogTrigger' },
      { name: 'Action', alias: 'AlertDialogAction' },
      { name: 'Cancel', alias: 'AlertDialogCancel' }
    ]
  },
  'aspect-ratio': { pkg: '@radix-ui/react-aspect-ratio', exports: [ { name: 'Root', alias: 'AspectRatio' } ] },
  'avatar': { pkg: '@radix-ui/react-avatar', exports: [ { name: 'Root', alias: 'Avatar' }, { name: 'Image', alias: 'AvatarImage' }, { name: 'Fallback', alias: 'AvatarFallback' } ] },
  'checkbox': { pkg: '@radix-ui/react-checkbox', exports: [ { name: 'Root', alias: 'Checkbox' }, { name: 'Indicator', alias: 'CheckboxIndicator' } ] },
  'collapsible': { pkg: '@radix-ui/react-collapsible', exports: [ { name: 'Root', alias: 'Collapsible' }, { name: 'Trigger', alias: 'CollapsibleTrigger' }, { name: 'Content', alias: 'CollapsibleContent' } ] },
  'context-menu': { pkg: '@radix-ui/react-context-menu', exports: [ { name: 'Root', alias: 'ContextMenu' }, { name: 'Trigger', alias: 'ContextMenuTrigger' }, { name: 'Content', alias: 'ContextMenuContent' }, { name: 'Item', alias: 'ContextMenuItem' }, { name: 'Separator', alias: 'ContextMenuSeparator' } ] },
  'dropdown-menu': { pkg: '@radix-ui/react-dropdown-menu', exports: [ { name: 'Root', alias: 'DropdownMenu' }, { name: 'Trigger', alias: 'DropdownMenuTrigger' }, { name: 'Content', alias: 'DropdownMenuContent' }, { name: 'Item', alias: 'DropdownMenuItem' }, { name: 'Separator', alias: 'DropdownMenuSeparator' } ] },
  'hover-card': { pkg: '@radix-ui/react-hover-card', exports: [ { name: 'Root', alias: 'HoverCard' }, { name: 'Trigger', alias: 'HoverCardTrigger' }, { name: 'Content', alias: 'HoverCardContent' } ] },
  'menubar': { pkg: '@radix-ui/react-menubar', exports: [ { name: 'Root', alias: 'Menubar' }, { name: 'Menu', alias: 'MenubarMenu' }, { name: 'Item', alias: 'MenubarItem' } ] },
  'navigation-menu': { pkg: '@radix-ui/react-navigation-menu', exports: [ { name: 'Root', alias: 'NavigationMenu' }, { name: 'List', alias: 'NavigationMenuList' }, { name: 'Item', alias: 'NavigationMenuItem' }, { name: 'Content', alias: 'NavigationMenuContent' } ] },
  'popover': { pkg: '@radix-ui/react-popover', exports: [ { name: 'Root', alias: 'Popover' }, { name: 'Trigger', alias: 'PopoverTrigger' }, { name: 'Content', alias: 'PopoverContent' } ] },
  'progress': { pkg: '@radix-ui/react-progress', exports: [ { name: 'Root', alias: 'Progress' }, { name: 'Indicator', alias: 'ProgressIndicator' } ] },
  'radio-group': { pkg: '@radix-ui/react-radio-group', exports: [ { name: 'Root', alias: 'RadioGroup' }, { name: 'Item', alias: 'RadioGroupItem' } ] },
  'scroll-area': { pkg: '@radix-ui/react-scroll-area', exports: [ { name: 'Root', alias: 'ScrollArea' }, { name: 'Viewport', alias: 'ScrollAreaViewport' }, { name: 'Scrollbar', alias: 'ScrollAreaScrollbar' }, { name: 'Thumb', alias: 'ScrollAreaThumb' } ] },
  'separator': { pkg: '@radix-ui/react-separator', exports: [ { name: 'Root', alias: 'Separator' } ] },
  'slider': { pkg: '@radix-ui/react-slider', exports: [ { name: 'Root', alias: 'Slider' }, { name: 'Thumb', alias: 'SliderThumb' }, { name: 'Track', alias: 'SliderTrack' }, { name: 'Range', alias: 'SliderRange' } ] },
  'switch': { pkg: '@radix-ui/react-switch', exports: [ { name: 'Root', alias: 'Switch' }, { name: 'Thumb', alias: 'SwitchThumb' } ] },
  'tabs': { pkg: '@radix-ui/react-tabs', exports: [ { name: 'Root', alias: 'Tabs' }, { name: 'List', alias: 'TabsList' }, { name: 'Trigger', alias: 'TabsTrigger' }, { name: 'Content', alias: 'TabsContent' } ] },
  'tooltip': { pkg: '@radix-ui/react-tooltip', exports: [ { name: 'Provider', alias: 'TooltipProvider' }, { name: 'Root', alias: 'Tooltip' }, { name: 'Trigger', alias: 'TooltipTrigger' }, { name: 'Content', alias: 'TooltipContent' }, { name: 'Arrow', alias: 'TooltipArrow' }, { name: 'Portal', alias: 'TooltipPortal' } ] },
  'toggle-group': { pkg: '@radix-ui/react-toggle-group', exports: [ { name: 'Root', alias: 'ToggleGroup' }, { name: 'Item', alias: 'ToggleGroupItem' } ] }
};

// List of non-Radix UI stubs
const stubs = [
  'alert','calendar','carousel','chart','drawer','input-otp','pagination','resizable','sidebar','skeleton','sonner','table','toaster','toggle','use-toast'
];

// Generate wrapper file content
function writeWrapper(name, config) {
  const lines = [`// @ts-nocheck`, `import * as Primitive from "${config.pkg}";`, ``];
  config.exports.forEach(({ name: prop, alias }) => {
    lines.push(`export const ${alias} = Primitive.${prop};`);
  });
  lines.push(``);
  config.exports.forEach(({ name: prop, alias }) => {
    lines.push(`${alias}.displayName = "${alias}";`);
  });
  fs.writeFileSync(path.join(uiDir, `${name}.tsx`), lines.join("\n") + "\n");
}

// Write Radix wrappers
Object.entries(primitives).forEach(([name, config]) => {
  writeWrapper(name, config);
});
// Write stubs
stubs.forEach(name => {
  const comp = name.split(/[-_]/).map(w=>w[0].toUpperCase()+w.slice(1)).join('');
  const file = path.join(uiDir, `${name}.tsx`);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, `// @ts-nocheck\nimport * as React from "react";\n\nexport function ${comp}(props: React.HTMLAttributes<HTMLDivElement>) {\n  return null;\n}\n`);
  }
});

// Re-generate index.ts
const indexFile = path.join(uiDir, 'index.ts');
const indexExports = [
  `export { Button } from './button';`,
  `export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './card';`,
  `export { Input } from './input';`,
  `export { Textarea } from './textarea';`,
  `export { Label } from './label';`,
  `export { Form } from './form';`,
  `export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogOverlay, DialogPortal, DialogClose } from './dialog';`,
  `export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from './select';`,
  `export { Toast } from './toast';`,
];
// Add Radix wrapper exports
Object.entries(primitives).forEach(([name, config]) => {
  const parts = config.exports.map(e=>e.alias).join(', ');
  indexExports.push(`export { ${parts} } from './${name}';`);
});
// Add stubs
stubs.forEach(name => {
  const comp = name.split(/[-_]/).map(w=>w[0].toUpperCase()+w.slice(1)).join('');
  indexExports.push(`export { ${comp} } from './${name}';`);
});
fs.writeFileSync(indexFile, indexExports.join("\n")+"\n");

console.log('Scaffolded explicit UI wrappers and updated index.ts'); 