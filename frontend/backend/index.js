import { IExecDataProtector, getWeb3Provider } from "@iexec/dataprotector";

const web3Provider = getWeb3Provider("d2ab6e77539c6d2ba90f19b217e26e4fad301e5066445514b4b63cba0fc80b6c");

// instantiate

const dataProtector = new IExecDataProtector(web3Provider);

const protectedData = await dataProtector.protectData({
    data: {
        email: 'crytrap05@gmail.com'
    }
})
 

console.log(protectedData);


const listProtectedData = await dataProtector.fetchProtectedData({
    owner: '0x7199D548f1B30EA083Fe668202fd5E621241CC89'
})

console.log(listProtectedData)