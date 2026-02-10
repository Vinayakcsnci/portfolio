// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation classes
document.querySelectorAll('.skill-category, .project-card, .patent-card, .timeline-item, .education-item, .cert-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Animation class
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Active navigation link based on scroll position
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = '#2563eb';
            } else {
                navLink.style.color = '';
            }
        }
    });
});

// Add stagger delay to grid items
document.querySelectorAll('.skills-grid, .projects-grid, .patents-grid').forEach(grid => {
    const items = grid.children;
    Array.from(items).forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Typing effect for hero title (optional enhancement)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    // Start typing after a short delay
    setTimeout(typeWriter, 500);
}

// Console greeting
console.log('%c Welcome to Vinayak C S Portfolio ', 'background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 10px 20px; border-radius: 5px; font-size: 14px;');

// =====================
// IndexedDB for Storage
// =====================
const DB_NAME = 'PortfolioDB';
const DB_VERSION = 1;
let db = null;

// Initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;

            // Store for profile image
            if (!database.objectStoreNames.contains('profile')) {
                database.createObjectStore('profile', { keyPath: 'id' });
            }

            // Store for posts
            if (!database.objectStoreNames.contains('posts')) {
                database.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

// Save to IndexedDB
function saveToDB(storeName, data) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);

        request.onsuccess = () => {
            showSaveNotification();
            resolve(request.result);
        };
        request.onerror = () => reject(request.error);
    });
}

// Get from IndexedDB
function getFromDB(storeName, key) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Get all from IndexedDB
function getAllFromDB(storeName) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Clear store in IndexedDB
function clearStore(storeName) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Delete from IndexedDB
function deleteFromDB(storeName, key) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized');
            return;
        }
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Show save notification
function showSaveNotification() {
    let notification = document.getElementById('saveNotification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'saveNotification';
        notification.innerHTML = '<i class="fas fa-check-circle"></i> Saved';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
            z-index: 9999;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
        document.body.appendChild(notification);
    }

    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
    }, 2000);
}

// Compress image before saving
function compressImage(dataUrl, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = dataUrl;
    });
}

// =====================
// Profile Image Upload
// =====================
const imageUpload = document.getElementById('imageUpload');
const profileImage = document.getElementById('profileImage');
const profilePlaceholder = document.getElementById('profilePlaceholder');
const postAvatar = document.getElementById('postAvatar');

// Load saved profile image from IndexedDB
async function loadProfileImage() {
    try {
        const profileData = await getFromDB('profile', 'main');
        if (profileData && profileData.image) {
            updateProfileImages(profileData.image);
        }
    } catch (e) {
        // Fallback to localStorage
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            updateProfileImages(savedImage);
        }
    }
}

function updateProfileImages(imageSrc) {
    // Update hero profile image
    if (profileImage) {
        profileImage.src = imageSrc;
        profileImage.classList.add('has-image');
    }
    if (profilePlaceholder) {
        profilePlaceholder.classList.add('hidden');
    }

    // Update post avatar
    if (postAvatar) {
        postAvatar.src = imageSrc;
        postAvatar.classList.add('has-image');
        const avatarPlaceholder = postAvatar.nextElementSibling;
        if (avatarPlaceholder) {
            avatarPlaceholder.classList.add('hidden');
        }
    }
}

