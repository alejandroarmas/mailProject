export function clear_compose_form() {
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  }


export function createEmailComposeAlert(jsonResponse) {

    const message = document.createElement("div")
    message.className = "alert alert-";

    let messageText = null
  
    if (jsonResponse.hasOwnProperty("message")) {
      message.className += "success";
      messageText = jsonResponse["message"]
    } else {
      message.className += "danger";
      messageText = jsonResponse["error"]
    }
  
    message.innerHTML = messageText
  
    return message;
  }


export function createNotification(type, emailId) {

    const notification = document.createElement("span")
    notification.setAttribute("data-id", emailId)
    let badge = "badge badge-"


    if (type === "unread") {
      notification.className = badge + "warning"
      notification.innerHTML = "Unread"
    }
    else if (type === "read"){
        notification.className = badge + "success"
        notification.innerHTML = "Read"

    }
    else if (type === "archived"){
      notification.className =  badge + "info"
      notification.innerHTML = "Archived"
    }
  
    return notification
  }