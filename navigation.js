// ========== НАВИГАЦИЯ К АККОРДЕОНАМ ==========
document.addEventListener('click', function(e) {
    // Ищем клик по ссылке с #accordion
    const link = e.target.closest('a[href*="#accordion"]');
    if (!link) return;
    
    e.preventDefault();
    
    // Получаем полный href
    const fullHref = link.getAttribute('href');
    
    // Разбираем href на страницу и якорь
    let targetPage = '';
    let targetHash = '';
    
    if (fullHref.includes('#')) {
        const parts = fullHref.split('#');
        targetPage = parts[0]; // может быть пустым, "index.html", "AutoService.html" и т.д.
        targetHash = '#' + parts[1];
    }
    
    // Получаем имя текущей страницы
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Если это ссылка на другую страницу
    if (targetPage && targetPage !== '' && targetPage !== currentPage) {
        // Переходим на другую страницу с якорем
        window.location.href = fullHref;
        return;
    }
    
    // Если мы уже на нужной странице
    const element = document.getElementById(targetHash.substring(1));
    
    if (element) {
        // Убираем якорь из URL
        history.replaceState(null, null, window.location.pathname);
        
        // Плавно прокручиваем
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        console.log(`✅ Прокручено к ${targetHash}`);
    }
});

// При загрузке страницы - проверяем, есть ли якорь в URL
document.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash;
    if (!hash || !hash.includes('accordion')) return;
    
    // Ждем загрузки контента
    setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
            // Плавно прокручиваем
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Удаляем якорь из URL
            history.replaceState(null, null, window.location.pathname);
            
            console.log(`✅ Прокручено к ${hash} после загрузки`);
        }
    }, 500);
});