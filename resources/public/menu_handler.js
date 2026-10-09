
jQuery(() => {
    class Menubar {
        constructor() {
            this.toggleButton = document.querySelector('.toggle-menu');
            this.menu = document.querySelector('.wpf_navbar_menu');
            this.menuLinks = document.querySelectorAll('.wpf_navbar_menu a');
            this.init();
        }

        init() {
            if (this.toggleButton) {
                this.toggleButton.addEventListener('click', this.toggleMenuVisibility.bind(this));
            }
            if (this.menuLinks.length > 0) {
                this.menuLinks.forEach((link) => {
                    link.addEventListener('click', this.closeMenuOnLinkClick);
                });
            }
        }

        toggleMenuVisibility() {
            if (this.menu) {
                this.menu.classList.toggle('show');
            }
        }

        closeMenuOnLinkClick = () => {
            if (this.menu) {
                this.menu.classList.remove('show');
            }
        }
    }

    new Menubar();
});
