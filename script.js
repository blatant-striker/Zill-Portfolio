// Add smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    
    // Mobile detection
    let isMobile = window.innerWidth <= 767;
    
    // Handle window resize events
    window.addEventListener('resize', function() {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 767;
        
        // If switching between mobile and desktop, refresh banner carousel
        if (wasMobile !== isMobile) {
            const bannerCarousel = document.querySelector('.banner-carousel');
            if (bannerCarousel) {
                const bannerTrack = bannerCarousel.querySelector('.banner-track');
                
                if (isMobile) {
                    // Switch to mobile mode - allow transform to work
                    bannerTrack.style.transition = 'transform 0.4s ease';
                    // Initialize at first slide
                    bannerTrack.style.transform = 'translateX(0%)';
                } else {
                    // Switch to desktop mode - reset transform and transition
                    bannerTrack.style.transform = 'none';
                    bannerTrack.style.transition = 'none';
                }
            }
        }
    });
    
    // Banner carousel functionality
    const bannerCarousel = document.querySelector('.banner-carousel');
    
    if(bannerCarousel) {
        const bannerTrack = bannerCarousel.querySelector('.banner-track');
        const bannerSlides = bannerCarousel.querySelectorAll('.banner-slide');
        const bannerDots = bannerCarousel.querySelectorAll('.banner-dots .dot');
        let bannerIndex = 0;
        const bannerCount = bannerSlides.length;
        
        // Only initialize banner carousel on mobile
        if(window.innerWidth <= 767) {
            // Initialize banner carousel
            function updateBannerCarousel() {
                bannerTrack.style.transform = `translateX(-${bannerIndex * 100}%)`;
                
                // Update active dot
                bannerDots.forEach(dot => dot.classList.remove('active'));
                bannerDots[bannerIndex].classList.add('active');
            }
            
            // Auto-advance banner every 3 seconds
            let bannerInterval = setInterval(() => {
                bannerIndex = (bannerIndex + 1) % bannerCount;
                updateBannerCarousel();
            }, 3000);
            
            // Dot navigation for banner
            bannerDots.forEach(dot => {
                dot.addEventListener('click', () => {
                    bannerIndex = parseInt(dot.getAttribute('data-index'));
                    updateBannerCarousel();
                    
                    // Reset interval on manual navigation
                    clearInterval(bannerInterval);
                    bannerInterval = setInterval(() => {
                        bannerIndex = (bannerIndex + 1) % bannerCount;
                        updateBannerCarousel();
                    }, 3000);
                });
            });
            
            // Touch support for banner carousel
            let bannerTouchStartX = 0;
            let bannerTouchEndX = 0;
            let isBannerSwiping = false;
            
            bannerTrack.addEventListener('touchstart', (e) => {
                bannerTouchStartX = e.changedTouches[0].screenX;
                isBannerSwiping = true;
                clearInterval(bannerInterval);
                
                // Improve responsiveness by removing transition
                bannerTrack.style.transition = 'none';
            }, { passive: true });
            
            bannerTrack.addEventListener('touchmove', (e) => {
                if (!isBannerSwiping) return;
                
                const currentX = e.changedTouches[0].screenX;
                const diffX = currentX - bannerTouchStartX;
                const movePercent = (diffX / window.innerWidth) * 100;
                
                // Provide visual feedback during swipe
                if (Math.abs(diffX) > 10) {
                    bannerTrack.style.transform = `translateX(calc(-${bannerIndex * 100}% + ${movePercent}px))`;
                }
            }, { passive: true });
            
            bannerTrack.addEventListener('touchend', (e) => {
                bannerTouchEndX = e.changedTouches[0].screenX;
                isBannerSwiping = false;
                
                // Restore transition
                bannerTrack.style.transition = '';
                
                handleBannerSwipe();
                
                // Resume autoplay after interaction
                bannerInterval = setInterval(() => {
                    bannerIndex = (bannerIndex + 1) % bannerCount;
                    updateBannerCarousel();
                }, 3000);
            }, { passive: true });
            
            function handleBannerSwipe() {
                const swipeThreshold = 50;
                if (bannerTouchEndX < bannerTouchStartX - swipeThreshold) {
                    // Swipe left (next slide)
                    bannerIndex = (bannerIndex + 1) % bannerCount;
                    updateBannerCarousel();
                } else if (bannerTouchEndX > bannerTouchStartX + swipeThreshold) {
                    // Swipe right (previous slide)
                    bannerIndex = (bannerIndex - 1 + bannerCount) % bannerCount;
                    updateBannerCarousel();
                }
            }
        } else {
            // On desktop, ensure track is not transformed and remove any transitions
            bannerTrack.style.transform = 'none';
            bannerTrack.style.transition = 'none';
        }
    }
    
    // Back to top button functionality (mobile only)
    if(isMobile) {
        const backToTopButton = document.querySelector('.back-to-top');
        
        // Show button when scrolled down
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }, { passive: true });
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Apply mobile-specific optimizations
    if(isMobile) {
        // Optimize images for mobile
        const images = document.querySelectorAll('img:not(.expanded-image)');
        images.forEach(img => {
            if(!img.complete) {
                img.style.opacity = '0';
                img.onload = function() {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                };
            }
        });
        
        // Improve scroll performance
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            document.body.classList.add('is-scrolling');
            scrollTimeout = setTimeout(function() {
                document.body.classList.remove('is-scrolling');
            }, 200);
        }, { passive: true });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if(targetId.startsWith('#')) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - (isMobile ? 20 : 80),
                        behavior: 'smooth'
                    });
                }
                
                // Update active class
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // UI Designs Carousel Functionality
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentIndex = 0;
    const slideCount = slides.length;
    
    // Initialize carousel
    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }
    
    // Event listeners for navigation
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateCarousel();
    });
    
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    });
    
    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.getAttribute('data-index'));
            updateCarousel();
        });
    });
    
    // Auto-advance carousel every 5 seconds
    let autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    }, 5000);
    
    // Pause autoplay on hover
    carouselTrack.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    // Resume autoplay on mouse leave
    carouselTrack.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateCarousel();
        }, 5000);
    });
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isSwiping = false;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = true;
        
        // Pause autoplay on touch interaction
        clearInterval(autoplayInterval);
        
        // Improve responsiveness by adding visual feedback
        carouselTrack.style.transition = 'none';
    }, { passive: true });
    
    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        
        const currentX = e.changedTouches[0].screenX;
        const diffX = currentX - touchStartX;
        const movePercent = (diffX / window.innerWidth) * 50;
        
        // Only move if swipe is primarily horizontal
        const currentY = e.changedTouches[0].screenY;
        const diffY = Math.abs(currentY - touchStartY);
        
        if (Math.abs(diffX) > diffY && Math.abs(diffX) > 10) {
            e.preventDefault();
            carouselTrack.style.transform = `translateX(calc(-${currentIndex * 100}% + ${movePercent}px))`;
        }
    }, { passive: false });
    
    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        // Reset transition
        carouselTrack.style.transition = '';
        
        handleSwipe();
        isSwiping = false;
        
        // Resume autoplay after interaction
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateCarousel();
        }, 5000);
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = window.innerWidth > 767 ? 50 : 30;
        const diffX = Math.abs(touchEndX - touchStartX);
        const diffY = Math.abs(touchEndY - touchStartY);
        
        // Ensure the swipe is primarily horizontal
        if (diffX > diffY && diffX > swipeThreshold) {
            if (touchEndX < touchStartX) {
                // Swipe left
                currentIndex = Math.min(currentIndex + 1, slideCount - 1);
                updateCarousel();
            } else {
                // Swipe right
                currentIndex = Math.max(currentIndex - 1, 0);
                updateCarousel();
            }
        } else {
            // If not a valid swipe, reset to current slide
            updateCarousel();
        }
    }
    
    // Image Expansion Functionality
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    const imageOverlay = document.querySelector('.image-overlay');
    const expandedImage = document.querySelector('.expanded-image');
    const expandedCaption = document.querySelector('.expanded-caption h3');
    const expandedDescription = document.querySelector('.expanded-caption p');
    const closeOverlay = document.querySelector('.close-overlay');
    
    // Zoom functionality
    const zoomInButton = document.querySelector('.zoom-in');
    const zoomOutButton = document.querySelector('.zoom-out');
    const zoomLevelDisplay = document.querySelector('.zoom-level');
    let currentZoom = 100;
    const minZoom = 100;
    const maxZoom = 300;
    const zoomStep = 20;
    
    // Drag to pan functionality
    let isDragging = false;
    let startX, startY;
    let translateX = 0;
    let translateY = 0;
    let lastTranslateX = 0;
    let lastTranslateY = 0;
    
    // Variables for pinch zoom
    let initialDistance = 0;
    let initialZoom = 0;
    let isPinching = false;

    // Function to calculate distance between two touch points
    function getTouchDistance(event) {
        if (event.touches.length < 2) return 0;
        
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Function to get center point of two touches
    function getTouchCenter(event) {
        if (event.touches.length < 2) return { x: 0, y: 0 };
        
        return {
            x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
            y: (event.touches[0].clientY + event.touches[1].clientY) / 2
        };
    }

    // Function to open the expanded image view
    function openExpandedView(imageSrc, captionText, descriptionText) {
        expandedImage.src = imageSrc;
        expandedCaption.textContent = captionText;
        expandedDescription.textContent = descriptionText;
        
        // Reset zoom level and position when opening a new image
        currentZoom = 100;
        translateX = 0;
        translateY = 0;
        lastTranslateX = 0;
        lastTranslateY = 0;
        updateZoomLevel(currentZoom);
        updateImagePosition();
        expandedImage.classList.remove('zoomed');
        expandedImage.classList.remove('dragging');
        
        // Reset pinch zoom state
        isPinching = false;
        initialDistance = 0;
        initialZoom = 0;
        
        // Pause carousel autoplay when image is expanded
        clearInterval(autoplayInterval);
        
        // Add mobile detection for better mobile experience
        if (window.innerWidth <= 767) {
            // Mobile-specific adjustments - don't directly set transform here
            // as it will conflict with the other transforms
            expandedImage.classList.add('mobile-view');
        } else {
            expandedImage.classList.remove('mobile-view');
        }
        
        // Show the overlay with animation
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        setTimeout(() => {
            imageOverlay.classList.add('active');
        }, 10);
    }
    
    // Function to close the expanded image view
    function closeExpandedView() {
        imageOverlay.classList.remove('active');
        
        // Re-enable scrolling after animation completes
        setTimeout(() => {
            document.body.style.overflow = '';
            
            // Resume carousel autoplay
            autoplayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slideCount;
                updateCarousel();
            }, 5000);
        }, 300);
    }
    
    // Function to update zoom level
    function updateZoomLevel(zoomLevel) {
        // Ensure zoom level is a number and within bounds
        zoomLevel = Math.min(Math.max(parseInt(zoomLevel) || 100, minZoom), maxZoom);
        
        // Update the current zoom
        currentZoom = zoomLevel;
        zoomLevelDisplay.textContent = `${currentZoom}%`;
        
        // Apply zoom transform along with any existing translation
        updateImageTransform();
        
        // Toggle zoomed class for cursor change
        if (currentZoom > 100) {
            expandedImage.classList.add('zoomed');
        } else {
            expandedImage.classList.remove('zoomed');
            // Reset position when zooming back to 100%
            translateX = 0;
            translateY = 0;
            lastTranslateX = 0;
            lastTranslateY = 0;
            updateImagePosition();
        }
        
        // Debug info
        console.log(`Zoom level set to: ${currentZoom}%`);
    }
    
    // Function to update image transform with both zoom and position
    function updateImageTransform() {
        expandedImage.style.transform = `scale(${currentZoom / 100}) translate(${translateX}px, ${translateY}px)`;
    }
    
    // Function to update image position only
    function updateImagePosition() {
        translateX = lastTranslateX;
        translateY = lastTranslateY;
        updateImageTransform();
    }
    
    // Zoom in button click
    zoomInButton.addEventListener('click', () => {
        if (currentZoom < maxZoom) {
            updateZoomLevel(currentZoom + zoomStep);
        }
    });
    
    // Zoom out button click
    zoomOutButton.addEventListener('click', () => {
        if (currentZoom > minZoom) {
            updateZoomLevel(currentZoom - zoomStep);
        }
    });
    
    // Double click on image to toggle between 100% and 200%
    expandedImage.addEventListener('dblclick', (e) => {
        e.preventDefault(); // Prevent default double-click behavior
        
        if (currentZoom <= 100) {
            // When zooming in, zoom toward the click point
            const rect = expandedImage.getBoundingClientRect();
            const offsetX = (e.clientX - rect.left) / rect.width;
            const offsetY = (e.clientY - rect.top) / rect.height;
            
            // Calculate position to keep click point centered after zoom
            const zoomFactor = 2; // 200% / 100%
            translateX = (0.5 - offsetX) * rect.width * (zoomFactor - 1) / zoomFactor;
            translateY = (0.5 - offsetY) * rect.height * (zoomFactor - 1) / zoomFactor;
            lastTranslateX = translateX;
            lastTranslateY = translateY;
            
            updateZoomLevel(200);
        } else {
            // When zooming out, reset position to center
            updateZoomLevel(100);
        }
    });
    
    // Mouse wheel zoom
    expandedImage.addEventListener('wheel', (e) => {
        e.preventDefault(); // Prevent page scrolling
        if (imageOverlay.classList.contains('active')) {
            if (e.deltaY < 0 && currentZoom < maxZoom) {
                // Scroll up, zoom in
                updateZoomLevel(currentZoom + zoomStep);
            } else if (e.deltaY > 0 && currentZoom > minZoom) {
                // Scroll down, zoom out
                updateZoomLevel(currentZoom - zoomStep);
            }
        }
    });
    
    // Drag to pan functionality
    expandedImage.addEventListener('mousedown', (e) => {
        if (currentZoom > 100) { // Only allow dragging when zoomed in
            isDragging = true;
            expandedImage.classList.add('dragging');
            startX = e.clientX;
            startY = e.clientY;
            e.preventDefault(); // Prevent image dragging default behavior
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = (e.clientX - startX) * (100 / currentZoom);
            const dy = (e.clientY - startY) * (100 / currentZoom);
            translateX = lastTranslateX + dx;
            translateY = lastTranslateY + dy;
            updateImageTransform();
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            expandedImage.classList.remove('dragging');
            lastTranslateX = translateX;
            lastTranslateY = translateY;
        }
    });
    
    // Touch support for dragging and pinching
    expandedImage.addEventListener('touchstart', (e) => {
        // Handle pinch zoom (two finger touch)
        if (e.touches.length === 2) {
            e.preventDefault();
            isPinching = true;
            isDragging = false; // Ensure we're not in dragging mode
            initialDistance = getTouchDistance(e);
            initialZoom = currentZoom;
            
            // Get the center point between the two touches
            const center = getTouchCenter(e);
            startX = center.x;
            startY = center.y;
            return;
        }
        
        // Handle single touch for dragging
        if (e.touches.length === 1) {
            if (currentZoom > 100) { // Only allow dragging when zoomed in
                e.preventDefault();
                isPinching = false;
                isDragging = true;
                expandedImage.classList.add('dragging');
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
        }
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
        if (!imageOverlay.classList.contains('active')) return;
        
        // Handle pinch zoom
        if (isPinching && e.touches.length === 2) {
            e.preventDefault();
            
            const currentDistance = getTouchDistance(e);
            if (initialDistance > 0) {
                // Calculate new zoom level based on pinch distance change
                const scale = currentDistance / initialDistance;
                const newZoom = Math.min(Math.max(initialZoom * scale, minZoom), maxZoom);
                
                // Round to nearest 5 to avoid small fluctuations
                const roundedZoom = Math.round(newZoom / 5) * 5;
                
                // Update zoom with the new calculated level
                if (roundedZoom !== currentZoom) {
                    updateZoomLevel(roundedZoom);
                }
                
                // Update center position for better pinch experience
                const center = getTouchCenter(e);
                const dx = (center.x - startX) * (100 / currentZoom);
                const dy = (center.y - startY) * (100 / currentZoom);
                translateX = lastTranslateX + dx;
                translateY = lastTranslateY + dy;
                updateImageTransform();
                
                // Update start position for next move
                startX = center.x;
                startY = center.y;
            }
            return;
        }
        
        // Handle dragging with one finger
        if (isDragging && e.touches.length === 1 && currentZoom > 100) {
            e.preventDefault();
            const dx = (e.touches[0].clientX - startX) * (100 / currentZoom);
            const dy = (e.touches[0].clientY - startY) * (100 / currentZoom);
            translateX = lastTranslateX + dx;
            translateY = lastTranslateY + dy;
            updateImageTransform();
        }
    }, { passive: false });
    
    // Add double tap support for mobile zoom
    let lastTapTime = 0;
    let lastTapX = 0;
    let lastTapY = 0;
    const doubleTapThreshold = 300; // ms
    const doubleTapPositionThreshold = 40; // pixels

    expandedImage.addEventListener('touchend', (e) => {
        if (!imageOverlay.classList.contains('active')) return;
        
        // Reset pinch zoom state
        if (isPinching) {
            lastTranslateX = translateX;
            lastTranslateY = translateY;
            isPinching = false;
            return;
        }
        
        // Handle end of dragging
        if (isDragging) {
            isDragging = false;
            expandedImage.classList.remove('dragging');
            lastTranslateX = translateX;
            lastTranslateY = translateY;
            return;
        }
        
        // Only process tap if we weren't dragging or pinching
        if (e.touches.length === 0 && !isPinching && !isDragging) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapTime;
            
            // Get tap position
            const tapX = e.changedTouches[0].clientX;
            const tapY = e.changedTouches[0].clientY;
            
            // Check if it's a double tap (time threshold and position threshold)
            const isDoubleTap = 
                tapLength < doubleTapThreshold && 
                Math.abs(tapX - lastTapX) < doubleTapPositionThreshold &&
                Math.abs(tapY - lastTapY) < doubleTapPositionThreshold;
            
            if (isDoubleTap) {
                e.preventDefault();
                
                // Toggle zoom between 100% and 200%, similar to PC double-click
                if (currentZoom <= 100) {
                    // When zooming in, zoom toward the tap point
                    const rect = expandedImage.getBoundingClientRect();
                    const offsetX = (tapX - rect.left) / rect.width;
                    const offsetY = (tapY - rect.top) / rect.height;
                    
                    // Calculate position to keep tap point centered after zoom
                    const zoomFactor = 2; // 200% / 100%
                    translateX = (0.5 - offsetX) * rect.width * (zoomFactor - 1) / zoomFactor;
                    translateY = (0.5 - offsetY) * rect.height * (zoomFactor - 1) / zoomFactor;
                    lastTranslateX = translateX;
                    lastTranslateY = translateY;
                    
                    updateZoomLevel(200);
                    console.log("Zoomed in to 200%");
                } else {
                    // When zooming out, reset position
                    translateX = 0;
                    translateY = 0;
                    lastTranslateX = 0;
                    lastTranslateY = 0;
                    updateZoomLevel(100);
                    console.log("Zoomed out to 100%");
                }
                
                // Provide visual feedback for double tap
                expandedImage.classList.add('tap-feedback');
                setTimeout(() => {
                    expandedImage.classList.remove('tap-feedback');
                }, 200);
                
                // Reset tap tracking
                lastTapTime = 0;
                lastTapX = 0;
                lastTapY = 0;
            } else {
                // Store this tap's info for potential double tap detection
                lastTapTime = currentTime;
                lastTapX = tapX;
                lastTapY = tapY;
            }
        }
    }, { passive: false });
    
    // Handle touchend on document level to properly handle dragging and pinching
    document.addEventListener('touchend', (e) => {
        if (!imageOverlay.classList.contains('active')) return;
        
        // Reset pinch zoom state
        if (isPinching) {
            lastTranslateX = translateX;
            lastTranslateY = translateY;
            isPinching = false;
        }
        
        if (isDragging) {
            isDragging = false;
            expandedImage.classList.remove('dragging');
            lastTranslateX = translateX;
            lastTranslateY = translateY;
        }
    }, { passive: true });
    
    // Handle touch cancel events
    document.addEventListener('touchcancel', (e) => {
        isPinching = false;
        isDragging = false;
        expandedImage.classList.remove('dragging');
        lastTranslateX = translateX;
        lastTranslateY = translateY;
    }, { passive: true });
    
    // Add click event to all carousel images
    carouselImages.forEach(image => {
        image.addEventListener('click', function() {
            const slide = this.closest('.carousel-slide');
            const caption = slide.querySelector('.slide-caption h4').textContent;
            const description = slide.querySelector('.slide-caption p').textContent;
            openExpandedView(this.src, caption, description);
        });
    });
    
    // Close expanded view when clicking close button or overlay background
    closeOverlay.addEventListener('click', closeExpandedView);
    imageOverlay.addEventListener('click', function(e) {
        if (e.target === imageOverlay) {
            closeExpandedView();
        }
    });
    
    // Close expanded view with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageOverlay.classList.contains('active')) {
            closeExpandedView();
        }
    });
}); 