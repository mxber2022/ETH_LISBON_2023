import React, { useState } from 'react';
import "./Profile.css";
import configFile from '../../Config.json';
import { abi } from "./abi";
import { useContractWrite, usePrepareContractWrite, useContractRead } from 'wagmi';
import { useAccount } from 'wagmi';
import { useDebounce } from 'use-debounce';
import { ethers } from "ethers"

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




    /*
        choices
    */

    const [choice, setChoice] = useState('');

    const handleChoiceChange = (event) => {
        const newChoice = event.target.value;
        setChoice(newChoice);
    }

    /*
        dynamic question
    */

    const [questions, setQuestions] = useState(new Array().fill(''));

    const addQuestion = () => {
        setQuestions([...questions, '']);
    };

    const removeQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    const handleQuestionChange = (index, event) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = event.target.value;
        setQuestions(updatedQuestions);
    };

    /*
        contract write
    */

    const [formTitle, setFormTitle] = React.useState(''); // New state for survey form title
    const debouncedFormTitle = useDebounce(formTitle);

    const [question, setQuestion] = useState(new Array());

    const { config: writeQuestion } = usePrepareContractWrite({
        address: configFile.CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'createSurveyForm',
        args: [debouncedFormTitle, questions],
        onSuccess(data) {
            console.log('Success Data Bug', questions)
        },
    });

    const { data: writeQuestion_data, isLoading: writeQuestion_isloading, isSuccess: writeQuestion_isSuccess, write: writeQuestion_write } = useContractWrite(writeQuestion);

    const handleSubmit = (e) => {
        e.preventDefault();
      
        setQuestion(questions);
        console.log("questions: ", questions);
        writeQuestion_write?.();
    };

/****************************************************************/
    /*
        add response
    */
     /*
        get all question
    */ 
        /* */
   
    const { data: getQuestionsForForm } = useContractRead({
        address: configFile.CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'getQuestionsForForm',
        args: [2],
        onSuccess(data) {
            console.log('Success', data)
        },
    })

    console.log("getQuestionsForForm: ", getQuestionsForForm);

    const [answers, setAnswers] = useState(new Array().fill(''));

    const { config: config_addResponses } = usePrepareContractWrite({
        address: configFile.CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'addResponses',
        args: [name, answers],
    });
    
    const { data: addResponses_data, isLoading: addResponses_isLoading, isSuccess:addResponses_isSuccess, write: addResponses_write } = useContractWrite(config_addResponses);

    

    const handleAnswerChange = (index, event) => {
        const newAnswers = [...answers];
        newAnswers[index] = event.target.value;
        setAnswers(newAnswers);
    };

    const handleSubmitAnswer = (e) => {
        e.preventDefault();
        addResponses_write?.();
    };


/****************************************************************/
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

                        {

                            choice === "Yes" && 
                            <>

                            <div>
                                <label htmlFor="formTitle">Survey Form Title:</label>
                                <input
                                    type="text"
                                    id="formTitle"
                                    placeholder="Enter the form title"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                />
                            </div>

                                <div>
                                    <form onSubmit={handleSubmit}>
                                        {questions.map((question, index) => (
                                        <div key={index}>
                                            <input
                                            type="text"
                                            value={question}
                                            onChange={(e) => handleQuestionChange(index, e)}
                                            placeholder="Question"
                                            />
                                            <button type="button" onClick={() => removeQuestion(index)}>
                                            Remove
                                            </button>
                                        </div>
                                        ))}
                                        <button type="button" onClick={addQuestion}>
                                        Add Question
                                        </button>
                                        <button type="submit">Submit</button>
                                    </form>
                                </div>

                                {isLoading && <div>Check Wallet</div>}
                                {writeQuestion_isSuccess && <div>Transaction: {JSON.stringify(writeQuestion_data)}</div>}
                            </>
                        
                        }
                    </div>
                    
                </> 
                : 
                <>
               
                    {
                         address==undefined? <></>:<>
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



            
            }

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

</>

    
    )
}

export default Profile;

