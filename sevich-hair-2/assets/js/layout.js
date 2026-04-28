/**
 * Layout - Sevich Hair
 * Injecte le header, footer, et Facebook Pixel dans toutes les pages
 */

(function() {
    const config = SEVICH.getConfig();
    const currentPage = document.body.dataset.page || 'home';
    
    // ============ Facebook Pixel ============
    if (config.facebook_pixel_id) {
        !function(f,b,e,v,n,t,s){
            if(f.fbq) return;
            n = f.fbq = function() { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
            if(!f._fbq) f._fbq = n;
            n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
            t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', config.facebook_pixel_id);
        fbq('track', 'PageView');
    }
    
    // ============ Expose config to window ============
    window.SITE_CONFIG = {
        maxCartItems: config.max_cart_items,
        currency: config.currency,
        facebookPixelId: config.facebook_pixel_id,
        shippingHome: config.shipping_home,
        shippingOffice: config.shipping_office,
    };
    
    // ============ Header HTML ============
    function buildHeader() {
        const isActive = (page) => page === currentPage ? 'active' : '';
        
        return `
        <div class="announcement-bar">
            <div class="container">
                <p>${SEVICH.escapeHtml(config.site_tagline)}</p>
            </div>
        </div>
        
        <header class="site-header">
            <div class="container header-inner">
                <button class="menu-toggle" id="menuToggle" aria-label="Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                
                <a href="index.html" class="site-logo">
                    <span class="logo-text">${SEVICH.escapeHtml(config.site_name)}</span>
                </a>
                
                <nav class="main-nav" id="mainNav">
                    <a href="index.html" class="${isActive('home')}">الرئيسية</a>
                    <a href="catalog.html" class="${isActive('catalog')}">المنتجات</a>
                    <a href="contact.html" class="${isActive('contact')}">اتصل بنا</a>
                </nav>
                
                <div class="header-actions">
                    <button class="search-toggle" id="searchToggle" aria-label="Search">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                    <button class="cart-toggle" id="cartToggle" aria-label="Cart">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 01-8 0"></path>
                        </svg>
                        <span class="cart-count" id="cartCount">0</span>
                    </button>
                </div>
            </div>
        </header>
        
        <div class="search-overlay" id="searchOverlay">
            <div class="container">
                <div class="search-inner">
                    <input type="search" class="search-input" id="searchInput" placeholder="ابحث عن منتج..." autocomplete="off">
                    <button class="search-close" id="searchClose" aria-label="Close">×</button>
                </div>
                <div class="search-results" id="searchResults"></div>
            </div>
        </div>
        
        <div class="cart-drawer" id="cartDrawer">
            <div class="cart-drawer-header">
                <h3>سلة التسوق</h3>
                <button class="cart-close" id="cartClose" aria-label="Close">×</button>
            </div>
            <div class="cart-drawer-body" id="cartDrawerBody"></div>
            <div class="cart-drawer-footer" id="cartDrawerFooter" style="display:none;">
                <div class="cart-limit-notice">⚠️ الحد الأقصى للطلب: ${config.max_cart_items} قطع</div>
                <div class="cart-subtotal">
                    <span>المجموع الفرعي:</span>
                    <strong id="cartSubtotal">DA 0.00</strong>
                </div>
                <a href="checkout.html" class="btn btn-dark btn-block" id="checkoutBtn">إتمام الطلب</a>
            </div>
        </div>
        <div class="cart-backdrop" id="cartBackdrop"></div>
        `;
    }
    
    // ============ Footer HTML ============
    function buildFooter() {
        const phoneClean = (config.whatsapp_number || '').replace(/\D/g, '');
        return `
        <section class="newsletter-section">
            <div class="container">
                <div class="newsletter-inner">
                    <h2>خليلنا إيمايلك</h2>
                    <p>اذا اردتم ان ننبهكم على عروض مميزة وإمكانية الوصول المبكر إلى المنتجات الجديدة</p>
                    <form class="newsletter-form" id="newsletterForm">
                        <input type="email" name="email" placeholder="بريدك الإلكتروني" required>
                        <button type="submit">اشتراك</button>
                    </form>
                </div>
            </div>
        </section>
        
        <footer class="site-footer">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <h4>${SEVICH.escapeHtml(config.site_name)}</h4>
                        <p>منتجات العناية بالشعر الأصلية، توصيل لجميع ولايات الجزائر مع الدفع عند الاستلام.</p>
                    </div>
                    <div class="footer-col">
                        <h4>روابط سريعة</h4>
                        <ul>
                            <li><a href="index.html">الرئيسية</a></li>
                            <li><a href="catalog.html">المنتجات</a></li>
                            <li><a href="contact.html">اتصل بنا</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>اتصل بنا</h4>
                        <ul>
                            <li>📞 ${SEVICH.escapeHtml(config.whatsapp_number)}</li>
                            <li>✉️ ${SEVICH.escapeHtml(config.email)}</li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>طرق الدفع</h4>
                        <p>💵 الدفع عند الاستلام<br>🚚 توصيل لـ 58 ولاية</p>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>© ${new Date().getFullYear()} ${SEVICH.escapeHtml(config.site_name)}. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
        
        <a href="https://wa.me/${phoneClean}" class="whatsapp-float" target="_blank" rel="noopener" aria-label="WhatsApp">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 0C7.2 0 0 7.2 0 16c0 2.8.7 5.5 2.1 7.9L0 32l8.4-2.2C10.7 31.2 13.3 32 16 32c8.8 0 16-7.2 16-16S24.8 0 16 0zm0 29.3c-2.4 0-4.8-.7-6.8-1.9l-.5-.3-5 1.3 1.3-4.9-.3-.5C3.4 21 2.7 18.5 2.7 16 2.7 8.7 8.7 2.7 16 2.7s13.3 6 13.3 13.3-6 13.3-13.3 13.3zm7.3-9.9c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1.1 1.3-1.3 1.6-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.3 0-.5-.1-.7-.1-.2-.9-2.2-1.3-3-.3-.8-.7-.7-.9-.7h-.8c-.3 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.4s1.5 4 1.7 4.2c.2.3 2.9 4.5 7.1 6.2 1 .4 1.8.7 2.4.9 1 .3 1.9.3 2.6.2.8-.1 2.4-1 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.2-.4-.3-.8-.5z"/>
            </svg>
        </a>
        
        <div class="toast-container" id="toastContainer"></div>
        `;
    }
    
    // ============ Inject DOM ============
    document.addEventListener('DOMContentLoaded', function() {
        const headerSlot = document.getElementById('site-header-slot');
        const footerSlot = document.getElementById('site-footer-slot');
        if (headerSlot) headerSlot.innerHTML = buildHeader();
        if (footerSlot) footerSlot.innerHTML = buildFooter();
        
        // Update title
        if (config.site_name) {
            const t = document.title;
            if (!t.includes(config.site_name)) {
                document.title = t + ' | ' + config.site_name;
            }
        }
        
        // Bind event handlers (pour que cart.js et search puissent les retrouver)
        bindHeaderEvents();
        
        // Notify ready
        document.dispatchEvent(new CustomEvent('layout:ready'));
    });
    
    function bindHeaderEvents() {
        // Header scroll
        const header = document.querySelector('.site-header');
        window.addEventListener('scroll', () => {
            if (header) header.classList.toggle('scrolled', window.scrollY > 10);
        }, { passive: true });
        
        // Mobile menu
        const menuToggle = document.getElementById('menuToggle');
        const mainNav = document.getElementById('mainNav');
        menuToggle?.addEventListener('click', () => mainNav?.classList.toggle('active'));
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => mainNav?.classList.remove('active'));
        });
        
        // Search
        const searchToggle = document.getElementById('searchToggle');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        searchToggle?.addEventListener('click', () => {
            searchOverlay?.classList.add('active');
            setTimeout(() => searchInput?.focus(), 100);
        });
        searchClose?.addEventListener('click', () => searchOverlay?.classList.remove('active'));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') searchOverlay?.classList.remove('active');
        });
        
        let searchTimer = null;
        searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimer);
            const q = e.target.value.trim();
            if (q.length < 2) {
                if (searchResults) searchResults.innerHTML = '';
                return;
            }
            searchTimer = setTimeout(() => doSearch(q), 250);
        });
        
        function doSearch(query) {
            const products = SEVICH.getProducts();
            const results = products.filter(p => {
                const haystack = (p.title + ' ' + (p.description || '') + ' ' + (p.short_description || '')).toLowerCase();
                return haystack.includes(query.toLowerCase());
            });
            
            if (!searchResults) return;
            if (results.length === 0) {
                searchResults.innerHTML = '<p style="text-align:center;padding:40px;color:#888;">لا توجد نتائج</p>';
                return;
            }
            searchResults.innerHTML = results.map(p => `
                <a href="product.html?id=${encodeURIComponent(p.id)}" class="search-result-item">
                    <img src="${SEVICH.escapeAttr(p.images[0] || '')}" alt="">
                    <div class="search-result-info">
                        <h4>${SEVICH.escapeHtml(p.title)}</h4>
                        <div class="price">${SEVICH.formatPrice(p.price)}</div>
                    </div>
                </a>
            `).join('');
        }
        
        // Newsletter
        const newsletterForm = document.getElementById('newsletterForm');
        newsletterForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.email.value.trim();
            if (!email) return;
            
            const cfg = SEVICH.getConfig();
            if (cfg.google_sheets_webhook) {
                fetch(cfg.google_sheets_webhook, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'newsletter',
                        data: { email, created_at: new Date().toISOString() },
                    }),
                }).catch(() => {});
            }
            
            SEVICH.toast('شكرا لاشتراكك!', 'success');
            newsletterForm.reset();
        });
    }
})();
