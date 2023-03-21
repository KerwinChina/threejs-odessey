import { getCurrentInstance } from 'vue';
import cardModalComponent from '@/views/home/components/cardModal.vue';

export default function () {
  const { proxy: ctx } = getCurrentInstance();
  function showCard(product, sliders) {
    return ctx.$modal({
      mode: 'custom',
      customVnode: cardModalComponent,
      className: 'myCardAnimation',
      customVprops: {
        product,
        sliders,
      },
      maskClose: false,
    });
  }
  return {
    showCard,
  };
}
