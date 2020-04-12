import React from 'react';
import '../css/style.css';

const Notification = (props) => {
    const { message, type } = props;

    let output = null;
    let messageClass;

    if(type === 'SUCCESS') {
        messageClass = 'success notification';
    } else if(type === 'ERROR'){
        messageClass = 'error notification';
    } else if(type === 'INFO') {
        messageClass = 'info notification';
    } else {
        messageClass = '';
    }

    if(message !== '') {
        output = (
            <div className={messageClass}>
                {message}
            </div>
        );
    }

    return output;
}

export default Notification;
