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

// ========== УПРАВЛЕНИЕ ЛОАДЕРОМ ==========
function showLoader() {
    const loader = document.getElementById('loader');
    const container = document.getElementById('products-container');
    if (loader) loader.style.display = 'flex';
    if (container) container.style.opacity = '1';
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

// ========== ЗАГРУЗКА ДАННЫХ ==========
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        const products = await response.json();
        
        return products.filter(product => 
            product.is_active !== false && 
            product.is_active !== 'Неактивен'
        );
    } catch (error) {
        console.error('Ошибка загрузки:', error);
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

// ========== ИНИЦИАЛИЗАЦИЯ АККОРДЕОНОВ ==========
function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const accordion = this.closest('.accordion');
            accordion.classList.toggle('active');
            
            const icon = this.querySelector('.fa-chevron-down');
            if (icon) {
                icon.style.transform = accordion.classList.contains('active') 
                    ? 'rotate(180deg)' 
                    : 'rotate(0deg)';
            }
            
            const content = accordion.querySelector('.accordion-content');
            if (content) {
                content.style.maxHeight = accordion.classList.contains('active')
                    ? content.scrollHeight + "px"
                    : null;
            }
        });
    });
}

// ========== ОТОБРАЖЕНИЕ ТОВАРОВ ==========
function displayProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;

    // Прячем лоадер
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

    // Инициализируем аккордеоны после добавления в DOM
    initAccordions();
}

// ========== ОСНОВНАЯ ФУНКЦИЯ ==========
async function loadCatalog() {
    // Показываем лоадер
    showLoader();
    
    try {
        // Загружаем данные
        const products = await fetchProducts();
        
        // Искусственная задержка для демонстрации (можно убрать)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Отображаем товары
        displayProducts(products);
        
    } catch (error) {
        console.error('Ошибка:', error);
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