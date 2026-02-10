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
// Profile Image Upload
// =====================
const imageUpload = document.getElementById('imageUpload');
const profileImage = document.getElementById('profileImage');
const profilePlaceholder = document.getElementById('profilePlaceholder');
const postAvatar = document.getElementById('postAvatar');

// Load saved profile image from localStorage
function loadProfileImage() {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        updateProfileImages(savedImage);
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
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageSrc = e.target.result;
                updateProfileImages(imageSrc);
                // Save to localStorage
                localStorage.setItem('profileImage', imageSrc);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Load profile image on page load
loadProfileImage();

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
            reader.onload = function(e) {
                currentMedia = e.target.result;
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

// Save posts to localStorage
function savePosts() {
    if (postsFeed) {
        localStorage.setItem('posts', postsFeed.innerHTML);
    }
}

// Load posts from localStorage
function loadPosts() {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts && postsFeed) {
        postsFeed.innerHTML = savedPosts;

        // Re-attach like handlers
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', handleLike);
        });

        // Re-attach menu handlers
        document.querySelectorAll('.post-card').forEach(postCard => {
            initPostMenu(postCard);
        });
    }
}

// Uncomment to enable post persistence
// loadPosts();

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
