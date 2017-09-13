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

//define an object that represents the application object
//application object
//when a user is signed in we are going to ger userid via this user object
var app ={userid:0,username:""};


//code form firebase.google.com docs
//https://firebase.google.com/docs/auth/web/password-auth
firebase.auth().onAuthStateChanged(function(user){
   if (user) {
       app.userid = user.uid;
       //user is signed in 
       //hide all the forms
       let authforms=document.querySelectorAll('.overlay');
       for(let i=0;i<authforms.length;i++){
           authforms[i].style.display='none';
       }
       //get username from database
       let path = 'users/'+app.userid;
       firebase.database().ref(path)
            .once('value')
            .then(function(snapshot){
                let username = snapshot.val().name;
                app.username = username;
                displayUserName(username);
            }
    );
    readTask(app.userid);
   } else {
   //no user is signed in
   showForm('signin-box');
   //clear the task list
   clearTaskList();
   }
});

//an observer once inisiated stats

function displayUserName(username){
    if(username){
        document.getElementById('username').innerText = username;
    }
    else{
        document.getElementById('username').innerText = "";
    }
}



window.addEventListener('load',function(){
    const SignUpTemplate = document.getElementById('signup-template');
    const SignInTemplate = document.getElementById('signin-template');
    
    
    //activate signup template
    var su_form = document.importNode(SignUpTemplate.content,true);
    //add form to document
    document.querySelector('.appview').appendChild(su_form);
    
    //activate signin template
    var si_form =document.importNode(SignInTemplate.content,true);
    //add form to document
    document.querySelector('.appview').appendChild(si_form);
    
   
    
    const signinlink = document.getElementById('signin-link');
    const signuplink = document.getElementById('signup-link');
    showForm('signup-box');
    signinlink.addEventListener('click',function(){
        showForm('signin-box');
    });
    
    signuplink.addEventListener('click',function(){
    //Test the fumction
    showForm('signup-box');
    });
    
    //get a 
    
    loadTasks();
    //create  a reference for  a form using  a constant
    //const TaskForm=document.getElementById('task-form');
    
    //make this form listen to the event
    //add a listener when form is submitted
    //TaskForm.addEventListener('submit',onSubmit);
    //get  areference to task-list element
   // const TaskList = document.getElementById('task-list');
    //TaskList.addEventListener('click',changeTaskStatus);
    
    // const Button = document.getElementById('remove');
    //Button.addEventListener('click',removeDone);

 //get a reference to the sign up form
    const signupform = document.getElementById('signup-form');
    signupform.addEventListener('submit',signUserUp);
    
    //get a reference to the sign in form
    const signinform = document.getElementById('signin-form');
    signinform.addEventListener('submit',signUserIn);
    
    //get a reference to logout button
    const logout = document.getElementById('logout');
    logout.addEventListener('click',logUserOut);
    
    
     loadTasks();
    const TaskForm = document.getElementById('task-form');
    //add a listener for when form is submitted
    TaskForm.addEventListener('submit',onSubmit);
    //get a reference to task-list element
    const TaskList = document.getElementById('task-list');
    TaskList.addEventListener('click',changeTaskStatus);
    const Button = document.getElementById('remove');
    Button.addEventListener('click',removeDone);
    //dispay user name
    displayUserName(app.username);
});


//code from https://firebase.google.com/docs/auth/web/password-auth
function logUserOut(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      displayUserName(false);
    }).catch(function(error) {
      // An error happened.
    });
}



function signUserIn(evt){
    evt.preventDefault();
    //get data from sign in form
    let data =new FormData(evt.target);
    let email = data.get('email');
    let password = data.get('password');
    evt.target.reset();
    
    //logging into firebase with user email and password
    firebase.auth().signInWithEmailAndPassword(email, password)
    
    //then trying to access the data entered into firebase database 
    //getting the "unique userid" of the current user
    .then(
        //basically getting the snap shot of data
        function(){
            //Here we are getting the "unique userid" of the current user
            let userid = firebase.auth().currentUser.uid;
            
            let path = 'users/' + userid;
            //now accessing the data entered into the firebase database
            firebase.database()
            .ref(path)
            .once('value')
            .then(
                function(snapshot){
                    let username = snapshot.val().name;
                    app.username = username;
                    displayUserName(username);
                }
            )
        }
        
    )
    .catch(
        function(error) {
            console.log(error.message);
        }
    );
}

