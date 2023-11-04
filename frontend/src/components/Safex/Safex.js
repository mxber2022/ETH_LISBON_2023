import "./Safex.css";
import { useAccount, useConnect, useEnsName } from 'wagmi';
import { ethers } from 'ethers';
import { useState, useRef } from "react";
import { Web3AuthModalPack, Web3AuthConfig } from '@safe-global/auth-kit'
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, SafeEventEmitterProvider, UserInfo, WALLET_ADAPTERS } from '@web3auth/base';
import { EthersAdapter } from '@safe-global/protocol-kit'
import Safe, { SafeFactory } from '@safe-global/protocol-kit'
import { SafeAccountConfig } from '@safe-global/protocol-kit'
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import SafeApiKit from '@safe-global/api-kit'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import { MetaTransactionData, MetaTransactionOptions } from '@safe-global/safe-core-sdk-types'

function Safex () {
    const [loggedIn, setLoggedIn] = useState(false); 
    const [wmp, setWmp] = useState(null)
    const web2provider = useRef("");
   // const { address, isConnected } = useAccount();
    //const { provider } = useConnect();

    const clientId = "BAmp5CuBnqR5yjbmgYq-rKNm-f4k_btdxxJ-3Mcsp8MtkhUVLSlpoP3o8mLnnK3TI6tKKFweXgql2-Iu_B_oKaI";

    const options = {
        clientId: clientId,
        web3AuthNetwork: 'testnet',
        chainConfig: {
        chainNamespace: "eip155",
        chainId: '0x5',
        rpcTarget: 'https://rpc.ankr.com/eth_goerli'
        },
        uiConfig: {
        theme: 'dark',
        loginMethodsOrder: ['google', 'facebook']
        }
    };

    const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
        label: 'torus',
        showOnModal: false
        },
        [WALLET_ADAPTERS.METAMASK]: {
        label: 'metamask',
        showOnDesktop: true,
        showOnMobile: false
        }
    }

    const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
        mfaLevel: 'mandatory'
        },
        adapterSettings: {
        uxMode: 'popup',
        whiteLabel: {
            name: 'Safe'
        }
        }
    })

    const web3AuthModalPack = new Web3AuthModalPack({
        txServiceUrl: 'https://safe-transaction-goerli.safe.global'
    })    
    
    async function web2login() {

        try {
            await web3AuthModalPack.init({ options, adapters: [openloginAdapter], modalConfig })
            setWmp(web3AuthModalPack);
            const authKitSignData = await web3AuthModalPack.signIn();
            const provider = new ethers.providers.Web3Provider(web3AuthModalPack.getProvider());
            web2provider.current = provider;
            const signer = provider.getSigner()



            try {
                const ethAdapter = new EthersAdapter({
                    ethers,
                    signerOrProvider: signer || provider
                })

                const safeFactory = await SafeFactory.create({ ethAdapter })
                console.log("ha: ", signer);
                const owners = [authKitSignData.eoa];



                console.log(authKitSignData.safes[0]);

                /* Transaction test */

                let temp_safe = authKitSignData.safes[0];
                console.log("temp_safe: ", temp_safe);
            
                const safeSdk = await Safe.create({ ethAdapter, safeAddress: temp_safe})

                const safeTransactionData = {
                    to: '0x7199D548f1B30EA083Fe668202fd5E621241CC89',
                    data: '0x',
                    value: ethers.utils.parseUnits('0.0001', 'ether').toString(),
                }

                /* 
                const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })
                console.log("safeTransaction: ", safeTransaction);

                const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
                console.log("safeTxHash: ", safeTxHash);

                const senderSignature = await safeSdk.signTransactionHash(safeTxHash)
                console.log("senderSignature: ", senderSignature);
*/

               // const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
               // const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapter })






                const MetaTransactionData = [{
                    to: "0x94F2840338d04cE69e3bcb1cf19B2e802dA1202F",
                    data: '0x',
                    value: ethers.utils.parseUnits('0.0001', 'ether').toString(),
                    
                }]
                const MetaTransactionOptions = {
                    isSponsored: true
                }

              
                const relayKit = new GelatoRelayPack("BLFJPtucDHaVwfXuIMp6MndfDcQOhnEs_MY8JsAb0SQ_")
                const safeTransaction1 = await relayKit.createRelayedTransaction({
                    safe: safeSdk,
                    transactions: MetaTransactionData,
                    options: MetaTransactionOptions
                })

                console.log("safeTransaction1: ", safeTransaction1);
                
                const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction1, "eth_signTypedData_v4")
                console.log("signedSafeTransaction", signedSafeTransaction);

                const response = await relayKit.executeRelayTransaction(signedSafeTransaction, safeSdk, MetaTransactionOptions)
                console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`)






                /*await safeService.proposeTransaction({
                    safeAddress: "0xF4fc89E39483b6ed51400701e7A962EaAA7FC6e2",
                    safeTransactionData: safeTransaction.data,
                    safeTxHash,
                    senderAddress: "0x94F2840338d04cE69e3bcb1cf19B2e802dA1202F",
                    senderSignature: senderSignature.data,
                })
                    */


                /* Transaction test */

                  
               
                
                /* 

                const safeAccountConfig = {
                    owners,
                    threshold: 1,
                }
                const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })
                const safeAddress = await safeSdk.getAddress()

                console.log('Your Safe has been deployed:')
                console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
                console.log(`https://app.safe.global/gor:${safeAddress}`)
                */
            }
            catch(e) {
                console.log("account exist or check balance ", e)
            }



            console.log("authKitSignData: ", authKitSignData);
            setLoggedIn(true);
        }
        catch(e){
            console.log("Error connecting wallet: ", e)
        }
        
    }

    async function web2logout() {
        await wmp.signOut()
        setLoggedIn(false);
        
    } 

    if(wmp!=null) {
        wmp.subscribe(ADAPTER_EVENTS.CONNECTED, () => {
            console.log('User is authenticated')
        })
        
        wmp.subscribe(ADAPTER_EVENTS.DISCONNECTED, () => {
            console.log('User is not authenticated')
        })
    }

    async function testTranaction() {
        if(web2provider!="") {
            
        }
    }
    
    

    return(
       <>
       <h2>SAFE CORE PROTOCOL - Account Abstraction</h2>
        {loggedIn ? (
            <button onClick={web2logout}>Web2 Logout</button>
        ) : (
            <button onClick={web2login}>Web2 Login</button>
        )}

        <button onClick={testTranaction}> create safe wallet</button>
    </>

    );
}

export default Safex;