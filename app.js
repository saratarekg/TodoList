
var taskInput=document.getElementById("new-task");
var addButton=document.getElementsByTagName("button")[0];//first button - add
var incompleteTaskHolder=document.getElementById("incomplete-tasks");//list of incomplete
var completedTasksHolder=document.getElementById("completed-tasks");//list of complete


var createNewTaskElement=function(taskString){

    var listItem=document.createElement("li");
    var checkBox=document.createElement("input");
    checkBox.type="checkbox";
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
    return listItem;
}



var addTask=function(){

    var listItem=createNewTaskElement(taskInput.value);

    incompleteTaskHolder.appendChild(listItem); //added to incomplete
    bindTaskEvents(listItem, taskCompleted);

    taskInput.value=""; //empty the text box
}
addButton.onclick=addTask;


var editTask=function(){
    var listItem=this.parentNode;

    var editInput=listItem.querySelector('input[type=text]');
    var label=listItem.querySelector("label");
    var editButton = listItem.querySelector("button.edit");
    var containsClass=listItem.classList.contains("editMode");
    //If class of the parent is .editmode
    if(containsClass){
        label.innerText=editInput.value;
        editButton.innerText = "Edit";

    }else{
        editInput.value=label.innerText;
        editButton.innerText = "Save";
    }

    listItem.classList.toggle("editMode");
}


var deleteTask=function(){
    var listItem=this.parentNode;
    var ul=listItem.parentNode;
    ul.removeChild(listItem);
}

var taskCompleted=function(){
    var listItem=this.parentNode;
    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete); //if task completed the checkbox makes it incomplete
}

var taskIncomplete=function(){
    var listItem=this.parentNode;
    incompleteTaskHolder.appendChild(listItem);
    bindTaskEvents(listItem,taskCompleted);
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

function search(searchInputId, listId) {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById(searchInputId);
    filter = input.value.toUpperCase();
    ul = document.getElementById(listId);
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].querySelector("label");
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}