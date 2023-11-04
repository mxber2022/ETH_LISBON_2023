import React, { useState } from 'react';
import "./Profile.css";
import configFile from '../../Config.json';
import { abi } from "./abi";
import { useContractWrite, usePrepareContractWrite, useContractRead } from 'wagmi';
import { useAccount } from 'wagmi';


function Profile() {

    const { address, isConnecting, isDisconnected } = useAccount()
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
        check id user exits 
        1. if yes, get their name and description
        2. if not ask to create
    */

    
    const { data: progfile_exist, isError } = useContractRead({
        address: configFile.CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'doesUserProfileExist',
        args: [address],
    })

    const { data: profiledata } = useContractRead({
        address: configFile.CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'getUserProfile',
        args: [address],
    })
    
        

    console.log("contractRead", profiledata);





    const [choice, setChoice] = useState('');

    const handleChoiceChange = (event) => {
        const newChoice = event.target.value;
        setChoice(newChoice);
    }

    return (
        <>

            {
                progfile_exist==true? 
                <>
                    <div> 
                        <h2>{`Welcome ${profiledata[0]}`} </h2>
                    </div>

                    <div>
                    <p>Would you like to create a form?</p>
                        <form>
                            <label>
                            <input
                                type="radio"
                                name="choice"
                                value="Yes"
                                checked={choice === "Yes"}
                                onChange={handleChoiceChange}
                            />
                            Yes
                            </label>
                            <label>
                            <input
                                type="radio"
                                name="choice"
                                value="No"
                                checked={choice === "No"}
                                onChange={handleChoiceChange}
                            />
                            No
                            </label>
                        </form>

                        {choice === "Yes" && <p>Hello</p>}
                    </div>
                    
                </> 
                : 
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
            
            }
</>

    
    )
}

export default Profile;
