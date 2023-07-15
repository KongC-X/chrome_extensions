// 添加滤镜
document.getElementById('changeFilterBtn').addEventListener('click', function () {
  chrome.tabs.executeScript({
    code: 'document.documentElement.style.filter = "hue-rotate(180deg)"'
  });
});

// 添加黑白滤镜
document.getElementById('changeBlackFilterBtn').addEventListener('click', function () {
  chrome.tabs.executeScript({
    code: 'document.documentElement.style.filter = "grayscale(100%)"'
  });
});

//去除滤镜
document.getElementById('resetFilterBtn').addEventListener('click', function () {
  chrome.tabs.executeScript({
    code: `document.documentElement.style.filter = "none"`
  });
});
