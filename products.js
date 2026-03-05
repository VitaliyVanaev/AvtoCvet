// ========== КОНФИГУРАЦИЯ ==========
const API_URL = 'https://script.google.com/macros/s/AKfycbz-KMFCLHOnhJPx-P_EnhDkzoT4zjbsd2qySnTHwn9gsuYN_Tsumk6tOrkFW2qBXDWvvg/exec';

const CATEGORY_ICONS = {
    'Материалы для кузовного ремонта': 'fa-car-crash',
    'Масла': 'fa-oil-can',
    'Фильтра': 'fa-filter',
    'Автохимия': 'fa-flask',
    'Автозапчасти': 'fa-cogs',
    'Автосвет': 'fa-lightbulb',
    'Средства индивидуальной защиты': 'fa-hard-hat',
    'Автоэмаль': 'fa-paint-roller',
    'Автомобильные чехлы': 'fa-car'
};

// ========== НАСТРОЙКИ КЭШИРОВАНИЯ ==========
const CACHE_KEYS = {
    PRODUCTS: 'avtocvet_products_cache',
    TIMESTAMP: 'avtocvet_cache_timestamp'
};
const CACHE_DURATION = 30 * 60 * 1000; // 30 минут

// ========== ФУНКЦИИ КЭШИРОВАНИЯ ==========
function saveToCache(products) {
    try {
        localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(products));
        localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
        console.log('✅ Данные сохранены в кэш');
    } catch (error) {
        console.error('❌ Ошибка при сохранении в кэш:', error);
    }
}

function loadFromCache() {
    try {
        const cachedData = localStorage.getItem(CACHE_KEYS.PRODUCTS);
        const cachedTime = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
        
        if (!cachedData || !cachedTime) return null;
        
        const now = Date.now();
        const timeDiff = now - parseInt(cachedTime);
        
        if (timeDiff > CACHE_DURATION) {
            console.log('⏰ Кэш устарел');
            clearCache();
            return null;
        }
        
        console.log('📦 Данные загружены из кэша');
        return JSON.parse(cachedData);
        
    } catch (error) {
        console.error('❌ Ошибка при загрузке из кэша:', error);
        return null;
    }
}

function clearCache() {
    try {
        localStorage.removeItem(CACHE_KEYS.PRODUCTS);
        localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
        console.log('🧹 Кэш очищен');
    } catch (error) {
        console.error('❌ Ошибка при очистке кэша:', error);
    }
}

// ========== УПРАВЛЕНИЕ ЛОАДЕРОМ ==========
function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

// ========== ЗАГРУЗКА ДАННЫХ ==========
async function fetchProductsFromAPI() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        const products = await response.json();
        
        return products.filter(product => 
            product.is_active !== false && 
            product.is_active !== 'Неактивен'
        );
    } catch (error) {
        console.error('❌ Ошибка загрузки из API:', error);
        throw error;
    }
}

async function fetchProducts() {
    try {
        const cachedProducts = loadFromCache();
        
        if (cachedProducts && cachedProducts.length > 0) {
            return cachedProducts;
        }
        
        console.log('🌐 Загружаем данные из API');
        const freshProducts = await fetchProductsFromAPI();
        
        if (freshProducts && freshProducts.length > 0) {
            saveToCache(freshProducts);
        }
        
        return freshProducts;
        
    } catch (error) {
        console.error('❌ Ошибка загрузки товаров:', error);
        return [];
    }
}

function getCategoryDescription(category) {
    const descriptions = {
        'Материалы для кузовного ремонта': 'Все материалы для кузовного ремонта от ведущих производителей.',
        'Масла': 'Широкий выбор масел от ведущих мировых производителей.',
        'Фильтра': 'Оригинальные и совместимые фильтры для всех марок автомобилей.',
        'Автохимия': 'Профессиональная автохимия для комплексного ухода за автомобилем.',
        'Автозапчасти': 'Огромный выбор автозапчастей для всех марок автомобилей.',
        'Автосвет': 'Широкий ассортимент автосвета от ведущих производителей.',
        'Средства индивидуальной защиты': 'Полный комплект средств индивидуальной защиты.',
        'Автоэмаль': 'Профессиональный подбор автоэмали с гарантией точного совпадения цвета.',
        'Автомобильные чехлы': 'Широкий выбор автомобильных чехлов и аксессуаров для салона.'
    };
    return descriptions[category] || 'Товары высшего качества с гарантией производителя.';
}

