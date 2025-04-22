// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FeedbackBoard {

    struct Feedback{
        address sender;
        string message;
    }

    Feedback[] public feedbacks;

    event FeedbackSubmitted(address indexed sender,string message);

    function submitFeedback(string memory _msg) public {
        feedbacks.push(Feedback(msg.sender,_msg));
        emit FeedbackSubmitted(msg.sender, _msg);
    }

    function getFeedback(uint index) public view returns(address,string memory)
    {
        require(index < feedbacks.length,"Index out of range");
        Feedback memory feed = feedbacks[index];
        return(feed.sender,feed.message);
    }

    function getTotalFeedback() public view returns (uint) {
        return(feedbacks.length);
    }

}