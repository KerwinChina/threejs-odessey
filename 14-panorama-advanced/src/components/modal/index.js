import {
  createVNode,
  render,
} from 'vue';
import ModalComponent from './base-modal.vue';
import {
  debounce,
} from '@/utils/index';

const container = document.createDocumentFragment();
let instanceVnode = null;

function myModal(options) {
  return new Promise((resolve, reject) => {
    instanceVnode = createVNode(ModalComponent, {
      ...options,
      visible: true,
      onSure(data, ctx) {
        resolve({
          data,
          ctx,
          message: 'sure',
        });
      },
      onCancel() {
        resolve({
          message: 'cancel',
        });
      },
    });
    render(instanceVnode, container);
  });
}

function modalClose() {
  if (instanceVnode) {
    render(null, container);
    instanceVnode = null;
  }
}

export function getModalInstance() {
  return instanceVnode;
}
// 防抖
export const Modal = debounce(myModal, 100);
const myModalClose = debounce(modalClose, 100);
Modal.close = myModalClose;
Modal.getInstance = getModalInstance;
export default function install(app) {
  app.config.globalProperties.$modal = Modal;
}
