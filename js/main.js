/* ============================================
   I2BS.TN - Template E-commerce Papeterie
   JavaScript Principal
   ============================================ */

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initProductTabs();
    initQuantitySelector();
    initCartActions();
    initWishlist();
    initPaymentMethods();
    initScrollEffects();
    initSearchBar();
    initNewsletterForm();
});

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
        menu.classList.toggle('active');
        const icon = this.querySelector('i');
        if (menu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active');
            const icon = toggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

/* ============================================
   PRODUCT TABS
   ============================================ */
function initProductTabs() {
    const tabNav = document.querySelector('.tab-nav');
    if (!tabNav) return;

    const tabs = tabNav.querySelectorAll('button');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;

            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active to clicked tab
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
}

/* ============================================
   QUANTITY SELECTOR
   ============================================ */
function initQuantitySelector() {
    const qtyControls = document.querySelectorAll('.qty-control');

    qtyControls.forEach(control => {
        const input = control.querySelector('input');
        const minusBtn = control.querySelector('.qty-minus');
        const plusBtn = control.querySelector('.qty-plus');

        if (!input) return;

        if (minusBtn) {
            minusBtn.addEventListener('click', function() {
                let val = parseInt(input.value) || 1;
                if (val > 1) {
                    input.value = val - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        }

        if (plusBtn) {
            plusBtn.addEventListener('click', function() {
                let val = parseInt(input.value) || 1;
                if (val < 99) {
                    input.value = val + 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        }

        input.addEventListener('change', function() {
            let val = parseInt(this.value) || 1;
            if (val < 1) val = 1;
            if (val > 99) val = 99;
            this.value = val;
        });
    });
}

/* ============================================
   CART ACTIONS
   ============================================ */
function initCartActions() {
    // Add to cart buttons
    const addCartBtns = document.querySelectorAll('.btn-add-cart, .btn-add-cart-lg');

    addCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // Animation feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
            this.style.background = 'var(--success)';

            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
            }, 1500);

            // Update cart badge
            updateCartBadge(1);
        });
    });

    // Remove from cart
    const removeBtns = document.querySelectorAll('.cart-item-remove');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const item = this.closest('.cart-item');
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                item.remove();
                updateCartTotals();
            }, 300);
        });
    });
}

function updateCartBadge(change) {
    const badge = document.querySelector('.header-action .badge');
    if (badge) {
        let count = parseInt(badge.textContent) || 0;
        count += change;
        badge.textContent = count;

        // Pulse animation
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 200);
    }
}

function updateCartTotals() {
    const items = document.querySelectorAll('.cart-item');
    if (items.length === 0) {
        const cartItems = document.querySelector('.cart-items');
        if (cartItems) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Votre panier est vide</h2>
                    <p>Parcourez nos produits et ajoutez-les à votre panier</p>
                    <a href="index.html" class="btn-primary" style="margin-top: 15px;">
                        <i class="fas fa-arrow-left"></i> Continuer les achats
                    </a>
                </div>
            `;
        }
        return;
    }

    let total = 0;
    items.forEach(item => {
        const priceEl = item.querySelector('.cart-item-total');
        if (priceEl) {
            const priceText = priceEl.textContent.replace(/[^0-9.,]/g, '').replace(',', '.');
            total += parseFloat(priceText) || 0;
        }
    });

    // Update summary
    const totalEl = document.querySelector('.summary-row.total span:last-child');
    if (totalEl) {
        totalEl.textContent = total.toFixed(3) + ' TND';
    }
}

/* ============================================
   WISHLIST
   ============================================ */
function initWishlist() {
    const wishlistBtns = document.querySelectorAll('.btn-wishlist, .product-actions button:first-child');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i') || this;

            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = 'var(--accent)';

                // Toast notification
                showToast('Produit ajouté aux favoris !');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';

                showToast('Produit retiré des favoris');
            }
        });
    });
}

/* ============================================
   PAYMENT METHODS
   ============================================ */
function initPaymentMethods() {
    const methods = document.querySelectorAll('.payment-method');

    methods.forEach(method => {
        method.addEventListener('click', function() {
            methods.forEach(m => {
                m.classList.remove('selected');
                m.querySelector('input').checked = false;
            });
            this.classList.add('selected');
            this.querySelector('input').checked = true;
        });
    });
}

/* ============================================
   SCROLL EFFECTS
   ============================================ */
function initScrollEffects() {
    // Header shadow on scroll
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        }

        lastScroll = currentScroll;
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .cat-card, .promo-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/* ============================================
   SEARCH BAR
   ============================================ */
function initSearchBar() {
    const searchInput = document.querySelector('.search-bar input');
    if (!searchInput) return;

    searchInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });

    searchInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
}

/* ============================================
   NEWSLETTER FORM
   ============================================ */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const input = this.querySelector('input');
        const btn = this.querySelector('button');

        if (input.value && input.value.includes('@')) {
            const originalText = btn.textContent;
            btn.innerHTML = '<i class="fas fa-check"></i> Inscrit !';
            btn.style.background = 'var(--success)';
            input.value = '';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);

            showToast('Inscription réussie !');
        } else {
            input.style.borderColor = 'var(--accent)';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }
    });
}

/* ============================================
   TOAST NOTIFICATIONS
   ============================================ */
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--dark);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations to CSS
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
`;
document.head.appendChild(toastStyles);

/* ============================================
   CHECKOUT FORM
   ============================================ */
function initCheckoutForm() {
    const form = document.querySelector('.checkout-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Simple validation
        const required = form.querySelectorAll('[required]');
        let valid = true;

        required.forEach(field => {
            if (!field.value.trim()) {
                valid = false;
                field.style.borderColor = 'var(--accent)';
                setTimeout(() => {
                    field.style.borderColor = '';
                }, 2000);
            }
        });

        if (valid) {
            showToast('Commande passée avec succès !');
            // Redirect to confirmation page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    });
}

// Initialize checkout form if on checkout page
if (document.querySelector('.checkout-page')) {
    initCheckoutForm();
}
