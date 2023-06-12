// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 contract TodoList{ 
    struct Task{
        string task;
        bool isDone;
    }

    mapping (address => Task[]) private Tasks;
    address public owner;
   

     constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this operation");
        _;
    }

    function addTask(string calldata _task) external{
        require(bytes(_task).length > 0, "Task name cannot be empty");
        
        
        Tasks[msg.sender].push(Task({
            task:_task,
            isDone:false
        }));
       
    } 

    function getTask(uint _taskIndex) external view returns (Task memory){
       Task storage task = Tasks[msg.sender][_taskIndex];
       return task;
    } 

    function updateStatus(uint256 _taskIndex,bool _status) external{
        Tasks[msg.sender][_taskIndex].isDone = _status;
    } 

    function deleteTask(uint256 _taskIndex) external{
        delete Tasks[msg.sender][_taskIndex];
    } 

    function getTaskCount() external view returns (uint256)
    {
        return Tasks[msg.sender].length;
    }
}