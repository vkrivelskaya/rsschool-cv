const selectors = {
    MESSAGE: '#message',
    USER_NAME: '#username',
    SEND_MESSAGE_BTN: '#send-message',
    CHANGE_USER: '#send-username',
    CHAT: '#chatroom',
    FEEDBACK: '#feedback',
};

const socket = io.connect('http://localhost:3000');
let userName = 'Anonymous';

socket.on('chat', function(data) {
    const chatroomElement = document.querySelector(selectors.CHAT);
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

    chatroomElement.innerHTML +=
    `<p class='message-line'>${data.userName}: ${data.message}</p>
    <span class='message-line'>${formattedTime}</span>`;
});

socket.on('typing', function (data) {
    const feedbackElement = document.querySelector(selectors.FEEDBACK);
    const { isTyping, userName } = data;

    if (!isTyping) {
        feedbackElement.innerHTML = "";
        return;
    }

    feedbackElement.innerHTML = `<p><em>${userName} is typing</em></p>`;
});

function init() {
    const messageElement = document.querySelector(selectors.MESSAGE);
    const userNameElement= document.querySelector(selectors.USER_NAME);
    const sendMessageBtn = document.querySelector(selectors.SEND_MESSAGE_BTN);
    const sendUserNameBtn = document.querySelector(selectors.CHANGE_USER);

    sendMessageBtn.addEventListener('click', () => {
        socket.emit('chat', {
            message: message.value,
            userName: userName
        });
        messageElement.value = '';
    });

    messageElement.addEventListener('keyup', () => {
        socket.emit('typing', {
          isTyping: messageElement.value.length > 0,
          userName: userName,
        });
      });

    sendUserNameBtn.addEventListener('click', () => {
        userName = userNameElement.value;
        userNameElement.value = '';
    });
}

init();