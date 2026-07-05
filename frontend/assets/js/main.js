
// Theme Engine
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeButton(next);
}

function updateThemeButton(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
  }
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeButton(saved);
});


let globalSearchQuery = '';

window.handleGlobalSearch = function(e) {
  globalSearchQuery = (e.target.value || '').toLowerCase();
  renderResults(true);
};

// ==========================================
// ✅ GLOBAL VARIABLES
// ==========================================

let currentResults = [];
let favoriteColleges = [];



// ==========================================
// 🧠 CHATBOT MEMORY
// ==========================================

let chatbotMemory = {

  rank: null,

  branch: null,

  quota: "GM",

  location: null

};



// ==========================================
// ✅ ELEMENTS
// ==========================================

const branchSelect =
  document.getElementById("branch");

const locationSelect =
  document.getElementById("location");



// ==========================================
// ✅ LOAD FILTERS
// ==========================================

async function loadFilters() {

  try {

    const response =
      await fetch(
        "http://localhost:5000/api/colleges"
      );

    const colleges =
      await response.json();



    // LOAD BRANCHES

    const branchSet =
      new Set();

    colleges.forEach((college) => {

      college.courses?.forEach((course) => {

        if (course.courseName) {

          branchSet.add(
            course.courseName
          );

        }

      });

    });



    branchSelect.innerHTML = `

      <option value="">
        Select Branch
      </option>

    `;



    [...branchSet]
      .sort()
      .forEach((branch) => {

        branchSelect.innerHTML += `

          <option value="${branch}">
            ${branch}
          </option>

        `;

      });




    // LOAD LOCATIONS

    const locationSet =
      new Set();

    colleges.forEach((college) => {

      if (college.district) {

        locationSet.add(
          college.district
        );

      }

    });



    locationSelect.innerHTML = `

      <option value="">
        Select Location
      </option>

    `;



    [...locationSet]
      .sort()
      .forEach((location) => {

        locationSelect.innerHTML += `

          <option value="${location}">
            ${location}
          </option>

        `;

      });



    console.log(
      "✅ Filters Loaded"
    );

  }

  catch (error) {

    console.log(
      "❌ Filter Error:",
      error
    );

  }

}



// ==========================================
// ✅ SEARCH COLLEGES
// ==========================================

async function searchColleges() {

  const rank =
    document.getElementById("rank").value;

  const branch =
    document.getElementById("branch").value;

  const location =
    document.getElementById("location").value;

  const quota =
    document.getElementById("quota").value;


  const resultsDiv =
    document.getElementById("results");

  const resultCount =
    document.getElementById("resultCount");

  const statsPanel =
    document.getElementById("statsPanel");


  resultsDiv.innerHTML = `

    <div class="loader-container">

      <div class="loader"></div>

      <p>Searching colleges...</p>

    </div>

  `;


  try {

    const response =
      await fetch(

        `http://localhost:5000/api/colleges/search?rank=${rank}&branch=${branch}&location=${location}&quota=${quota}`

      );


    const colleges =
      await response.json();


    currentResults =
      colleges;


    if (
      colleges.length === 0
    ) {

      resultCount.innerHTML = "";

      statsPanel.innerHTML = "";

      resultsDiv.innerHTML = `

        <p class="no-results">

          No matching colleges found.

        </p>

      `;

      return;

    }


    resultCount.innerHTML = `

      Showing ${colleges.length} colleges

    `;


    updateStatistics();

    renderResults(true);

  }

  catch (error) {

    console.log(error);

    resultsDiv.innerHTML = `

      <p class="no-results">

        Error loading colleges.

      </p>

    `;

  }

}



// ==========================================
// ✅ UPDATE STATISTICS
// ==========================================

function updateStatistics() {

  const quota =
    document.getElementById("quota").value;

  const statsPanel =
    document.getElementById("statsPanel");


  const totalColleges =
    currentResults.length;


  const topCollege =
    currentResults[0]?.collegeName || "N/A";


  let totalCutoff = 0;

  let cutoffCount = 0;


  currentResults.forEach((college) => {

    college.matchingCourses?.forEach((course) => {

      const cutoff =
        course.cutoffs?.[quota];

      if (cutoff) {

        totalCutoff += cutoff;

        cutoffCount++;

      }

    });

  });



  const averageCutoff =

    cutoffCount > 0

      ? Math.round(
          totalCutoff / cutoffCount
        )

      : 0;


  statsPanel.innerHTML = `

    <div class="stat-card">

      <h2>${totalColleges}</h2>

      <p>Total Colleges</p>

    </div>


    <div class="stat-card">

      <h2>${averageCutoff}</h2>

      <p>Average Cutoff</p>

    </div>


    <div class="stat-card">

      <h2>${favoriteColleges.length}</h2>

      <p>Favorites</p>

    </div>


    <div class="stat-card">

      <h2>${topCollege}</h2>

      <p>Top College</p>

    </div>

  `;

}



