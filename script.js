const inputField = document.getElementById('command-input');
const sendButton = document.getElementById('send-command');
const outputPanel = document.getElementById('gemini-output');

// --- AI Training Logic (Simulated Response Generator) ---
function generateAIResponse(prompt) {
    const command = prompt.toUpperCase().trim();

    // 1. Core Commands (Mandatory)
    if (command === 'CLEAR') {
        return { response: '', type: 'SPECIAL' };
    }
    if (command === 'HELP') {
        return { 
            response: `
                // Available AI-Trained Commands:
                - SCAN [TARGET]: Analyze a system component (e.g., SCAN FIREWALL).
                - REPORT [TOPIC]: Draft an analysis summary (e.g., REPORT CRYPTO).
                - HELP: Display available commands.
                - CLEAR: Clear the console screen.
                - INITIATE SELF-DESTRUCT: (Warning: Highly unstable function.)
            `,
            type: 'INFO'
        };
    }

    // 2. Thematic Analysis (Trained Responses based on keywords)
    if (command.startsWith('SCAN')) {
        const target = command.substring(5).trim();
        if (target === 'FIREWALL') {
            return {
                response: `
                    // SYSTEM STATUS: FIREWALL ANALYSIS
                    - Protocol Integrity: 99.8% (Nominal)
                    - Rule Set Deviation: 0 detected.
                    - Intrusion Attempts (24h): 45, all mitigated by Layer 7 filter.
                    - RECOMMENDATION: Monitor geo-locked IP ranges for anomalous packet size.
                `,
                type: 'ANALYSIS'
            };
        } else if (target === 'NETWORK') {
            return {
                 response: `
                    // NETWORK MONITORING PROTOCOL v3.1 ACTIVATED
                    - Current Latency: 45ms (High for internal traffic.)
                    - Bandwidth Usage: 78% peak.
                    - Suspicious Activity: A persistent connection on port 22 (SSH) from an internal host is flagged.
                    - STATUS: Requires immediate triage. Threat Level: ORANGE.
                 `,
                 type: 'ANALYSIS'
            };
        }
    }
    
    if (command.startsWith('REPORT')) {
        const topic = command.substring(7).trim();
        if (topic === 'CRYPTO') {
            return {
                response: `
                    // FINANCIAL ANALYTICS REPORT: CRYPTO ASSETS
                    - Current Volatility Index: High (12.5)
                    - Wallet Security: Key rotation successfully executed 04:00 UTC.
                    - NOTE: Phishing attempts targeting treasury personnel have increased by 200% this quarter. Education module required.
                `,
                type: 'REPORT'
            };
        }
    }
    
    // 3. Fun/Easter Egg Response (Simulating AI personality)
    if (command === 'INITIATE SELF-DESTRUCT') {
        return {
            response: `
                // WARNING: Self-Destruct Sequence **DENIED** (Code 404: Protocol not found). 
                // A helpful AI is not permitted to destroy its operational environment. Please try a different command.
            `,
            type: 'ERROR'
        };
    }


    // 4. Default Unknown Command
    return {
        response: `
            // ERROR: Command '${prompt}' not recognized by AI training model. 
            // Try formatting your query as 'SCAN [TARGET]' or 'REPORT [TOPIC]'. Type 'HELP' for assistance.
        `,
        type: 'ERROR'
    };
}


// --- UI Interaction Functions (Modified for clarity and styling) ---

function typeText(element, text, speed = 10, isError = false) {
    return new Promise(resolve => {
        let i = 0;
        element.innerHTML = '';
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                outputPanel.scrollTop = outputPanel.scrollHeight;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

function displayOutput(text, type) {
    const p = document.createElement('p');
    // Add a class for potential styling (e.g., making errors red)
    if (type === 'ERROR' || type === 'SPECIAL') {
        p.classList.add(type.toLowerCase()); 
    }
    p.classList.add('terminal-line');
    outputPanel.appendChild(p);

    // Use the typing animation for engaging output
    typeText(p, text.trim());
}

function handleCommand() {
    const prompt = inputField.value.trim();
    if (prompt === "") return;

    // Display the command input first
    const inputLine = `>_ COMMAND RECEIVED: ${prompt}`;
    displayOutput(inputLine, 'INPUT');
    
    // Clear input immediately
    inputField.value = ''; 

    // Get the response from the AI training function
    const { response, type } = generateAIResponse(prompt);

    // Handle special CLEAR command
    if (type === 'SPECIAL' && response === '') {
        outputPanel.innerHTML = '';
        return;
    }

    // Display the simulated AI response
    setTimeout(() => {
        displayOutput(response, type);
    }, 700); // Simulate processing time
}

// Event Listeners
sendButton.addEventListener('click', handleCommand);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission if in a form
        handleCommand();
    }
});

// Initial greeting on load
window.onload = () => {
    // You could also add a temporary CSS style to make ERROR text red in your stylesheet:
    // .error { color: #FF4136 !important; } 
    displayOutput("// Initializing AI Core v2.0 (Self-Trained Model)...", 'INFO');
    setTimeout(() => {
        displayOutput("// STATUS: System Analysis Ready. Type 'HELP' to view trained commands.", 'INFO');
    }, 1200);
};
