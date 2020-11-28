import { clear_compose_form, createEmailComposeAlert, createNotification } from "./utils.js";


document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  clear_compose_form()

  document.querySelector("#compose-form").addEventListener('submit', (event) => {

    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    fetch("/emails", {
      method: "POST",
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(jsonResponse => {

      const message = createEmailComposeAlert(jsonResponse);

      let alert = document.querySelector(".alert")
      if (alert !== null) {
        alert.replaceWith(message)
      } else {
        document.querySelector("#compose-view").insertBefore(message, document.querySelector("#compose-form"))
      }

      clear_compose_form()
    })

    event.preventDefault();
    return false;
  });

}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3> ${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`, {
    method: "GET"
  })
  .then(response => response.json())
  .then(emailsData => showAllEmailPreviews(emailsData, mailbox))

}


function showAllEmailPreviews(data, mailbox) {

  const emailsContainer = document.createElement("ul");
  emailsContainer.className = "list-group";
  emailsContainer.addEventListener("click", event => displayEmail(event));
  // emailsContainer.addEventListener("click", event => printstuff("Hello World"));
  // emailsContainer.addEventListener("click", event => setEmailRead(event.currentTarget.id) );

  data.forEach(emaildata => {

    const email = createEmailPreview(emaildata, mailbox);
    emailsContainer.appendChild(email)

  });

  document.querySelector('#emails-view').append(emailsContainer)

}


function createEmailPreview(emaildata , mailbox) {

  const emailPreview = document.createElement("li")
  emailPreview.addEventListener("click", event => displayEmail(event));
  const emailPreviewContent = document.createElement("h5")
  const userDidSend = (mailbox === "sent")
  let otherUsers = null;

  if (userDidSend){
    otherUsers = emaildata["recipients"];

  } 
  else {
    otherUsers = emaildata["sender"];
    emailPreview.appendChild(createNotification("unread"));
  }

  emailPreview.id = emaildata["id"]
  emailPreview.className = "list-group-item list-group-item-action list-group-item-light";
  emailPreviewContent.innerHTML = `${otherUsers} - ${emaildata["subject"]} - ${emaildata["body"] } - ${emaildata["timestamp"] }` 
  emailPreviewContent.style.textOverflow = "ellipsis"
  emailPreview.appendChild(emailPreviewContent)

  return emailPreview;
}


function displayEmail(event) {
  if (event.currentTarget) {
  

    const emailTitle = document.querySelector("#emailTitle")
    const emailInfo = document.querySelector("#emailInfo")
    const emailBody = document.querySelector("#modalBody")

    event.stopPropagation()
    
    fetch("emails/" + event.currentTarget.id, {
      method: "GET"
    })
    .then(response => response.json())
    .then(data => {
      emailTitle.innerHTML = data["subject"]
      emailInfo.innerHTML = `via ${data["sender"]} at ${data["timestamp"]}`
      emailBody.innerHTML = data["body"]
      $('#email').modal({
        show: true,
        keyboard: true
      })
    })

  }
}



function setEmailRead(emailId) {
  
  fetch(`emails/${emailId}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))

}


function setEmailArchive(emailId, archived=True) {
  
  fetch(`emails/${emailId}`, {
    method: "PUT",
    body: JSON.stringify({
      archived: archived
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))

}



