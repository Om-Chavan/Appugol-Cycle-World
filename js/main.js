/**
 * Cycle World - Main JavaScript
 * Handles interactive functionality for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Handle missing images
    handleMissingImages();
    
    // Initialize all components
    initMobileMenu();
    initCarousel();
    initProductFilters();
    initQuickView();
    initFaqToggle();
    initServiceBooking();
    initQuantitySelectors();
    initFormValidation();
    initScrollEffects();
});

/**
 * Handle missing images gracefully
 */
function handleMissingImages() {
    // Create placeholder icon for missing images
    function createImagePlaceholder(element, type) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder ' + type + '-placeholder';
        
        // Use appropriate icon based on context
        let icon = 'image';
        if (type === 'product') icon = 'bicycle';
        if (type === 'category') icon = 'list';
        if (type === 'accessory') icon = 'cog';
        
        placeholder.innerHTML = `<i class="fas fa-${icon}"></i>`;
        
        // Add placeholder to parent element
        element.appendChild(placeholder);
        return placeholder;
    }
    
    // Add error class to all images that fail to load
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.classList.add('error');
            
            // Create appropriate placeholder based on context
            if (this.parentElement) {
                if (this.parentElement.classList.contains('product-image')) {
                    createImagePlaceholder(this.parentElement, 'product');
                    this.style.display = 'none';
                } 
                else if (this.parentElement.classList.contains('category-card')) {
                    // Category cards use CSS ::before for gradient background
                    this.style.display = 'none';
                }
                else if (this.parentElement.classList.contains('testimonial-author')) {
                    createImagePlaceholder(this.parentElement, 'avatar');
                    this.style.display = 'none';
                }
            }
        });
    });
    
    // Handle background images in carousel
    const carouselImages = document.querySelectorAll('.carousel-image');
    carouselImages.forEach(div => {
        const url = div.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
        if (url) {
            const img = new Image();
            img.onload = function() {
                // Image loaded successfully, do nothing
            };
            img.onerror = function() {
                // Image failed to load, apply a gradient background instead
                div.style.backgroundImage = 'linear-gradient(45deg, var(--primary-color), var(--dark-color))';
            };
            img.src = url;
        }
    });
    
    // Make sure category cards are properly styled for missing images
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        const img = card.querySelector('img');
        if (img && (!img.complete || img.naturalHeight === 0)) {
            img.classList.add('error');
            img.style.display = 'none';
        }
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    // This would be implemented for responsive menu on smaller screens
    // Not fully implemented in this example as we're focusing on desktop first
}

/**
 * Carousel functionality
 */
function initCarousel() {
    const carousel = document.querySelector('.carousel-section');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    const prevBtn = carousel.querySelector('.prev-arrow');
    const nextBtn = carousel.querySelector('.next-arrow');
    
    let currentSlide = 0;
    let slideInterval;
    const autoPlayDelay = 5000; // 5 seconds between slides
    
    // Function to show a specific slide
    function goToSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
    }
    
    // Function to go to next slide
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        goToSlide(next);
    }
    
    // Function to go to previous slide
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) {
            prev = slides.length - 1;
        }
        goToSlide(prev);
    }
    
    // Set up auto play
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    // Stop auto play when user interacts with carousel
    function stopAutoPlay() {
        clearInterval(slideInterval);
    }
    
    // Restart auto play after user interaction
    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Event listeners for controls
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            restartAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            restartAutoPlay();
        });
    }
    
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            goToSlide(index);
            restartAutoPlay();
        });
    });
    
    // Pause autoplay when hovering over carousel
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Touch support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance to be considered a swipe
        
        if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right - go to previous slide
            prevSlide();
        } else if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left - go to next slide
            nextSlide();
        }
    }
    
    // Initialize carousel - start with first slide and auto play
    goToSlide(0);
    startAutoPlay();
}

/**
 * Product Filters
 */
function initProductFilters() {
    // Only run on the products page
    if (!document.querySelector('.product-filters')) return;

    // Category filter
    const categoryLinks = document.querySelectorAll('.filter-list a[data-category]');
    const productCards = document.querySelectorAll('.product-card');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            categoryLinks.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-category');
            
            // Show all products if "all" is selected, otherwise filter
            if (selectedCategory === 'all') {
                productCards.forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                productCards.forEach(card => {
                    if (card.getAttribute('data-category') === selectedCategory) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
            
            // Update product count
            updateProductCount();
        });
    });
    
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            const value = this.value;
            priceValue.textContent = value >= 250000 ? '₹250000+' : '₹' + value;
        });
    }
    
    // Apply filters button
    const applyFiltersBtn = document.querySelector('.apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // In a real implementation, this would gather all filter values
            // and apply them to the product listing
            alert('Filters applied!');
        });
    }
    
    // Reset filters button
    const resetFiltersBtn = document.querySelector('.reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Reset category selection
            const allCategoryLink = document.querySelector('.filter-list a[data-category="all"]');
            if (allCategoryLink) {
                categoryLinks.forEach(link => link.classList.remove('active'));
                allCategoryLink.classList.add('active');
            }
            
            // Reset price slider
            if (priceRange) {
                priceRange.value = 250000;
                priceValue.textContent = '₹250000+';
            }
            
            // Reset checkboxes
            document.querySelectorAll('.filter-list input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = true;
            });
            
            // Show all products
            productCards.forEach(card => {
                card.style.display = 'block';
            });
            
            // Update product count
            updateProductCount();
        });
    }
    
    // Sort by dropdown
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            // In a real implementation, this would sort the products
            // based on the selected option
            const sortValue = this.value;
            console.log('Sorting by:', sortValue);
            
            // Placeholder for sorting logic
            alert(`Products sorted by: ${sortValue}`);
        });
    }
    
    // Pagination
    const paginationBtns = document.querySelectorAll('.page-btn');
    if (paginationBtns.length) {
        paginationBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.classList.contains('next')) {
                    // Logic for next page
                    alert('Next page');
                    return;
                }
                
                // Remove active class from all buttons
                paginationBtns.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // In a real implementation, this would load the appropriate page of products
                alert(`Page ${this.textContent} selected`);
            });
        });
    }
    
    // Helper function to update product count
    function updateProductCount() {
        const visibleProducts = document.querySelectorAll('.product-card[style="display: block"]').length || 
                               document.querySelectorAll('.product-card:not([style="display: none"])').length;
        
        const productCountElem = document.getElementById('productCount');
        if (productCountElem) {
            productCountElem.textContent = visibleProducts;
        }
    }
}

