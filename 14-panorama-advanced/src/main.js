import { createApp } from 'vue';
// import Vconsole from 'vconsole';
import './style.css';
import App from './App.vue';
import 'amfe-flexible';
import Router from '@/router/index';
import modalInstall from './components/modal/index';

// const vconsole = new Vconsole();
const app = createApp(App);
modalInstall(app);

app.use(Router).mount('#app');
