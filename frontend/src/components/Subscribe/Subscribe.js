import './Subscribe.css';
import { NotifyClient } from '@walletconnect/notify-client';
import { useAccount, usePublicClient, useSignMessage } from "wagmi";
import { signMessage } from '@wagmi/core';
import { useManageSubscription, useSubscription, useW3iAccount, useInitWeb3InboxClient, useMessages } from '@web3inbox/widget-react'
import { useCallback, useEffect } from 'react';

const appDomain = new URL("https://explorer-api.walletconnect.com/v3/dapps?projectId=241bb4581819090d1602501778f5ff8f&is_notify_enabled=true").hostname
console.log("appDomain: ", appDomain);

function Subscribe() {

    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const isReady = useInitWeb3InboxClient({
        projectId: '241bb4581819090d1602501778f5ff8f',
        domain: 'eth-lisbon-2023.vercel.app',
        isLimited: false
    })
    
    const { account, setAccount, isRegistered, isRegistering, register } = useW3iAccount();

    useEffect(() => {
        if (!address) return
        // Convert the address into a CAIP-10 blockchain-agnostic account ID and update the Web3Inbox SDK with it
        setAccount(`eip155:1:${address}`)
    }, 
    [address, setAccount])

    const performRegistration = useCallback(async () => {
        if (!address) return
        try {
          await register(message => signMessageAsync({ message }))
        } catch (registerIdentityError) {
          alert(registerIdentityError)
        }
    }, 
    [signMessageAsync, register, address])

    useEffect(() => {
        // Register even if an identity key exists, to account for stale keys
        performRegistration()
    }, [performRegistration])
    
    const { isSubscribed, isSubscribing, subscribe } = useManageSubscription()
    
    const performSubscribe = useCallback(async () => {
        // Register again just in case
        await performRegistration()
        await subscribe()
    }, 
    [subscribe, isRegistered])
    
    const { subscription } = useSubscription()
    const { messages } = useMessages()

    console.log("messages: ", messages);
    console.log("subscription: ", subscription);

    async function Noteify() {
        const response = await fetch(
            'https://notify.walletconnect.com/241bb4581819090d1602501778f5ff8f/notify',
            {
              method: "POST",
              headers: {
                Authorization: 'Bearer f83a5aee-b546-4e50-a739-8bf61bebbe0c',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                notification: {
                  type: "35f41b82-01d5-428d-9efe-b4b9b6c0294e", // Notification type ID copied from Cloud 
                  title: "Hello ETH Lisbon",
                  body: "Notification body",
                  icon: "https://app.example.com/icon.png", // optional
                  url: "https://eth-lisbon-prep-air5.vercel.app/", // optional
                },
                accounts: [
                    `eip155:1:${address}` // CAIP-10 account ID
                ]
              })
            }
          );

          console.log("response: ", response);
    }

    

    //Noteify()

/*
    const handleBlockNotification = useCallback(async () => {
        
              await sendNotification({
                accounts: [address], // accounts that we want to send the notification to.
                notification: {
                  title: "New block",
                  body: "hello",
                  icon: `${window.location.origin}/eth-glyph-colored.png`,
                  url: `https://etherscan.io/block/${blockNumber.toString()}`,
                  type: "transactional",
                },
              });
        
      }, []);
    
      useInterval(() => {
        handleBlockNotification();
      }, 12000);


*/




    return(
        <>
        {!isReady ? (
          <div>Loading client...</div>
        ) : (
          <>
            {!address ? (
              <div></div>
            ) : (
              <>
                <div>Address: {address}</div>
                <div>Account ID: {account}</div>
                {!isRegistered ? (
                  <div>
                    To manage notifications, sign and register an identity key:&nbsp;
                    <button onClick={performRegistration} disabled={isRegistering}>
                      {isRegistering ? 'Signing...' : 'Sign'}
                    </button>
                  </div>
                ) : (
                  <>
                    {!isSubscribed ? (
                      <>
                        <button onClick={performSubscribe} disabled={isSubscribing}>
                          {isSubscribing ? 'Subscribing...' : 'Subscribe to notifications'}
                        </button>
                      </>
                    ) : (
                      <>
                        <div>You are subscribed</div>
                         {/*<div>Subscription: {JSON.stringify(subscription)}</div>*/}
                        
                        <div>Message from: {messages[0]['message']['title']}</div>
                        <div>Message: {messages[0]['message']['body']}</div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </>
    )
}

export default Subscribe;


