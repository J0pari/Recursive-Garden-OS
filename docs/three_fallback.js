/**
 * THREE.JS FALLBACK - Ensure V5 visuals work even if CDN fails
 * 
 * This provides a minimal Three.js implementation if the CDN is blocked
 */

// Check if Three.js loaded
if (typeof THREE === 'undefined') {
    console.error('🚨 Three.js CDN failed! Loading fallback...');
    
    // Create minimal Three.js stub to prevent total failure
    window.THREE = {
        Scene: function() {
            this.add = function() {};
            this.remove = function() {};
        },
        PerspectiveCamera: function() {
            this.position = { set: function() {} };
            this.lookAt = function() {};
        },
        WebGLRenderer: function() {
            this.setSize = function() {};
            this.render = function() {};
            this.domElement = document.createElement('canvas');
        },
        PointLight: function() {
            this.position = { set: function() {} };
        },
        AmbientLight: function() {},
        BufferGeometry: function() {
            this.setAttribute = function() {};
        },
        Points: function() {
            this.geometry = { attributes: {} };
        },
        ShaderMaterial: function() {},
        BufferAttribute: function() {},
        Color: function() {},
        Vector3: function() {},
        Clock: function() {
            this.getDelta = function() { return 0.016; };
        }
    };
    
    // Show error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff4444;
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-family: system-ui;
        z-index: 10000;
        text-align: center;
    `;
    errorDiv.innerHTML = `
        <h2>⚠️ 3D Graphics Failed to Load</h2>
        <p>The visualization library could not be loaded from CDN.</p>
        <p><a href="keats_v1.html" style="color: white; text-decoration: underline;">Try V1 (no external dependencies)</a></p>
    `;
    document.body.appendChild(errorDiv);
}