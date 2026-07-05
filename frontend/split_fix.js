const fs = require('fs');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

// The file is divided by // ==========================================
const blocks = js.split('// ==========================================');

let stateJS = '';
let filtersJS = '';
let searchJS = '';
let statsJS = '';
let cardsJS = '';
let chatbotJS = '';
let modalsJS = '';
let authJS = '';
let compareJS = '';

blocks.forEach(block => {
  if (block.includes('GLOBAL VARIABLES')) stateJS += block;
  else if (block.includes('CHATBOT MEMORY') || block.includes('CHATBOT') || block.includes('SMART KCET AI') || block.includes('TYPING EFFECT') || block.includes('ENTER KEY SUPPORT')) chatbotJS += block;
  else if (block.includes('ELEMENTS')) stateJS += block;
  else if (block.includes('LOAD FILTERS')) filtersJS += block;
  else if (block.includes('SEARCH COLLEGES') || block.includes('SORT RESULTS') || block.includes('CLEAR FILTERS')) searchJS += block;
  else if (block.includes('UPDATE STATISTICS')) statsJS += block;
  else if (block.includes('FAVORITES') || block.includes('RENDER RESULTS')) cardsJS += block;
  else if (block.includes('COMPARE')) compareJS += block;
  else if (block.includes('MODAL')) modalsJS += block;
  else if (block.includes('SIGNUP') || block.includes('LOGIN') || block.includes('LOGOUT') || block.includes('AUTO LOGIN') || block.includes('DASHBOARD')) authJS += block;
  else if (block.includes('SHOW TOAST')) authJS += block; // toast is shared
  else if (block.includes('window.onload')) searchJS += block;
});

// Since we split by // =====, we need to add them back if we want, but it's fine.
const wrap = (content) => content.trim();

fs.writeFileSync('assets/js/state.js', wrap(stateJS));
fs.writeFileSync('assets/js/components/filters.js', wrap(filtersJS));
fs.writeFileSync('assets/js/components/search.js', wrap(searchJS));
fs.writeFileSync('assets/js/components/stats.js', wrap(statsJS));
fs.writeFileSync('assets/js/components/cards.js', wrap(cardsJS));
fs.writeFileSync('assets/js/components/chatbot.js', wrap(chatbotJS));
fs.writeFileSync('assets/js/components/modals.js', wrap(modalsJS));
fs.writeFileSync('assets/js/components/auth.js', wrap(authJS));
fs.writeFileSync('assets/js/components/compare.js', wrap(compareJS));
fs.writeFileSync('assets/js/main.js', wrap(searchJS)); // searchJS has window.onload

console.log("Files generated successfully!");
