import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './style/index.css';

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')