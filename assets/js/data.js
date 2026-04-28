/**
 * Sevich Hair - Données globales et configuration
 * Tout est stocké dans localStorage côté navigateur
 */

const SEVICH = {
    KEYS: {
        CONFIG: 'sevich_config',
        PRODUCTS: 'sevich_products',
        ORDERS: 'sevich_orders',
        ABANDONED: 'sevich_abandoned',
        CART: 'sevich_cart',
        CUSTOMER: 'sevich_customer',
        ADMIN_SESSION: 'sevich_admin_session',
    },
    
    // Configuration par défaut
    defaultConfig: {
        site_name: 'Sevich Hair',
        site_tagline: 'مرحبا بيكم التوصيل 58 ولاية و الدفع عند الاستلام',
        currency: 'DA',
        max_cart_items: 3,
        admin_username: 'admin',
        admin_password: 'admin123', // changeable depuis l'admin
        facebook_pixel_id: '',
        google_sheets_webhook: '',
        whatsapp_number: '+213000000000',
        email: 'contact@sevich-hair.dz',
        shipping_home: 600,
        shipping_office: 400,
        reviews_per_product: 12,
    },
    
    // Produits par défaut (basés sur le Shopify original)
    defaultProducts: [
        {
            id: 'sevich-hair-fiber',
            title: 'Sevich hair fiber أفضل شركة ألياف تغطية شعر أمريكية 🇺🇸',
            description: 'ألياف الشعر Sevich هي الحل الأمثل لتغطية الفراغات والشعر الخفيف بشكل فوري وطبيعي. تركيبة أمريكية أصلية 100% تلتصق بالشعر بفضل الشحنة الكهروستاتيكية وتدوم طوال اليوم. مقاومة للماء والرياح والتعرق. متوفرة بعدة ألوان لتناسب جميع أنواع الشعر.',
            short_description: 'تغطية فورية للفراغات بألياف طبيعية أمريكية',
            price: 2950,
            compare_price: 3750,
            images: [
                'https://sevich-hair-2.myshopify.com/cdn/shop/files/IMG_2589.jpg?v=1770864122&width=800',
                'https://sevich-hair-2.myshopify.com/cdn/shop/files/IMG_2591.jpg?v=1770864122&width=800',
                'https://sevich-hair-2.myshopify.com/cdn/shop/files/IMG_2590.jpg?v=1770864122&width=800',
                'https://sevich-hair-2.myshopify.com/cdn/shop/files/IMG_2592.jpg?v=1770864122&width=800',
                'https://sevich-hair-2.myshopify.com/cdn/shop/files/IMG_2593.jpg?v=1770864122&width=800',
            ],
            variants: [
                { name: 'أسود', value: 'black' },
                { name: 'بني داكن', value: 'dark-brown' },
                { name: 'بني فاتح', value: 'light-brown' },
            ],
            stock: 150,
            badge: 'Sale',
            features: [
                'تركيبة أمريكية أصلية 100%',
                'تغطية فورية في 30 ثانية',
                'مقاومة للماء والتعرق',
                'تدوم طوال اليوم',
                'مناسب لجميع أنواع الشعر',
            ],
        },
        {
            id: 'sevich-shadow-hair',
            title: 'Sevich Shadow Hair 🇺🇸 تغطية فورية',
            description: 'بودرة Shadow Hair من Sevich مصممة لتغطية فراغات فروة الرأس وخط الشعر بمظهر طبيعي ومتجانس. تركيبة مقاومة للماء تدوم لساعات طويلة. سهلة الاستخدام مع فرشاة دقيقة للتطبيق المثالي.',
            short_description: 'بودرة تغطية فروة الرأس بمظهر طبيعي',
            price: 2350,
            compare_price: 3500,
            images: [
                'https://sevich-hair-2.myshopify.com/cdn/shop/files/image_7ce603ee-018d-4f60-912b-e99639f97008.webp?v=1766888511&width=800',
                'https://sevich-hair-2.myshopify.com/cdn/shop/files/image_6aab9450-3256-4101-bcea-ed0ce48f62a6.webp?v=1766888511&width=800',
                'https://sevich-hair-2.myshopify.com/cdn/shop/files/image_4af49f48-516c-4b42-8802-24ab89e70abd.webp?v=1766743462&width=800',
                'https://sevich-hair-2.myshopify.com/cdn/shop/files/IMG_0335.jpg?v=1766743462&width=800',
                'https://sevich-hair-2.myshopify.com/cdn/shop/files/IMG_0346.webp?v=1766744629&width=800',
            ],
            variants: [
                { name: 'أسود', value: 'black' },
                { name: 'بني', value: 'brown' },
            ],
            stock: 200,
            badge: 'Sale',
            features: [
                'بودرة احترافية ضد الماء',
                'تغطي فروة الرأس بشكل طبيعي',
                'تدوم لأكثر من 12 ساعة',
                'سهلة التطبيق',
                'لا تترك أثر على الملابس',
            ],
        },
    ],
    
    wilayas: {
        '01': 'أدرار', '02': 'الشلف', '03': 'الأغواط', '04': 'أم البواقي',
        '05': 'باتنة', '06': 'بجاية', '07': 'بسكرة', '08': 'بشار',
        '09': 'البليدة', '10': 'البويرة', '11': 'تمنراست', '12': 'تبسة',
        '13': 'تلمسان', '14': 'تيارت', '15': 'تيزي وزو', '16': 'الجزائر',
        '17': 'الجلفة', '18': 'جيجل', '19': 'سطيف', '20': 'سعيدة',
        '21': 'سكيكدة', '22': 'سيدي بلعباس', '23': 'عنابة', '24': 'قالمة',
        '25': 'قسنطينة', '26': 'المدية', '27': 'مستغانم', '28': 'المسيلة',
        '29': 'معسكر', '30': 'ورقلة', '31': 'وهران', '32': 'البيض',
        '33': 'إليزي', '34': 'برج بوعريريج', '35': 'بومرداس', '36': 'الطارف',
        '37': 'تندوف', '38': 'تيسمسيلت', '39': 'الوادي', '40': 'خنشلة',
        '41': 'سوق أهراس', '42': 'تيبازة', '43': 'ميلة', '44': 'عين الدفلى',
        '45': 'النعامة', '46': 'عين تموشنت', '47': 'غرداية', '48': 'غليزان',
        '49': 'تيميمون', '50': 'برج باجي مختار', '51': 'أولاد جلال', '52': 'بني عباس',
        '53': 'عين صالح', '54': 'عين قزام', '55': 'تقرت', '56': 'جانت',
        '57': 'المغير', '58': 'المنيعة',
    },
    
    // ============ STORAGE HELPERS ============
    storage: {
        get(key, defaultVal = null) {
            try {
                const v = localStorage.getItem(key);
                return v ? JSON.parse(v) : defaultVal;
            } catch (e) {
                return defaultVal;
            }
        },
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        remove(key) {
            localStorage.removeItem(key);
        },
    },
    
    // ============ CONFIG ============
    getConfig() {
        const stored = this.storage.get(this.KEYS.CONFIG, {});
        return { ...this.defaultConfig, ...stored };
    },
    
    saveConfig(updates) {
        const current = this.storage.get(this.KEYS.CONFIG, {});
        const merged = { ...current, ...updates };
        this.storage.set(this.KEYS.CONFIG, merged);
        return { ...this.defaultConfig, ...merged };
    },
    
    // ============ PRODUCTS ============
    getProducts() {
        const stored = this.storage.get(this.KEYS.PRODUCTS, null);
        if (stored === null) {
            this.storage.set(this.KEYS.PRODUCTS, this.defaultProducts);
            return this.defaultProducts;
        }
        return stored;
    },
    
    getProduct(id) {
        return this.getProducts().find(p => p.id === id) || null;
    },
    
    saveProducts(products) {
        this.storage.set(this.KEYS.PRODUCTS, products);
    },
    
    // ============ FORMAT ============
    formatPrice(amount) {
        return 'DA ' + Number(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    },
    
    // ============ HTML ESCAPE ============
    escapeHtml(text) {
        if (text == null) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    escapeAttr(text) {
        if (text == null) return '';
        return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    
    // ============ URL PARAMS ============
    getQueryParam(name) {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    },
    
    // ============ TOAST ============
    toast(message, type = 'success') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.textContent = message;
        container.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => {
            t.classList.remove('show');
            setTimeout(() => t.remove(), 300);
        }, 3000);
    },
};

// Init au chargement (s'assure que defaultProducts sont là)
SEVICH.getProducts();