// ==========================================
// ❤️ FAVORITES
// ==========================================

// ==========================================
// ❤️ TOGGLE FAVORITES
// ==========================================

function toggleFavorite(collegeName) {

  let favorites =
    JSON.parse(

      localStorage.getItem(
        "favorites"
      )

    ) || [];


  // ======================================
  // REMOVE FAVORITE
  // ======================================

  if (
    favorites.includes(
      collegeName
    )
  ) {

    favorites =
      favorites.filter(

        fav =>
          fav !== collegeName

      );

  }

  // ======================================
  // ADD FAVORITE
  // ======================================

  else {

    favorites.push(
      collegeName
    );

  }


  // ======================================
  // SAVE
  // ======================================

  localStorage.setItem(

    "favorites",

    JSON.stringify(
      favorites
    )

  );


  // ======================================
  // REFRESH UI
  // ======================================

  searchColleges();

}



// ==========================================
// 🔄 SORT RESULTS
// ==========================================

function sortResults() {

  const sortOption =
    document.getElementById(
      "sortOption"
    ).value;


  if (!currentResults.length)
    return;



  // SORT ALPHABETICALLY

  if (
    sortOption ===
    "alphabetical"
  ) {

    currentResults.sort((a, b) =>

      a.collegeName.localeCompare(
        b.collegeName
      )

    );

  }



  // SORT LOW TO HIGH

  else if (
    sortOption ===
    "lowToHigh"
  ) {

    const quota =
      document.getElementById(
        "quota"
      ).value;


    currentResults.sort((a, b) => {

      const aCutoff =
        a.matchingCourses?.[0]
          ?.cutoffs?.[quota] || 0;

      const bCutoff =
        b.matchingCourses?.[0]
          ?.cutoffs?.[quota] || 0;

      return aCutoff - bCutoff;

    });

  }



  // SORT HIGH TO LOW

  else if (
    sortOption ===
    "highToLow"
  ) {

    const quota =
      document.getElementById(
        "quota"
      ).value;


    currentResults.sort((a, b) => {

      const aCutoff =
        a.matchingCourses?.[0]
          ?.cutoffs?.[quota] || 0;

      const bCutoff =
        b.matchingCourses?.[0]
          ?.cutoffs?.[quota] || 0;

      return bCutoff - aCutoff;

    });

  }


  renderResults(true);
updateStatistics();

}



// ==========================================
// 🧹 CLEAR FILTERS
// ==========================================

function clearFilters() {

  document.getElementById(
    "rank"
  ).value = "";

  document.getElementById(
    "branch"
  ).selectedIndex = 0;

  document.getElementById(
    "location"
  ).selectedIndex = 0;

  document.getElementById(
    "quota"
  ).selectedIndex = 0;

  document.getElementById(
    "sortOption"
  ).selectedIndex = 0;



  document.getElementById(
    "results"
  ).innerHTML = "";

  document.getElementById(
    "resultCount"
  ).innerHTML = "";

  document.getElementById(
    "statsPanel"
  ).innerHTML = "";



  currentResults = [];



  chatbotMemory = {

    rank: null,

    branch: null,

    quota: "GM",

    location: null

  };



  console.log(
    "✅ Filters Cleared"
  );

}



// ==========================================
// ✅ RENDER RESULTS
// ==========================================


let currentPage = 1;
const itemsPerPage = 15;

