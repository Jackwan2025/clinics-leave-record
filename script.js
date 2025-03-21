const GITHUB_TOKEN = '你的_Personal_Access_Token'; // 替換為你的 PAT
const REPO_OWNER = '你的_GitHub_用戶名'; // 替換為你的 GitHub 用戶名
const REPO_NAME = '你的_倉庫名稱'; // 替換為你的倉庫名稱
const FILE_PATH = 'data.json'; // JSON 文件路徑

const dataInput = document.getElementById('dataInput');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const output = document.getElementById('output');

// 加載資料
async function loadData() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = await response.json();
        const content = atob(data.content); // 解碼 Base64 內容
        output.textContent = content;
        dataInput.value = content;
    } catch (error) {
        console.error('加載失敗:', error);
        output.textContent = '加載失敗，請檢查控制台。';
    }
}

// 保存資料
async function saveData() {
    const content = dataInput.value;
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

    // 獲取當前文件的 SHA
    const getResponse = await fetch(url, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const getData = await getResponse.json();
    const sha = getData.sha;

    // 更新文件
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: '更新 data.json',
                content: btoa(content), // 編碼為 Base64
                sha: sha
            })
        });
        const data = await response.json();
        console.log('保存成功:', data);
        output.textContent = '資料已保存！';
    } catch (error) {
        console.error('保存失敗:', error);
        output.textContent = '保存失敗，請檢查控制台。';
    }
}

// 綁定按鈕事件
saveButton.addEventListener('click', saveData);
loadButton.addEventListener('click', loadData);

// 初始化加載資料
loadData();