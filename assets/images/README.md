# CreateX Images Asset Directory

This directory contains all static image assets for the CreateX project.

## Directory Structure

- **`logos/`** - CreateX branding, logos, and wordmarks
  - Main logo variants (light/dark themes)
  - Logo with text
  - Favicon sources
  - Brand guidelines assets

- **`icons/`** - UI icons and symbolic graphics
  - Application icons
  - Feature icons
  - Status indicators
  - Navigation elements

- **`diagrams/`** - Technical documentation visuals
  - Architecture diagrams
  - Smart contract flow charts
  - Sequence diagrams
  - Process illustrations

- **`screenshots/`** - Application and documentation screenshots
  - Interface screenshots
  - Demo images
  - Tutorial steps
  - Feature demonstrations

## Usage Guidelines

1. **File Naming**: Use kebab-case for file names (e.g., `createx-logo-light.svg`)
2. **Formats**: 
   - Use SVG for logos and icons when possible
   - Use PNG for screenshots and complex images
   - Use WebP for optimized web images
3. **Sizing**: Include multiple sizes for responsive design
4. **Optimization**: Ensure all images are optimized for web delivery

## Integration

- For web interface: Copy relevant images to `/interface/public/images/`
- For documentation: Reference images using relative paths
- For README files: Use GitHub raw URLs or relative paths

## Contributing

When adding new images:
1. Place them in the appropriate subdirectory
2. Use descriptive, consistent naming
3. Include both light and dark variants when applicable
4. Optimize file sizes
5. Update this README if adding new categories
