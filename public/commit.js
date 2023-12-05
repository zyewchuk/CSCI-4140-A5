 // timer set to 20 seconds
let countdownValue = 20;

function startTransaction545() {
    // Simulate starting the transaction
    console.log('Transaction started');
    displayPrepareMessage545('P, 1, prepareToCommit');
    displayPrepareMessage545('P, 2, prepareToCommit');

      // Start the countdown
    updateCountdown545();
    timeout = setInterval(() => {
        updateCountdown545();
        countdownValue--;

        if (countdownValue < 0) {
            // Timeout function to be executed after 20 seconds
            handleTimeout545();
        }
    }, 2000); // Update every 1 second
  }
  // Function to reset the timer
    function resetTimer545() {
        countdownValue = 20;
        updateCountdown545();
  }

  function updateCountdown545() {
    // Update the countdown value on the UI
    document.getElementById('countdown').textContent = countdownValue;
  }

  function handleTimeout545() {
    // Handle the timeout event by aborting the transaction
    alert('Participants did not respond in time which resulted in a timeout and the transaction is now aborted. Page will now refresh.');
    location.reload();
  }
  
  function displayPrepareMessage545(message) {
    // logging messages into writeAheadLog
    logMessage545('Coordinator', 'Participants', message);
     const paragraph = document.createElement('p');
     paragraph.innerHTML = message;
     const cordinatorPrepare = document.getElementById('cordinatorPrepare');
     cordinatorPrepare.appendChild(paragraph);
  }
  // displying commit message from the cordinator
  function displayCommitMessage545(message) {
    logMessage545('Coordinator', 'Participants', message);
    const paragraph = document.createElement('p');
    paragraph.innerHTML = message;
    const cordinatorPrepare = document.getElementById('cordinatorCommit');
    cordinatorPrepare.appendChild(paragraph);
  }
  // initializing input for participant
  function prepareToCommit545() {
    createParticipantInput545(1);
    createParticipantInput545(2);
  }
  // function to create input fields for participant
  function createParticipantInput545(participantID, container, isSecondSet) {
    const inputContainer = container || document.getElementById('participantResponses');

    const label = document.createElement('label');
    label.textContent = `C, ${participantID}, `;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'readyToCommit, abort, commit, timeout';
    input.id = `participant${participantID}Input`;

    const checkmark = document.createElement('span');
    checkmark.innerHTML = '✓';
    checkmark.style.color = 'green';
    checkmark.style.fontSize = '2.5em'
    checkmark.style.display = 'none'; 


    const submitButton = document.createElement('button');
    submitButton.textContent = isSecondSet ? 'Submit Commit' : 'Submit Response';
    // Conditionally assign the onclick function
    if (!isSecondSet) {
        submitButton.onclick = () => handleParticipantResponse545(participantID, input, checkmark);
    } else {
        // Create a new function for the second set of buttons
        submitButton.onclick = () => handleCommitResponse545(participantID, input, checkmark, isSecondSet);
    }
    // Add line breaks between elements for better layout
    inputContainer.appendChild(label);
    inputContainer.appendChild(input);
    inputContainer.appendChild(submitButton);
    inputContainer.appendChild(checkmark);
    inputContainer.appendChild(document.createElement('br')); 
}
  // count for amount of correct responses
  let readyCount = 0;
  // handle participant first resoponse
  function handleParticipantResponse545(participantID, inputField, checkmark) {
  const messageType = inputField.value;
  logMessage545(`Participant ${participantID}`, 'Coordinator', `C, ${participantID}, ${messageType}`);
  // Validate messageType
  if (['readyToCommit', 'abort', 'commit', 'timeout'].includes(messageType)) {

    // Check if the input is "readyToCommit"
    if (messageType === 'readyToCommit') {
        //show checkmark
        checkmark.style.display = 'inline';
      // Display message for commit 
      displayCommitMessage545(`P, ${participantID}, commit`);
      readyCount++;
      // if there are two correct readyToCommit responses
      if(readyCount ===2 ){

        secondContainer545();
        resetTimer545();
        
      }
    } else {
        checkmark.style.display = 'none';
      // error checking to make sure that responses are readyToCommit if not, transaction aborted
      alert(`All of the participants did not vote "readyToCommit", therefore transaction is aborted. Page will now refresh.`);
      location.reload();
    }
  } else {
    // input validation
    console.error('Invalid messageType entered');

    // Hide checkmark
    checkmark.style.display = 'none';
    // Display alert for invalid input
    alert('Invalid input. Please enter "readyToCommit", "abort", "timeout", or "commit"');
  }
}

function secondContainer545() {
    // Create a new container for the second set of input fields
    const secondInputContainer = document.createElement('div');
    secondInputContainer.id = 'secondParticipantResponses';

    // Append the new container below cordinatorCommit
    const cordinatorCommit = document.getElementById('cordinatorCommit');
    cordinatorCommit.parentNode.appendChild(secondInputContainer);

    // Create new input fields for the next phase
    createParticipantInput545(1, secondInputContainer, true); // Pass true for isSecondSet
    createParticipantInput545(2, secondInputContainer, true); // Pass true for isSecondSet
}
//count for correct amount of commit messages
let commitCount =0;
// handling commit responses by participant
function handleCommitResponse545(participantID, inputField, checkmark) {
    const messageType2 = inputField.value;
    logMessage545(`Participant ${participantID}`, 'Coordinator', `C, ${participantID}, ${messageType2}`);
    // Validate messageType
  if (['readyToCommit', 'abort', 'commit', 'timeout'].includes(messageType2)) {

    // Check if the input is "commit"
    if (messageType2 === 'commit') {
        //show checkmark
        checkmark.style.display = 'inline';
      
      commitCount++;
      if(commitCount ===2 ){
        success545();
        clearInterval(timeout);
        
      }
    } else {
      
        checkmark.style.display = 'none';
      alert(`All of the participants did not vote "commit", therefore transaction is aborted. Page will now refresh.`);
      location.reload();
    }
  } else {
    console.error('Invalid messageType entered');
    // Hide checkmark
    checkmark.style.display = 'none';
    // Display alert for invalid input
    alert('Invalid input. Please enter "readyToCommit", "abort", "timeout" or "commit"');
  }
  }
  // function for when all fields are correct
  function success545() {
    const successMessage = document.createElement('p');
    successMessage.textContent = 'Transaction committed successfully!';
    const secondInputContainer = document.getElementById('secondParticipantResponses');
    secondInputContainer.appendChild(successMessage);
  
    // Save the log to MongoDB
    const logData = writeAheadLog545.getLog();
    saveLogToMongoDB545(logData);
  }
  // logging into writeAheadLog
  function logMessage545(sender, receiver, messageType) {
    writeAheadLog545.addMessage(sender, receiver, messageType);
  }
  //displaying log on console when toggles
  function logDisplay545(){
    console.log(writeAheadLog545);
  }
    // Define a global variable for the base URL
  let baseUrl = 'http://localhost:4200';

  // Function to set the base URL
  function setBaseUrl(url) {
    baseUrl = url;
  }
  // writting data to mongoDb database
  async function saveLogToMongoDB545(logData) {
    try {
      // Set the base URL before making the request
      setBaseUrl('https://morning-garden-77909-7c27190c9f61.herokuapp.com');
  
      const response = await fetch(`${baseUrl}/save-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logData }),
      });
  
      const result = await response.text();
      console.log(result);
    } catch (err) {
      console.error('Error saving log to MongoDB:', err);
    }
  }
  