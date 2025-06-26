
// FUNCIÓN PARA CAMBIAR EL TEMA (CLARO/OSCURO)
function setTheme(isDark, iconElement) {
    if (iconElement) {
        if (isDark) {
            document.body.classList.add("dark-theme");
            iconElement.classList.replace("bxs-moon", "bxs-sun");
        } else {
            document.body.classList.remove("dark-theme");
            iconElement.classList.replace("bxs-sun", "bxs-moon");
        }
    }
}


// FUNCIÓN PARA CAMBIAR EL IDIOMA Y ACTUALIZAR EL CONTENIDO
async function changeLanguage(language) {
    try {
        const response = await fetch(`languages/${language}.json`);
        if (!response.ok) {
            console.error(`No se pudo cargar el archivo de idioma: ${language}.json`);
            return;
        }
        const translations = await response.json();

        // Actualizar palabras de la animación
        const animatedWords = [
            translations.animated_text_1,
            translations.animated_text_2,
            translations.animated_text_3,
            translations.animated_text_4
        ];

        // Actualizar las variables CSS para la animación
        if (animatedWords.every(word => word)) {
            // Actualizar las variables CSS con las nuevas palabras
            document.documentElement.style.setProperty('--word-1', `"${animatedWords[0]}"`);
            document.documentElement.style.setProperty('--word-2', `"${animatedWords[1]}"`);
            document.documentElement.style.setProperty('--word-3', `"${animatedWords[2]}"`);
            document.documentElement.style.setProperty('--word-4', `"${animatedWords[3]}"`);
            
            // Forzar reinicio de la animación
            const textAnimation = document.querySelector('.text-animation .animated-word');
            if (textAnimation) {
                // Eliminar y volver a agregar la clase para reiniciar la animación
                textAnimation.style.animation = 'none';
                // Forzar un reflow/repaint
                void textAnimation.offsetWidth;
                // Restaurar la animación
                textAnimation.style.animation = '';
                
                // Asegurarse de que el texto inicial se muestre correctamente
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes words {
                        0%, 20% { content: "${animatedWords[0].replace(/"/g, '\\"')}"; }
                        21%, 40% { content: "${animatedWords[1].replace(/"/g, '\\"')}"; }
                        41%, 60% { content: "${animatedWords[2].replace(/"/g, '\\"')}"; }
                        61%, 100% { content: "${animatedWords[3].replace(/"/g, '\\"')}"; }
                    }
                `;
                // Eliminar estilos anteriores si existen
                const oldStyle = document.getElementById('dynamic-animation-styles');
                if (oldStyle) oldStyle.remove();
                
                style.id = 'dynamic-animation-styles';
                document.head.appendChild(style);
            }
        }

        // Actualizar todos los elementos con el atributo data-key
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations.hasOwnProperty(key)) {
                const translation = translations[key];
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });
        
        // Actualizar el texto del botón de cambio de idioma
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.textContent = language === 'en' ? 'ES' : 'EN';
        }

        // Actualizar el enlace de descarga del CV
        const downloadBtn = document.getElementById('download_cv');
        if (downloadBtn) {
            const cvFile = language === 'en' ? 'CV_Emmanuel_Ramirez.pdf' : 'CV_Emmanuel_Ramirez_B.pdf';
            downloadBtn.setAttribute('href', cvFile);
            downloadBtn.setAttribute('download', cvFile);
        }

    } catch (error) {
        console.error('Error al cambiar el idioma:', error);
    }
    

        // Reiniciar la animación
        const animatedWord = document.querySelector('.animated-word');
        if (animatedWord) {
            const animation = animatedWord.style.animation;
            animatedWord.style.animation = 'none';
            void animatedWord.offsetWidth; // Forzar reflujo
            animatedWord.style.animation = animation;
        }

    
}


// =================================================================
// EJECUCIÓN DEL SCRIPT: ESPERA A QUE EL DOM ESTÉ CARGADO
// =================================================================
document.addEventListener('DOMContentLoaded', function() {

    // --- Selección de Elementos --- 
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    const themeIcon = document.getElementById('mode-icon');
    const languageToggle = document.getElementById('language-toggle');

    // --- Configuración Inicial ---
    
    // 1. Cargar el tema guardado
    const savedTheme = localStorage.getItem('darkTheme');
    setTheme(savedTheme === 'true', themeIcon);

    // 2. Cargar el idioma guardado
    const savedLang = localStorage.getItem('language') || 'en';
    changeLanguage(savedLang);


    // --- Asignación de Eventos ---

    // 1. Scrollspy para resaltar el enlace de navegación activo
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (currentSectionId && linkHref && linkHref.includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    });

    // 2. Menú de navegación móvil
    if (menuIcon) {
        menuIcon.onclick = () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        };

        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.navbar a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Solo cerrar si el menú está abierto (en móviles)
                if (window.innerWidth <= 991) {
                    menuIcon.classList.remove('bx-x');
                    navbar.classList.remove('active');
                }
            });
        });
    }

    // Cerrar menú al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991) {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        }
    });

    // 3. Botón para cambiar el tema"
    if (themeIcon) {
        themeIcon.onclick = function() {
            const isDarkNow = document.body.classList.contains('dark-theme');
            const newTheme = !isDarkNow;
            localStorage.setItem('darkTheme', newTheme);
            setTheme(newTheme, themeIcon);
        };
    }

    // 4. Botón para cambiar el idioma
    if (languageToggle) {
        languageToggle.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir la recarga de la página
            const currentLang = localStorage.getItem('language') || 'en';
            const newLang = currentLang === 'en' ? 'es' : 'en';
            localStorage.setItem('language', newLang);
            changeLanguage(newLang);
        });
    }
});