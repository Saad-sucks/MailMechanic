document.addEventListener('DOMContentLoaded', () => {
    // 1. Feature 1: Live Spam-Trigger Word Scanner
    const spamWords = [
        "free", "100% guaranteed", "make money", "risk-free", 
        "click here", "act now", "buy today", "urgent", "winner", 
        "congratulations", "cash", "credit card", "investment",
        "no hidden costs", "once in a lifetime", "dear friend"
    ];

    const emailBody = document.getElementById('email-body');
    const highlights = document.getElementById('highlights-layer');
    const spamList = document.getElementById('spam-list');
    const healthScoreEl = document.getElementById('health-score');
    const copyPromptBtn = document.getElementById('copy-prompt-btn');
    let currentSpamWords = [];

    // Sync scroll
    emailBody.addEventListener('scroll', () => {
        highlights.scrollTop = emailBody.scrollTop;
    });

    const checkSpamWords = () => {
        let text = emailBody.value;
        let highlightedText = text;
        const detectedWords = new Set();

        // Create a regex to find all spam words
        // Sort by length descending to match longer phrases first
        const sortedSpamWords = [...spamWords].sort((a, b) => b.length - a.length);
        const escapedSpamWords = sortedSpamWords.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex = new RegExp(`\\b(${escapedSpamWords.join('|')})\\b`, 'gi');

        highlightedText = text.replace(regex, (match) => {
            detectedWords.add(match.toLowerCase());
            return `<mark>${match}</mark>`;
        });

        // Update highlights div (add trailing newline to ensure empty lines sync correctly)
        // Also replace newlines with <br> for HTML rendering in the div
        highlights.innerHTML = highlightedText.replace(/\n/g, '<br>') + '<br>';

        // Update diagnostics panel
        currentSpamWords = Array.from(detectedWords);
        updateSpamDiagnostics(currentSpamWords);
    };

    const updateSpamDiagnostics = (detected) => {
        // Update Score
        let score = Math.max(0, 100 - (detected.length * 10));
        healthScoreEl.textContent = score;
        healthScoreEl.className = '';
        const scoreCircleBg = document.getElementById('score-circle-bg');
        if (score === 100) {
            healthScoreEl.classList.add('score-perfect');
            if(scoreCircleBg) scoreCircleBg.style.backgroundImage = 'linear-gradient(-225deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)';
            if (copyPromptBtn) copyPromptBtn.style.display = 'none';
        } else if (score >= 70) {
            healthScoreEl.classList.add('score-warning');
            if(scoreCircleBg) scoreCircleBg.style.backgroundImage = 'linear-gradient(-225deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)';
            if (copyPromptBtn) copyPromptBtn.style.display = '';
        } else {
            healthScoreEl.classList.add('score-danger');
            if(scoreCircleBg) scoreCircleBg.style.backgroundImage = 'linear-gradient(-225deg, #ef4444 0%, #f87171 50%, #fca5a5 100%)';
            if (copyPromptBtn) copyPromptBtn.style.display = '';
        }

        spamList.innerHTML = '';
        if (detected.length === 0) {
            spamList.innerHTML = `
                <li class="spam-card" style="border-left: 3px solid var(--success);">
                    <div class="spam-img" style="background: transparent;">✅</div>
                    <div class="spam-textBox">
                        <div class="spam-textContent">
                            <p class="spam-h1">All Clear</p>
                        </div>
                        <p class="spam-p">No spam words detected. Looking good!</p>
                    </div>
                </li>
            `;
            return;
        }

        detected.forEach(word => {
            const li = document.createElement('li');
            li.className = 'spam-card';
            li.style.borderLeft = '3px solid var(--danger)';
            li.innerHTML = `
                <div class="spam-img" style="background: transparent;">⚠️</div>
                <div class="spam-textBox">
                    <div class="spam-textContent">
                        <p class="spam-h1">Spam Trigger</p>
                        <span class="spam-span">${word}</span>
                    </div>
                    <p class="spam-p">This is a known spam-trigger phrase that can cause your email to be flagged. Try using a natural alternative.</p>
                </div>
            `;
            spamList.appendChild(li);
        });
    };

    const adjustTextareaHeight = () => {
        const editorContainer = document.querySelector('.editor-container');
        emailBody.style.height = 'auto';
        highlights.style.height = 'auto';
        if (editorContainer) {
            editorContainer.style.height = 'auto';
        }

        const scrollHeight = emailBody.scrollHeight;
        const targetHeight = Math.min(Math.max(150, scrollHeight), 400);

        emailBody.style.height = targetHeight + 'px';
        highlights.style.height = targetHeight + 'px';
        if (editorContainer) {
            editorContainer.style.height = targetHeight + 'px';
        }

        if (scrollHeight > 400) {
            emailBody.style.overflowY = 'auto';
            highlights.style.overflowY = 'auto';
        } else {
            emailBody.style.overflowY = 'hidden';
            highlights.style.overflowY = 'hidden';
        }
    };

    emailBody.addEventListener('input', () => {
        checkSpamWords();
        adjustTextareaHeight();
    });

    // Initial check and resize
    checkSpamWords();
    adjustTextareaHeight();


    // 2. Feature 2: Simulated "Domain Authentication" Auditor
    const domainInput = document.getElementById('domain-input');
    const checkDomainBtn = document.getElementById('check-domain-btn');
    const domainToggle = document.getElementById('domain-toggle');
    const domainResults = document.getElementById('domain-results');
    const domainLoader = document.getElementById('domain-loader');

    const runDomainCheck = () => {
        const domain = domainInput.value.trim();
        if (!domain) {
            alert('Please enter a domain to tune-up!');
            return;
        }

        // Show loading state
        domainLoader.classList.remove('hidden');
        domainResults.innerHTML = '<p class="placeholder-text">Analyzing DNS records...</p>';
        checkDomainBtn.disabled = true;

        const isBroken = domainToggle.checked;

        // Simulate network delay
        setTimeout(() => {
            domainLoader.classList.add('hidden');
            checkDomainBtn.disabled = false;

            if (isBroken) {
                domainResults.innerHTML = `
                    <ul class="status-list">
                        <li class="status-item fail">
                            <span class="icon">❌</span>
                            <div>
                                <strong>SPF: Missing</strong><br>
                                Your SPF record is missing. Fix this by adding a TXT record to your registrar to authorize your email servers.
                            </div>
                        </li>
                        <li class="status-item pass">
                            <span class="icon">✅</span>
                            <div>
                                <strong>DKIM: Configured</strong><br>
                                DKIM signature found. Your emails are securely signed.
                            </div>
                        </li>
                        <li class="status-item fail">
                            <span class="icon">❌</span>
                            <div>
                                <strong>DMARC: Quarantine Policy Missing</strong><br>
                                DMARC is not protecting your domain. Add a DMARC policy (p=reject or p=quarantine).
                            </div>
                        </li>
                    </ul>
                `;
            } else {
                domainResults.innerHTML = `
                    <ul class="status-list">
                        <li class="status-item pass">
                            <span class="icon">✅</span>
                            <div>
                                <strong>SPF: Pass</strong><br>
                                Your SPF record is properly configured and authorizing your IPs.
                            </div>
                        </li>
                        <li class="status-item pass">
                            <span class="icon">✅</span>
                            <div>
                                <strong>DKIM: Pass</strong><br>
                                DKIM signature verified. Excellent.
                            </div>
                        </li>
                        <li class="status-item pass">
                            <span class="icon">✅</span>
                            <div>
                                <strong>DMARC: Pass</strong><br>
                                DMARC policy is active (p=reject). Your domain is fully protected from spoofing.
                            </div>
                        </li>
                    </ul>
                `;
            }
        }, 1200);
    };

    checkDomainBtn.addEventListener('click', runDomainCheck);
    domainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') runDomainCheck();
    });


    // 3. Feature 3: Simulated "IP Blocklist" Checker
    const ipBlocklist = document.getElementById('ip-blocklist');
    
    const renderIPBlocklist = () => {
        ipBlocklist.innerHTML = `
            <li class="ip-card fail" style="border-left: 3px solid var(--danger);">
                <div class="ip-img" style="background: transparent;">⚠️</div>
                <div class="ip-textBox">
                    <div class="ip-textContent">
                        <p class="ip-h1" style="font-size: 0.95rem; margin-bottom: 2px;">Status: 1 Active Listing Detected (SORBS DUHL)</p>
                    </div>
                    <p class="ip-p"><a href="#" style="color: var(--text-secondary); text-decoration: underline; font-size: 0.8rem;">Request Delisting</a></p>
                </div>
            </li>
        `;
    };

    renderIPBlocklist();

    // 4. Feature 4: The AI Fix-It Prompt Generator
    const toastContainer = document.getElementById('toast-container');
    
    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    copyPromptBtn.addEventListener('click', () => {
        const subject = document.getElementById('email-subject').value;
        const body = emailBody.value;
        const isBroken = domainToggle.checked;
        
        let prompt = `Act as an expert B2B copywriter and email deliverability consultant. Please review and rewrite the following cold email to ensure it is flawless, engaging, and avoids spam filters.\n\n`;
        prompt += `### Current Draft:\n**Subject:** ${subject || '[None provided]'}\n**Body:**\n${body || '[None provided]'}\n\n`;
        prompt += `### Deliverability Issues Found in MailMechanic:\n`;
        
        if (currentSpamWords.length > 0) {
            prompt += `- **Spam Words Detected:** ${currentSpamWords.map(w => '"' + w + '"').join(', ')}. Please remove or replace these with more natural alternatives.\n`;
        } else {
            prompt += `- **Spam Words:** None detected. Great job, but please maintain a natural, conversational tone in your rewrite.\n`;
        }
        
        if (isBroken) {
            prompt += `- **Domain Status:** Broken (SPF Missing, DMARC Failing). Since my domain reputation might be poor right now, please ensure the rewrite is extremely conservative and avoids any aggressive sales language.\n`;
        } else {
            prompt += `- **Domain Status:** Clean. My authentication records are perfect.\n`;
        }
        
        prompt += `\nPlease provide the rewritten subject line and body below.`;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(prompt).then(() => {
                showToast('Custom AI Fix-It Prompt copied! Paste this into ChatGPT or Claude to get a flawless rewrite.');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy to clipboard.');
            });
        } else {
            // Fallback for non-secure contexts (like preview panels sometimes)
            const textArea = document.createElement("textarea");
            textArea.value = prompt;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showToast('Custom AI Fix-It Prompt copied! Paste this into ChatGPT or Claude to get a flawless rewrite.');
            } catch (err) {
                console.error('Fallback copy failed', err);
                alert('Failed to copy to clipboard.');
            }
            textArea.remove();
        }
    });
});
