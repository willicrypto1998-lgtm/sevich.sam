/**
 * Cart - Sevich Hair
 * Panier avec limite 3 unités totales + capture abandoned cart
 */

const Cart = (function() {
    let items = [];
    
    function load() {
        items = SEVICH.storage.get(SEVICH.KEYS.CART, []);
    }
    
    function save() {
        SEVICH.storage.set(SEVICH.KEYS.CART, items);
        updateUI();
        triggerAbandonedCapture();
    }
    
    function getMaxItems() {
        return SEVICH.getConfig().max_cart_items;
    }
    
    function getTotalItems() {
        return items.reduce((s, i) => s + i.quantity, 0);
    }
    
    function getSubtotal() {
        return items.reduce((s, i) => s + (i.price * i.quantity), 0);
    }
    
    function getAll() {
        return [...items];
    }
    
    function add(product, quantity = 1) {
        const max = getMaxItems();
        const totalAfter = getTotalItems() + quantity;
        
        if (totalAfter > max) {
            const remaining = max - getTotalItems();
            if (remaining <= 0) {
                SEVICH.toast(`الحد الأقصى للطلب هو ${max} قطع. لا يمكن إضافة المزيد.`, 'warning');
                return false;
            }
            SEVICH.toast(`يمكنك إضافة ${remaining} قطع فقط (الحد الأقصى ${max})`, 'warning');
            quantity = remaining;
        }
        
        const existing = items.find(i => i.id === product.id && i.variant === product.variant);
        if (existing) {
            existing.quantity += quantity;
        } else {
            items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                comparePrice: product.comparePrice || null,
                image: product.image,
                variant: product.variant || null,
                variantName: product.variantName || null,
                quantity: quantity,
            });
        }
        
        save();
        SEVICH.toast('تمت إضافة المنتج إلى السلة ✓', 'success');
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'AddToCart', {
                content_ids: [product.id],
                content_name: product.title,
                content_type: 'product',
                value: product.price * quantity,
                currency: 'DZD',
            });
        }
        
        return true;
    }
    
    function updateQuantity(id, variant, newQty) {
        const item = items.find(i => i.id === id && i.variant === variant);
        if (!item) return;
        
        if (newQty <= 0) {
            remove(id, variant);
            return;
        }
        
        const others = items
            .filter(i => !(i.id === id && i.variant === variant))
            .reduce((s, i) => s + i.quantity, 0);
        
        const max = getMaxItems();
        if (others + newQty > max) {
            const allowed = Math.max(1, max - others);
            item.quantity = allowed;
            SEVICH.toast(`الحد الأقصى للطلب هو ${max} قطع`, 'warning');
        } else {
            item.quantity = newQty;
        }
        save();
    }
    
    function remove(id, variant) {
        items = items.filter(i => !(i.id === id && i.variant === variant));
        save();
        SEVICH.toast('تم حذف المنتج', 'success');
    }
    
    function clear() {
        items = [];
        save();
    }
    
    function updateUI() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const total = getTotalItems();
            cartCount.textContent = total;
            cartCount.style.display = total > 0 ? 'flex' : 'none';
        }
        renderDrawer();
    }
    
    function renderDrawer() {
        const body = document.getElementById('cartDrawerBody');
        const footer = document.getElementById('cartDrawerFooter');
        const subtotalEl = document.getElementById('cartSubtotal');
        if (!body) return;
        
        const max = getMaxItems();
        
        if (items.length === 0) {
            body.innerHTML = `
                <div class="cart-empty">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 01-8 0"></path>
                    </svg>
                    <p>سلتك فارغة</p>
                    <a href="catalog.html" class="btn btn-dark">تصفح المنتجات</a>
                </div>
            `;
            if (footer) footer.style.display = 'none';
            return;
        }
        
        body.innerHTML = items.map(item => {
            const variantStr = item.variant ? JSON.stringify(item.variant) : 'null';
            return `
            <div class="cart-item">
                <img src="${SEVICH.escapeAttr(item.image)}" alt="" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${SEVICH.escapeHtml(item.title)}</h4>
                    ${item.variantName ? `<div class="cart-item-variant">${SEVICH.escapeHtml(item.variantName)}</div>` : ''}
                    <div class="cart-item-price">${SEVICH.formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <div class="qty-control">
                            <button onclick="Cart.updateQuantity('${SEVICH.escapeAttr(item.id)}', ${variantStr}, ${item.quantity - 1})">−</button>
                            <input type="number" value="${item.quantity}" min="1" max="${max}" 
                                onchange="Cart.updateQuantity('${SEVICH.escapeAttr(item.id)}', ${variantStr}, parseInt(this.value) || 1)">
                            <button onclick="Cart.updateQuantity('${SEVICH.escapeAttr(item.id)}', ${variantStr}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="cart-item-remove" onclick="Cart.remove('${SEVICH.escapeAttr(item.id)}', ${variantStr})">حذف</button>
                    </div>
                </div>
            </div>
            `;
        }).join('');
        
        if (footer) {
            footer.style.display = 'block';
            const limitNotice = footer.querySelector('.cart-limit-notice');
            if (limitNotice) limitNotice.textContent = `⚠️ الحد الأقصى للطلب: ${max} قطع`;
        }
        if (subtotalEl) subtotalEl.textContent = SEVICH.formatPrice(getSubtotal());
    }
    
    // ============ ABANDONED CART CAPTURE ============
    let abandonedTimer = null;
    function triggerAbandonedCapture() {
        clearTimeout(abandonedTimer);
        abandonedTimer = setTimeout(() => {
            const customer = SEVICH.storage.get(SEVICH.KEYS.CUSTOMER, {});
            if (items.length > 0 && customer.phone) {
                sendAbandonedCart(customer);
            }
        }, 2000);
    }
    
    function saveCustomerInfo(info) {
        const current = SEVICH.storage.get(SEVICH.KEYS.CUSTOMER, {});
        const updated = { ...current, ...info };
        SEVICH.storage.set(SEVICH.KEYS.CUSTOMER, updated);
        if (items.length > 0 && updated.phone) {
            sendAbandonedCart(updated);
        }
    }
    
    function sendAbandonedCart(customer) {
        // Rate limiting
        const lastSent = parseInt(localStorage.getItem('sevich_abandoned_last') || '0');
        if (Date.now() - lastSent < 30000) return;
        
        // Sauvegarder en local pour l'admin
        const abandoned = SEVICH.storage.get(SEVICH.KEYS.ABANDONED, []);
        const phoneClean = (customer.phone || '').replace(/\D/g, '');
        
        let found = false;
        for (let i = 0; i < abandoned.length; i++) {
            const existPhone = (abandoned[i].customer.phone || '').replace(/\D/g, '');
            if (existPhone === phoneClean) {
                abandoned[i].customer = customer;
                abandoned[i].cart = items;
                abandoned[i].subtotal = getSubtotal();
                abandoned[i].updated_at = new Date().toISOString();
                abandoned[i].count = (abandoned[i].count || 1) + 1;
                found = true;
                break;
            }
        }
        if (!found) {
            abandoned.push({
                id: 'ab_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
                customer: customer,
                cart: items,
                subtotal: getSubtotal(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                count: 1,
                recovered: false,
            });
        }
        if (abandoned.length > 500) abandoned.splice(0, abandoned.length - 500);
        SEVICH.storage.set(SEVICH.KEYS.ABANDONED, abandoned);
        
        // Envoi vers Google Sheets
        const config = SEVICH.getConfig();
        if (config.google_sheets_webhook) {
            const cartSummary = items.map(i => 
                `${i.title}${i.variantName ? ' (' + i.variantName + ')' : ''} x${i.quantity}`
            ).join(' | ');
            
            fetch(config.google_sheets_webhook, {
                method: 'POST',
                mode: 'no-cors', // important pour Apps Script
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'abandoned_cart',
                    data: {
                        phone: customer.phone || '',
                        name: customer.name || '',
                        email: customer.email || '',
                        wilaya: customer.wilaya || '',
                        commune: customer.commune || '',
                        address: customer.address || '',
                        cart_items: cartSummary,
                        subtotal: getSubtotal(),
                        updated_at: new Date().toISOString(),
                    },
                }),
            }).catch(() => {});
        }
        
        localStorage.setItem('sevich_abandoned_last', Date.now().toString());
    }
    
    function clearAbandoned() {
        SEVICH.storage.remove(SEVICH.KEYS.CUSTOMER);
        localStorage.removeItem('sevich_abandoned_last');
    }
    
    function init() {
        load();
        updateUI();
        
        const cartToggle = document.getElementById('cartToggle');
        const cartClose = document.getElementById('cartClose');
        const cartBackdrop = document.getElementById('cartBackdrop');
        const cartDrawer = document.getElementById('cartDrawer');
        
        function openDrawer() {
            cartDrawer?.classList.add('active');
            cartBackdrop?.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeDrawer() {
            cartDrawer?.classList.remove('active');
            cartBackdrop?.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        cartToggle?.addEventListener('click', openDrawer);
        cartClose?.addEventListener('click', closeDrawer);
        cartBackdrop?.addEventListener('click', closeDrawer);
        
        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn?.addEventListener('click', (e) => {
            if (items.length === 0) {
                e.preventDefault();
                SEVICH.toast('سلتك فارغة', 'warning');
                return;
            }
            if (typeof fbq !== 'undefined') {
                fbq('track', 'InitiateCheckout', {
                    content_ids: items.map(i => i.id),
                    num_items: getTotalItems(),
                    value: getSubtotal(),
                    currency: 'DZD',
                });
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    return {
        add, remove, updateQuantity, clear, getAll, getTotalItems, getSubtotal,
        saveCustomerInfo, clearAbandoned, getMaxItems,
    };
})();

window.Cart = Cart;
