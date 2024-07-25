// js/bubble-animation.js

document.addEventListener('DOMContentLoaded', function() {
    const svg = document.getElementById('bubble-svg');
    const svgNS = "http://www.w3.org/2000/svg";
    let bubbles = [];
    let time = 0;
    const UNIFORM_RISE_RATE = bubbleAnimationSettings.riseRate;
    const NUM_BUBBLES = bubbleAnimationSettings.numBubbles;
    const BUBBLE_COLOR = bubbleAnimationSettings.bubbleColor;

    function createBubble(size = null, color = null, x = null, y = null) {
        const bubble = document.createElementNS(svgNS, "circle");
        size = size || Math.random() * 53.9 + 6.1; // Sizes ranging from 6.1 to 60 (10% larger)
        x = x || Math.random() * window.innerWidth;
        y = y || Math.random() * window.innerHeight; // Random y-position across the entire screen
        const opacity = 0.3 + Math.random() * 0.4;
        color = color || BUBBLE_COLOR;

        bubble.setAttribute('r', size);
        bubble.setAttribute('cx', x);
        bubble.setAttribute('cy', y);
        bubble.setAttribute('fill', color);
        
        svg.appendChild(bubble);

        const bubbleObj = {
            element: bubble,
            size: size,
            color: color,
            wobble: Math.random() * 2 * Math.PI,
            wobbleSpeed: 0.01 + Math.random() * 0.02,
            x: x,
            y: y
        };

        bubble.addEventListener('mouseover', () => popBubble(bubbleObj));
        
        return bubbleObj;
    }

    function popBubble(bubble) {
        const { x, y, size, color } = bubble;
        bubble.element.remove();
        bubbles = bubbles.filter(b => b !== bubble);

        const numNewBubbles = Math.floor(Math.random() * 3) + 2; // 2 to 4 new bubbles
        for (let i = 0; i < numNewBubbles; i++) {
            const newSize = Math.min(Math.max(size * (0.22 + Math.random() * 0.66), 6.1), 60); // 22% to 88% of original size, but within 6.1-60 range
            const newX = x + (Math.random() - 0.5) * size * 2;
            const newY = y + (Math.random() - 0.5) * size * 2;
            bubbles.push(createBubble(newSize, color, newX, newY));
        }
    }

    function animateBubble(bubble) {
        bubble.y -= UNIFORM_RISE_RATE; // Using the uniform rise rate for ALL bubbles
        bubble.wobble += bubble.wobbleSpeed;
        bubble.x += Math.sin(bubble.wobble) * (bubble.size < 30 ? 0.5 : 0.2);

        if (bubble.y < -bubble.size) {
            bubble.y = window.innerHeight + bubble.size;
            bubble.x = Math.random() * window.innerWidth;
        }

        bubble.x = Math.max(bubble.size, Math.min(window.innerWidth - bubble.size, bubble.x));

        bubble.element.setAttribute('cx', bubble.x);
        bubble.element.setAttribute('cy', bubble.y);

        const pulseFactor = 1 + Math.sin(time * 0.1) * (bubble.size < 30 ? 0.03 : 0.01);
        bubble.element.setAttribute('r', bubble.size * pulseFactor);
    }

    function generateBubbles() {
        while (bubbles.length < NUM_BUBBLES) {
            bubbles.push(createBubble());
        }
        setTimeout(generateBubbles, 2000);
    }

    function animate() {
        time += 0.16;
        bubbles.forEach(animateBubble);
        requestAnimationFrame(animate);
    }

    generateBubbles();
    animate();

    window.addEventListener('resize', () => {
        svg.setAttribute('width', window.innerWidth);
        svg.setAttribute('height', window.innerHeight);
    });
});