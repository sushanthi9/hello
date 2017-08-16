//define task class
//task has a name,status and id
class Task {
    constructor(taskname){
        this.name = taskname;
        this.status = 0;
        //time stamp
        this.id = new Date().getTime();
        //this returns an object of itself
        return this;
    }
}

//array to store tasks
//let prevents global accesibility whereas var is global
var TaskArray = [];

window.addEventListener('load',function(){
    loadTasks();
    //create  a reference for  a form using  a constant
    const TaskForm=document.getElementById('task-form');
    
    //make this form listen to the event
    //add a listener when form is submitted
    TaskForm.addEventListener('submit',onSubmit);
    //get  areference to task-list element
    const TaskList = document.getElementById('task-list');
    TaskList.addEventListener('click',changeTaskStatus);
    
    const Button = document.getElementById('remove');
    Button.addEventListener('click',removeDone);
});
function removeDone(){
    let count = TaskArray.length-1;
    for(let i=count; i>=0; i--){
        let item = TaskArray[i];
        if(item.status ==1){
            //splice remove items from array
            TaskArray.splice(i,1);
            saveTasks();
            renderTaskList();
        }
        
    }
}


//define onSubmit
function onSubmit(event){
    //cancel event default
    event.preventDefault();
    const TaskInput = document.getElementById('task-input');
    let taskname = TaskInput.value;
    if(taskname != ''){
        let todo = new Task(taskname);
        TaskArray.push(todo);
        saveTasks();
        //createNewTask(todo);
        event.target.reset();
        renderTaskList();
    }
     //if we want the action in console
  //  console.log(taskname);
 //   console.log(console);
  
}
  //to convert this task inti html element
  function createNewTask(taskobj){
     
      //create an LI element
      let listitem = document.createElement('LI');
      //set attributes to the LI
      listitem.setAttribute('id',taskobj.id);
      listitem.setAttribute('data-status',taskobj.status);
      let txt = document.createTextNode(taskobj.name);
      listitem.appendChild(txt);
      //add this to task list
      document.getElementById('task-list').appendChild(listitem);
  }
  
  function clearTaskList(){
      //innerHTML holds all html tags from task list
      document.getElementById('task-list').innerHTML = '';
  }
  
  function renderTaskList(){
      let count = TaskArray.length;
      clearTaskList();
      for(let i=0;i < count;i++){
          let taskobj = TaskArray[i];
          createNewTask(taskobj);
      }
      toggleShowButton();
  }
  
  //will see the event from the parent instead of the item on which the event is occuring 
  function changeTaskStatus(event){
      console.log(event.target);
      let itemid = event.target.id;
      //search the array for the itemid
      let count = TaskArray.length;
      //loop through array
      for(let i=0;i < count; i++){
          let taskobj = TaskArray[i];
          if (taskobj.id == itemid){
              switch (taskobj.status) {
                  case 0:
                      taskobj.status = 1;
                      break;
                   case 1:
                      taskobj.status = 0;
                      break;   
                   default:
                      break;
              }
              saveTasks();
              renderTaskList();
          }
      }
      
  }
  
  //
  function saveTasks(){
      if(window.localStorage){
      //converting into string
          let jsonstring = JSON.stringify(TaskArray);
          window.localStorage.setItem('tasks',jsonstring);
      }
  } 

function loadTasks(){
    if(window.localStorage){
        let data = window.localStorage.getItem('tasks');
        //let jsondata = JSON.parse(data);
        if(JSON.parse(data)){
            TaskArray = JSON.parse(data);
            renderTaskList();
        }
        //console.log(jsondata);
        //convert that data into an array
       // TaskArray = new Array(JSON.parse(data));
      // TaskArray = new Array(jsondata);
     // if(jsondata.length > 0){
      //TaskArray = jsondata;
       //renderTaskList();
      //}
    }
}
//to show and hide the button 
function toggleShowButton(){
    //let is a construct in java script let is more localised
    let show = false;
    let count = TaskArray.length;
    //loop through the array to find items with status=1
    for(let i=0; i<count; i++){
       let item = TaskArray[i];
       if(item.status == 1){
           show = true;
       }
    }
    //to hide the button set display=none but will not a fading effect 
    //fhdhj
    if(show == true){
        document.getElementById('remove').setAttribute('class','show');
    }
    else{
        document.getElementById('remove').removeAttribute('class');
    }
}