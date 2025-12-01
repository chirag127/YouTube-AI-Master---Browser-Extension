---
name: 🐛 Bug Report
abel: true
labels: bug, triage
assignees: ""

---

## 🚨 APEX BUG REPORT SUBMISSION PROTOCOL

Thank you for reporting an issue in the **YouTube-AI-Navigator-Browser-Extension**. We enforce strict **Zero-Defect** standards. Please provide maximum signal density to allow for rapid resolution.

### 1. CRITICAL CONTEXT & SEVERITY

**1.1. Severity Assessment (Select One):**

* [ ] **CRITICAL (P0):** Extension crash, data loss, security vulnerability, or core feature completely non-functional.
* [ ] **HIGH (P1):** Major feature degraded, incorrect AI output (high hallucination rate), or significant performance impact.
* [ ] **MEDIUM (P2):** UI glitch, minor incorrect data display, or non-critical feature failure.
* [ ] **LOW (P3):** Typo, cosmetic issue, or request for enhancement/clarification.

**1.2. Affected Environment (Mandatory):**

* **Browser:** [e.g., Chrome 125.0.6422.142, Firefox 128.0]
* **Operating System:** [e.g., Windows 11, macOS Sonoma 14.5]
* **Extension Version:** [If known, e.g., v1.2.5 or hash/commit ID]
* **Is this reproducible in Incognito/Private Mode?** [Yes/No]

### 2. REPLICATION STEPS (THE MINIMAL REPRODUCIBLE EXAMPLE)

Provide the **EXACT** sequence of actions required to trigger the bug. Use numbered steps. If a specific URL is required, provide it.

1. Navigate to `https://www.youtube.com/watch?v=XXXXXXXXXXX`.
2. Click the extension icon (if applicable).
3. Execute the 'Get Gemini Summary' command.
4. Observe that [Expected Result] vs [Actual Result].

### 3. EXPECTED VS. ACTUAL BEHAVIOR

**Expected Behavior (As defined by SOLID/DRY principles):**

> [Describe precisely what should have happened. Example: The AI summary panel should render within 500ms using the Gemini 3.0 API endpoint.]

**Actual Behavior (The Artifact of Failure):**

> [Describe precisely what happened. Example: The panel renders but shows a persistent "API Timeout" error (HTTP 504) or the wrong summary text.]

### 4. DIAGNOSTIC ARTIFACTS

Attach any relevant console logs, network errors, or screenshots. **DO NOT** attach sensitive personal data.

**4.1. Console Logs (Crucial):**

javascript
// Paste relevant entries from the browser's developer console here.
// Look for RED errors related to extension execution, API calls, or rendering.


**4.2. Screenshots/Screen Recordings:**

> [Attach images/GIFs illustrating the failure point.]

### 5. AGENT DIRECTIVE ALIGNMENT CHECK

Does this bug relate to a failure in one of the core Apex principles outlined in `AGENTS.md` (e.g., latency, improper state handling, security vulnerability)?

* [ ] Violation of CQS (Command/Query confusion)
* [ ] Failure to use Guard Clauses (Bad Nesting)
* [ ] Performance regression (High INP/Slow Load)
* [ ] Security sanitation failure (Input Trust)
* [ ] Other (Specify): 

---

*For reference, this repository operates under the **YouTube-AI-Navigator-Browser-Extension** mandate, using TypeScript, Vite, and Gemini APIs.*