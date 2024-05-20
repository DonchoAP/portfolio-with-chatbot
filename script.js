document.addEventListener('DOMContentLoaded', () => {
    // AOS Initialization
    AOS.init({
        duration: 1000,
    });

    // Smooth Scroll for anchor links
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for lazy loading sections
    const sections = document.querySelectorAll('.content');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Particle.js Initialization
    const particles = document.getElementById('particles');
    particles.width = window.innerWidth;
    particles.height = window.innerHeight;
    const ctx = particles.getContext('2d');

    let particlesArray;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x + this.size > particles.width || this.x - this.size < 0) {
                this.directionX = -this.directionX;
            }

            if (this.y + this.size > particles.height || this.y - this.size < 0) {
                this.directionY = -this.directionY;
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (particles.width * particles.height) / 9000;
        for (let i = 0; i < numberOfParticles * 2; i++) {
            let size = (Math.random() * 5) + 1;
            let x = (Math.random() * ((particles.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((particles.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 5) - 2.5;
            let directionY = (Math.random() * 5) - 2.5;
            let color = '#0071e3';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, particles.width, particles.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    initParticles();
    animateParticles();

    // Chart.js Initialization
    const ctxChart = document.getElementById('projectChart').getContext('2d');
    const projectChart = new Chart(ctxChart, {
        type: 'bar',
        data: {
            labels: ['Total Deliveries', 'Product Returns'],
            datasets: [{
                label: 'Data',
                data: [150, 30],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Llama 3 Chatbot
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    async function sendMessage(message) {
        const response = await fetch('https://llama3.api/endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify({ prompt: message })
        });

        const data = await response.json();
        return data.text;
    }

    function appendMessage(message, sender) {
        const messageElem = document.createElement('div');
        messageElem.classList.add('message', sender);
        messageElem.textContent = message;
        messagesContainer.appendChild(messageElem);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendBtn.addEventListener('click', async () => {
        const message = userInput.value.trim();
        if (message) {
            appendMessage(message, 'user');
            userInput.value = '';

            const botResponse = await sendMessage(message);
            appendMessage(botResponse, 'bot');
        }
    });

    userInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                appendMessage(message, 'user');
                userInput.value = '';

                const botResponse = await sendMessage(message);
                appendMessage(botResponse, 'bot');
            }
        }
    });
});