if (imageUpload) {
    imageUpload.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                let imageSrc = e.target.result;

                // Compress image
                imageSrc = await compressImage(imageSrc, 400, 0.8);

                updateProfileImages(imageSrc);

                // Save to IndexedDB
                try {
                    await saveToDB('profile', { id: 'main', image: imageSrc });
                } catch (err) {
                    // Fallback to localStorage
                    localStorage.setItem('profileImage', imageSrc);
                    showSaveNotification();
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// =====================
// Post Modal
// =====================
const postModal = document.getElementById('postModal');
const openPostModalBtn = document.getElementById('openPostModal');
const closePostModalBtn = document.getElementById('closePostModal');
const postActionBtns = document.querySelectorAll('.post-action-btn');
const publishPostBtn = document.getElementById('publishPost');
const postText = document.getElementById('postText');
const mediaPreview = document.getElementById('mediaPreview');
const postImageUpload = document.getElementById('postImageUpload');
const postVideoUpload = document.getElementById('postVideoUpload');
const videoUrlInput = document.getElementById('videoUrl');
const postsFeed = document.getElementById('postsFeed');

let currentMedia = null;
let currentMediaType = null;

// Open modal
function openModal() {
    if (postModal) {
        postModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal() {
    if (postModal) {
        postModal.classList.remove('active');
        document.body.style.overflow = '';
        resetModal();
    }
}

// Reset modal
function resetModal() {
    if (postText) postText.value = '';
    if (mediaPreview) mediaPreview.innerHTML = '';
    if (videoUrlInput) videoUrlInput.value = '';
    currentMedia = null;
    currentMediaType = null;
}

if (openPostModalBtn) {
    openPostModalBtn.addEventListener('click', openModal);
}

if (closePostModalBtn) {
    closePostModalBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside
if (postModal) {
    postModal.addEventListener('click', function(e) {
        if (e.target === postModal) {
            closeModal();
        }
    });
}

// Post action buttons (Post, Photo, Video)
postActionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.dataset.type;
        openModal();

        if (type === 'image' && postImageUpload) {
            postImageUpload.click();
        } else if (type === 'video' && postVideoUpload) {
            postVideoUpload.click();
        }
    });
});

// Image upload for post
if (postImageUpload) {
    postImageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                // Compress image for storage
                currentMedia = await compressImage(e.target.result, 800, 0.7);
                currentMediaType = 'image';
                if (mediaPreview) {
                    mediaPreview.innerHTML = `<img src="${currentMedia}" alt="Post image">`;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Video upload for post
if (postVideoUpload) {
    postVideoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentMedia = e.target.result;
                currentMediaType = 'video';
                if (mediaPreview) {
                    mediaPreview.innerHTML = `<video controls><source src="${currentMedia}" type="${file.type}"></video>`;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Video URL input
if (videoUrlInput) {
    videoUrlInput.addEventListener('input', function() {
        const url = this.value.trim();
        if (url) {
            const embedUrl = getVideoEmbedUrl(url);
            if (embedUrl) {
                currentMedia = embedUrl;
                currentMediaType = 'embed';
                if (mediaPreview) {
                    mediaPreview.innerHTML = `<iframe width="100%" height="315" src="${embedUrl}" frameborder="0" allowfullscreen style="border-radius: 12px;"></iframe>`;
                }
            }
        }
    });
}

// Convert video URL to embed URL
function getVideoEmbedUrl(url) {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return null;
}

// Publish post - handled in the edit/create section below

// Create new post
function createPost(text, media, mediaType) {
    const savedImage = localStorage.getItem('profileImage');
    const now = new Date();
    const timeString = 'Just now';

    let mediaHtml = '';
    if (media) {
        if (mediaType === 'image') {
            mediaHtml = `<div class="post-media"><img src="${media}" alt="Post image"></div>`;
        } else if (mediaType === 'video') {
            mediaHtml = `<div class="post-media"><video controls><source src="${media}"></video></div>`;
        } else if (mediaType === 'embed') {
            mediaHtml = `<div class="post-media"><iframe width="100%" height="315" src="${media}" frameborder="0" allowfullscreen style="border-radius: 12px;"></iframe></div>`;
        }
    }

    const avatarHtml = savedImage
        ? `<img src="${savedImage}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
        : `<i class="fas fa-user"></i>`;

    const postHtml = `
        <article class="post-card" style="opacity: 0; transform: translateY(20px);">
            <div class="post-header">
                <div class="post-author">
                    <div class="author-avatar">
                        ${avatarHtml}
                    </div>
                    <div class="author-info">
                        <h4>Vinayak C S</h4>
                        <span class="post-date">${timeString}</span>
                    </div>
                </div>
                <div class="post-menu">
                    <button class="post-menu-btn"><i class="fas fa-ellipsis-h"></i></button>
                    <div class="post-dropdown">
                        <button class="dropdown-item edit-post-btn"><i class="fas fa-edit"></i> Edit</button>
                        <button class="dropdown-item delete-post-btn"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
            </div>
            <div class="post-content">
                ${text ? `<p>${text}</p>` : ''}
                ${mediaHtml}
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn"><i class="far fa-heart"></i> Like</button>
                <button class="action-btn"><i class="far fa-comment"></i> Comment</button>
                <button class="action-btn"><i class="fas fa-share"></i> Share</button>
            </div>
        </article>
    `;

    if (postsFeed) {
        postsFeed.insertAdjacentHTML('afterbegin', postHtml);

        // Animate in
        const newPost = postsFeed.firstElementChild;
        setTimeout(() => {
            newPost.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            newPost.style.opacity = '1';
            newPost.style.transform = 'translateY(0)';
        }, 10);

        // Add like functionality to new post
        const likeBtn = newPost.querySelector('.like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', handleLike);
        }

        // Add menu functionality to new post
        initPostMenu(newPost);

        // Save posts to localStorage
        savePosts();
    }
}

// Handle like button
function handleLike() {
    this.classList.toggle('liked');
    const icon = this.querySelector('i');
    if (this.classList.contains('liked')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
    }
}

// Add like functionality to existing posts
document.querySelectorAll('.action-btn').forEach(btn => {
    if (btn.textContent.includes('Like')) {
        btn.classList.add('like-btn');
        btn.addEventListener('click', handleLike);
    }
});

// Save posts to IndexedDB
async function savePosts() {
    if (postsFeed) {
        const posts = [];
        postsFeed.querySelectorAll('.post-card').forEach((card, index) => {
            const content = card.querySelector('.post-content p');
            const media = card.querySelector('.post-media');
            const date = card.querySelector('.post-date');
            const liked = card.querySelector('.like-btn.liked') !== null;

            let mediaData = null;
            let mediaType = null;

            if (media) {
                const img = media.querySelector('img');
                const video = media.querySelector('video source');
                const iframe = media.querySelector('iframe');

                if (img) {
                    mediaData = img.src;
                    mediaType = 'image';
                } else if (video) {
                    mediaData = video.src;
                    mediaType = 'video';
                } else if (iframe) {
                    mediaData = iframe.src;
                    mediaType = 'embed';
                }
            }

            posts.push({
                id: index,
                text: content ? content.textContent : '',
                media: mediaData,
                mediaType: mediaType,
                date: date ? date.textContent : 'Just now',
                liked: liked
            });
        });

        try {
            await clearStore('posts');
            for (const post of posts) {
                await saveToDB('posts', post);
            }
        } catch (err) {
            console.error('Error saving posts:', err);
            // Fallback: try localStorage for text-only
            try {
                const textOnlyPosts = posts.map(p => ({
                    ...p,
                    media: p.mediaType === 'embed' ? p.media : null // Only keep embed URLs
                }));
                localStorage.setItem('posts', JSON.stringify(textOnlyPosts));
                showSaveNotification();
            } catch (e) {
                console.error('localStorage also failed:', e);
            }
        }
    }
}

// Load posts from IndexedDB
async function loadPosts() {
    if (!postsFeed) return;

    try {
        const posts = await getAllFromDB('posts');

        if (posts && posts.length > 0) {
            // Clear default posts
            postsFeed.innerHTML = '';

            // Sort by id (newest first - higher id = newer)
            posts.sort((a, b) => a.id - b.id);

            const savedProfileImage = await getFromDB('profile', 'main');
            const avatarSrc = savedProfileImage?.image || '';

            posts.forEach(post => {
                const avatarHtml = avatarSrc
                    ? `<img src="${avatarSrc}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
                    : `<i class="fas fa-user"></i>`;

                let mediaHtml = '';
                if (post.media && post.mediaType) {
                    if (post.mediaType === 'image') {
                        mediaHtml = `<div class="post-media"><img src="${post.media}" alt="Post image"></div>`;
                    } else if (post.mediaType === 'video') {
                        mediaHtml = `<div class="post-media"><video controls><source src="${post.media}"></video></div>`;
                    } else if (post.mediaType === 'embed') {
                        mediaHtml = `<div class="post-media"><iframe width="100%" height="315" src="${post.media}" frameborder="0" allowfullscreen style="border-radius: 12px;"></iframe></div>`;
                    }
                }

                const postHtml = `
                    <article class="post-card">
                        <div class="post-header">
                            <div class="post-author">
                                <div class="author-avatar">
                                    ${avatarHtml}
                                </div>
                                <div class="author-info">
                                    <h4>Vinayak C S</h4>
                                    <span class="post-date">${post.date}</span>
                                </div>
                            </div>
                            <div class="post-menu">
                                <button class="post-menu-btn"><i class="fas fa-ellipsis-h"></i></button>
                                <div class="post-dropdown">
                                    <button class="dropdown-item edit-post-btn"><i class="fas fa-edit"></i> Edit</button>
                                    <button class="dropdown-item delete-post-btn"><i class="fas fa-trash"></i> Delete</button>
                                </div>
                            </div>
                        </div>
                        <div class="post-content">
                            ${post.text ? `<p>${post.text}</p>` : ''}
                            ${mediaHtml}
                        </div>
                        <div class="post-actions">
                            <button class="action-btn like-btn ${post.liked ? 'liked' : ''}">
                                <i class="${post.liked ? 'fas' : 'far'} fa-heart"></i> Like
                            </button>
                            <button class="action-btn"><i class="far fa-comment"></i> Comment</button>
                            <button class="action-btn"><i class="fas fa-share"></i> Share</button>
                        </div>
                    </article>
                `;

                postsFeed.insertAdjacentHTML('beforeend', postHtml);
            });

            // Re-attach handlers
            document.querySelectorAll('.like-btn').forEach(btn => {
                btn.addEventListener('click', handleLike);
            });

            document.querySelectorAll('.post-card').forEach(postCard => {
                initPostMenu(postCard);
            });
        }
    } catch (err) {
        console.error('Error loading posts:', err);
        // Fallback to localStorage
        try {
            const savedPosts = localStorage.getItem('posts');
            if (savedPosts) {
                const posts = JSON.parse(savedPosts);
                // Reconstruct posts from localStorage data
                console.log('Loaded from localStorage fallback');
            }
        } catch (e) {
            console.error('localStorage fallback also failed:', e);
        }
    }
}

// Auto-save on visibility change (when user leaves page)
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        savePosts();
    }
});