function renderResults(resetPage = false) {
  if (resetPage) currentPage = 1;

  const quota = document.getElementById('quota').value;
  const userRank = Number(document.getElementById('rank').value);
  const resultsDiv = document.getElementById('results');

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Paginating overall results first
  let filteredData = currentResults;
    if (globalSearchQuery) {
      filteredData = currentResults.filter(c => {
        return (
          (c.collegeName || '').toLowerCase().includes(globalSearchQuery) ||
          (c.collegeCode || '').toLowerCase().includes(globalSearchQuery) ||
          (c.district || '').toLowerCase().includes(globalSearchQuery) ||
          (c.collegeType || '').toLowerCase().includes(globalSearchQuery)
        );
      });
    }

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = filteredData.slice(startIndex, endIndex);

  let safe = [];
  let moderate = [];
  let dream = [];

  paginatedResults.forEach((college) => {
    const firstCourse = college.matchingCourses?.[0];
    const cutoff = firstCourse?.cutoffs?.[quota] || 0;
    
    college.isFavorite = favorites.includes(college.collegeName);
    college.cutoff = cutoff;

    if (cutoff >= userRank + 10000) {
      college.status = 'Safe';
      safe.push(college);
    } else if (cutoff >= userRank) {
      college.status = 'Moderate';
      moderate.push(college);
    } else {
      college.status = 'Dream';
      dream.push(college);
    }
  });

  
  const renderCard = (c, index) => {
    const courseCount = c.matchingCourses ? c.matchingCourses.length : 0;
    return `
    <a href="college.html?id=${c._id}" onclick="sessionStorage.setItem('selectedCollege', JSON.stringify(currentResults.find(x => x._id === '${c._id}')));" class="college-card linear-card" style="animation-delay:${index * 0.03}s">
      <div class="card-header">
        <h3 class="card-title" title="${c.collegeName}">${c.collegeName}</h3>
        <button class="favorite-btn ${c.isFavorite ? 'active' : ''}" onclick="event.preventDefault(); toggleFavorite('${c.collegeName}');" title="Toggle Favorite">
          ${c.isFavorite ? '♥' : '♡'}
        </button>
      </div>
      <p class="card-subtitle">${c.district || 'Unknown Dist'} • ${c.collegeType || 'Unknown Type'}</p>
      
      <div class="card-tags">
        <span class="tag code-tag">${c.collegeCode || 'N/A'}</span>
        <span class="tag highlight-tag">${courseCount} Matching Course${courseCount !== 1 ? 's' : ''}</span>
      </div>
      
      <div class="card-footer">
        <span class="action-text">View Details →</span>
      </div>
    </a>
    `;
  };


  let html = '';

  if (safe.length > 0) {
    html += `<h2 class="category-header">Safe Colleges</h2><div class="category-grid">`;
    html += safe.map(renderCard).join('');
    html += `</div>`;
  }
  
  if (moderate.length > 0) {
    html += `<h2 class="category-header">Moderate Colleges</h2><div class="category-grid">`;
    html += moderate.map(renderCard).join('');
    html += `</div>`;
  }

  if (dream.length > 0) {
    html += `<h2 class="category-header">Dream Colleges</h2><div class="category-grid">`;
    html += dream.map(renderCard).join('');
    html += `</div>`;
  }

  if (filteredData.length === 0) {
    html = '<p>No colleges found matching your criteria.</p>';
  } else {
    // Render pagination controls
    // totalPages already calculated above
    html += `
      <div class="pagination-controls">
        <button onclick="changePage(-1)" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button onclick="changePage(1)" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
      </div>
    `;
  }

  resultsDiv.innerHTML = html;
}

window.changePage = function(delta) {
  const totalPages = Math.ceil(currentResults.length / itemsPerPage);
  const newPage = currentPage + delta;
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    renderResults();
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};


// ==========================================
// 🤖 CHATBOT TOGGLE
// ==========================================

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



// ==========================================
// 🤖 SMART KCET AI CHATBOT
// ==========================================

