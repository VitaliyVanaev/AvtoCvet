const API_URL = 'https://script.google.com/macros/s/AKfycbz-KMFCLHOnhJPx-P_EnhDkzoT4zjbsd2qySnTHwn9gsuYN_Tsumk6tOrkFW2qBXDWvvg/exec';

// Иконки для категорий
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

function getCategoryDescription(category) {
  const descriptions = {
    'Материалы для кузовного ремонта': 'Все материалы для кузовного ремонта от ведущих производителей. Гарантия качества и долговечности.',
    'Масла': 'Широкий выбор масел от ведущих мировых производителей. Подберем оптимальный вариант для вашего автомобиля.',
    'Фильтра': 'Оригинальные и совместимые фильтры для всех марок автомобилей. Гарантия качества и надежности.',
    'Автохимия': 'Профессиональная автохимия для комплексного ухода за автомобилем. Защита и восстановление всех узлов и агрегатов.',
    'Автозапчасти': 'Огромный выбор автозапчастей для всех марок автомобилей. Оригинальные и качественные аналоги.',
    'Автосвет': 'Широкий ассортимент автосвета от ведущих производителей. Гарантия яркого и безопасного освещения.',
    'Средства индивидуальной защиты': 'Полный комплект средств индивидуальной защиты для безопасной работы с автомобилем.',
    'Автоэмаль': 'Профессиональный подбор автоэмали с гарантией точного совпадения цвета. Современное оборудование для колеровки.',
    'Автомобильные чехлы': 'Широкий выбор автомобильных чехлов и аксессуаров для салона. Индивидуальный пошив по вашим размерам.'
  };
  return descriptions[category] || 'Товары высшего качества с гарантией производителя.';
}

// Загрузка товаров
async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
    const products = await response.json();
    
    // Фильтрация активных товаров
    return products.filter(product => 
      product.is_active !== false && 
      product.is_active !== 'Неактивен'
    );
    
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return [];
  }
}

// Инициализация аккордеонов
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
      const accordion = this.closest('.accordion');
      accordion.classList.toggle('active');
      
      const icon = this.querySelector('.fa-chevron-down');
      icon.style.transform = accordion.classList.contains('active') 
        ? 'rotate(180deg)' 
        : 'rotate(0deg)';
      
      const content = accordion.querySelector('.accordion-content');
      content.style.maxHeight = accordion.classList.contains('active')
        ? content.scrollHeight + "px"
        : null;
    });
  });
}

// Отображение товаров
async function renderProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;

  const products = await loadProducts();
  console.log('Загружено товаров:', products.length);

  if (products.length === 0) {
    container.innerHTML = '<p class="text-center py-8">Товары не найдены</p>';
    return;
  }

  // Группировка по категориям
  const categories = products.reduce((groups, product) => {
    if (!groups[product.category]) groups[product.category] = [];
    groups[product.category].push(product);
    return groups;
  }, {});

  // Генерация HTML
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
                <img src="${item.image || 'https://via.placeholder.com/300'}" 
                     alt="${item.name}" 
                     class="w-full h-48 object-cover rounded-md mb-3">
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

  initAccordions();
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', renderProducts);