# CreateX Development Setup Guide

This guide will help you set up the CreateX smart contract project for development.

## Prerequisites

Ensure you have the following installed:
- Node.js (v18+ recommended)
- pnpm (v10.6.3 as specified in package.json)
- Git

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
# Install main project dependencies
pnpm install

# Install interface dependencies
cd interface
pnpm install
cd ..
```

### 2. Install Development Tools

#### Foundry (For Solidity development)
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify installation
forge --version
cast --version
anvil --version
```

#### Hardhat (Alternative Solidity toolchain)
```bash
# Already included in dependencies, verify with:
npx hardhat --version
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# Add your private keys, RPC URLs, etc.
```

### 4. Build the Project

```bash
# Clean previous builds
pnpm clean

# Compile contracts with Forge
pnpm test

# Compile with Hardhat
npx hardhat compile

# Generate ABIs
pnpm abi
```

### 5. Run Tests

```bash
# Run Forge tests
pnpm test

# Run with coverage
pnpm coverage

# Generate coverage report
pnpm coverage:report
```

### 6. Start the Interface

```bash
# Navigate to interface directory
cd interface

# Start development server
pnpm dev

# Or build for production
pnpm build
pnpm start
```

## 🛠️ Development Workflow

### Smart Contract Development

1. **Write contracts** in `src/`
2. **Write tests** in `test/`
3. **Run tests** with `pnpm test`
4. **Deploy** using scripts in `scripts/`

### Frontend Development

1. **Navigate** to `interface/` directory
2. **Start dev server** with `pnpm dev`
3. **Access** at http://localhost:3000

### Security Checks

```bash
# Check for secrets in code
pnpm security:check

# Remove any found secrets
pnpm security:remove

# Verify dependencies
pnpm deps:verify
```

## 📁 Project Structure

```
createx/
├── src/                    # Smart contracts
├── test/                   # Contract tests
├── scripts/                # Deployment scripts
├── interface/              # Next.js frontend
├── assets/                 # Static assets
├── deployments/            # Deployment artifacts
├── verification/           # Contract verification
└── lib/                    # External libraries
```

## 🐳 Docker Setup (Optional)

```bash
# Build Docker image
docker build -t createx-interface .

# Run container
docker run -p 3000:3000 createx-interface
```

## 🔧 Troubleshooting

### Common Issues

1. **Forge not found**: Reinstall Foundry
2. **GLIBC errors**: Update system or use Docker
3. **Dependency conflicts**: Clear node_modules and reinstall
4. **Network issues**: Check RPC URLs in .env

### Debug Commands

```bash
# Check network connectivity
pnpm debug:network

# Check account balances
pnpm debug:balance

# Estimate gas costs
pnpm debug:gas

# Run all debug checks
pnpm debug:all
```

## 📚 Additional Resources

- [Foundry Documentation](https://book.getfoundry.sh/)
- [Hardhat Documentation](https://hardhat.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [CreateX GitHub](https://github.com/pcaversaccio/createx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

For more details, see the security guidelines in `SECURITY.md`.
