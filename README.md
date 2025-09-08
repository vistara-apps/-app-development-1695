# Tip.Like - Solana Micro-Tipping for Farcaster

> A Solana miniapp that allows users to easily micro-tip creators they engage with, directly from their Farcaster client.

![Tip.Like Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=Tip.Like+Preview)

## 🚀 Features

### Core Features
- **In-Frame Micro-Tipping**: Automated or one-click SOL/SPL micro-tips on content likes
- **Creator Onboarding & Profiles**: Simple process for creators to register and receive tips
- **On-Chain Transaction Optimization**: Batching and fee optimization for micro-transactions
- **Social Integration**: Deep integration with Farcaster Frames

### Technical Features
- ✅ Real Solana Web3.js integration with Phantom/Solflare wallet support
- ✅ Transaction batching for cost optimization
- ✅ Comprehensive error handling and monitoring
- ✅ Farcaster Frame API integration
- ✅ Responsive design with glass morphism UI
- ✅ Production-ready configuration

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Social**: Farcaster Frames API
- **UI/UX**: Glass morphism design system
- **State Management**: React hooks and context
- **Error Handling**: Custom error boundary and logging

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Solana wallet (Phantom, Solflare, etc.)
- Farcaster account for Frame testing

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/vistara-apps/-app-development-1695.git
cd -app-development-1695
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Configure your environment variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Solana Configuration
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Farcaster Configuration
VITE_FARCASTER_HUB_URL=https://hub.farcaster.xyz
VITE_FRAME_BASE_URL=https://your-domain.com

