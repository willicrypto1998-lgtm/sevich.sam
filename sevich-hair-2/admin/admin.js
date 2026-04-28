/**
 * Admin Layout - Sevich Hair
 * Sidebar, auth check, layout commun pour toutes les pages admin
 */

const Admin = {
    isLoggedIn() {
        const session = SEVICH.storage.get(SEVICH.KEYS.ADMIN_SESSION, null);
        if (!session) return false;
        // Session expire après 24h
        if (Date.now() - session.loggedAt > 24 * 60 * 60 * 1000) {
            SEVICH.storage.remove(SEVICH.KEYS.ADMIN_SESSION);
            return false;
        }
        return true;
    },
    
    login(username, password) {
        const config = SEVICH.getConfig();
        if (username === config.admin_username && password === config.admin_password) {
            SEVICH.storage.set(SEVICH.KEYS.ADMIN_SESSION, {
                username: username,
                loggedAt: Date.now(),
            });
            return true;
        }
        return false;
    },
    
    logout() {
        SEVICH.storage.remove(SEVICH.KEYS.ADMIN_SESSION);
        window.location.href = 'login.html';
    },
    
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },
    
    getOrders() {
        return SEVICH.storage.get(SEVICH.KEYS.ORDERS, []);
    },
    
    saveOrders(orders) {
        SEVICH.storage.set(SEVICH.KEYS.ORDERS, orders);
    },
    
    getAbandoned() {
        return SEVICH.storage.get(SEVICH.KEYS.ABANDONED, []);
    },
    
    saveAbandoned(abandoned) {
        SEVICH.storage.set(SEVICH.KEYS.ABANDONED, abandoned);
    },
    
    renderSidebar(currentPage) {
        const config = SEVICH.getConfig();
        const orders = this.getOrders();
        const abandoned = this.getAbandoned();
        const pendingOrders = orders.filter(o => (o.status || 'pending') === 'pending').length;
        const pendingAbandoned = abandoned.filter(a => !a.recovered).length;
        
        const isActive = (page) => page === currentPage ? 'active' : '';
        
        return `
        <aside class="admin-sidebar">
            <div class="admin-sidebar-logo">
                <h2>${SEVICH.escapeHtml(config.site_name)}</h2>
                <small>لوحة التحكم</small>
            </div>
            
            <nav class="admin-nav">
                <a href="index.html" class="${isActive('dashboard')}">
                    📊 الرئيسية
                </a>
                <a href="orders.html" class="${isActive('orders')}">
                    🛒 الطلبات
                    ${pendingOrders > 0 ? `<span class="badge">${pendingOrders}</span>` : ''}
                </a>
                <a href="abandoned.html" class="${isActive('abandoned')}">
                    ⚠️ السلال المتروكة
                    ${pendingAbandoned > 0 ? `<span class="badge">${pendingAbandoned}</span>` : ''}
                </a>
                <a href="products.html" class="${isActive('products')}">
                    📦 المنتجات
                </a>
                <a href="settings.html" class="${isActive('settings')}">
                    ⚙️ الإعدادات
                </a>
                <a href="../index.html" target="_blank">
                    🌐 عرض الموقع
                </a>
            </nav>
            
            <div class="admin-sidebar-footer">
                <button onclick="Admin.logout()" class="btn-admin btn-outline" style="width:100%; justify-content:center; background:transparent; color:rgba(255,255,255,.7); border-color:rgba(255,255,255,.2);">
                    تسجيل الخروج
                </button>
            </div>
        </aside>
        `;
    },
    
    init(currentPage) {
        if (!this.requireAuth()) return;
        
        const sidebar = document.getElementById('sidebarSlot');
        if (sidebar) sidebar.outerHTML = this.renderSidebar(currentPage);
    },
};

window.Admin = Admin;
