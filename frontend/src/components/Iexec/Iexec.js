import './Iexec.css';
import { IExecWeb3mail } from "@iexec/web3mail";
import React, { useState, useEffect } from 'react';
import { IExecDataProtector } from "@iexec/dataprotector";
import { getAccount } from '@wagmi/core';

function Iexec() {
  const web3Provider = window.ethereum;
  const web3mail = new IExecWeb3mail(web3Provider);

  const [contactList, setContactList] = useState([]);

  useEffect(() => {
    fetchMyMail();
  }, []);

  async function fetchMyMail() {
    const listContact = await web3mail.fetchMyContacts();
    console.log("listContact: ", listContact);
    setContactList(listContact);
  }

  const [protectedData, setProtectedData] = useState('');
  const handleProtectedDataChange = (e) => {
    setProtectedData(e.target.value);
  };

  const [emailSubject, setEmailSubject] = useState('');
  const handleEmailSubjectChange = (e) => {
    setEmailSubject(e.target.value);
  };

  const [emailContent, setEmailContent] = useState('');
  const handleEmailContentChange = (e) => {
    setEmailContent(e.target.value);
  };

  async function sendMail() {
    const sendEmail = await web3mail.sendEmail({
        protectedData: protectedData,
        emailSubject: emailSubject,
        emailContent: 'My email content'
    })

    console.log("sendEmail: ", sendEmail);
  }

  /*  Protect Data */

    async function protectData() {

        const result = getAccount();
        const provider = await result.connector?.getProvider();
        const dataProtector = new IExecDataProtector(provider);
        console.log("provider: ", provider);
        console.log(dataProtector);
    
        const protectedData =  await dataProtector.protectData({
            data: {
                email: 'crytrap05@gmail.com'
            }
        });
        
        console.log("protectedData: ", protectedData);
    }
    
  


  return (
    <>
    <button onClick={protectData}>Protect Data</button>
        <div>
        <h2>IExec - Web3Mail</h2>
        <button onClick={fetchMyMail}>Fetch My Contacts</button>
        <ul>
            {contactList.map((contact, index) => (
            <li key={index}>
                Address: {contact.address}, Owner: {contact.owner}, Timestamp: {contact.accessGrantTimestamp}
            </li>
            ))}
        </ul>
        </div>

       
        <div>
            <label htmlFor="protectedData">Protected Data:</label>
            <input type="text" id="protectedData" value={protectedData} onChange={handleProtectedDataChange} />
        </div>

        <div>
            <label htmlFor="emailSubject">Email Subject:</label>
            <input type="text" id="emailSubject" value={emailSubject} onChange={handleEmailSubjectChange} />
        </div>

        <div>
            <label htmlFor="emailContent">Email Content:</label>
            <textarea id="emailContent" value={emailContent} onChange={handleEmailContentChange} />
        </div>

        <button onClick={sendMail}>Send Mail</button>
    </>
  );
}

export default Iexec;
