import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StarknetkitProvider } from './provider/StarknetkitProvider.tsx'
import { mainnet, sepolia } from "@starknet-react/chains"
import { publicProvider, StarknetConfig } from "@starknet-react/core"
import { connectors } from './connectors/index.ts'
import { GlobalProvider } from './provider/GlobalContext.tsx'
import { Toaster } from 'react-hot-toast';

const chains = [mainnet, sepolia]
const providers = publicProvider()



createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <StarknetConfig
        chains={chains}
        provider={providers}
        connectors={connectors}
      >
        <GlobalProvider>
          <StarknetkitProvider>
             <App />
              </StarknetkitProvider>
      </GlobalProvider>
    </StarknetConfig>
  </StrictMode>,
)