async function sendMessage() {

  const input =
    document.getElementById(
      "chatInput"
    );

  const message =
    input.value.trim();

  if (!message) return;


  const chatMessages =
    document.getElementById(
      "chatMessages"
    );


  chatMessages.innerHTML += `

    <div class="user-message">

      ${message}

    </div>

  `;


  input.value = "";


  chatMessages.scrollTop =
    chatMessages.scrollHeight;


  const lower =
    message.toLowerCase();


  let reply = "";


  try {

    const response =
      await fetch(
        "http://localhost:5000/api/colleges"
      );

    const colleges =
      await response.json();



    // SIMPLE QUESTIONS

    if (
      lower.includes("what is gmk")
    ) {

      reply =
        "🪪 GMK refers to Karnataka General Merit quota.";

    }

    else if (
      lower.includes("what is gmr")
    ) {

      reply =
        "🪪 GMR refers to Rural reservation quota in KCET.";

    }

    else if (
      lower.includes("what is gm")
    ) {

      reply =
        "🪪 GM stands for General Merit quota.";

    }

    else {

      const branchKeywords = {

        cse:
          "COMPUTER SCIENCE",

        cs:
          "COMPUTER SCIENCE",

        "computer science":
          "COMPUTER SCIENCE",

        aiml:
          "ARTIFICIAL INTELLIGENCE",

        ai:
          "ARTIFICIAL INTELLIGENCE",

        ece:
          "ELECTRONICS",

        mech:
          "MECHANICAL",

        civil:
          "CIVIL",

        ise:
          "INFORMATION SCIENCE"

      };



      let detectedBranch =
        chatbotMemory.branch;

      let detectedLocation =
        chatbotMemory.location;

      let detectedQuota =
        chatbotMemory.quota;

      let detectedRank =
        chatbotMemory.rank;



      // DETECT BRANCH

      for (const key in branchKeywords) {

        if (
          lower.includes(key)
        ) {

          detectedBranch =
            branchKeywords[key];

          chatbotMemory.branch =
            detectedBranch;

          break;

        }

      }



      // DETECT LOCATION

      colleges.forEach((college) => {

        if (

          college.district &&

          lower.includes(
            college.district.toLowerCase()
          )

        ) {

          detectedLocation =
            college.district;

          chatbotMemory.location =
            detectedLocation;

        }

      });



      // DETECT RANK

      const rankMatch =
        lower.match(/\d+/);


      if (rankMatch) {

        detectedRank =
          Number(rankMatch[0]);

        chatbotMemory.rank =
          detectedRank;

      }



      // DETECT QUOTA

      if (
        lower.includes("gmk")
      ) {

        detectedQuota =
          "GMK";

        chatbotMemory.quota =
          "GMK";

      }

      else if (
        lower.includes("gmr")
      ) {

        detectedQuota =
          "GMR";

        chatbotMemory.quota =
          "GMR";

      }



      // FILTER COLLEGES

      let matchedColleges =
        colleges;


      if (detectedLocation) {

        matchedColleges =
          matchedColleges.filter(

            (college) =>

              college.district ===
              detectedLocation

          );

      }


      if (detectedBranch) {

        matchedColleges =
          matchedColleges.filter(

            (college) =>

              college.courses?.some(

                (course) =>

                  course.courseName
                    ?.toUpperCase()
                    .includes(
                      detectedBranch
                    )

              )

          );

      }



 // ======================================
// SAFE / MODERATE / DREAM DETECTION
// ======================================

let recommendationType = "";



// SAFE

if (

  lower.includes("safe college") ||

  lower.includes("safe colleges") ||

  lower.includes("safe")

) {

  recommendationType = "safe";

}



// MODERATE

else if (

  lower.includes("moderate college") ||

  lower.includes("moderate colleges") ||

  lower.includes("moderate")

) {

  recommendationType = "moderate";

}



// DREAM

else if (

  lower.includes("dream college") ||

  lower.includes("dream colleges") ||

  lower.includes("dream")

) {

  recommendationType = "dream";

}



      // RANK FILTERING

      if (detectedRank) {

        matchedColleges =
          matchedColleges.filter(

            (college) => {

              return college.courses?.some(

                (course) => {

                  const cutoff =
                    course.cutoffs?.[
                      detectedQuota
                    ];

                  if (!cutoff)
                    return false;



                  if (
                    recommendationType ===
                    "safe"
                  ) {

                    return (
                      cutoff >=
                      detectedRank + 10000
                    );

                  }



                  if (
                    recommendationType ===
                    "moderate"
                  ) {

                    return (

                      cutoff >=
                        detectedRank -

                          3000 &&

                      cutoff <=
                        detectedRank +

                          3000

                    );

                  }



                  if (
                    recommendationType ===
                    "dream"
                  ) {

                    return (
                      cutoff <
                      detectedRank
                    );

                  }



                  return (
                    cutoff >=
                    detectedRank
                  );

                }

              );

            }

          );

      }



      // FINAL REPLY

      if (
        lower.includes("safe") &&
        !detectedRank
      ) {

        reply =
          "😄 Please tell me your KCET rank first so I can suggest safe colleges.";

      }

      else if (
        lower.includes("college") &&
        !detectedBranch
      ) {

        reply =
          "😄 Which branch are you interested in?";

      }

      else if (
        matchedColleges.length > 0
      ) {

        const topColleges =
          matchedColleges.slice(0, 5);


        const names =
          topColleges

            .map((college) => {

              return `• ${college.collegeName}`;

            })

            .join("<br>");



        if (
          recommendationType ===
          "safe"
        ) {

          reply = `

            🟢 Safe colleges for you:

            <br><br>

            ${names}

          `;

        }

        else if (
          recommendationType ===
          "moderate"
        ) {

          reply = `

            🟡 Moderate colleges for your profile:

            <br><br>

            ${names}

          `;

        }

        else if (
          recommendationType ===
          "dream"
        ) {

          reply = `

            🔥 Dream colleges you can try:

            <br><br>

            ${names}

          `;

        }

        else {

          reply = `

            🎓 Based on your profile, these colleges look suitable:

            <br><br>

            ${names}

          `;

        }

      }

      else {

        reply =
          "😭 I couldn't find matching colleges.";

      }

    }

  }

  catch (error) {

    console.log(error);

    reply =
      "😭 Server error.";

  }



  // ==========================================
  // 🤖 TYPING EFFECT
  // ==========================================

  const typingId =
    "typing-" + Date.now();


  chatMessages.innerHTML += `

    <div
      class="bot-message"
      id="${typingId}"
    >

      ✍️ Typing...

    </div>

  `;


  chatMessages.scrollTop =
    chatMessages.scrollHeight;


  setTimeout(() => {

    const typingDiv =
      document.getElementById(
        typingId
      );


    if (typingDiv) {

      typingDiv.innerHTML =
        reply;

    }


    chatMessages.scrollTop =
      chatMessages.scrollHeight;

  }, 1200);

}



