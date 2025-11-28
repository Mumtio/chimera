# Chimera Protocol UI Component Library

A cyberpunk-themed UI component library with neon green aesthetics, angular frames, and futuristic animations.

## Components

### CyberButton
Cyberpunk-styled button with multiple variants and glow effects.

**Variants:** `primary`, `secondary`, `danger`, `ghost`
**Sizes:** `sm`, `md`, `lg`
**Features:** Glow effects, pulse animation, angular clip-path styling

### CyberInput
Input field with neon border focus and floating label animation.

**Types:** `text`, `email`, `password`, `search`
**Features:** Floating labels, neon glow on focus, error states, monospace font

### CyberCard
Card component with angular frames and corner accents.

**Features:** Corner accents, glowing borders, hoverable states, clickable actions

### StatCard
Dashboard statistics card with icons and trend indicators.

**Features:** Large value display, icon with glow, trend indicators (up/down/neutral), animated value changes

### Layout Primitives

#### Container
Responsive container with configurable max-width and padding.

#### Grid
CSS Grid layout with responsive column configurations.

#### Flex
Flexbox layout with configurable direction, alignment, and spacing.

## Styling System

### Colors
- **Neon Green:** `#00FFAA` - Primary accent color
- **Deep Teal:** `#012A2D` - Secondary/background color
- **Error Red:** `#FF0055` - Error states
- **Black:** `#000000` - Base background

### Typography
- **Headings:** Orbitron font (bold, uppercase, wide tracking)
- **Body:** Inter font (clean, readable)
- **Code:** Courier New (monospace)

### Visual Effects
- **Scanlines:** Animated horizontal lines for retro CRT effect
- **Pulse Glow:** Pulsing opacity animation
- **Angular Frames:** Clipped corners for cyberpunk aesthetic
- **Corner Accents:** Decorative corner borders
- **Circuit Background:** Grid pattern with neon lines
- **Neon Glow:** Multi-layer box shadows

## Usage Example

```tsx
import { CyberButton, CyberCard, StatCard, Grid } from './components/ui';
import { Brain } from 'lucide-react';

function MyComponent() {
  return (
    <CyberCard title="Dashboard" glowBorder>
      <Grid cols={3} gap="lg">
        <StatCard 
          label="Total Memories" 
          value="1,247" 
          icon={Brain}
          trend="up"
        />
      </Grid>
      <CyberButton variant="primary" glow pulse>
        Enter Lab
      </CyberButton>
    </CyberCard>
  );
}
```

## Accessibility

All components support:
- Keyboard navigation
- Focus indicators
- ARIA labels (where applicable)
- Reduced motion preferences
- Screen reader compatibility

## Requirements Validated

This component library satisfies requirements:
- 16.1: Neon green (#00FFAA) primary accent color
- 16.2: Deep teal (#012A2D) and black backgrounds
- 16.3: Angular tech shapes with glowing borders
- 16.4: Subtle pulsing glow effects
- 16.5: Bold square sci-fi fonts (Orbitron)
- 16.7: Hover effects with increased glow intensity
