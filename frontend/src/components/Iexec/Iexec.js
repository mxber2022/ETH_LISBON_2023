import './Iexec.css';
import { IExecWeb3mail } from "@iexec/web3mail";

function Iexec () {

    const web3Provider = window.ethereum;
    const web3mail = new IExecWeb3mail(web3Provider);

    async function fetchMyMail() {
        const listContact = await web3mail.fetchMyContacts()

        console.log(listContact);
    }

    return(
        <>
            <h2>IExec - Web3Mail</h2>
            <button onClick={fetchMyMail}>Fetch All Mails</button>
        </>
    )
}

export default Iexec;

