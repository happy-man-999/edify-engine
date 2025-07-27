import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism } from 'wagmi/chains'
import { metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'

const projectId = import.meta.env.VITE_WALLETCONNET_PROJEC_ID

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    walletConnect({ projectId, showQrModal: true }),
    metaMask(),
    coinbaseWallet({
      appName: 'EdifyEngine',
      chains: [mainnet, base, optimism],
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})