// Save before page unload
window.addEventListener('beforeunload', function() {
    savePosts();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modal
    if (e.key === 'Escape') {
        if (postModal && postModal.classList.contains('active')) {
            closeModal();
        }
        if (deleteModal && deleteModal.classList.contains('active')) {
            closeDeleteModal();
        }
        // Close any open dropdowns
        document.querySelectorAll('.post-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
    }
});

// =====================
// Post Menu & Delete
// =====================
const deleteModal = document.getElementById('deleteModal');
const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const postModalTitle = document.getElementById('postModalTitle');

let postToDelete = null;
let postToEdit = null;
let isEditMode = false;

// Initialize post menu for a single post
function initPostMenu(postCard) {
    const menuBtn = postCard.querySelector('.post-menu-btn');
    const menu = postCard.querySelector('.post-menu');
    const deleteBtn = postCard.querySelector('.delete-post-btn');
    const editBtn = postCard.querySelector('.edit-post-btn');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            // Close other open menus
            document.querySelectorAll('.post-menu.active').forEach(m => {
                if (m !== menu) m.classList.remove('active');
            });
            menu.classList.toggle('active');
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            postToDelete = postCard;
            openDeleteModal();
            menu.classList.remove('active');
        });
    }

    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            postToEdit = postCard;
            openEditModal(postCard);
            menu.classList.remove('active');
        });
    }
}

