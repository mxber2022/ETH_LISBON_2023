import React, { useState } from 'react';
import "./Profile.css";
import configFile from '../../Config.json';
import { abi } from "./abi";
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

function Profile() {
    const [name, setName] = useState(""); 
    const [description, setDescription] = useState(""); 

    const { config } = usePrepareContractWrite({
        address: configFile.CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'createUserProfile',
        args: [name, description],
    });

    const { data, isLoading, isSuccess, write } = useContractWrite(config);

    const handleCreateProfile = () => {
        // Ensure both name and description are filled before creating the profile
        if (name.trim() !== "" && description.trim() !== "") {
            write?.(); 
        }
    }

    /* 
        Transaction through safe
    */

    

    return (
        <>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="description">Description:</label>
                <input
                    type="text"
                    id="description"
                    placeholder="Enter a description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <button disabled={!write} onClick={handleCreateProfile}> Create Profile </button>
            {isLoading && <div>Check Wallet</div>}
            {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
        </>
    )
}

export default Profile;
