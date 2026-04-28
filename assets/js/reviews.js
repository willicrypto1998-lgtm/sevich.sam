/**
 * Générateur d'avis fake déterministes
 * Même ID produit => mêmes avis (pas de changement à chaque rafraîchissement)
 */

const ReviewsGenerator = (function() {
    const algerianNames = [
        'أمينة بن علي', 'فاطمة الزهراء', 'سامية محمدي', 'كريمة بوزيد', 'نادية بلقاسم',
        'هدى مرزوق', 'رشيدة قاسمي', 'وردة بن صالح', 'خديجة عبدلي', 'ليلى حمداني',
        'سعاد بوعلام', 'يمينة شريف', 'مريم العربي', 'زهرة بن عمر', 'حياة بكوش',
        'صبرينة لعرج', 'نورة بن يوسف', 'أسماء بوشعيب', 'منال زيداني', 'إيمان قويدر',
        'سهام بوقرة', 'فريدة عيساوي', 'سارة بن مالك', 'لطيفة هاشمي', 'حنان بن ناصر',
        'كنزة سعيدي', 'إكرام بوعزيز', 'دليلة بلهادي', 'وفاء مزهود', 'سميرة بوداود',
        'محمد العربي', 'أحمد بن يحيى', 'يوسف قدور', 'كمال بوزيان', 'عبد القادر بن علي',
        'رضا حمدي', 'بلال مرابط', 'مهدي بوغرارة', 'سفيان بن عمار', 'إلياس قويسم',
    ];
    
    const cities = [
        'الجزائر العاصمة', 'وهران', 'قسنطينة', 'عنابة', 'سطيف', 'باتنة',
        'البليدة', 'تيزي وزو', 'بجاية', 'تلمسان', 'سكيكدة', 'جيجل',
        'بومرداس', 'مستغانم', 'تيبازة', 'الشلف', 'بسكرة', 'ورقلة',
    ];
    
    const comments = [
        'منتج ممتاز والله، جربته وأنا مرتاحة بزاف. التوصيل كان سريع و الجودة عالية.',
        'بصح المنتج راهو يستحق. النتيجة فورية و طبيعية، شكرا للفريق.',
        'أحسن منتج جربته في حياتي، النتيجة فاقت كل توقعاتي. أنصح به بقوة.',
        'جودة عالية و سعر مناسب. التغطية ممتازة و تدوم طول النهار.',
        'وصل سريع و التغليف نظيف. المنتج فعال جدا و يستحق كل دينار.',
        'بصح راني فرحانة، استعملته شهر كامل و النتيجة واضحة. ميرسي.',
        'منتج كويس و التوصيل كان في الوقت. النتيجة طبيعية بزاف.',
        'صراحة فاقت توقعاتي، اللون مطابق تماما لشعري الطبيعي. ممتاز!',
        'أنا زوجي يستعملو و راه مبسوط. التغطية احترافية و المنتج أصلي.',
        'هذا ثاني طلب ليا، المنتج رائع و خدمة الزبائن ممتازة. شكرا.',
        'جربته في عرس صديقتي و الكل قاللي شعرك راني واعر. النتيجة باهية.',
        'أحسن استثمار، النتيجة فورية و ما يلطخش الملابس. أنصح به.',
        'الحق يقال، منتج 100% أصلي و النتيجة كيما في الإعلان. ميرسي.',
        'باهي، استعملته أسبوع و راني فرحان بالنتيجة. أنصح ببقوة.',
        'منتج رائع، يصمد ضد الماء و الرياح. النتيجة طبيعية تماما.',
        'بصح راني مرتاح، النتيجة احترافية و المنتج أصلي مية بالمية.',
        'سهل الاستعمال و النتيجة فورية. أنصح به لكل من يعاني من الفراغات.',
        'منتج ممتاز و التوصيل سريع. شكرا على الجودة و الاحترافية.',
        'أصدقائي يسألوني واش راني نستعمل، صراحة المنتج فعال جدا.',
        'الله يبارك، منتج أصلي و فعال. ما ندمتش على الشراء.',
    ];
    
    const titles = [
        'منتج رائع جدا', 'أنصح به', 'جودة ممتازة', 'فعال 100%',
        'تستحق كل دينار', 'أفضل منتج جربته', 'نتائج مذهلة', 'سعر مناسب',
        'توصيل سريع', 'سأطلبه مرة أخرى', 'منتج أصلي', 'يستحق التجربة',
    ];
    
    // PRNG déterministe (mulberry32) basé sur seed
    function makeRng(seed) {
        let s = seed;
        return function() {
            s |= 0; s = s + 0x6D2B79F5 | 0;
            let t = Math.imul(s ^ s >>> 15, 1 | s);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
    
    function hashString(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = (h << 5) - h + str.charCodeAt(i);
            h |= 0;
        }
        return Math.abs(h);
    }
    
    function generate(productId, count = 12) {
        const seed = hashString(productId);
        const rng = makeRng(seed);
        const pick = (arr) => arr[Math.floor(rng() * arr.length)];
        const randInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
        
        const reviews = [];
        const now = Date.now();
        
        for (let i = 0; i < count; i++) {
            const daysAgo = randInt(2, 180);
            const reviewDate = now - (daysAgo * 86400 * 1000);
            
            const r = rng() * 100;
            let rating;
            if (r <= 70) rating = 5;
            else if (r <= 95) rating = 4;
            else rating = 3;
            
            reviews.push({
                id: productId + '-review-' + i,
                name: pick(algerianNames),
                city: pick(cities),
                rating: rating,
                title: pick(titles),
                text: pick(comments),
                date: reviewDate,
                verified: rng() < 0.85,
                helpful: randInt(0, 47),
            });
        }
        
        // Trier par date desc
        reviews.sort((a, b) => b.date - a.date);
        return reviews;
    }
    
    function getStats(reviews) {
        if (reviews.length === 0) return { count: 0, average: 0, distribution: {} };
        const sum = reviews.reduce((s, r) => s + r.rating, 0);
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => dist[r.rating]++);
        return {
            count: reviews.length,
            average: Math.round((sum / reviews.length) * 10) / 10,
            distribution: dist,
        };
    }
    
    function timeAgo(timestamp) {
        const diff = Math.floor((Date.now() - timestamp) / 1000);
        if (diff < 3600) {
            const m = Math.floor(diff / 60);
            return m <= 1 ? 'منذ دقيقة' : `منذ ${m} دقيقة`;
        }
        if (diff < 86400) {
            const h = Math.floor(diff / 3600);
            return h === 1 ? 'منذ ساعة' : `منذ ${h} ساعات`;
        }
        if (diff < 604800) {
            const d = Math.floor(diff / 86400);
            return d === 1 ? 'منذ يوم' : `منذ ${d} أيام`;
        }
        if (diff < 2592000) {
            const w = Math.floor(diff / 604800);
            return w === 1 ? 'منذ أسبوع' : `منذ ${w} أسابيع`;
        }
        const m = Math.floor(diff / 2592000);
        return m === 1 ? 'منذ شهر' : `منذ ${m} أشهر`;
    }
    
    return { generate, getStats, timeAgo };
})();