/**
 * Quick View Modal
 */
function initQuickView() {
    const quickViewModal = document.getElementById('quickViewModal');
    if (!quickViewModal) return;
    
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const closeModal = document.querySelector('.close-modal');
    
    // Open modal when quick view button is clicked
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // In a real implementation, this would load product details dynamically
            // For this example, we'll just display the modal with static content
            quickViewModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close modal when X is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            quickViewModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === quickViewModal) {
            quickViewModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Option buttons (size, color, etc.)
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from sibling buttons
            const siblingBtns = this.parentElement.querySelectorAll('.option-btn');
            siblingBtns.forEach(sibling => sibling.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // Color options
    const colorOptions = document.querySelectorAll('.color-option input');
    colorOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Remove active class from all color circles
            document.querySelectorAll('.color-circle').forEach(circle => {
                circle.classList.remove('active');
            });
            
            // Add active class to selected color circle
            this.nextElementSibling.classList.add('active');
        });
    });
    
    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            alert('Product added to cart!');
            quickViewModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Add to wishlist button
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            alert('Product added to wishlist!');
        });
    }
}

/**
 * FAQ Toggle
 */
function initFaqToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.toggle-icon i');
        
        question.addEventListener('click', function() {
            // Toggle active class
            item.classList.toggle('active');
            
            // Toggle icon
            if (icon) {
                icon.className = item.classList.contains('active') ? 'fas fa-minus' : 'fas fa-plus';
            }
            
            // Toggle answer visibility
            if (answer) {
                answer.style.display = item.classList.contains('active') ? 'block' : 'none';
            }
        });
    });
}

/**
 * Service Booking
 */
function initServiceBooking() {
    const bookingBtns = document.querySelectorAll('.book-btn');
    const bookingModal = document.getElementById('bookingModal');
    const closeModal = bookingModal ? bookingModal.querySelector('.close-modal') : null;
    const serviceTypeSelect = document.getElementById('serviceType');
    
    if (!bookingBtns.length || !bookingModal) return;
    
    bookingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Set the service type based on the button's data attribute
            const serviceType = this.getAttribute('data-service');
            
            if (serviceTypeSelect) {
                // Find and select the appropriate option
                for (let i = 0; i < serviceTypeSelect.options.length; i++) {
                    if (serviceTypeSelect.options[i].value === serviceType) {
                        serviceTypeSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            
            // Show the modal
            bookingModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal when X is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            bookingModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Form submission
    const bookingForm = bookingModal ? bookingModal.querySelector('.booking-form') : null;
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, this would submit the form data via AJAX
            alert('Booking submitted successfully! We will contact you shortly to confirm your appointment.');
            
            // Close the modal
            bookingModal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Reset the form
            this.reset();
        });
    }
}

/**
 * Quantity Selectors
 */
function initQuantitySelectors() {
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    if (!quantitySelectors.length) return;
    
    quantitySelectors.forEach(selector => {
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        const input = selector.querySelector('.quantity-input');
        
        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', function() {
                let value = parseInt(input.value);
                if (value > parseInt(input.min)) {
                    input.value = value - 1;
                }
            });
            
            plusBtn.addEventListener('click', function() {
                let value = parseInt(input.value);
                if (value < parseInt(input.max)) {
                    input.value = value + 1;
                }
            });
        }
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        let valid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                valid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // Email validation
        const emailField = contactForm.querySelector('input[type="email"]');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                valid = false;
                emailField.classList.add('error');
            }
        }
        
        if (valid) {
            // In a real implementation, this would submit the form data via AJAX
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset the form
            contactForm.reset();
        } else {
            alert('Please fill in all required fields correctly.');
        }
    });
}

/**
 * Add to Cart Functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, this would add the product to the cart
            // For this example, we'll just show an alert
            alert('Product added to cart!');
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim()) {
                alert('Thank you for subscribing to our newsletter!');
                this.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
});

/**
 * Scroll Effects
 */
function initScrollEffects() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const sections = document.querySelectorAll('section');
    
    // Scroll to top button functionality
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Scroll-triggered animations for elements
    const scrollAnimElements = document.querySelectorAll('.scroll-anim');
    
    // Add scroll-anim class to elements we want to animate on scroll
    document.querySelectorAll('.product-card, .service-card, .category-card, .section-title').forEach(el => {
        if (!el.classList.contains('scroll-anim')) {
            el.classList.add('scroll-anim');
        }
    });
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll animations
    function handleScrollAnimations() {
        scrollAnimElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
            }
        });
    }
    
    // Initial check for elements in viewport
    handleScrollAnimations();
    
    // Check on scroll
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Add parallax effect to sections with background
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        // Parallax effect for background elements
        sections.forEach(section => {
            if (section.classList.contains('featured-products') || section.classList.contains('services')) {
                const speed = 0.2;
                section.style.backgroundPosition = `center ${scrollPosition * speed}px`;
            }
        });
    });
}