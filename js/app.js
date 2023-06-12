$(document).ready(createTaskList());

$('#add-task-container').on('shown.bs.modal', function () {
	$('#new-task').trigger('focus');
});


async function createTaskList() {
	try {
		await getAccount();
		
		contract = new web3.eth.Contract(contractABI, '0x7120F6fb2F279f4831b0749c66b67e899d871BA5');
		try {
			numberOfTask = await contract.methods.getTaskCount().call({ from: web3.eth.defaultAccount });
			
			if (numberOfTask != 0) {
				let taskIterator = 0;
				while (taskIterator < numberOfTask) {
					try {
						let task = await contract.methods.getTask(taskIterator).call({ from: web3.eth.defaultAccount });
						if (task[0] != '') {
							addTaskToList(taskIterator, task[0], task[1]);
						}
						else {
							console.log('The index ' + taskIterator + ' is empty');
						}
					} catch {
						console.log('Failed to get Task ' + taskIterator);
					}
					taskIterator++;
				}
				updateTasksCount();
			}
		} catch {
			console.log('Failed to get task count from blockchain');
		}
	} catch {
		console.log('Failed to get the account');
	}

}


function addTaskToList(id, name, status) {
	console.log('addTaskToList(): Add Task ' + (id) + ' ' + [name, status]);
	
	let list = document.getElementById('list');
	
	let item = document.createElement('li');
	item.classList.add('list-group-item', 'border-0', 'd-flex', 'justify-content-between', 'align-items-center');
	item.id = 'item-' + id;
	let task = document.createTextNode(name);
	
	var checkbox = document.createElement("INPUT");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("id", "item-" + id + "-checkbox");
	checkbox.checked = status;
	
	if (status) {
		item.classList.add("task-done");
	}
	list.appendChild(item);
	
	item.ondblclick = function () {
		removeTask(item.id);
	}
	item.appendChild(task);
	item.appendChild(checkbox);
	checkbox.onclick = function () { changeTaskStatus(checkbox.id, id); };
}

async function removeTask(taskIndex) {
	console.log("removeTask(): Remove Task " + taskIndex);
	let taskSelector = '#' + taskIndex;
	taskIndex = taskIndex.replace('item-', '');
	try {
		await contract.methods.deleteTask(taskIndex).send({ from: web3.eth.defaultAccount });
		Alert('Remove Task ' + taskIndex + ' from the blockchain');
		$(taskSelector).remove();
		updateTasksCount();
	} catch {
		console.log('Issue occurred while removing task item-' + taskIndex);
	}
}

async function changeTaskStatus(id, taskIndex) {
	let checkbox = document.getElementById(id);
	let textId = id.replace('-checkbox', '');
	let text = document.getElementById(textId);
	try {
		await contract.methods.updateStatus(taskIndex, checkbox.checked).send({ from: web3.eth.defaultAccount });
		console.log('changeTaskStatus(): Change status of task ' + textId + ' to ' + checkbox.checked);
		if (checkbox.checked) {
			text.classList.add("task-done");
		} else {
			text.classList.remove("task-done");
		}
	} catch (error) {
		console.log('Failed to change Status of task ' + textId + ' in blockchain');
	}
}


function updateTasksCount() {
	let list = document.getElementById('list');
	let taskCount = list.childElementCount;
	console.log('updateTaskCount(): Jumlah Task ' + taskCount);
	let count = document.getElementById('taskCount');
	count.innerText = taskCount + " Task";
}


 async function addTask(name) {
	
	console.log('Get the number of task from blockchain');
	document.getElementById('new-task').value = '';
	contract.methods.getTaskCount().call({ from: web3.eth.defaultAccount }).then(numberOfTask => {
		addTaskToList(numberOfTask, name, false);
		updateTasksCount();
	}, err => {
		console.log('Error:  ' + err);
	});
	try {
		await contract.methods.addTask(name).send({ from: web3.eth.defaultAccount });
	} catch {
		console.log('Error add Task');
	}


} 

