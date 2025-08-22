window.PWAState = {
    deferredPrompt: null
};

window.PWAUtils = {
    isMobile: () => /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent),

    isStandalone: () =>
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone,

    hasPrompted: () => localStorage.getItem('pwa-prompted'),

    shouldShowInstallBanner: function () {
        return this.isMobile() && !this.isStandalone() && !this.hasPrompted();
    },

    savePrompted: () => localStorage.setItem('pwa-prompted', 'true')
};

function installJustFirstTime() {
    console.log(`[installJustFirstTime] - Verificando instalação. deferredPrompt: [${PWAState.deferredPrompt}]`);
    const hasPrompted = window.PWAUtils.hasPrompted();
    console.log(`[installJustFirstTime] - hasPrompted: ${hasPrompted}`);

    if (!hasPrompted && PWAState.deferredPrompt) {
        PWAState.deferredPrompt.prompt();
        PWAState.deferredPrompt.userChoice.then((choiceResult) => {
            console.log(`[installJustFirstTime] - Escolha do usuário: ${choiceResult.outcome}`);

            if (choiceResult.outcome === 'accepted') {
                console.log('[installJustFirstTime] - PWA instalada com sucesso!');
                window.PWAUtils.savePrompted();
                console.log("[installJustFirstTime] - Estado salvo em memória!");
            } else {
                console.log('[installJustFirstTime] - Usuário recusou a instalação.');
            }

            // Limpa a variável após uso
            PWAState.deferredPrompt = null;
        });
    }
}

function setButtonText(buttonId, text) {
    if (window.PWAUtils.hasPrompted()) {
        const installButton = document.getElementById(buttonId);
        if (installButton) {
            installButton.textContent = text;
            installButton.style.display = 'block';
        }
    }
}

window.PWAUtils.autoHideBanner = function () {
    const banner = document.querySelector(".install-banner");
    const hasPrompted = window.PWAUtils.hasPrompted();

    if (banner && !hasPrompted) {
        setTimeout(() => {
            banner.classList.add("hide");
            banner.addEventListener("animationend", () => {
                banner.remove();
            }, { once: true });
        }, 6000); // 10 segundos
    }
};


document.addEventListener('DOMContentLoaded', () => {
    // Esse trecho pode ser expandido se quiser acionar automaticamente algo ao carregar
    const popupElement = document.querySelector('.popup');
    const hasPrompted = window.PWAUtils.hasPrompted();

    const banner = document.querySelector(".install-banner");
    if (banner && !hasPrompted) {
        setTimeout(() => {
            banner.classList.add("hide");
            banner.addEventListener("animationend", () => {
                banner.remove();
            }, { once: true });
        }, 10000); // 10 segundos
    }
});

window.addEventListener('beforeinstallprompt', (e) => {
    console.log(`[beforeinstallprompt] - Evento capturado: [${e}]`);
    e.preventDefault();
    PWAState.deferredPrompt = e;
    console.log(`[beforeinstallprompt] - Evento salvo em PWAState`);

    const installButton = document.getElementById('confirmPopup');
    const closePopupElement = document.querySelector('.closePopup');
    console.log(`[beforeinstallprompt] - Botões selecionados`);

    if (installButton) {
        installButton.addEventListener('click', () => {
            if (PWAState.deferredPrompt) {
                console.log(`[confirmPopup click] - Iniciando prompt`);
                PWAState.deferredPrompt.prompt();
                installJustFirstTime();
            }
        });
    }
});
