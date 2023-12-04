
let timeout;
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
    logMessage545('Coordinator', 'Participants', message);
     // Create a new paragraph element
     const paragraph = document.createElement('p');
     // Set the HTML content of the paragraph
     paragraph.innerHTML = message;
     // Append the paragraph to the cordinatorPrepare element
     const cordinatorPrepare = document.getElementById('cordinatorPrepare');
     cordinatorPrepare.appendChild(paragraph);
  }
  function displayCommitMessage545(message) {
    
    // Create a new paragraph element
    const paragraph = document.createElement('p');
    // Set the HTML content of the paragraph
    paragraph.innerHTML = message;
    // Append the paragraph to the cordinatorPrepare element
    const cordinatorPrepare = document.getElementById('cordinatorCommit');
    cordinatorPrepare.appendChild(paragraph);
  }

  function prepareToCommit545() {
    createParticipantInput545(1);
    createParticipantInput545(2);
  }
  
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
    checkmark.style.display = 'none'; // Initially hidden


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
    inputContainer.appendChild(document.createElement('br')); // Line break
}

  let readyCount = 0;
  
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
      if(readyCount ===2 ){
        secondContainer545();
        resetTimer545();
        logMessage545('Coordinator', 'Participants', 'C,1, commit');
        logMessage545('Coordinator', 'Participants', 'C,2, commit');
      }
    } else {
        checkmark.style.display = 'none';
      // Display alert for other input than "readyToCommit"
      alert(`All of the participants did not vote "readyToCommit", therefore transaction is aborted. Page will now refresh.`);
      location.reload();
    }
  } else {
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

let commitCount =0;

function handleCommitResponse545(participantID, inputField, checkmark) {
    const messageType2 = inputField.value;
    logMessage545(`Participant ${participantID}`, 'Coordinator', `C, ${participantID}, ${messageType2}`);
    // Validate messageType
  if (['readyToCommit', 'abort', 'commit', 'timeout'].includes(messageType2)) {

    // Check if the input is "readyToCommit"
    if (messageType2 === 'commit') {
        //show checkmark
        checkmark.style.display = 'inline';
      
      commitCount++;
      if(commitCount ===2 ){
        success545();
        clearInterval(timeout);
        
      }
    } else {
        // show x when incorrect input
        checkmark.style.display = 'none';
      // Display alert for other input than "readyToCommit"
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
  
  function success545() {
    const successMessage = document.createElement('p');
    successMessage.textContent = 'Transaction committed successfully!';
    const secondInputContainer = document.getElementById('secondParticipantResponses');
    secondInputContainer.appendChild(successMessage);
  
    // Save the log to MongoDB
    const logData = writeAheadLog545.getLog();
    saveLogToMongoDB545(logData);
  }

  function logMessage545(sender, id, messageType) {
    writeAheadLog545.addMessage(sender, id, messageType);
  }
  function logDisplay545(){
    console.log(writeAheadLog545);
  }

  async function saveLogToMongoDB545(logData) {
    try {
      const response = await fetch('http://localhost:4200/save-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logData }), // Pass the log data in the request body
      });
  
      const result = await response.text();
      console.log(result);
    } catch (err) {
      console.error('Error saving log to MongoDB:', err);
    }
  }