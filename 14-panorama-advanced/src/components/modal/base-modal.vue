<template>
  <Teleport to="body">
    <div :class="`modal ${className}`" v-if="visible">
      <div class="modal-mask" v-if="maskClose" @click="cancelModel"></div>
      <div class="modal-container animation-modal" ref="modalCardRef" v-if="mode === 'card'">
        <div class="modal-header">
          <Vnodes :vnodes="titleVnode" v-if="titleVnode" :propsData="titleVprops"></Vnodes>
          <slot name="title" v-else-if="$slots && $slots.title"></slot>
          <div v-else class="modal-header-title">
            <p>{{ title }}</p>
          </div>
        </div>
        <div class="modal-content">
          <Vnodes :vnodes="contentVnode" v-if="contentVnode" :propsData="contentVprops"> </Vnodes>
          <slot name="content" v-else-if="$slots && $slots.content"></slot>
          <p v-else class="modal-content-txt">{{ content }}</p>
        </div>
        <div class="modal-footer" v-if="(showConfirmBtn || showCancelBtn || footerVnode) && !noFooter">
          <Vnodes :vnodes="footerVnode" v-if="footerVnode" :propsData="footerVprops"></Vnodes>
          <slot name="footer" v-else-if="$slots && $slots.footer"></slot>
          <div class="modal-footer-btns" v-else>
            <div v-if="showCancelBtn" class="btn btn-lg btn-secondary cancel-btn" @click="cancelModel">
              <p>{{ cancelBtnText }}</p>
            </div>
            <div class="my-placeholder" v-show="showConfirmBtn && showCancelBtn"></div>
            <div v-if="showConfirmBtn" class="btn btn-lg btn-primary-black sure-btn" @click="sureModel">
              <p>{{ confirmBtnText }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="mode === 'alert'" class="alert-container animation-modal" ref="alertContainerRef">
        <p class="alert-title" v-if="title">{{ title }}</p>
        <div class="alert-content">
          <Vnodes :vnodes="contentVnode" v-if="contentVnode" :propsData="contentVprops"> </Vnodes>
          <p v-else class="alert-content-txt">{{ content }}</p>
        </div>
        <div class="alert-btns">
          <div v-if="showCancelBtn" class="cancel-btn" @click="cancelModel">
            <p>{{ cancelBtnText }}</p>
          </div>
          <div class="my-placeholder" v-show="showConfirmBtn && showCancelBtn"></div>
          <div v-if="showConfirmBtn" class="sure-btn" @click="sureModel">
            <p>{{ confirmBtnText }}</p>
          </div>
        </div>
      </div>
      <div v-if="mode === 'custom'" class="custom-container animation-modal" ref="customContainerRef">
        <Vnodes :vnodes="customVnode" v-if="customVnode" :propsData="customVprops"></Vnodes>
        <slot name="custom" v-else-if="$slots && $slots.custom"></slot>
        <p v-else>请自定义</p>
      </div>
    </div>
  </Teleport>
</template>
<script>
import {
  defineComponent, reactive, toRefs, h, getCurrentInstance, isVNode, ref,
} from 'vue';

export default defineComponent({
  name: 'modal',
  emits: ['cancel', 'sure'],
  props: {
    // 蒙层close
    maskClose: {
      type: Boolean,
      default: true,
    },
    hasClose: {
      type: Boolean,
      default: true,
    },
    mode: {
      type: String,
      default: 'card', // card  卡片弹窗 alert 弹窗 custom 自定义
    },
    customVprops: {
      type: Object,
      default: () => { },
    },
    customVnode: {
      type: Object,
      default: () => { },
    },
    noFooter: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: '',
    },
    // 是否可见, 组件使用需要加.sync
    visible: {
      type: Boolean,
      default: false,
    },
    showConfirmBtn: {
      type: Boolean,
      default: true,
    },
    showCancelBtn: {
      type: Boolean,
      default: true,
    },
    confirmBtnText: {
      type: String,
      default: '确定',
    },
    cancelBtnText: {
      type: String,
      default: '取消',
    },
    titleVprops: {
      type: Object,
      default: () => { },
    },
    titleVnode: {
      type: Object,
      default: () => { },
    },
    contentVprops: {
      type: Object,
      default: () => { },
    },
    contentVnode: {
      type: Object,
      default: () => { },
    },
    footerVnode: {
      type: Object,
      default: () => { },
    },
    footerVprops: {
      type: Object,
      default: () => { },
    },
    content: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  components: {
    Vnodes: {
      data() {
        return {
          vComp: null,
        };
      },
      props: {
        modelValue: {
          type: Object,
          default: () => ({}),
        },
        vnodes: {
          type: [Object, String],
        },
        propsData: {
          type: Object,
        },
      },
      render() {
        if (this.vComp && isVNode(this.vComp)) {
          return this.vComp;
        }
        return '';
      },
      mounted() {
        this.vComp = h(this.vnodes, {
          ...this.propsData,
          onCancel: () => {
            this.$parent.cancelModel();
          },
          onSure: (data) => {
            this.$parent.sureModel(data);
          },
        });
      },
    },
  },
  setup(props, { emit }) {
    const { proxy: ctx } = getCurrentInstance();
    const state = reactive({});
    const modalCardRef = ref(null);
    const customContainerRef = ref(null);
    const alertContainerRef = ref(null);
    const bindfn = {
      sureModel(data) {
        emit('sure', data, ctx);
      },
      cancelModel() {
        switch (props.mode) {
          case 'card':
            modalCardRef.value && modalCardRef.value.classList.add('modal-close-animation');
            break;
          case 'custom':
            customContainerRef.value && customContainerRef.value.classList.add('modal-close-animation');
            break;
          case 'alert':
            alertContainerRef.value && alertContainerRef.value.classList.add('modal-close-animation');
            break;
          default:
        }
        emit('cancel');
        window.$root.$modal.close();
      },
    };
    return {
      ...toRefs(state),
      ...bindfn,
      modalCardRef,
      customContainerRef,
      alertContainerRef,
    };
  },
});
</script>

<style lang="stylus" scoped>
.modal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;

  &-mask {
    position: absolute;
    z-index: 2;
    background: rgba(0, 0, 0, 0.5);
    height: 100%;
    width: 100%;
  }

  &-container {
    margin-top: auto;
    width: 100%;
    min-height: 100px;
    background: #ffffff;
    border-radius: 8px 8px 0px 0px;

    .modal-header {
      padding: 15px 12px 12px 12px;
    }

    .modal-header-title {
      font-size: 18px;
      font-family: SourceHanSansCN-Bold, SourceHanSansCN;
      font-weight: bold;
      color: #1d1f24;
      display: flex;
      align-items: center;
    }

    .modal-content {
      margin-bottom: 18px;

      .modal-content-txt {
        padding: 0 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #2f3243;
      }
    }

    .modal-footer {}

    .modal-footer-btns {
      display: flex;
      font-size: 18px;
      justify-content: center;
      margin-bottom: 35px;
      padding: 0 20px;

      .btn-primary-black {
        flex: 1;
        min-width: 160px;
        line-height: 48px;
      }

      .my-placeholder {
        flex: none;
        width: 15px;
        height: 100%;
        background-color: transparent;
      }

      .cancel-btn {
        flex: 1;
        min-width: 160px;
        line-height: 48px;
      }
    }
  }

  .custom-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 3;
  }

  .alert-container {
    width: 300px;
    min-height: 183px;
    background: #ffffff;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    padding: 23px 0 21px 0;
    position: relative;
    z-index: 3;

    .alert-title {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2f3243;
      flex: none;
    }

    .alert-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .alert-content-txt {
        padding: 16px 0;
      }
    }

    .alert-btns {
      display: flex;
      flex: none;

      .sure-btn,
      .cancel-btn {
        position: relative;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        text-align: center;
        line-height: 38px;
        width: 116px;
        height: 38px;
        border-radius: 19px;
        background: linear-gradient(134deg, rgba(252, 191, 66, 1), rgba(254, 78, 42, 1));
      }

      .cancel-btn {
        color: #fd8c37;
        border: 1px solid rgba(254, 78, 42, 1);
        background: transparent;
      }

      .my-placeholder {
        width: 15px;
        height: 1px;
        background: transparent;
      }
    }
  }
}

</style>
