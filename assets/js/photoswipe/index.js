import PhotoSwipeLightbox from '/assets/js/photoswipe/photoswipe-lightbox.esm.js';
const options = {
  gallery: '#photogallery',
  children: 'a',
  showHideAnimationType: 'none',
  pswpModule: () => import('/assets/js/photoswipe/photoswipe.esm.js')
};
const lightbox = new PhotoSwipeLightbox(options);
lightbox.on('uiRegister', function () {
  lightbox.pswp.ui.registerElement({
    order: 8,
    isButton: false,
    tagName: 'a',

    // SVG with outline
    html: '',
    // Or provide full svg:
    // html: '<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" class="pswp__icn"><path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" /></svg>',
    // Or provide any other markup:
    // html: '<i class="fa-solid fa-download"></i>' 

    onInit: (el, pswp) => {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');

      pswp.on('change', () => {
        console.log('change');
        el.href = pswp.currSlide.data.src;
      });
    }
  });

  lightbox.pswp.ui.registerElement({
    name: 'custom-caption',
    order: 9,
    isButton: false,
    appendTo: 'root',
    html: 'Caption text',
    onInit: (el, pswp) => {
      lightbox.pswp.on('change', () => {
        const currSlideElement = lightbox.pswp.currSlide.data.element;
        let captionHTML = '';
        if (currSlideElement) {
          const hiddenCaption = currSlideElement.querySelector('.hidden-caption-content');
          if (hiddenCaption) {
            // get caption from element with class hidden-caption-content
            captionHTML = hiddenCaption.innerHTML;
          } else {
            // get caption from alt attribute
            captionHTML = currSlideElement.querySelector('img').getAttribute('alt');
          }
        }
        el.innerHTML = captionHTML || '';
      });
    }
  });



});
lightbox.init();