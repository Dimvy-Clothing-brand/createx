# Interface Images

This directory contains images used by the CreateX web interface.

## Directory Structure

- **`frameworks/`** - Blockchain framework logos (ethers.js, viem, etc.)
- **`tools/`** - Development tool logos (Solidity, JSON, etc.)
- **`ui/`** - User interface elements and graphics
- **`backgrounds/`** - Background images and patterns

## Usage

These images are served statically by Next.js and can be referenced in components using:

```tsx
import Image from 'next/image'

// For framework logos
<Image src="/images/frameworks/ethersjs.png" alt="ethers.js" width={100} height={100} />

// For tool logos  
<Image src="/images/tools/solidity.png" alt="Solidity" width={50} height={50} />
```

## Optimization

- All images should be optimized for web delivery
- Use Next.js Image component for automatic optimization
- Provide appropriate alt text for accessibility
- Consider WebP format for better compression
