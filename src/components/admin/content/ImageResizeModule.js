// Custom Image Resize and Positioning Module for Quill
import Quill from 'quill';

const Image = Quill.import('formats/image');

class ImageResizeModule {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = {
      handleStyles: {
        backgroundColor: '#3b82f6',
        border: '2px solid #ffffff',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        position: 'absolute',
        cursor: 'pointer',
        zIndex: 1000,
      },
      ...options
    };
    
    this.init();
  }

  init() {
    // Register custom image format
    Quill.register('formats/image', CustomImage, true);
    
    // Add event listeners
    this.quill.on('text-change', this.handleTextChange.bind(this));
    this.quill.root.addEventListener('click', this.handleClick.bind(this));
    this.quill.root.addEventListener('mousedown', this.handleMouseDown.bind(this));
    
    // Add CSS for image positioning
    this.addStyles();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .ql-editor img {
        cursor: pointer;
        transition: all 0.2s ease;
        max-width: 100%;
        height: auto;
      }
      
      .ql-editor img:hover {
        box-shadow: 0 0 0 2px #3b82f6;
      }
      
      .ql-editor img.selected {
        box-shadow: 0 0 0 3px #3b82f6;
      }
      
      .image-resize-handle {
        position: absolute;
        background: #3b82f6;
        border: 2px solid #ffffff;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      .image-resize-handle:hover {
        background: #2563eb;
        transform: scale(1.2);
      }
      
      .image-container {
        position: relative;
        display: inline-block;
        margin: 8px;
      }
      
      .image-toolbar {
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        background: #1f2937;
        border-radius: 8px;
        padding: 8px;
        display: flex;
        gap: 8px;
        z-index: 1001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      
      .image-toolbar button {
        background: #374151;
        border: none;
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.2s ease;
      }
      
      .image-toolbar button:hover {
        background: #4b5563;
      }
      
      .image-position-options {
        position: absolute;
        top: 100%;
        left: 0;
        background: #1f2937;
        border-radius: 4px;
        padding: 4px;
        margin-top: 4px;
        display: none;
        z-index: 1002;
      }
      
      .image-position-options.show {
        display: block;
      }
      
      .image-position-options button {
        display: block;
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        color: white;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 12px;
      }
      
      .image-position-options button:hover {
        background: #374151;
      }
    `;
    document.head.appendChild(style);
  }

  handleTextChange() {
    // Remove old handles when content changes
    this.removeHandles();
  }

  handleClick(e) {
    if (e.target.tagName === 'IMG') {
      this.selectImage(e.target);
    } else {
      this.deselectAll();
    }
  }

  handleMouseDown(e) {
    if (e.target.classList.contains('image-resize-handle')) {
      e.preventDefault();
      this.startResize(e);
    }
  }

  selectImage(img) {
    this.deselectAll();
    img.classList.add('selected');
    this.addResizeHandles(img);
    this.addToolbar(img);
  }

  deselectAll() {
    const selectedImages = this.quill.root.querySelectorAll('img.selected');
    selectedImages.forEach(img => {
      img.classList.remove('selected');
    });
    this.removeHandles();
    this.removeToolbar();
  }

  addResizeHandles(img) {
    const container = this.createContainer(img);
    const handles = this.createHandles();
    
    handles.forEach(handle => {
      container.appendChild(handle);
    });
    
    this.quill.root.appendChild(container);
  }

  createContainer(img) {
    const container = document.createElement('div');
    container.className = 'image-container';
    container.style.position = 'relative';
    container.style.display = 'inline-block';
    
    // Move image to container
    img.parentNode.insertBefore(container, img);
    container.appendChild(img);
    
    return container;
  }

  createHandles() {
    const positions = ['nw', 'ne', 'sw', 'se'];
    return positions.map(pos => {
      const handle = document.createElement('div');
      handle.className = 'image-resize-handle';
      handle.dataset.position = pos;
      
      // Position handles
      switch(pos) {
        case 'nw':
          handle.style.top = '-6px';
          handle.style.left = '-6px';
          handle.style.cursor = 'nw-resize';
          break;
        case 'ne':
          handle.style.top = '-6px';
          handle.style.right = '-6px';
          handle.style.cursor = 'ne-resize';
          break;
        case 'sw':
          handle.style.bottom = '-6px';
          handle.style.left = '-6px';
          handle.style.cursor = 'sw-resize';
          break;
        case 'se':
          handle.style.bottom = '-6px';
          handle.style.right = '-6px';
          handle.style.cursor = 'se-resize';
          break;
      }
      
      return handle;
    });
  }

  addToolbar(img) {
    const toolbar = document.createElement('div');
    toolbar.className = 'image-toolbar';
    toolbar.innerHTML = `
      <button onclick="this.parentElement.querySelector('.image-position-options').classList.toggle('show')">
        📍 Position
      </button>
      <button onclick="this.parentElement.parentElement.querySelector('img').style.width = '200px'">
        📏 Small
      </button>
      <button onclick="this.parentElement.parentElement.querySelector('img').style.width = '400px'">
        📏 Medium
      </button>
      <button onclick="this.parentElement.parentElement.querySelector('img').style.width = '600px'">
        📏 Large
      </button>
      <button onclick="this.parentElement.parentElement.querySelector('img').style.width = '100%'">
        📏 Full
      </button>
      <button onclick="this.parentElement.parentElement.querySelector('img').style.float = 'left'; this.parentElement.parentElement.querySelector('img').style.marginRight = '10px'">
        ⬅️ Left
      </button>
      <button onclick="this.parentElement.parentElement.querySelector('img').style.float = 'right'; this.parentElement.parentElement.querySelector('img').style.marginLeft = '10px'">
        ➡️ Right
      </button>
      <button onclick="this.parentElement.parentElement.querySelector('img').style.float = 'none'; this.parentElement.parentElement.querySelector('img').style.margin = '10px auto'; this.parentElement.parentElement.querySelector('img').style.display = 'block'">
        🎯 Center
      </button>
      <button onclick="this.parentElement.parentElement.remove()">
        🗑️ Remove
      </button>
    `;
    
    const positionOptions = document.createElement('div');
    positionOptions.className = 'image-position-options';
    positionOptions.innerHTML = `
      <button onclick="this.parentElement.parentElement.parentElement.querySelector('img').style.float = 'none'; this.parentElement.parentElement.parentElement.querySelector('img').style.margin = '10px 0'; this.parentElement.parentElement.parentElement.querySelector('img').style.display = 'block'">
        📄 Inline
      </button>
      <button onclick="this.parentElement.parentElement.parentElement.querySelector('img').style.float = 'left'; this.parentElement.parentElement.parentElement.querySelector('img').style.margin = '0 10px 10px 0'">
        ⬅️ Left Wrap
      </button>
      <button onclick="this.parentElement.parentElement.parentElement.querySelector('img').style.float = 'right'; this.parentElement.parentElement.parentElement.querySelector('img').style.margin = '0 0 10px 10px'">
        ➡️ Right Wrap
      </button>
      <button onclick="this.parentElement.parentElement.parentElement.querySelector('img').style.float = 'none'; this.parentElement.parentElement.parentElement.querySelector('img').style.margin = '10px auto'; this.parentElement.parentElement.parentElement.querySelector('img').style.display = 'block'">
        🎯 Centered
      </button>
    `;
    
    toolbar.appendChild(positionOptions);
    this.quill.root.appendChild(toolbar);
  }

  removeHandles() {
    const handles = this.quill.root.querySelectorAll('.image-resize-handle');
    handles.forEach(handle => handle.remove());
  }

  removeToolbar() {
    const toolbars = this.quill.root.querySelectorAll('.image-toolbar');
    toolbars.forEach(toolbar => toolbar.remove());
  }

  startResize(e) {
    const handle = e.target;
    const img = handle.closest('.image-container').querySelector('img');
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = img.offsetWidth;
    const startHeight = img.offsetHeight;
    const position = handle.dataset.position;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      if (position.includes('e')) {
        newWidth = startWidth + deltaX;
      } else if (position.includes('w')) {
        newWidth = startWidth - deltaX;
      }
      
      if (position.includes('s')) {
        newHeight = startHeight + deltaY;
      } else if (position.includes('n')) {
        newHeight = startHeight - deltaY;
      }
      
      // Maintain aspect ratio
      const aspectRatio = startWidth / startHeight;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newHeight = newWidth / aspectRatio;
      } else {
        newWidth = newHeight * aspectRatio;
      }
      
      // Set minimum size
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);
      
      img.style.width = `${newWidth}px`;
      img.style.height = `${newHeight}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
}

// Custom Image Format
class CustomImage extends Image {
  static create(value) {
    const node = super.create(value);
    node.style.cursor = 'pointer';
    return node;
  }
}

export default ImageResizeModule; 