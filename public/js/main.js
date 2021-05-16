const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get Image from user.
     var imgData  ;

     function readFile(evt) {
         var f = evt.target.files[0]; 

            if (f) {
                 if ( /(jpe?g|png|gif)$/i.test(f.type) ) {
                         var r = new FileReader();
                             r.onload = function(e) { 
                                  imgData = e.target.result;
                              }
                          r.readAsDataURL(f);
                      } else { 
                            alert("Failed file type");
                         }
               }   else { 
                      alert("Failed to load file");
                    }
      }

document.getElementById('inputImg').addEventListener('change', readFile, false);


// Get username and room from URL
const { username, room, status } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
}); 

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room, status });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message, getImgData) => {
  console.log(message);

  outputMessage(message, getImgData);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;
         if(msg != ''){
          // Emit message to server
            socket.emit('chatMessage',msg ,imgData);
            imgData = '';
         }
  
  // clear blobImg 
  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message, getImgData) {
     if(getImgData == undefined){
      const div = document.createElement('div');
      div.classList.add('message');
      div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
      <p class="text">
        ${message.text}<br>
      </p>`;
      document.querySelector('.chat-messages').appendChild(div);
     }
     else{      
      const div = document.createElement('div');
      div.classList.add('message');
      div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
      <br><p class="text">${message.text}</p><img src="${getImgData}" class="img-thumbnail" /> `;
      document.querySelector('.chat-messages').appendChild(div); 
     }
}

// Add room name to DOM
function outputRoomName(room) {
  var title = document.querySelector('.login100-form-title');
  roomName.innerText = room;
  title.innerHTML =`<i class="fa fa-home">${room}</i>`;
    if(room.length > 6 && room.length < 12){
        title.style.fontSize = "30px";
    }
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

$(document).ready(function(){
   $(".fa-bars").click(function(){
      $(".roomInfo").toggle();
     });
   });

// Emoji-picker Code 

window.addEventListener('DOMContentLoaded', () => {
  const button1 = document.querySelector('#emoji-button');
  const picker = new EmojiButton(
    {
      emojiSize : "1.5em",
      emojisPerRow:6,
      style :"twemoji",
      position:"left-start",
      zIndex:999
    });

  picker.on('emoji', emoji => {
    document.querySelector('input').value += emoji;
  });

  button1.addEventListener('click', () => {
    picker.pickerVisible ? picker.hidePicker() : picker.showPicker(button1);
  });
});

let roomTitle = document.querySelector(".login100-form-title");
if(roomTitle.innerText.length > 5){
     alert()
}

