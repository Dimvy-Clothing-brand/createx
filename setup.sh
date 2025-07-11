#!/bin/bash

# CreateX Project Setup Script
# Run this script to set up your development environment

echo "🚀 Setting up CreateX development environment..."

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js found: $(node --version)"
else
    echo "❌ Node.js not found. Please install Node.js v18+ first."
    exit 1
fi

# Check pnpm
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm found: $(pnpm --version)"
else
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing project dependencies..."
pnpm install

# Install interface dependencies
echo "🖥️ Installing interface dependencies..."
cd interface
pnpm install
cd ..

# Check for Foundry
echo "🔧 Checking for Foundry..."
if command -v forge &> /dev/null; then
    echo "✅ Foundry found: $(forge --version | head -1)"
else
    echo "⚡ Installing Foundry..."
    curl -L https://foundry.paradigm.xyz | bash
    source ~/.bashrc
    foundryup
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Copied .env.example to .env"
    else
        touch .env
        echo "✅ Created empty .env file"
    fi
    echo "⚠️  Please configure your .env file with appropriate values"
fi

# Build the project
echo "🔨 Building the project..."
echo "Cleaning previous builds..."
pnpm clean 2>/dev/null || echo "Clean command not available, skipping..."

echo "Compiling contracts..."
if command -v forge &> /dev/null; then
    forge build --out forge-artifacts
else
    echo "⚠️  Forge not available, skipping Forge build"
fi

# Test Hardhat
echo "Testing Hardhat..."
npx hardhat --version 2>/dev/null || echo "⚠️  Hardhat test failed"

# Run tests
echo "🧪 Running tests..."
if command -v forge &> /dev/null; then
    forge test --out forge-artifacts
else
    echo "⚠️  Skipping tests - Forge not available"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Configure your .env file"
echo "2. Run 'cd interface && pnpm dev' to start the frontend"
echo "3. Run 'pnpm test' to run smart contract tests"
echo "4. See SETUP.md for detailed documentation"
echo ""
echo "🛠️  Available commands:"
echo "- pnpm test          # Run smart contract tests"
echo "- pnpm clean         # Clean build artifacts"
echo "- pnpm coverage      # Generate test coverage"
echo "- cd interface && pnpm dev  # Start frontend development server"
echo ""