# Feature Flags
VITE_ENABLE_BATCHING=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true
```

### 3. Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### 4. Build for Production

```bash
npm run build
npm run preview
```

## 🏗 Architecture

### Component Structure

```
src/
├── components/           # React components
│   ├── AppBar.jsx       # Navigation bar
│   ├── Dashboard.jsx    # Main dashboard
│   ├── TippingInterface.jsx  # Tip sending interface
│   ├── CreatorProfile.jsx    # Creator profile management
│   ├── FarcasterFrame.jsx    # Frame integration
│   └── WalletProvider.jsx    # Wallet context provider
├── hooks/               # Custom React hooks
│   └── useWalletIntegration.js  # Wallet integration hook
├── utils/               # Utility functions
│   ├── api.js          # API client
│   ├── errorHandler.js # Error handling system
│   └── transactionBatcher.js  # Transaction batching
└── styles/             # CSS and styling
```

### Data Model

#### User Entity
```javascript
{
  farcasterId: string,
  solanaAddress: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Creator Entity
```javascript
{
  farcasterId: string,
  solanaAddress: string,
  isCreator: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Tip Entity
```javascript
{
  tipId: string,
  senderFarcasterId: string,
  recipientFarcasterId: string,
  amount: number,
  token: string,
  transactionHash: string,
  timestamp: timestamp,
  status: string,
  frameActionType: string
}
```

## 🔌 API Integration

### Wallet Integration

```javascript
import { useWalletIntegration } from './hooks/useWalletIntegration'

function MyComponent() {
  const { 
    connected, 
    balance, 
    sendTip, 
    loading 
  } = useWalletIntegration()

  const handleTip = async () => {
    try {
      const result = await sendTip(
        'recipient-address',
        0.1, // SOL amount
        'Great content!'
      )
      console.log('Tip sent:', result.signature)
    } catch (error) {
      console.error('Tip failed:', error)
    }
  }
}
```

### Transaction Batching

```javascript
import { useTransactionBatcher } from './utils/transactionBatcher'

function BatchTipping() {
  const { queueTip, flushBatch, status } = useTransactionBatcher(
    connection, 
    wallet,
    { maxBatchSize: 10, batchTimeout: 5000 }
  )

  const handleBatchTip = async () => {
    // Queue multiple tips
    await queueTip('address1', 0.01, 'Nice post!')
    await queueTip('address2', 0.02, 'Love it!')
    
    // Force process batch
    const result = await flushBatch()
    console.log('Batch processed:', result)
  }
}
```

### Farcaster Frame Integration

```javascript
import FarcasterFrame from './components/FarcasterFrame'

function FrameExample() {
  const frameData = {
    id: 'post-123',
    creator: {
      username: '@creator',
      address: 'solana-address',
      avatar: '🎨'
    },
    content: 'Check out my latest artwork!',
    image: '/path/to/image.jpg'
  }

  const handleFrameAction = (action) => {
    switch (action.type) {
      case 'tip_sent':
        console.log('Tip sent:', action.data)
        break
      case 'like':
        console.log('Post liked:', action.data)
        break
    }
  }

  return (
    <FarcasterFrame 
      frameData={frameData}
      onAction={handleFrameAction}
    />
  )
}
```

## 🎨 Design System

### Colors
```css
:root {
  --color-bg: 220 25% 95%;
  --color-text: 220 20% 20%;
  --color-accent: 160 100% 40%;
  --color-primary: 210 80% 50%;
  --color-surface: 0 0% 100%;
}
```

### Components
- **Glass morphism effects**: `.glass` class
- **Gradient backgrounds**: `bg-gradient-purple`
- **Responsive spacing**: `lg`, `md`, `sm` utilities
- **Consistent border radius**: `16px`, `10px`, `6px`

## 🔧 Configuration

### Wallet Configuration

The app supports multiple Solana wallets:
- Phantom
- Solflare
- (Extensible for more wallets)

### Network Configuration

- **Development**: Solana Devnet
- **Production**: Solana Mainnet-beta

### Batching Configuration

```javascript
const batcherOptions = {
  maxBatchSize: 10,        // Max tips per batch
  batchTimeout: 5000,      // Auto-process after 5s
  maxRetries: 3            // Retry failed transactions
}
```

## 🚨 Error Handling

The app includes comprehensive error handling:

```javascript
import { useErrorHandler, ERROR_CODES } from './utils/errorHandler'

function MyComponent() {
  const { error, handleError, clearError } = useErrorHandler()

  const riskyOperation = async () => {
    try {
      await someOperation()
    } catch (err) {
      handleError(err, { context: 'user_action' })
    }
  }
}
```

### Error Types
- `WALLET_NOT_CONNECTED`
- `INSUFFICIENT_BALANCE`
- `TRANSACTION_FAILED`
- `NETWORK_ERROR`
- `API_ERROR`

## 📊 Analytics & Monitoring

### Built-in Analytics
- Tip transaction tracking
- User engagement metrics
- Error rate monitoring
- Performance metrics

### Integration Points
- Sentry for error monitoring
- Custom analytics API
- Blockchain transaction indexing

## 🔒 Security

### Best Practices
- ✅ Input validation and sanitization
- ✅ Secure wallet integration
- ✅ Transaction verification
- ✅ Error boundary protection
- ✅ Environment variable protection

### Wallet Security
- Uses official Solana wallet adapters
- No private key handling in frontend
- Transaction signing through wallet
- Secure RPC connections

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build image
docker build -t tip-like .

# Run container
docker run -p 3000:3000 tip-like
```

### Environment Variables for Production

```env
VITE_SOLANA_NETWORK=mainnet-beta
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_API_BASE_URL=https://api.tip-like.com
VITE_FRAME_BASE_URL=https://tip-like.com
VITE_SENTRY_DSN=your-sentry-dsn
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.tip-like.com](https://docs.tip-like.com)
- **Discord**: [Join our community](https://discord.gg/tip-like)
- **Issues**: [GitHub Issues](https://github.com/vistara-apps/-app-development-1695/issues)

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core tipping functionality
- ✅ Wallet integration
- ✅ Farcaster Frame support
- ✅ Transaction batching

### Phase 2 (Next)
- [ ] SPL token support
- [ ] Advanced analytics dashboard
- [ ] Creator monetization tools
- [ ] Mobile app

### Phase 3 (Future)
- [ ] Cross-chain support
- [ ] NFT integration
- [ ] Subscription tipping
- [ ] Advanced social features

---

**Built with ❤️ for the Solana and Farcaster communities**
