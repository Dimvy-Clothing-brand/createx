# CreateX Development Environment Checklist

## ✅ Quick Setup Commands

Run these commands in order:

```bash
# 1. Make setup script executable and run it
chmod +x setup.sh
./setup.sh

# 2. Or manual setup:
pnpm install
cd interface && pnpm install && cd ..

# 3. Install Foundry (if needed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 4. Configure environment
cp .env.example .env  # Edit this file with your settings

# 5. Build and test
pnpm clean
forge build --out forge-artifacts
pnpm test
```

## 🖥️ Start Development

### Smart Contract Development
```bash
# Run tests
pnpm test

# Watch tests
forge test --watch

# Generate coverage
pnpm coverage
```

### Frontend Development
```bash
# Start development server
cd interface
pnpm dev

# Build for production
pnpm build
```

## 🔧 Tools Needed

### Essential
- [x] Node.js (v18+) 
- [x] pnpm (v10.6.3+)
- [ ] Foundry (forge, cast, anvil)

### Optional
- [ ] Docker (for containerization)
- [ ] VS Code with Solidity extensions

## 📋 Environment Variables

Create `.env` file with:

```bash
# Private keys (for deployment)
PRIVATE_KEY=your_private_key_here

# RPC URLs
MAINNET_RPC_URL=https://mainnet.infura.io/v3/your_key
GOERLI_RPC_URL=https://goerli.infura.io/v3/your_key

# API Keys
ETHERSCAN_API_KEY=your_etherscan_key
POLYGONSCAN_API_KEY=your_polygonscan_key

# Gas settings
GAS_PRICE=20000000000
GAS_LIMIT=8000000
```

## 🚨 Troubleshooting

### Common Issues

1. **"forge: GLIBC not found"**
   - Update system packages or use Docker
   - Try: `sudo apt update && sudo apt upgrade`

2. **"pnpm command not found"**
   - Install: `npm install -g pnpm`

3. **"Module not found" errors**
   - Run: `pnpm install` in both root and interface directories

4. **Git submodule issues**
   - Run: `git submodule update --init --recursive`

### Debug Commands

```bash
# Check versions
node --version
pnpm --version
forge --version

# Check project health
pnpm deps:verify
pnpm security:check

# Network debugging
pnpm debug:network
pnpm debug:balance
```

## 📁 Key Directories

- `src/` - Smart contracts
- `test/` - Contract tests  
- `interface/` - Next.js frontend
- `scripts/` - Deployment scripts
- `assets/` - Static assets (images, docs)
- `deployments/` - Deployment artifacts

## 🎯 Development Workflow

1. **Smart Contracts**: Edit in `src/`, test in `test/`
2. **Frontend**: Develop in `interface/`
3. **Deploy**: Use scripts in `scripts/`
4. **Verify**: Use Etherscan verification tools

## 🐳 Docker Alternative

If you have issues with local setup:

```bash
# Build Docker image
docker build -t createx .

# Run container
docker run -p 3000:3000 createx
```

## 📚 Documentation

- See `SETUP.md` for detailed setup guide
- Check `README.md` for project overview  
- Review `SECURITY.md` for security guidelines
