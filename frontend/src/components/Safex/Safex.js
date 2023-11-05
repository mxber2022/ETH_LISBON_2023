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


import configFile from '../../Config.json';
import { abi } from "./abi";
import { useContractWrite, usePrepareContractWrite, useContractRead } from 'wagmi';
import { useDebounce } from 'use-debounce';


function Safex () {
    const [loggedIn, setLoggedIn] = useState(false); 
    const [wmp, setWmp] = useState(null)
    const web2provider = useRef("");
    const ASD = useRef("");
   // const { address, isConnected } = useAccount();
    //const { provider } = useConnect();

    const clientId = "BMt8Val4uB41EFPQo2RWtZMKJV4SfERT2-8pc7LKlgO9jNBvkrGKASnnFqkEU1p8csKeTq2xCJTRoL4fyRxq-m8";

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
            ASD.current = authKitSignData;
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
                

                const safeAccountConfig = {
                    owners,
                    threshold: 1,
                }
                const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })
                const safeAddress = await safeSdk.getAddress()

                console.log('Your Safe has been deployed:')
                console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
                console.log(`https://app.safe.global/gor:${safeAddress}`)
            
            }
            catch(e) {
                console.log("Eroor here ", e)
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
        const provider = web2provider.current;
        const signer = web2provider.current.getSigner();
        const authKitSignData = ASD.current;
        console.log("web2signer: ", signer)

        try {
            const ethAdapter = new EthersAdapter({
                ethers,
                signerOrProvider: signer || provider
            })

            console.log("authKitSignData from test: ", authKitSignData);
            const owners = [authKitSignData.eoa];



            console.log("safe address from test: ", authKitSignData.safes[0]);

            /* Transaction test */

            let temp_safe = authKitSignData.safes[0];
            console.log("temp_safe: ", temp_safe);
        
            const safeSdk = await Safe.create({ ethAdapter, safeAddress: temp_safe})

      
            const MetaTransactionData1 = [{
                to: "0x94F2840338d04cE69e3bcb1cf19B2e802dA1202F",
                data: '0x',
                value: ethers.utils.parseUnits('0.0001', 'ether').toString(),
                
            }]
            /* 

            */


            const contractAdd = "0xfdf36Ba67000E5AAaD15773FEbcb1F0CBb3F1bbE";
            let CONT = new ethers.Contract(contractAdd, abi, signer);
            const { data } = await CONT.populateTransaction.addResponses(1, ["hello", "hello"]);
            console.log("datas: ", data);
            const MetaTransactionData = [{
                to: "0xfdf36Ba67000E5AAaD15773FEbcb1F0CBb3F1bbE",
                data: data,
                value: 0,
            }]

            console.log("MetaTransactionData: ", MetaTransactionData);
            //const tx_hash = await signer.sendUncheckedTransaction(datas);
            //console.log("tx:", tx_hash);





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

        }
        catch(e) {
            console.log("Error found in testTranaction ", e)
        }
        
    }

/* 
    Start: 
*/

    const { data: getQuestionsForForm } = useContractRead({
        address: configFile.CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'getQuestionsForForm',
        args: [0],
        onSuccess(data) {
            console.log('Success', data)
        },
    })

    console.log("getQuestionsForForm: ", getQuestionsForForm);
    const [answers, setAnswers] = useState(new Array().fill(''));
    const handleAnswerChange = (index, event) => {
        const newAnswers = [...answers];
        newAnswers[index] = event.target.value;
        setAnswers(newAnswers);
    };

    const handleSubmitAnswer = (e) => {
        e.preventDefault();
        addResponses_write?.();
    };

    /* Change this to safe */

    const { config: config_addResponses } = usePrepareContractWrite({
        address: configFile.CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'addResponses',
        args: [0, answers],
    });
    
    const { data: addResponses_data, isLoading: addResponses_isLoading, isSuccess:addResponses_isSuccess, write: addResponses_write } = useContractWrite(config_addResponses);


/* 
    Ends: 
*/
    
    

    return(
    <>
       <h2>SAFE CORE PROTOCOL - Account Abstraction</h2>
        {loggedIn ? (
            <button onClick={web2logout}>Web2 Logout</button>
        ) : (
            <button onClick={web2login}>Web2 Login</button>
        )}


        {    

            getQuestionsForForm ?

            <> 
                <div>
                    <h2>Survey Form</h2>
                    <form>
                        {getQuestionsForForm.map((question, index) => (
                        <div key={index}>
                            <p>{question}</p>
                            <input
                            type="text"
                            value={answers[index]}
                            onChange={(e) => handleAnswerChange(index, e)}
                            placeholder="Your Answer"
                            />
                        </div>
                        ))}
                        <button onClick={handleSubmitAnswer}>Submit</button>
                    </form>
                </div>
            </> 

            : 

            <> </>  
            
        }

        <button onClick={testTranaction}> Confirm Response</button>
    </>

    );
}

export default Safex;