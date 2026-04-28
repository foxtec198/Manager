class CardCarousel {
    constructor(root) {
        this.root = root
        this.track = root.querySelector('.card-carousel-track')
        this.views = root.querySelectorAll('.card-view')
        this.index = 0

        root.querySelector('.next')?.addEventListener('click', () => this.next())
        root.querySelector('.prev')?.addEventListener('click', () => this.prev())
    }

    update() {
        this.track.style.transform = `translateX(-${this.index * 100}%)`
    }

    next() {
        if (this.index < this.views.length - 1) {
            this.index++
            this.update()
        }
    }

    prev() {
        if (this.index > 0) {
            this.index--
            this.update()
        }
    }
};

// Paginas onde se deve carregar o carousel
const pages = [ "pos" ]

// Logica para carregamento
pages.forEach(page => {
    // Inibe carregamentos fora da tela definida sem que seja instancia manualmente
    if (window.location.pathname == `/pages/${page}.html`){
        document.querySelectorAll('.card-carousel')
        .forEach(el => new CardCarousel(el));
    };
})