// ==========================================
// ⌨️ ENTER KEY SUPPORT
// ==========================================

document
  .getElementById("chatInput")
  .addEventListener(
    "keypress",
    function(event) {

      if (event.key === "Enter") {

        sendMessage();

      }

    }
  );



// ==========================================
// ✅ LOAD FILTERS ON START
// ==========================================

loadFilters();
// ==========================================
// ⭐ LOAD COMPARE DROPDOWNS
// ==========================================

async function loadCompareColleges() {

  try {

    const response =
      await fetch(
        "http://localhost:5000/api/colleges"
      );

    const colleges =
      await response.json();


    const select1 =
      document.getElementById(
        "compareCollege1"
      );

    const select2 =
      document.getElementById(
        "compareCollege2"
      );


    colleges.forEach((college) => {

      const option1 =
        document.createElement(
          "option"
        );

      option1.value =
        college.collegeName;

      option1.textContent =
        college.collegeName;


      const option2 =
        document.createElement(
          "option"
        );

      option2.value =
        college.collegeName;

      option2.textContent =
        college.collegeName;


      select1.appendChild(
        option1
      );

      select2.appendChild(
        option2
      );

    });

  }

  catch (error) {

    console.log(error);

  }

}



// ==========================================
// ⚔ COMPARE COLLEGES
// ==========================================

async function compareColleges() {

  const college1 =
    document.getElementById(
      "compareCollege1"
    ).value;

  const college2 =
    document.getElementById(
      "compareCollege2"
    ).value;


  if (
    !college1 || !college2
  ) {

    showToast(
      "Please select both colleges"
    );

    return;

  }


  try {

    const response =
      await fetch(
        "http://localhost:5000/api/colleges"
      );

    const colleges =
      await response.json();


    const firstCollege =
      colleges.find(

        (college) =>

          college.collegeName ===
          college1

      );

    const secondCollege =
      colleges.find(

        (college) =>

          college.collegeName ===
          college2

      );


    const compareResults =
      document.getElementById(
        "compareResults"
      );


    compareResults.innerHTML = `

      <div class="compare-result-card">

        <div class="compare-card">

          <h3>
            ${firstCollege.collegeName}
          </h3>

          <p>
            <strong>District:</strong>
            ${firstCollege.district}
          </p>

          <p>
            <strong>Type:</strong>
            ${firstCollege.collegeType}
          </p>

          <p>
            <strong>Courses:</strong>
          </p>

          <ul>

            ${firstCollege.courses
              ?.slice(0, 5)
              .map((course) => `

                <li>
                  ${course.courseName}
                </li>

              `)
              .join("")}

          </ul>
    </a>



        <div class="compare-card">

          <h3>
            ${secondCollege.collegeName}
          </h3>

          <p>
            <strong>District:</strong>
            ${secondCollege.district}
          </p>

          <p>
            <strong>Type:</strong>
            ${secondCollege.collegeType}
          </p>

          <p>
            <strong>Courses:</strong>
          </p>

          <ul>

            ${secondCollege.courses
              ?.slice(0, 5)
              .map((course) => `

                <li>
                  ${course.courseName}
                </li>

              `)
              .join("")}

          </ul>
    </a>

      </div>

    `;

  }

  catch (error) {

    console.log(error);

  }

}