//sign user in with email and password
//get sign up form
//const signupform = document.getElementById('signup-form');
//watch for sign up form being submitted
//signupform.addEventListener('submit',function(evt){

function signUserUp(evt){
//for testing the working the below log
//console.log(evt.target.id);
   //stop page refreshing
   evt.preventDefault();
    let data = new FormData(evt.target);
//   let data=  FormData(signupform);
   let username = data.get('username');
   let email=data.get('email');
//   console.log(email);
   let password=data.get('password');
   evt.target.reset();
   
//sending data to firebase and creating an account in firebase with the user details.
//The account details are stored in firebase authentication database but not the firebase database
   firebase.auth().createUserWithEmailAndPassword(email,password)
   
//now we are going to write username under "unique userid" to the firebase database,
//getting "unique userid" created by firebase during user account creation(with the firebase)
   .then(
        function(){
          let userid = firebase.auth().currentUser.uid;
          //we need to create path before we write to firebase database
          let path = 'users/' + userid;
          let obj = {name: username};
          firebase.database()
                .ref(path)
                .set(obj)
                .then(function(result){
              
                     //when we enter data to firebase it returns a promise
                     //.den in javascript it is ....of promise
                    
                     //nothing yet
                     //user is now signed up and is logged in
                     displayUserName(username);
                     }
                 );
        }
    )
   .catch(
      function(error){
          console.log("account creation failed");
      }
      )
}

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
      writeTask(app.userid,taskobj);
  }
  
  //similar to createNewTask to add a list item to the panel
  //write a task to write data to the firebase only if the user exits
  //call this from createNewtasK
  function writeTask(userid,task){
      if(app.userid){
          let path = 'lists/' + userid + '/' + task.id;
          let taskobj = {name: task.name, status: task.status};
          firebase.database().ref(path).set(taskobj);
      }    
  }
  
  //get task objects from firebase lists folder  for the logged in user and 
  //capture them inthe array and display them in the browser tasks
  function readTask(userid){
      let path = 'lists/' + userid;
      firebase.database()
            .ref(path)
            .once('value')
            .then(
                //get all the tasks from firebase
                function(snapshot){
                    let tasks = snapshot.val();
                    //get ids of the tasks from firebase
                    let count = Object.keys(tasks).length;
                    let keys = Object.keys(tasks);
                    //console.log(count);
                    for(let i=0; i<count; i++){
                     //    console.log(Object.keys(tasks[i]));
                    //     let item = tasks[i];
                    //     console.log(item);
                           let item= tasks[ keys[i] ];
                        //   console.log(item);
                           let name = item.name;
                           let status = item.status;
                           let id = keys[i];
                           let task = {id: id , name: name, status: status};
                           //add to our Task Array
                           TaskArray.push(task);
                           renderTaskList();
                     }
                }
            );
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
//       if(window.localStorage){
//       //converting into string
//           let jsonstring = JSON.stringify(TaskArray);
//           window.localStorage.setItem('tasks',jsonstring);
//       }
   } 

 function loadTasks(){
//     if(window.localStorage){
//         let data = window.localStorage.getItem('tasks');
//         //let jsondata = JSON.parse(data);
//         if(JSON.parse(data)){
//             TaskArray = JSON.parse(data);
//             renderTaskList();
//         }
//         //console.log(jsondata);
//         //convert that data into an array
//       // TaskArray = new Array(JSON.parse(data));
//       // TaskArray = new Array(jsondata);
//      // if(jsondata.length > 0){
//       //TaskArray = jsondata;
//       //renderTaskList();
//       //}
//     }
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

 //function to show a particular form
    function showForm(formid){
        //get a reference to both forms
        let forms=document.querySelectorAll('.overlay');
        //iterate through result and set each to have display:none
        for(let i=0; i<forms.length; i++){
            forms[i].style.display = 'none';
            if(forms[i].getAttribute('id') == formid){
                forms[i].style.display = 'flex';
            }
        }
    }