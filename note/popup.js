// 渲染笔记列表
function renderNoteList(notes) {
  var noteList = document.getElementById("note-list");
  noteList.innerHTML = "";
  for (var i = 0; i < notes.length; i++) {
    // 创建笔记项
    var noteItem = document.createElement("div");
    noteItem.className = "note-item";
    // 创建笔记文本
    var noteText = document.createElement("div");
    noteText.className = "note-text";
    noteText.textContent = notes[i];
    // 创建复制按钮
    var copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.textContent = "复制";
    // 创建删除按钮
    var deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "删除";
    // 绑定删除按钮的点击事件
    deleteButton.addEventListener("click", (function(index) {
      return function() {
        // 删除对应的笔记
        notes.splice(index, 1);
        // 更新笔记列表
        chrome.storage.sync.set({notes: notes}, function() {
          renderNoteList(notes);
        });
      };
    })(i));

    // 获取所有复制按钮
    var copyButtons = document.querySelectorAll('.copy-button');
    // 给每个复制按钮添加点击事件
    copyButtons.forEach(copyButton => {
      copyButton.addEventListener('click', () => {
        // 获取要复制的文本内容
        const noteContent = copyButton.previousElementSibling ? copyButton.previousElementSibling.textContent.trim() : copyButton.previousSibling.textContent.trim();
        // 创建一个临时textarea元素
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = noteContent;
        // 将临时textarea元素添加到body中，并选中其中的文本
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        // 复制文本内容到剪贴板
        document.execCommand('copy');
        // 移除临时textarea元素
        document.body.removeChild(tempTextarea);
      });
    });
    // 添加笔记文本和删除按钮到笔记项
    noteItem.appendChild(noteText);
    noteItem.appendChild(copyButton);
    noteItem.appendChild(deleteButton);
    // 添加笔记项到笔记列表
    noteList.appendChild(noteItem);
  }
}

// 当DOM加载完成时执行以下代码
document.addEventListener("DOMContentLoaded", function() {
  var noteList = [];
  var noteTextarea = document.getElementById("note-textarea");
  var addButton = document.getElementById("add-button");
  var clearButton = document.getElementById("clear-button");

  // 绑定添加按钮的点击事件
  addButton.addEventListener("click", function() {
    var note = noteTextarea.value;
    if (note) {
      // 将笔记添加到笔记列表
      noteList.push(note);
      // 更新笔记列表
      chrome.storage.sync.set({notes: noteList}, function() {
        renderNoteList(noteList);
      });
      // 清空笔记输入框
      noteTextarea.value = "";
    }
  });

  // 保留复制文本的格式信息
  noteTextarea.addEventListener("paste", function(e) {
    e.preventDefault();
    var text = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  });

  // 绑定清空按钮的点击事件
  clearButton.addEventListener("click", function() {
    // 清空笔记列表
    noteList = [];
    // 更新笔记列表
    chrome.storage.sync.remove("notes", function() {
      renderNoteList(noteList);
    });
  });

  // 获取存储在Chrome浏览器中的笔记列表
  chrome.storage.sync.get("notes", function(data) {
    if (data.notes) {
      // 如果存在笔记列表，则将其赋值给noteList变量
      noteList = data.notes;
      // 渲染笔记列表
      renderNoteList(noteList);
    }
  });

  // 设置插件图标
  chrome.browserAction.setIcon({ path: 'icon/icon128.png' });

  // 设置插件标题
  chrome.browserAction.setTitle({ title: '瑞萌萌的记事本🗒️' });
});