// ==========================================
// ✅ LOAD ON START
// ==========================================

loadCompareColleges();
// ==========================================
// ⭐ OPEN COLLEGE MODAL
// ==========================================

function openCollegeModal(collegeId) {

  const college =
    currentResults.find(

      (item) =>
        item._id === collegeId

    );


  if (!college) return;


  const modal =
    document.getElementById(
      "collegeModal"
    );

  const modalBody =
    document.getElementById(
      "modalBody"
    );


  modalBody.innerHTML = `

    <h1>
      ${college.collegeName}
    </h1>

    <p>
      <strong>College Code:</strong>
      ${college.collegeCode}
    </p>

    <p>
      <strong>District:</strong>
      ${college.district}
    </p>

    <p>
      <strong>Type:</strong>
      ${college.collegeType}
    </p>


    <h2 style="margin-top:25px;">

      Courses & Cutoffs

    </h2>


    ${college.courses?.map((course) => `

      <div class="modal-course">

        <h4>
          ${course.courseName}
        </h4>

        <p>
          GM:
          ${course.cutoffs?.GM || "N/A"}
        </p>

        <p>
          GMK:
          ${course.cutoffs?.GMK || "N/A"}
        </p>

        <p>
          GMR:
          ${course.cutoffs?.GMR || "N/A"}
        </p>

      </div>

    `).join("")}

  `;


  modal.classList.remove(
    "hidden"
  );

}



// ==========================================
// ❌ CLOSE MODAL
// ==========================================

function closeCollegeModal() {

  document
    .getElementById(
      "collegeModal"
    )
    .classList.add(
      "hidden"
    );

}
// ==========================================
// 🔐 OPEN/CLOSE MODALS
// ==========================================

function openSignupModal() {

  document
    .getElementById(
      "signupModal"
    )
    .classList.remove(
      "hidden"
    );

}


function closeSignupModal() {

  document
    .getElementById(
      "signupModal"
    )
    .classList.add(
      "hidden"
    );

}


function openLoginModal() {

  document
    .getElementById(
      "loginModal"
    )
    .classList.remove(
      "hidden"
    );

}


function closeLoginModal() {

  document
    .getElementById(
      "loginModal"
    )
    .classList.add(
      "hidden"
    );

}



// ==========================================
// 🔐 SIGNUP
// ==========================================

async function signupUser() {

  const name =
    document.getElementById(
      "signupName"
    ).value;

  const email =
    document.getElementById(
      "signupEmail"
    ).value;

  const password =
    document.getElementById(
      "signupPassword"
    ).value;


  try {

    const response =
      await fetch(

        "http://localhost:5000/api/auth/signup",

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            name,

            email,

            password

          })

        }

      );


    const data =
      await response.json();


    showToast(data.message);


    if (data.success) {

      closeSignupModal();

    }

  }

  catch (error) {

    console.log(error);

  }

}



// ==========================================
// 🔐 LOGIN
// ==========================================

