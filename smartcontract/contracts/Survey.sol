// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Survey is ERC721, ERC721URIStorage, Ownable {

    uint256 private _nextTokenId;

    constructor(address initialOwner)
        ERC721("Survey", "MTK")
        Ownable(initialOwner)
    {}

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    struct Question {
        string text;
    }

    struct Response {
        uint formId;
        address respondent;
        string answer;
    }

    struct SurveyForm {
        address user;
        string title;
        uint[] questionIds;
    }

    struct UserProfile {
        string name;
        string description;
    }

    mapping(address => UserProfile) public userProfiles;
    mapping(uint => Question) public questions;
    mapping(uint => SurveyForm) public surveyForms;
    Response[] public responses;

    uint public formCounter;
    uint public questionCounter;

    event SurveyFormCreated(uint formId, address user, string title);
    event QuestionAdded(uint formId, uint questionId, string questionText);
    event ResponseAdded(uint formId, address respondent, string answer);

    modifier hasProfile() {
        require(bytes(userProfiles[msg.sender].name).length > 0, "User profile not found");
        _;
    }

    function createUserProfile(string memory name, string memory description) public {
        userProfiles[msg.sender] = UserProfile(name, description);
    }

    function createSurveyForm(string memory title, string[] memory questionTexts) public hasProfile {
        uint formId = formCounter++;
        surveyForms[formId] = SurveyForm(msg.sender, title, new uint[](0));
        emit SurveyFormCreated(formId, msg.sender, title);

        for (uint i = 0; i < questionTexts.length; i++) {
            uint questionId = questionCounter++;
            questions[questionId] = Question(questionTexts[i]);
            surveyForms[formId].questionIds.push(questionId);
            emit QuestionAdded(formId, questionId, questionTexts[i]);
        }
    }

    function addResponses(uint formId, string[] memory answers) public hasProfile {
        require(formId < formCounter, "Invalid form ID");

        for (uint i = 0; i < answers.length; i++) {
            responses.push(Response(formId, msg.sender, answers[i]));
            emit ResponseAdded(formId, msg.sender, answers[i]);
        }

        safeMint(msg.sender, "test");
    }

    function getResponses(uint formId) public view returns (address[] memory, string[] memory) {
        require(formId < formCounter, "Invalid form ID");

        uint responseCount = 0;
        for (uint i = 0; i < responses.length; i++) {
            if (responses[i].formId == formId) {
                responseCount++;
            }
        }

        address[] memory respondents = new address[](responseCount);
        string[] memory answers = new string[](responseCount);

        uint currentIndex = 0;
        for (uint i = 0; i < responses.length; i++) {
            if (responses[i].formId == formId) {
                respondents[currentIndex] = responses[i].respondent;
                answers[currentIndex] = responses[i].answer;
                currentIndex++;
            }
        }

        return (respondents, answers);
    }

    function getQuestionsForForm(uint formId) public view returns (string[] memory) {
        require(formId < formCounter, "Invalid form ID");

        SurveyForm storage form = surveyForms[formId];
        uint numQuestions = form.questionIds.length;

        string[] memory questionTexts = new string[](numQuestions);

        for (uint i = 0; i < numQuestions; i++) {
            uint questionId = form.questionIds[i];
            questionTexts[i] = questions[questionId].text;
        }

        return questionTexts;
    }

}

