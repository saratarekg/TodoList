import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';

var taskInput=document.getElementById("new-task");
var addButton=document.getElementsByTagName("button")[0];//first button - add
var incompleteTaskHolder=document.getElementById("incomplete-tasks");//list of incomplete
var completedTasksHolder=document.getElementById("completed-tasks");//list of complete

const firebaseConfig = {
    apiKey: "AIzaSyDBGKNL5SefEi9ZtBKnod8KaEwuW3z8G2A",
    authDomain: "todolist-sara.firebaseapp.com",
    projectId: "todolist-sara",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const loadTasks = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "todos"));
        querySnapshot.forEach(doc => {
            const task = doc.data();
            console.log(task);
            const listItem = createNewTaskElement(task.text, doc.id, task.completed);
            if (task.completed) {
                completedTasksHolder.appendChild(listItem);
                bindTaskEvents(listItem, taskIncomplete);
            } else {
                incompleteTaskHolder.appendChild(listItem);
                bindTaskEvents(listItem, taskCompleted);
            }
        });
    } catch (error) {
        console.error("Error fetching tasks: ", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

var createNewTaskElement=function(taskString, id = null, completed = false){

    var listItem=document.createElement("li");
    var checkBox=document.createElement("input");
    checkBox.type="checkbox";
    checkBox.checked = completed;

    var label=document.createElement("label");//label
    label.innerText=taskString;
    var editInput=document.createElement("input");//text
    editInput.type="text";
    var editButton=document.createElement("button");//edit button
    editButton.innerText="Edit";
    editButton.className="edit";
    var deleteButton=document.createElement("button");//delete button
    deleteButton.innerText="Delete";
    deleteButton.className="delete";

    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    listItem.dataset.id = id;

    return listItem;
}



var addTask=async () =>{
    const taskText = taskInput.value;
    if (!taskText) return;

    try {
        const docRef =  await addDoc(collection(db, "todos"), {
            text: taskText,
            completed: false
        });
        var listItem = createNewTaskElement(taskText, docRef.id);
        incompleteTaskHolder.appendChild(listItem); //added to incomplete
        bindTaskEvents(listItem, taskCompleted);
        taskInput.value = ""; //empty the text box
        console.log("Task added successfully!");
    }
    catch (e) {
        console.error("Error adding task: ", e);
    }
}

addButton.onclick=addTask;


var editTask=async function(){
    var listItem=this.parentNode;
    const taskId = listItem.dataset.id;

    var editInput=listItem.querySelector('input[type=text]');
    var label=listItem.querySelector("label");
    var editButton = listItem.querySelector("button.edit");
    var containsClass=listItem.classList.contains("editMode");
    if(containsClass){
        try {
            const updatedText = editInput.value;
            await updateDoc(doc(db, "todos", taskId), {text: updatedText});

            label.innerText = updatedText;
            editButton.innerText = "Edit";
        }
        catch (e) {
            console.error("Error updating task: ", e);
        }

    }else{
        editInput.value=label.innerText;
        editButton.innerText = "Save";
    }

    listItem.classList.toggle("editMode");
}


var deleteTask=async function(){
    var listItem=this.parentNode;
    const taskId = listItem.dataset.id;

    var ul=listItem.parentNode;
    try {
        await deleteDoc(doc(db, "todos", taskId));
        ul.removeChild(listItem);
    }
    catch (e) {
        console.error("Error deleting task: ", e);
    }
}

var taskCompleted=async function() {
    var listItem = this.parentNode;
    const taskId = listItem.dataset.id;

    try {
        await updateDoc(doc(db, "todos", taskId), {completed: true});
        completedTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskIncomplete); //if task completed the checkbox makes it incomplete
    }
    catch (e) {
        console.log("Error updating task to completed: ", e);
    }
}

var taskIncomplete=async function(){
    var listItem=this.parentNode;
    const taskId = listItem.dataset.id;
    try {
        await updateDoc(doc(db, "todos", taskId), {completed: false});
        incompleteTaskHolder.appendChild(listItem);
        bindTaskEvents(listItem,taskCompleted);
        }
    catch (e) {
        console.log("Error updating task to incomplete: ", e);
    }

}

var bindTaskEvents=function(taskListItem,checkBoxEventHandler){

    var checkBox=taskListItem.querySelector("input[type=checkbox]");
    var editButton=taskListItem.querySelector("button.edit");
    var deleteButton=taskListItem.querySelector("button.delete");

    //Bind editTask to edit button.
    editButton.onclick=editTask;
    //Bind deleteTask to delete button.
    deleteButton.onclick=deleteTask;
    //Bind taskCompleted to checkBoxEventHandler.
    checkBox.onchange=checkBoxEventHandler;
}


for (var i=0; i<incompleteTaskHolder.children.length;i++){
    bindTaskEvents(incompleteTaskHolder.children[i],taskCompleted);
}


for (var i=0; i<completedTasksHolder.children.length;i++){
    bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
}


// Function to display today's date in the format "Month Day, Year"
var displayDate = function() {
    var today = new Date();
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var formattedDate = today.toLocaleDateString('en-US', options);
    document.getElementById('current-date').innerText = formattedDate;
};
displayDate();