// Initialize all existing post menus
document.querySelectorAll('.post-card').forEach(postCard => {
    initPostMenu(postCard);
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.post-menu')) {
        document.querySelectorAll('.post-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
    }
});

// Delete Modal Functions
function openDeleteModal() {
    if (deleteModal) {
        deleteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDeleteModal() {
    if (deleteModal) {
        deleteModal.classList.remove('active');
        document.body.style.overflow = '';
        postToDelete = null;
    }
}

if (closeDeleteModalBtn) {
    closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
}

if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
}

if (deleteModal) {
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
}

// Confirm Delete
if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', function() {
        if (postToDelete) {
            // Animate out
            postToDelete.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            postToDelete.style.opacity = '0';
            postToDelete.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                postToDelete.remove();
                savePosts();
                closeDeleteModal();
            }, 300);
        }
    });
}

// Edit Post Functions
function openEditModal(postCard) {
    isEditMode = true;
    const content = postCard.querySelector('.post-content p');
    const media = postCard.querySelector('.post-media');

    if (postModalTitle) {
        postModalTitle.textContent = 'Edit Post';
    }

    if (publishPostBtn) {
        publishPostBtn.textContent = 'Save Changes';
    }

    if (postText && content) {
        postText.value = content.textContent;
    }

    // Handle existing media
    if (media && mediaPreview) {
        const img = media.querySelector('img');
        const video = media.querySelector('video');
        const iframe = media.querySelector('iframe');

        if (img) {
            currentMedia = img.src;
            currentMediaType = 'image';
            mediaPreview.innerHTML = `<img src="${currentMedia}" alt="Post image">`;
        } else if (video) {
            currentMedia = video.querySelector('source')?.src || '';
            currentMediaType = 'video';
            mediaPreview.innerHTML = `<video controls><source src="${currentMedia}"></video>`;
        } else if (iframe) {
            currentMedia = iframe.src;
            currentMediaType = 'embed';
            mediaPreview.innerHTML = `<iframe width="100%" height="315" src="${currentMedia}" frameborder="0" allowfullscreen style="border-radius: 12px;"></iframe>`;
        }
    }

    openModal();
}

