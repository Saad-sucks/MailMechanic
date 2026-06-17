# MailMechanic

An interactive web dashboard used to audit cold email text copies and domain setups before sending. 

## Features
- **Keyword Scanner:** Runs an internal text array comparison to highlight known marketing spam flags in red and updates a live health percentage score.
- **Domain Configuration Simulator:** Features a backend toggle interface to test and display the visual output of passing versus missing DNS records (SPF, DKIM, DMARC).
- **IP Status Widget:** A compact card illustrating network health and blacklisting indicators (SORBS DUHL).
- **Markdown Prompt Compiler:** Reads the active input errors, matches the specific flagged keyword arrays, and outputs a formatted prompt string to the clipboard so users can get quick copy rewrites in ChatGPT or Claude.

## Stack
- Frontend: HTML5, CSS3 (Custom Variables, Flexbox/Grid)
- Logic: Vanilla JavaScript (ES6 Document Listeners, Regular Expressions)
- UI Components: Checkbox wrapper logic inspired by Shoh2008 and panel structure elements via Uiverse.io.

## Running Locally
1. Clone the project:
   git clone https://github.com/saad-abdullah/MailMechanic.git
2. Open index.html directly in any browser. No build steps, installations, or API keys required.

---
Maintained by [@saad-abdullah](https://github.com/saad-abdullah)