async function loginUser() {

  const email =
    document.getElementById(
      "loginEmail"
    ).value;

  const password =
    document.getElementById(
      "loginPassword"
    ).value;


  try {

    const response =
      await fetch(

        "http://localhost:5000/api/auth/login",

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            email,

            password

          })

        }

      );


    const data =
      await response.json();


    showToast(data.message);


    if (data.success) {

      localStorage.setItem(

        "currentUser",

        JSON.stringify(data.user)

      );


      document.getElementById(
        "welcomeUser"
      ).innerHTML =

        `Welcome, ${data.user.name}`


      document.getElementById(
        "logoutBtn"
      ).style.display =
        "block";
        document.getElementById(
  "dashboardBtn"
).style.display =
  "block";
        document.querySelector(
  ".auth-buttons button:nth-child(1)"
).style.display = "none";


document.querySelector(
  ".auth-buttons button:nth-child(2)"
).style.display = "none";


      closeLoginModal();

    }

  }

  catch (error) {

    console.log(error);

  }

}



// ==========================================
// 🔐 LOGOUT
// ==========================================

function logoutUser() {

  localStorage.removeItem(
    "currentUser"
  );


  document.getElementById(
    "welcomeUser"
  ).innerHTML = "";


  document.getElementById(
    "logoutBtn"
  ).style.display =
    "none";
    document.getElementById(
  "dashboardBtn"
).style.display =
  "none";
    document.querySelector(
  ".auth-buttons button:nth-child(1)"
).style.display = "block";


document.querySelector(
  ".auth-buttons button:nth-child(2)"
).style.display = "block";

}



// ==========================================
// 🔐 AUTO LOGIN
// ==========================================

window.addEventListener(
  "load",

  () => {

    const user =
      JSON.parse(

        localStorage.getItem(
          "currentUser"
        )

      );


    if (user) {

      document.getElementById(
        "welcomeUser"
      ).innerHTML =

        `Welcome, ${user.name}`;


      document.getElementById(
        "logoutBtn"
      ).style.display =
        "block";
        document.getElementById(
  "dashboardBtn"
).style.display =
  "block";
        document.querySelector(
  ".auth-buttons button:nth-child(1)"
).style.display = "none";


document.querySelector(
  ".auth-buttons button:nth-child(2)"
).style.display = "none";

    }

  }

);
// ==========================================
// 🔔 SHOW TOAST
// ==========================================

function showToast(message) {

  const toast =
    document.getElementById(
      "toast"
    );


  toast.innerHTML =
    message;


  toast.classList.add(
    "show"
  );


  setTimeout(() => {

    toast.classList.remove(
      "show"
    );

  }, 3000);

}
// ==========================================
// 🔔 SHOW TOAST
// ==========================================

function showToast(message) {

  const toast =
    document.getElementById(
      "toast"
    );


  toast.innerHTML =
    message;


  toast.classList.add(
    "show"
  );


  setTimeout(() => {

    toast.classList.remove(
      "show"
    );

  }, 3000);

}
// ==========================================
// 🧹 CLEAR COMPARE
// ==========================================

function clearCompare() {

  document.getElementById(
    "compareCollege1"
  ).selectedIndex = 0;


  document.getElementById(
    "compareCollege2"
  ).selectedIndex = 0;


  document.getElementById(
    "compareResults"
  ).innerHTML = "";


  showToast(
    "Compare cleared"
  );

}
// ==========================================
// 👤 OPEN DASHBOARD
// ==========================================

function openDashboard() {

  const user =
    JSON.parse(

      localStorage.getItem(
        "currentUser"
      )

    );


  if (!user) {

    showToast(
      "Please login first"
    );

    return;

  }


  const favorites =
    JSON.parse(

      localStorage.getItem(
        "favorites"
      )

    ) || [];


  document.getElementById(
    "dashboardContent"
  ).innerHTML = `

    <div class="dashboard-card">

      <h3>
        Welcome
      </h3>

      <p>
        👤 ${user.name}
      </p>

      <p>
        📧 ${user.email}
      </p>

    </div>



    <div class="dashboard-card">

      <h3>
        Favorites
      </h3>

      <p>
        ❤️ ${favorites.length}
        favorite colleges
      </p>

    </div>



    <div class="dashboard-card">

      <h3>
        KCET Insights
      </h3>

      <p>
        🔥 Exploring colleges smarter
      </p>

      <p>
        🎯 Personalized dashboard active
      </p>

    </div>

  `;


  document
    .getElementById(
      "dashboardModal"
    )
    .classList.remove(
      "hidden"
    );

}



// ==========================================
// 👤 CLOSE DASHBOARD
// ==========================================

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

  if(quota) document.getElementById('quota').value = quota;
  if(rank) document.getElementById('rank').value = rank;

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
