const inputField = document.getElementById('command-input');
const sendButton = document.getElementById('send-command');
const outputPanel = document.getElementById('gemini-output'); 

// --- NEW PROXY LOGIC ELEMENTS ---
const ipElement = document.getElementById('current-ip');
const locationElement = document.getElementById('current-location');
const proxyButton = document.getElementById('change-proxy');
const globeVisual = document.querySelector('.globe-visual');

const PROXY_LOCATIONS = [
    { ip: '172.67.142.15', location: 'Sydney, Australia' },
    { ip: '45.33.49.119', location: 'Tokyo, Japan' },
    { ip: '198.51.100.22', location: 'Sao Paulo, Brazil' },
    { ip: '203.0.113.88', location: 'London, United Kingdom' },
    { ip: '104.244.42.129', location: 'Amsterdam, Netherlands' }, 
];

let currentIndex = 0;

function changeProxyLocation() {
    // 1. Simulate "Spinning" and Disable Button
    // The CSS transition property handles the smooth rotation
    globeVisual.style.transform = `rotateY(720deg) scale(1.1)`; 
    proxyButton.disabled = true;
    proxyButton.textContent = 'CONNECTING...';
    displayOutput('// INITIATING PROXY SWAP: ENCRYPTING TUNNEL...', 'INFO');

    // 2. Determine New Location
    currentIndex = (currentIndex + 1) % PROXY_LOCATIONS.length;
    const newLocation = PROXY_LOCATIONS[currentIndex];

    // 3. Update UI after a short delay (Simulate connection time)
    setTimeout(() => {
        ipElement.textContent = newLocation.ip;
        locationElement.textContent = newLocation.location;
        globeVisual.style.transform = `rotateY(0deg) scale(1.0)`; // Stop spin, reset size
        
        displayOutput(`// PROXY CONNECTED: IP ${newLocation.ip} (${newLocation.location})`, 'SUCCESS');
        
        // 4. Re-enable Button
        proxyButton.textContent = 'CHANGE PROXY LOCATION';
        proxyButton.disabled = false;
    }, 2000); // 2-second connection simulation
}

// Attach the event listener to the button
proxyButton.addEventListener('click', changeProxyLocation);

// --- AI Training Logic (Simulated Response Generator) ---

function generateAIResponse(prompt) {
    const command = prompt.toUpperCase().trim();
    
    // 1. Core Commands
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
                    - NOTE: Phishing attempts targeting treasury personnel have increased by 200% this quarter.
                `,
                type: 'REPORT'
            };
        }
    }
    
    // 3. Fun/Easter Egg Response
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
            // Type 'HELP' for assistance.
        `,
        type: 'ERROR'
    };
}


// --- UI Interaction Functions ---

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
    if (type === 'ERROR' || type === 'SPECIAL') {
        p.classList.add(type.toLowerCase()); 
    }
    p.classList.add('terminal-line');
    outputPanel.appendChild(p);

    typeText(p, text.trim());
}

function handleCommand() {
    const prompt = inputField.value.trim();
    if (prompt === "") return;

    const inputLine = `>_ COMMAND RECEIVED: ${prompt}`;
    displayOutput(inputLine, 'INPUT');
    
    inputField.value = ''; 

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
        e.preventDefault(); 
        handleCommand();
    }
});

// Utility to update time in metrics panel
function updateTime() {
    const timeElement = document.getElementById('current-time');
    if(timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    }
}

// Initializing the Console
window.onload = () => {
    displayOutput("// Initializing AI Core v2.0 (Self-Trained Model)...", 'INFO');
    setTimeout(() => {
        displayOutput("// STATUS: System Analysis Ready. Type 'HELP' to view trained commands.", 'INFO');
    }, 1200);
    setInterval(updateTime, 1000);
    updateTime();
};
