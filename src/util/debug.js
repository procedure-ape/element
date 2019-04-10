import axios from 'axios'

axios.interceptors.request.use((config) => {
    // config.headers['X-Requested-With'] = 'XMLHttpRequest';
    // let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值

    // 加入静态IP地址，生产环境中应该去掉
    // 以及！！！上传镜像的webuploader使用的非axios方式请求，无法截获，传入的固定Url
    let static_addres = 'http:\/\/192.168.30.137:8000'
    config.url = static_addres+config.url
    // config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
    return config
});
