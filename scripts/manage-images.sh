#!/bin/bash

# CreateX Image Management Script
# Manages and optimizes images across the project

echo "🖼️  CreateX Image Management"
echo "============================"

# Function to optimize SVG files
optimize_svg() {
    echo "🔧 Optimizing SVG files..."
    if command -v svgo &> /dev/null; then
        find assets/images -name "*.svg" -exec svgo {} \;
        echo "✅ SVG optimization complete"
    else
        echo "⚠️  svgo not found. Install with: npm install -g svgo"
    fi
}

# Function to copy images to interface
sync_interface_images() {
    echo "🔄 Syncing images to interface..."
    
    # Create directories if they don't exist
    mkdir -p interface/public/images/{logos,icons,ui}
    
    # Copy logos
    cp assets/images/logos/*.svg interface/public/images/logos/ 2>/dev/null || true
    
    # Copy icons
    cp assets/images/icons/*.svg interface/public/images/ui/ 2>/dev/null || true
    
    # Copy favicon
    cp assets/images/logos/favicon.svg interface/public/ 2>/dev/null || true
    
    echo "✅ Image sync complete"
}

# Function to generate image inventory
generate_inventory() {
    echo "📋 Generating image inventory..."
    
    cat > assets/images/INVENTORY.md << EOF
# CreateX Image Inventory

Generated on: $(date)

## Logos
$(find assets/images/logos -name "*.svg" -o -name "*.png" | sort)

## Icons
$(find assets/images/icons -name "*.svg" -o -name "*.png" | sort)

## Diagrams
$(find assets/images/diagrams -name "*" -type f | sort)

## Screenshots
$(find assets/images/screenshots -name "*" -type f 2>/dev/null | sort || echo "None")

## Interface Images
$(find interface/public/images -name "*" -type f 2>/dev/null | sort || echo "None")

EOF
    
    echo "✅ Inventory generated at assets/images/INVENTORY.md"
}

# Function to validate images
validate_images() {
    echo "🔍 Validating images..."
    
    local errors=0
    
    # Check for required files
    if [ ! -f "assets/images/logos/createx-logo.svg" ]; then
        echo "❌ Missing main logo: createx-logo.svg"
        ((errors++))
    fi
    
    if [ ! -f "assets/images/logos/favicon.svg" ]; then
        echo "❌ Missing favicon: favicon.svg"
        ((errors++))
    fi
    
    # Check SVG syntax
    for svg in $(find assets/images -name "*.svg"); do
        if ! xmllint --noout "$svg" 2>/dev/null; then
            echo "❌ Invalid SVG: $svg"
            ((errors++))
        fi
    done
    
    if [ $errors -eq 0 ]; then
        echo "✅ All images validated successfully"
    else
        echo "⚠️  Found $errors errors"
    fi
    
    return $errors
}

# Main menu
case "${1:-help}" in
    "optimize")
        optimize_svg
        ;;
    "sync")
        sync_interface_images
        ;;
    "inventory")
        generate_inventory
        ;;
    "validate")
        validate_images
        ;;
    "all")
        validate_images
        optimize_svg
        sync_interface_images
        generate_inventory
        echo "🎉 All image operations complete!"
        ;;
    "help"|*)
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  optimize   - Optimize SVG files"
        echo "  sync       - Copy images to interface directory"
        echo "  inventory  - Generate image inventory"
        echo "  validate   - Validate image files"
        echo "  all        - Run all operations"
        echo "  help       - Show this help"
        echo ""
        echo "Examples:"
        echo "  $0 all       # Run all operations"
        echo "  $0 sync      # Just sync to interface"
        echo "  $0 validate  # Check image validity"
        ;;
esac