// Setup publish button to handle both create and edit
function setupPublishButton() {
    const publishBtn = document.getElementById('publishPost');
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            const text = postText ? postText.value.trim() : '';

            if (!text && !currentMedia) {
                alert('Please add some content to your post.');
                return;
            }

            if (isEditMode && postToEdit) {
                // Update existing post
                updatePost(postToEdit, text, currentMedia, currentMediaType);
            } else {
                // Create new post
                createPost(text, currentMedia, currentMediaType);
            }

            closeModal();
        });
    }
}

setupPublishButton();

// Update existing post
function updatePost(postCard, text, media, mediaType) {
    const contentDiv = postCard.querySelector('.post-content');

    let mediaHtml = '';
    if (media) {
        if (mediaType === 'image') {
            mediaHtml = `<div class="post-media"><img src="${media}" alt="Post image"></div>`;
        } else if (mediaType === 'video') {
            mediaHtml = `<div class="post-media"><video controls><source src="${media}"></video></div>`;
        } else if (mediaType === 'embed') {
            mediaHtml = `<div class="post-media"><iframe width="100%" height="315" src="${media}" frameborder="0" allowfullscreen style="border-radius: 12px;"></iframe></div>`;
        }
    }

    contentDiv.innerHTML = `
        ${text ? `<p>${text}</p>` : ''}
        ${mediaHtml}
    `;

    // Update date to show edited
    const dateSpan = postCard.querySelector('.post-date');
    if (dateSpan) {
        dateSpan.textContent = 'Edited just now';
    }

    savePosts();
}

// Override closeModal to reset edit mode
const originalCloseModal = closeModal;
closeModal = function() {
    if (postModal) {
        postModal.classList.remove('active');
        document.body.style.overflow = '';

        // Reset form
        if (postText) postText.value = '';
        if (mediaPreview) mediaPreview.innerHTML = '';
        if (videoUrlInput) videoUrlInput.value = '';
        currentMedia = null;
        currentMediaType = null;

        // Reset edit mode
        isEditMode = false;
        postToEdit = null;

        if (postModalTitle) {
            postModalTitle.textContent = 'Create Post';
        }

        const publishBtn = document.getElementById('publishPost') || document.querySelector('.modal-footer .btn-primary');
        if (publishBtn) {
            publishBtn.textContent = 'Publish';
        }
    }
};

// =====================
// Initialize Application
// =====================
async function initApp() {
    try {
        // Initialize IndexedDB
        await initDB();
        console.log('IndexedDB initialized');

        // Load profile image
        await loadProfileImage();

        // Load saved posts
        await loadPosts();

        console.log('Portfolio data loaded successfully');
    } catch (err) {
        console.error('Error initializing app:', err);
        // Fallback: try loading from localStorage
        loadProfileImage();
    }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
