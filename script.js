// Конфигурация Tailwind (если нужно)
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#bdce0c',
                logo: '#2c391d',
            }
        }
    }
};

// module.exports = {
//     theme: {
//       extend: {
//         transitionProperty: {
//           'height': 'height',
//           'opacity': 'opacity'
//         }
//       }
//     }
// }

// Анимация аккордеона
document.addEventListener('DOMContentLoaded', function() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const icon = header.querySelector('.fa-chevron-down');
        
        header.addEventListener('click', () => {
            accordion.classList.toggle('active');
            
            if (accordion.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Анимация для карточек контактов
    document.addEventListener('DOMContentLoaded', function() {
        const contactCards = document.querySelectorAll('.contact-card');
        
        contactCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
        });
        
    });
});