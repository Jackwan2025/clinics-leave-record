document.addEventListener('DOMContentLoaded', function () {
    const calendar = document.getElementById('calendar');
    const year = 2025;
    const months = [
        "一月", "二月", "三月", "四月", "五月", "六月",
        "七月", "八月", "九月", "十月", "十一月", "十二月"
    ];

    months.forEach((month, monthIndex) => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month';
        monthDiv.innerHTML = `<h2>${month}</h2>`;
        calendar.appendChild(monthDiv);

        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();

        const daysContainer = document.createElement('div');
        daysContainer.className = 'days';
        daysContainer.style.display = 'grid';
        daysContainer.style.gridTemplateColumns = 'repeat(7, 1fr)';
        daysContainer.style.gap = '10px';

        // 填充空白格
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            daysContainer.appendChild(emptyDay);
        }

        // 生成每一天
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.textContent = day;

            const textarea = document.createElement('textarea');
            textarea.placeholder = '輸入資料...';

            // 從 localStorage 加載已保存的資料
            const key = `${year}-${monthIndex + 1}-${day}`;
            const savedData = localStorage.getItem(key);
            if (savedData) {
                textarea.value = savedData;
                dayDiv.classList.add('has-data');
            }

            // 當用戶輸入資料時，保存到 localStorage 並添加 has-data 類
            textarea.addEventListener('input', function () {
                if (textarea.value.trim()) {
                    localStorage.setItem(key, textarea.value);
                    dayDiv.classList.add('has-data');
                } else {
                    localStorage.removeItem(key);
                    dayDiv.classList.remove('has-data');
                }
            });

            // 當用戶按下 Enter 鍵時，縮小輸入框
            textarea.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); // 防止輸入換行
                    textarea.style.height = '100px'; // 恢復正常高度
                    textarea.blur(); // 移除焦點
                }
            });

            dayDiv.addEventListener('click', function () {
                dayDiv.appendChild(textarea);
                textarea.focus();
                textarea.style.height = '150px'; // 點擊後調整輸入框高度
            });

            daysContainer.appendChild(dayDiv);
        }

        monthDiv.appendChild(daysContainer);
    });

    // 添加清除資料按鈕
    const clearButton = document.createElement('button');
    clearButton.textContent = '清除所有資料';
    clearButton.style.marginTop = '20px';
    clearButton.addEventListener('click', function () {
        localStorage.clear();
        alert('所有資料已清除！');
        location.reload();
    });
    calendar.appendChild(clearButton);

    // 添加導出資料按鈕
    const exportButton = document.createElement('button');
    exportButton.textContent = '導出資料';
    exportButton.style.marginTop = '20px';
    exportButton.addEventListener('click', function () {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calendar_data.json';
        a.click();
        URL.revokeObjectURL(url);
    });
    calendar.appendChild(exportButton);
});