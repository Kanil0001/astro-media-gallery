// Sample media data (replace with your backend/database)
let mediaData = [
    { id: 1, type: 'image', url: 'https://via.placeholder.com/300x200/00d4ff/000?text=Moon', username: 'u/astrofan123', description: 'Full moon capture!', date: '2025-10-19', sub: 'r/astro' },
    { id: 2, type: 'video', url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', username: 'u/star_gazer', description: 'ISS passby', date: '2025-10-18', sub: 'r/amateur' },
    { id: 3, type: 'image', url: 'https://via.placeholder.com/300x200/ff6b6b/000?text=Orion', username: 'u/space_lover', description: 'Orion Nebula', date: '2025-10-17', sub: 'r/astro' }
];

let allMedia = [...mediaData];

// DOM Elements
const gallery = document.getElementById('gallery');

// Initialize gallery
function initGallery() {
    displayMedia(allMedia);
}
initGallery();

// Upload functionality
function uploadMedia() {
    const fileInput = document.getElementById('mediaFile');
    const username = document.getElementById('redditUsername').value;
    const description = document.getElementById('description').value;
    
    if (!fileInput.files.length || !username) {
        alert('Please select files and enter your Reddit username!');
        return;
    }
    
    Array.from(fileInput.files).forEach(file => {
        // Simulate upload (replace with actual upload to your backend)
        const newMedia = {
            id: Date.now(),
            type: file.type.startsWith('image') ? 'image' : 'video',
            url: URL.createObjectURL(file), // For demo - replace with actual URL
            username: username,
            description: description,
            date: new Date().toISOString().split('T')[0],
            sub: 'r/astro' // Auto-detect or let user choose
        };
        
        allMedia.unshift(newMedia);
        mediaData.unshift(newMedia);
    });
    
    displayMedia(allMedia);
    fileInput.value = '';
    document.getElementById('redditUsername').value = '';
    document.getElementById('description').value = '';
    alert('Media uploaded successfully! 🚀');
}

// Display media in gallery
function displayMedia(data) {
    gallery.innerHTML = data.map(item => `
        <div class="media-card ${item.type}" onclick="openModal('${item.url}', '${item.description}', '${item.username}', '${item.date}')">
            ${item.type === 'image' ? 
                `<img src="${item.url}" alt="${item.description}">` : 
                `<video src="${item.url}" muted></video>`
            }
            <div class="card-content">
                <h3>${item.description || 'Amazing capture!'}</h3>
                <div class="card-meta">
                    <span><i class="fas fa-user"></i> ${item.username}</span>
                    <span><i class="fas fa-clock"></i> ${formatDate(item.date)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter functionality
function filterMedia(type) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    let filtered = allMedia;
    if (type === 'images') filtered = allMedia.filter(m => m.type === 'image');
    if (type === 'videos') filtered = allMedia.filter(m => m.type === 'video');
    if (type === 'recent') filtered = allMedia.slice(0, 6);
    
    displayMedia(filtered);
}

// Modal for full view
function openModal(url, desc, user, date) {
    const modal = `
        <div id="modal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.9); z-index: 1000; display: flex; 
            align-items: center; justify-content: center; padding: 20px;
        ">
            <div style="max-width: 90%; max-height: 90%; text-align: center;">
                ${url.startsWith('http') ? 
                    (url.includes('.mp4') ? `<video src="${url}" controls style="max-width:100%; max-height:70vh;"></video>` : 
                     `<img src="${url}" style="max-width:100%; max-height:70vh;">`) :
                    `<video src="${url}" controls style="max-width:100%; max-height:70vh;"></video>`
                }
                <div style="margin-top: 1rem; color: #fff;">
                    <h3>${desc}</h3>
                    <p><i class="fas fa-user"></i> ${user} | <i class="fas fa-clock"></i> ${formatDate(date)}</p>
                </div>
                <button onclick="closeModal()" style="
                    background: #00d4ff; border: none; padding: 10px 20px; 
                    color: #000; border-radius: 20px; cursor: pointer; margin-top: 10px;
                ">Close</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modal);
}

function closeModal() {
    document.getElementById('modal').remove();
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

// Auto-play videos on hover
gallery.addEventListener('mouseenter', (e) => {
    if (e.target.tagName === 'VIDEO') e.target.play();
}, true);

gallery.addEventListener('mouseleave', (e) => {
    if (e.target.tagName === 'VIDEO') e.target.pause();
}, true);