// public/sw.js
self.addEventListener("install", event => {
    console.log("Service Worker installed");
});

self.addEventListener("fetch", event => {
    // 可以自定义缓存逻辑
});
