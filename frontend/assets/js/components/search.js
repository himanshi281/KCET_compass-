// ✅ SEARCH COLLEGES

// 🔄 SORT RESULTS

// 🧹 CLEAR FILTERS


const robotAssistant =
  document.getElementById(
    "robotAssistant"
  );

const chatbotPopup =
  document.getElementById(
    "chatbotPopup"
  );


window.onload = () => {

  loadFilters();

  setTimeout(() => {

    chatbotPopup.classList.remove(
      "hidden"
    );

  }, 1200);

};


robotAssistant.addEventListener(
  "click",
  toggleChatbot
);


function toggleChatbot() {

  chatbotPopup.classList.toggle(
    "hidden"
  );

}





function closeDashboard() {

  document
    .getElementById(
      "dashboardModal"
    )
    .classList.add(
      "hidden"
    );

}
window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const quota = urlParams.get('quota') || 'GM';
  const rank = urlParams.get('rank') || '';
  const branch = urlParams.get('branch') || '';
  const location = urlParams.get('location') || '';

  // Set values to hidden form
  if(quota) document.getElementById('quota').value = quota;
  if(rank) document.getElementById('rank').value = rank;

  // Build the display text
  let summaryText = `Showing results for `;
  summaryText += `<strong>Quota:</strong> ${quota}`;
  if (rank) summaryText += ` &nbsp;|&nbsp; <strong>Rank:</strong> ${rank}`;
  if (branch) summaryText += ` &nbsp;|&nbsp; <strong>Branch:</strong> ${branch}`;
  if (location) summaryText += ` &nbsp;|&nbsp; <strong>Location:</strong> ${location}`;
  
  const summaryEl = document.getElementById('searchParamsText');
  if (summaryEl) summaryEl.innerHTML = summaryText;

  setTimeout(() => {
    if(branch) document.getElementById('branch').value = branch;
    if(location) document.getElementById('location').value = location;
    searchColleges();
  }, 600);
};