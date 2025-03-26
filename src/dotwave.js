/**
 * DotWave.js - Interactive Dots Background Library
 * Create animated dot backgrounds that react to cursor movements
 * @version 1.0.0
 */
(function(global) {
    'use strict';
    
    /**
     * DotWave constructor
     * @param {Object} options - Configuration options
     */
    function DotWave(options) {
        // Default configuration
        this.defaults = {
            container: 'body',           // Container selector or DOM element
            numDots: 200,                // Number of dots
            dotColor: 'white',           // Dot color (CSS color)
            backgroundColor: 'black',    // Background color
            dotMinSize: 0.5,             // Minimum dot size
            dotMaxSize: 2.5,             // Maximum dot size
            dotMinOpacity: 0.5,          // Minimum dot opacity
            dotMaxOpacity: 1,            // Maximum dot opacity
            influenceRadius: 150,        // Mouse influence radius
            influenceStrength: 0.08,     // Mouse influence strength
            randomFactor: 0.03,          // Random movement factor
            friction: 0.97,              // Movement friction
            maxSpeed: 3,                 // Maximum dot speed
            responsive: true,            // Automatically resize with container
            zIndex: -1                   // Canvas z-index
        };
        
        // Merge options with defaults
        this.options = this._mergeOptions(this.defaults, options || {});
        
        // Initialize properties
        this.canvas = null;
        this.ctx = null;
        this.container = null;
        this.dots = [];
        this.width = 0;
        this.height = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        this.mouseSpeedX = 0;
        this.mouseSpeedY = 0;
        this.animationFrame = null;
        this.resizeTimeout = null;
        
        // Initialize the canvas
        this.init();
    }
    
    /**
     * Initialize the DotWave instance
     */
    DotWave.prototype.init = function() {
        // Get container element
        this.container = this._getContainer(this.options.container);
        if (!this.container) {
            console.error('DotWave: Container element not found');
            return;
        }
        
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas styles
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = this.options.zIndex;
        this.canvas.style.pointerEvents = 'none'; // Allow clicks to pass through
        
        // Add canvas to container
        this._setupContainer();
        this.container.appendChild(this.canvas);
        
        // Set initial canvas size
        this._updateCanvasSize();
        
        // Create dots
        this._createDots();
        
        // Add event listeners
        this._addEventListeners();
        
        // Start animation
        this._animate();
    };
    
    /**
     * Set up the container element for the canvas
     */
    DotWave.prototype._setupContainer = function() {
        // Only modify position if it's static
        const containerStyle = window.getComputedStyle(this.container);
        if (containerStyle.position === 'static') {
            this.container.style.position = 'relative';
        }
        
        // Set background color if specified and container is body
        if (this.options.backgroundColor && this.container === document.body) {
            document.body.style.backgroundColor = this.options.backgroundColor;
        }
    };
    
    /**
     * Get container DOM element from selector or element
     * @param {String|Element} container - Container selector or DOM element
     * @return {Element} The container element
     */
    DotWave.prototype._getContainer = function(container) {
        if (typeof container === 'string') {
            return document.querySelector(container);
        } else if (container instanceof Element) {
            return container;
        } else if (container === document.body) {
            return document.body;
        }
        return null;
    };
    
    /**
     * Merge default options with user options
     * @param {Object} defaults - Default options
     * @param {Object} options - User options
     * @return {Object} Merged options
     */
    DotWave.prototype._mergeOptions = function(defaults, options) {
        const merged = {};
        for (const key in defaults) {
            merged[key] = options[key] !== undefined ? options[key] : defaults[key];
        }
        return merged;
    };
    
    /**
     * Update canvas size to match container
     */
    DotWave.prototype._updateCanvasSize = function() {
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        
        // Set canvas size (with device pixel ratio for retina displays)
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Center mouse position initially
        this.mouseX = this.width / 2;
        this.mouseY = this.height / 2;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
    };
    
    /**
     * Create dots with random properties
     */
    DotWave.prototype._createDots = function() {
        this.dots = [];
        
        for (let i = 0; i < this.options.numDots; i++) {
            // z represents depth (0 = far, 1 = close)
            const z = Math.random();
            
            this.dots.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                z: z, // Depth value
                radius: this.options.dotMinSize + z * (this.options.dotMaxSize - this.options.dotMinSize),
                alpha: this.options.dotMinOpacity + z * (this.options.dotMaxOpacity - this.options.dotMinOpacity),
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                // Deeper dots move slower to create parallax effect
                speedMultiplier: 0.3 + z * 0.7
            });
        }
    };
    
    /**
     * Add event listeners for mouse movement and window resize
     */
    DotWave.prototype._addEventListeners = function() {
        // Mouse movement
        window.addEventListener('mousemove', this._handleMouseMove.bind(this));
        
        // Window resize
        if (this.options.responsive) {
            window.addEventListener('resize', this._handleResize.bind(this));
        }
    };
    
    /**
     * Handle mouse movement
     * @param {Event} e - Mouse event
     */
    DotWave.prototype._handleMouseMove = function(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        this.mouseSpeedX = this.mouseX - this.prevMouseX;
        this.mouseSpeedY = this.mouseY - this.prevMouseY;
    };
    
    /**
     * Handle window resize with debounce
     */
    DotWave.prototype._handleResize = function() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this._updateCanvasSize();
        }, 250);
    };
    
    /**
     * Animation loop
     */
    DotWave.prototype._animate = function() {
        this.animationFrame = requestAnimationFrame(this._animate.bind(this));
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update and draw dots
        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i];
            
            // Calculate distance to mouse
            const dx = this.mouseX - dot.x;
            const dy = this.mouseY - dot.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply mouse influence if dot is within range
            if (distance < this.options.influenceRadius) {
                // Stronger effect when closer
                const influence = (1 - distance / this.options.influenceRadius) * dot.z;
                
                // Add a fraction of mouse speed to dot velocity
                dot.vx += this.mouseSpeedX * influence * this.options.influenceStrength;
                dot.vy += this.mouseSpeedY * influence * this.options.influenceStrength;
            }
            
            // Add some randomness to movement
            dot.vx += (Math.random() - 0.5) * this.options.randomFactor;
            dot.vy += (Math.random() - 0.5) * this.options.randomFactor;
            
            // Apply friction to prevent excessive speed
            dot.vx *= this.options.friction;
            dot.vy *= this.options.friction;
            
            // Limit maximum speed
            const speed = Math.sqrt(dot.vx * dot.vx + dot.vy * dot.vy);
            if (speed > this.options.maxSpeed) {
                dot.vx = (dot.vx / speed) * this.options.maxSpeed;
                dot.vy = (dot.vy / speed) * this.options.maxSpeed;
            }
            
            // Update position based on velocity and depth
            dot.x += dot.vx * dot.speedMultiplier;
            dot.y += dot.vy * dot.speedMultiplier;
            
            // Wrap around edges (with a buffer to prevent popping)
            if (dot.x < -50) dot.x = this.width + 50;
            if (dot.x > this.width + 50) dot.x = -50;
            if (dot.y < -50) dot.y = this.height + 50;
            if (dot.y > this.height + 50) dot.y = -50;
            
            // Draw dot
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this._getRGBA(this.options.dotColor, dot.alpha);
            this.ctx.fill();
        }
    };
    
    /**
     * Convert color to RGBA format
     * @param {String} color - CSS color
     * @param {Number} alpha - Alpha value
     * @return {String} RGBA color string
     */
    DotWave.prototype._getRGBA = function(color, alpha) {
        // If already RGBA format
        if (color.startsWith('rgba')) {
            return color;
        }
        
        // If RGB format
        if (color.startsWith('rgb')) {
            return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        }
        
        // If named color or hex
        const tempEl = document.createElement('div');
        tempEl.style.color = color;
        document.body.appendChild(tempEl);
        const computedColor = window.getComputedStyle(tempEl).color;
        document.body.removeChild(tempEl);
        
        return computedColor.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
    };
    
    /**
     * Destroy the DotWave instance
     */
    DotWave.prototype.destroy = function() {
        // Stop animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Remove event listeners
        window.removeEventListener('mousemove', this._handleMouseMove);
        window.removeEventListener('resize', this._handleResize);
        
        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        // Clear properties
        this.canvas = null;
        this.ctx = null;
        this.dots = [];
    };
    
    /**
     * Update options
     * @param {Object} options - New options
     */
    DotWave.prototype.updateOptions = function(options) {
        this.options = this._mergeOptions(this.options, options || {});
        
        // Recreate dots if number changed
        if (options.numDots !== undefined) {
            this._createDots();
        }
    };
    
    /**
     * Pause animation
     */
    DotWave.prototype.pause = function() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    };
    
    /**
     * Resume animation
     */
    DotWave.prototype.resume = function() {
        if (!this.animationFrame) {
            this._animate();
        }
    };
    
    // Expose DotWave to global scope
    global.DotWave = DotWave;
    
})(typeof window !== 'undefined' ? window : this);