// ========== АККОРДЕОНЫ - РАБОЧАЯ ВЕРСИЯ ==========
function initAccordions() {
    console.log('🔄 Инициализация аккордеонов...');
    
    document.querySelectorAll('.accordion-header').forEach((header, index) => {
        // Убираем все старые обработчики
        header.replaceWith(header.cloneNode(true));
    });
    
    // Заново получаем все заголовки после replaceWith
    document.querySelectorAll('.accordion-header').forEach((header, index) => {
        header.addEventListener('click', function(e) {
            e.preventDefault();
            const accordion = this.closest('.accordion');
            
            // Просто переключаем класс
            if (accordion.classList.contains('active')) {
                accordion.classList.remove('active');
                console.log(`Аккордеон ${index + 1} закрыт`);
            } else {
                accordion.classList.add('active');
                console.log(`Аккордеон ${index + 1} открыт`);
            }
        });
    });
}

// ========== ОТОБРАЖЕНИЕ ТОВАРОВ ==========
function displayProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;

    hideLoader();

    if (products.length === 0) {
        container.innerHTML = '<p class="text-center py-8 text-gray-600">Товары временно отсутствуют</p>';
        return;
    }

    // Группировка по категориям
    const categories = products.reduce((groups, product) => {
        const cat = product.category || 'Другие товары';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(product);
        return groups;
    }, {});

    // Генерация HTML аккордеонов
    container.innerHTML = Object.entries(categories).map(([category, items]) => `
        <div class="accordion mb-4 bg-white rounded-lg overflow-hidden shadow-md">
            <button class="accordion-header w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition duration-200">
                <h3 class="text-xl font-semibold text-gray-800">
                    <i class="fas ${CATEGORY_ICONS[category] || 'fa-tag'} text-primary mr-3"></i>
                    ${category}
                </h3>
                <i class="fas fa-chevron-down text-primary transition-transform duration-300"></i>
            </button>
            <div class="accordion-content">
                <div class="p-6 pt-0">
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        ${items.map(item => `
                            <div class="product-card bg-gray-50 p-4 rounded-lg transition hover:shadow-md">
                                <img src="${item.image || 'images/placeholder.jpg'}" 
                                     alt="${item.name}" 
                                     class="w-full h-48 object-cover rounded-md mb-3"
                                     onerror="this.src='images/placeholder.jpg'">
                                <h4 class="font-bold text-lg mb-2">${item.name}</h4>
                                <p class="text-gray-600 mb-3">${item.description || 'Описание отсутствует'}</p>
                                <span class="text-primary font-bold">${item.price ? `${item.price} ₽` : 'Цена по запросу'}</span>
                            </div>
                        `).join('')}
                    </div>
                    <p class="text-gray-700">${getCategoryDescription(category)}</p>
                </div>
            </div>
        </div>
    `).join('');

    // Инициализируем аккордеоны
    setTimeout(initAccordions, 100);
}

// ========== ОСНОВНАЯ ФУНКЦИЯ ==========
async function loadCatalog() {
    try {
        showLoader();
        
        const cachedProducts = loadFromCache();
        
        if (cachedProducts && cachedProducts.length > 0) {
            console.log('🚀 Быстрая загрузка из кэша');
            displayProducts(cachedProducts);
            
            setTimeout(async () => {
                try {
                    const freshProducts = await fetchProductsFromAPI();
                    if (freshProducts && freshProducts.length > 0) {
                        if (JSON.stringify(freshProducts) !== JSON.stringify(cachedProducts)) {
                            saveToCache(freshProducts);
                            console.log('🔄 Кэш обновлен в фоне');
                        }
                    }
                } catch (error) {
                    console.error('❌ Ошибка фонового обновления:', error);
                }
            }, 1000);
        } else {
            console.log('🌐 Первая загрузка из API');
            const products = await fetchProducts();
            displayProducts(products);
        }
        
    } catch (error) {
        console.error('❌ Критическая ошибка:', error);
        hideLoader();
        document.getElementById('products-container').innerHTML = `
            <div class="text-center py-8">
                <p class="text-red-500 text-lg">Ошибка загрузки товаров</p>
                <p class="text-gray-600 mt-2">Попробуйте обновить страницу</p>
            </div>
        `;
    }
}

// ========== ЗАПУСК ==========
document.addEventListener('DOMContentLoaded', loadCatalog);