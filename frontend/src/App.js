import './App.css';
import Nav from './components/Nav/Nav';
import Profile from './components/Profile/Profile';
import { InjectedConnector } from 'wagmi/connectors/injected'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, goerli, mainnet, polygon } from 'wagmi/chains';
import { walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { IExecDataProtector } from "@iexec/dataprotector";
import Safex from './components/Safex/Safex';
import Iexec from './components/Iexec/Iexec';

const chains = [arbitrum, mainnet, polygon, goerli];
const projectId = '241bb4581819090d1602501778f5ff8f';



async function protectData() {
  
  const web3Provider = window.ethereum;
  console.log(web3Provider);
  const dataProtector = new IExecDataProtector(web3Provider);
  console.log(dataProtector);
  try{
    const protectedData =  await dataProtector.protectData({
      data: {
          email: 'crytrap05@gmail.com'
      }
    });
  
    console.log("protectedData: ", protectedData);
  }
  catch(e) {
    console.log("E: ", e);
  }
  
}




const { publicClient } = configureChains(
  chains, 
  [alchemyProvider({ apiKey: '_HaCAEADifV16NSoWZ0DJ-pKt-zFOfaK' })],
  [walletConnectProvider({ projectId }), publicProvider()]
);

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
    new EIP6963Connector({ chains }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({ chains, options: { appName: metadata.name } })
  ],
  publicClient
})

createWeb3Modal({ wagmiConfig, projectId, chains })

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <button onClick={protectData}>Protect Data</button>
        <Nav />
        <Profile />
        <Iexec /><br/><br/>
        <Safex /> 
      </WagmiConfig>
    </>
  );
}

export default App;
