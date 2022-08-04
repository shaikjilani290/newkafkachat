function joinNS(endpoint){
    if(nsSocket){
        nsSocket.close();
        document.querySelector('#user-input').removeEventListener('submit', formSubmition);
    }
nsSocket = io(`http://localhost:9000${endpoint}`);
nsSocket.on('nsRoomLoad', (nsRooms)=>{
    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = "";
    nsRooms.forEach((room)=>{
        let glyph = room.privateRoom?'lock':'globe';
        roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`
    });
    let roomNodes = document.getElementsByClassName('room');
    Array.from(roomNodes).forEach((element)=>{
        element.addEventListener('click', (event)=>{
            joinRoom(event.target.innerText);
        });
    });
    const topRoom = document.querySelector('.room');
    const topRoomName = topRoom.innerText;
    joinRoom(topRoomName);
});

nsSocket.on('messageToClients',(msg)=>{
    
    const newMsg = buildHTML(msg);
    document.querySelector('#messages').innerHTML += newMsg;
})
document.querySelector(".message-form").addEventListener('submit', formSubmition);

}

function formSubmition(event){
        event.preventDefault();
        const newMessage = document.querySelector("#user-message").value;
        nsSocket.emit('newMessage', {text: newMessage}); 
}

function buildHTML(msg){
    const convertedDate = new Date(msg.time).toLocaleString();
    const newHTML = `     
<li>
    <div class="user-image">
        <img src="${msg.avatar}" />
    </div>
    <div class="user-message">
        <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
        <div class="message-text">${msg.text}</div>
    </div>
</li>`;
    return newHTML;
}