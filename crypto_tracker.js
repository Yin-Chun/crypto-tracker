// 全域變數
let trades = [];
let currentEditId = null;
let customExchanges = [];
let customStrategies = [];
let customTradeTypes = [];
let customEntryMoods = [];
let customExitMoods = [];

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    loadTrades();
    loadCustomOptions();
    setDefaultDateTime();
    updateTradeTypeOptions();
    updateExchangeOptions();
    updateStrategyOptions();
    updateEntryMoodOptions();
    updateExitMoodOptions();
    updateCoinFilter();
    updateStats();
    displayRecords();

    // 監聽時間篩選變化
    document.getElementById('timeFilter').addEventListener('change', function() {
        if (this.value === 'custom') {
            document.getElementById('customDateFrom').style.display = 'block';
            document.getElementById('customDateTo').style.display = 'block';
        } else {
            document.getElementById('customDateFrom').style.display = 'none';
            document.getElementById('customDateTo').style.display = 'none';
            filterRecords();
        }
    });

    // 監聽自訂日期變化
    document.getElementById('dateFrom')?.addEventListener('change', filterRecords);
    document.getElementById('dateTo')?.addEventListener('change', filterRecords);
});

// 設定預設日期時間為現在
function setDefaultDateTime() {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    document.getElementById('tradeDate').value = localDateTime;
}

// 表單提交
document.getElementById('tradingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const trade = {
        id: currentEditId || Date.now(),
        date: document.getElementById('tradeDate').value,
        type: document.getElementById('tradeType').value,
        coinSymbol: document.getElementById('coinSymbol').value.toUpperCase(),
        quantity: parseFloat(document.getElementById('quantity').value),
        price: parseFloat(document.getElementById('price').value),
        fee: parseFloat(document.getElementById('fee').value) || 0,
        exchange: document.getElementById('exchange').value,
        tradingPair: document.getElementById('tradingPair').value || '',
        strategy: document.getElementById('strategy').value || '',
        leverage: parseFloat(document.getElementById('leverage').value) || 1,
        holdingPeriod: parseFloat(document.getElementById('holdingPeriod').value) || 0,
        riskRewardRatio: parseFloat(document.getElementById('riskRewardRatio').value) || 0,
        profitLoss: parseFloat(document.getElementById('profitLoss').value) || 0,
        profitLossPercent: parseFloat(document.getElementById('profitLossPercent').value) || 0,
        maxDrawdown: parseFloat(document.getElementById('maxDrawdown').value) || 0,
        entryReason: document.getElementById('entryReason').value || '',
        exitReason: document.getElementById('exitReason').value || '',
        postTradeMood: document.getElementById('postTradeMood').value || '',
        review: document.getElementById('review').value || '',
        notes: document.getElementById('notes').value || '',
        // 開倉環境
        entryTime: document.getElementById('entryTime').value || '',
        entryLocation: document.getElementById('entryLocation').value || '',
        entryMood: document.getElementById('entryMood').value || '',
        entryWeather: document.getElementById('entryWeather').value || '',
        entryPhysical: document.getElementById('entryPhysical').value || '',
        entrySleepHours: parseFloat(document.getElementById('entrySleepHours').value) || 0,
        entrySurroundings: document.getElementById('entrySurroundings').value || '',
        entryHappenings: document.getElementById('entryHappenings').value || '',
        entryThoughts: document.getElementById('entryThoughts').value || '',
        // 平倉環境
        exitTime: document.getElementById('exitTime').value || '',
        exitLocation: document.getElementById('exitLocation').value || '',
        exitMoodBefore: document.getElementById('exitMoodBefore').value || '',
        exitWeather: document.getElementById('exitWeather').value || '',
        exitPhysical: document.getElementById('exitPhysical').value || '',
        exitSleepHours: parseFloat(document.getElementById('exitSleepHours').value) || 0,
        exitSurroundings: document.getElementById('exitSurroundings').value || '',
        exitHappenings: document.getElementById('exitHappenings').value || '',
        exitThoughts: document.getElementById('exitThoughts').value || ''
    };

    if (currentEditId) {
        // 編輯現有記錄
        const index = trades.findIndex(t => t.id === currentEditId);
        trades[index] = trade;
        currentEditId = null;
    } else {
        // 新增記錄
        trades.push(trade);
    }

    saveTrades();
    updateCoinFilter();
    updateStats();
    displayRecords();
    resetForm();

    alert('交易記錄已儲存!');
});

// 重置表單
function resetForm() {
    document.getElementById('tradingForm').reset();
    setDefaultDateTime();
    currentEditId = null;
    document.querySelector('.btn-primary').textContent = '新增記錄';
}

// 儲存到 localStorage
function saveTrades() {
    localStorage.setItem('cryptoTrades', JSON.stringify(trades));
}

// 從 localStorage 載入
function loadTrades() {
    const stored = localStorage.getItem('cryptoTrades');
    if (stored) {
        trades = JSON.parse(stored);
    }
}

// 載入自訂選項
function loadCustomOptions() {
    const storedExchanges = localStorage.getItem('customExchanges');
    const storedStrategies = localStorage.getItem('customStrategies');
    const storedTradeTypes = localStorage.getItem('customTradeTypes');
    const storedEntryMoods = localStorage.getItem('customEntryMoods');
    const storedExitMoods = localStorage.getItem('customExitMoods');

    if (storedExchanges) {
        customExchanges = JSON.parse(storedExchanges);
    } else {
        // 預設交易所
        customExchanges = ['Binance', 'Coinbase', 'MAX', 'OKX', 'Bybit'];
        saveCustomOptions();
    }

    if (storedStrategies) {
        customStrategies = JSON.parse(storedStrategies);
    } else {
        // 預設策略
        customStrategies = ['短線', '波段', '長期持有', '定投', '套利'];
        saveCustomOptions();
    }

    if (storedTradeTypes) {
        customTradeTypes = JSON.parse(storedTradeTypes);
    } else {
        // 預設交易類型
        customTradeTypes = ['買入', '賣出', '轉換', '做多', '做空', '網格', '定投'];
        saveCustomOptions();
    }

    if (storedEntryMoods) {
        customEntryMoods = JSON.parse(storedEntryMoods);
    } else {
        // 預設開倉心情
        customEntryMoods = ['興奮', '平靜', '緊張', '焦慮', '樂觀', '悲觀', 'FOMO', '恐慌', '自信', '猶豫'];
        saveCustomOptions();
    }

    if (storedExitMoods) {
        customExitMoods = JSON.parse(storedExitMoods);
    } else {
        // 預設平倉心情
        customExitMoods = ['興奮', '平靜', '緊張', '焦慮', '樂觀', '悲觀', '恐慌', '貪婪', '猶豫', '後悔'];
        saveCustomOptions();
    }
}

// 儲存自訂選項
function saveCustomOptions() {
    localStorage.setItem('customExchanges', JSON.stringify(customExchanges));
    localStorage.setItem('customStrategies', JSON.stringify(customStrategies));
    localStorage.setItem('customTradeTypes', JSON.stringify(customTradeTypes));
    localStorage.setItem('customEntryMoods', JSON.stringify(customEntryMoods));
    localStorage.setItem('customExitMoods', JSON.stringify(customExitMoods));
}

// 更新交易所選項
function updateExchangeOptions() {
    const exchangeSelect = document.getElementById('exchange');
    const currentValue = exchangeSelect.value;

    exchangeSelect.innerHTML = '<option value="">請選擇</option>';
    customExchanges.forEach(exchange => {
        const option = document.createElement('option');
        option.value = exchange;
        option.textContent = exchange;
        exchangeSelect.appendChild(option);
    });

    // 恢復之前選擇的值
    if (currentValue && customExchanges.includes(currentValue)) {
        exchangeSelect.value = currentValue;
    }
}

// 更新策略選項
function updateStrategyOptions() {
    const strategySelect = document.getElementById('strategy');
    const currentValue = strategySelect.value;

    strategySelect.innerHTML = '<option value="">請選擇</option>';
    customStrategies.forEach(strategy => {
        const option = document.createElement('option');
        option.value = strategy;
        option.textContent = strategy;
        strategySelect.appendChild(option);
    });

    // 恢復之前選擇的值
    if (currentValue && customStrategies.includes(currentValue)) {
        strategySelect.value = currentValue;
    }
}

// 更新交易類型選項
function updateTradeTypeOptions() {
    const tradeTypeSelect = document.getElementById('tradeType');
    const currentValue = tradeTypeSelect.value;

    tradeTypeSelect.innerHTML = '<option value="">請選擇</option>';
    customTradeTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        tradeTypeSelect.appendChild(option);
    });

    // 恢復之前選擇的值
    if (currentValue && customTradeTypes.includes(currentValue)) {
        tradeTypeSelect.value = currentValue;
    }
}

// 管理交易所
function manageExchanges() {
    while (true) {
        const currentList = customExchanges.map((item, index) => `${index + 1}. ${item}`).join('\n');

        const action = prompt(
            `=== 管理交易所 ===\n\n【目前的交易所列表】（共 ${customExchanges.length} 個）\n${currentList}\n\n請選擇操作：\n1 = 新增交易所\n2 = 刪除交易所\n0 = 完成並退出\n\n請輸入數字：`
        );

        if (action === null || action === '0') {
            // 使用者取消或選擇退出
            break;
        } else if (action === '1') {
            // 新增交易所
            if (customExchanges.length >= 15) {
                alert('⚠️ 已達到最大數量限制（15個）！\n請先刪除部分選項後再新增。');
                continue;
            }

            const newExchange = prompt('請輸入新的交易所名稱：');
            if (newExchange && newExchange.trim().length > 0) {
                const trimmedExchange = newExchange.trim();
                if (customExchanges.includes(trimmedExchange)) {
                    alert('❌ 此交易所已存在！');
                } else {
                    customExchanges.push(trimmedExchange);
                    saveCustomOptions();
                    updateExchangeOptions();
                    alert(`✅ 已新增：${trimmedExchange}`);
                }
            }
        } else if (action === '2') {
            // 刪除交易所
            if (customExchanges.length <= 1) {
                alert('❌ 至少需要保留一個交易所！');
                continue;
            }

            const indexToDelete = prompt(
                `請輸入要刪除的編號（1-${customExchanges.length}）：\n\n${currentList}`
            );

            if (indexToDelete !== null) {
                const index = parseInt(indexToDelete) - 1;
                if (index >= 0 && index < customExchanges.length) {
                    const deleted = customExchanges[index];
                    customExchanges.splice(index, 1);
                    saveCustomOptions();
                    updateExchangeOptions();
                    alert(`✅ 已刪除：${deleted}`);
                } else {
                    alert('❌ 無效的編號！');
                }
            }
        } else {
            alert('❌ 請輸入有效的選項（0、1 或 2）');
        }
    }
}

// 管理策略
function manageStrategies() {
    while (true) {
        const currentList = customStrategies.map((item, index) => `${index + 1}. ${item}`).join('\n');
        const listDisplay = customStrategies.length > 0 ? currentList : '（目前無策略）';

        const action = prompt(
            `=== 管理策略類型 ===\n\n【目前的策略列表】（共 ${customStrategies.length} 個）\n${listDisplay}\n\n請選擇操作：\n1 = 新增策略\n2 = 刪除策略\n0 = 完成並退出\n\n請輸入數字：`
        );

        if (action === null || action === '0') {
            break;
        } else if (action === '1') {
            if (customStrategies.length >= 15) {
                alert('⚠️ 已達到最大數量限制（15個）！\n請先刪除部分選項後再新增。');
                continue;
            }

            const newStrategy = prompt('請輸入新的策略名稱：');
            if (newStrategy && newStrategy.trim().length > 0) {
                const trimmedStrategy = newStrategy.trim();
                if (customStrategies.includes(trimmedStrategy)) {
                    alert('❌ 此策略已存在！');
                } else {
                    customStrategies.push(trimmedStrategy);
                    saveCustomOptions();
                    updateStrategyOptions();
                    alert(`✅ 已新增：${trimmedStrategy}`);
                }
            }
        } else if (action === '2') {
            if (customStrategies.length === 0) {
                alert('❌ 目前沒有策略可刪除！');
                continue;
            }

            const indexToDelete = prompt(
                `請輸入要刪除的編號（1-${customStrategies.length}）：\n\n${currentList}`
            );

            if (indexToDelete !== null) {
                const index = parseInt(indexToDelete) - 1;
                if (index >= 0 && index < customStrategies.length) {
                    const deleted = customStrategies[index];
                    customStrategies.splice(index, 1);
                    saveCustomOptions();
                    updateStrategyOptions();
                    alert(`✅ 已刪除：${deleted}`);
                } else {
                    alert('❌ 無效的編號！');
                }
            }
        } else {
            alert('❌ 請輸入有效的選項（0、1 或 2）');
        }
    }
}

// 管理交易類型
function manageTradeTypes() {
    while (true) {
        const currentList = customTradeTypes.map((item, index) => `${index + 1}. ${item}`).join('\n');

        const action = prompt(
            `=== 管理交易類型 ===\n\n【目前的交易類型列表】（共 ${customTradeTypes.length} 個）\n${currentList}\n\n請選擇操作：\n1 = 新增交易類型\n2 = 刪除交易類型\n0 = 完成並退出\n\n請輸入數字：`
        );

        if (action === null || action === '0') {
            break;
        } else if (action === '1') {
            if (customTradeTypes.length >= 15) {
                alert('⚠️ 已達到最大數量限制（15個）！\n請先刪除部分選項後再新增。');
                continue;
            }

            const newType = prompt('請輸入新的交易類型名稱：');
            if (newType && newType.trim().length > 0) {
                const trimmedType = newType.trim();
                if (customTradeTypes.includes(trimmedType)) {
                    alert('❌ 此交易類型已存在！');
                } else {
                    customTradeTypes.push(trimmedType);
                    saveCustomOptions();
                    updateTradeTypeOptions();
                    alert(`✅ 已新增：${trimmedType}`);
                }
            }
        } else if (action === '2') {
            if (customTradeTypes.length <= 1) {
                alert('❌ 至少需要保留一個交易類型！');
                continue;
            }

            const indexToDelete = prompt(
                `請輸入要刪除的編號（1-${customTradeTypes.length}）：\n\n${currentList}`
            );

            if (indexToDelete !== null) {
                const index = parseInt(indexToDelete) - 1;
                if (index >= 0 && index < customTradeTypes.length) {
                    const deleted = customTradeTypes[index];
                    customTradeTypes.splice(index, 1);
                    saveCustomOptions();
                    updateTradeTypeOptions();
                    alert(`✅ 已刪除：${deleted}`);
                } else {
                    alert('❌ 無效的編號！');
                }
            }
        } else {
            alert('❌ 請輸入有效的選項（0、1 或 2）');
        }
    }
}

// 更新開倉心情選項
function updateEntryMoodOptions() {
    const moodSelect = document.getElementById('entryMood');
    if (!moodSelect) {
        console.error('找不到開倉心情下拉選單元素');
        return;
    }

    const currentValue = moodSelect.value;

    // 完全清空現有選項
    moodSelect.innerHTML = '';

    // 添加預設選項
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '請選擇';
    moodSelect.appendChild(defaultOption);

    // 添加自訂選項
    customEntryMoods.forEach(mood => {
        const option = document.createElement('option');
        option.value = mood;
        option.textContent = mood;
        moodSelect.appendChild(option);
    });

    // 恢復之前選擇的值
    if (currentValue && customEntryMoods.includes(currentValue)) {
        moodSelect.value = currentValue;
    }

    console.log('開倉心情選項已更新，共', customEntryMoods.length, '個'); // 調試用
}

// 更新平倉心情選項
function updateExitMoodOptions() {
    const moodSelect = document.getElementById('exitMoodBefore');
    if (!moodSelect) {
        console.error('找不到平倉心情下拉選單元素');
        return;
    }

    const currentValue = moodSelect.value;

    // 完全清空現有選項
    moodSelect.innerHTML = '';

    // 添加預設選項
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '請選擇';
    moodSelect.appendChild(defaultOption);

    // 添加自訂選項
    customExitMoods.forEach(mood => {
        const option = document.createElement('option');
        option.value = mood;
        option.textContent = mood;
        moodSelect.appendChild(option);
    });

    // 恢復之前選擇的值
    if (currentValue && customExitMoods.includes(currentValue)) {
        moodSelect.value = currentValue;
    }

    console.log('平倉心情選項已更新，共', customExitMoods.length, '個'); // 調試用
}

// 管理開倉心情
function manageEntryMoods() {
    while (true) {
        const currentList = customEntryMoods.map((item, index) => `${index + 1}. ${item}`).join('\n');
        const listDisplay = customEntryMoods.length > 0 ? currentList : '（目前無選項）';

        const action = prompt(
            `=== 管理開倉心情 ===\n\n【目前的開倉心情列表】（共 ${customEntryMoods.length} 個）\n${listDisplay}\n\n請選擇操作：\n1 = 新增心情選項\n2 = 刪除心情選項\n0 = 完成並退出\n\n請輸入數字：`
        );

        if (action === null || action === '0') {
            break;
        } else if (action === '1') {
            if (customEntryMoods.length >= 15) {
                alert('⚠️ 已達到最大數量限制（15個）！\n請先刪除部分選項後再新增。');
                continue;
            }

            const newMood = prompt('請輸入新的開倉心情選項：');
            if (newMood && newMood.trim().length > 0) {
                const trimmedMood = newMood.trim();
                if (customEntryMoods.includes(trimmedMood)) {
                    alert('❌ 此心情選項已存在！');
                } else {
                    customEntryMoods.push(trimmedMood);
                    saveCustomOptions();
                    updateEntryMoodOptions();
                    alert(`✅ 已新增：${trimmedMood}`);
                }
            }
        } else if (action === '2') {
            if (customEntryMoods.length === 0) {
                alert('❌ 目前沒有心情選項可刪除！');
                continue;
            }

            const indexToDelete = prompt(
                `請輸入要刪除的編號（1-${customEntryMoods.length}）：\n\n${currentList}`
            );

            if (indexToDelete !== null) {
                const index = parseInt(indexToDelete) - 1;
                if (index >= 0 && index < customEntryMoods.length) {
                    const deleted = customEntryMoods[index];
                    customEntryMoods.splice(index, 1);
                    saveCustomOptions();
                    updateEntryMoodOptions();
                    alert(`✅ 已刪除：${deleted}`);
                } else {
                    alert('❌ 無效的編號！');
                }
            }
        } else {
            alert('❌ 請輸入有效的選項（0、1 或 2）');
        }
    }
}

// 管理平倉心情
function manageExitMoods() {
    while (true) {
        const currentList = customExitMoods.map((item, index) => `${index + 1}. ${item}`).join('\n');
        const listDisplay = customExitMoods.length > 0 ? currentList : '（目前無選項）';

        const action = prompt(
            `=== 管理平倉心情 ===\n\n【目前的平倉心情列表】（共 ${customExitMoods.length} 個）\n${listDisplay}\n\n請選擇操作：\n1 = 新增心情選項\n2 = 刪除心情選項\n0 = 完成並退出\n\n請輸入數字：`
        );

        if (action === null || action === '0') {
            break;
        } else if (action === '1') {
            if (customExitMoods.length >= 15) {
                alert('⚠️ 已達到最大數量限制（15個）！\n請先刪除部分選項後再新增。');
                continue;
            }

            const newMood = prompt('請輸入新的平倉心情選項：');
            if (newMood && newMood.trim().length > 0) {
                const trimmedMood = newMood.trim();
                if (customExitMoods.includes(trimmedMood)) {
                    alert('❌ 此心情選項已存在！');
                } else {
                    customExitMoods.push(trimmedMood);
                    saveCustomOptions();
                    updateExitMoodOptions();
                    alert(`✅ 已新增：${trimmedMood}`);
                }
            }
        } else if (action === '2') {
            if (customExitMoods.length === 0) {
                alert('❌ 目前沒有心情選項可刪除！');
                continue;
            }

            const indexToDelete = prompt(
                `請輸入要刪除的編號（1-${customExitMoods.length}）：\n\n${currentList}`
            );

            if (indexToDelete !== null) {
                const index = parseInt(indexToDelete) - 1;
                if (index >= 0 && index < customExitMoods.length) {
                    const deleted = customExitMoods[index];
                    customExitMoods.splice(index, 1);
                    saveCustomOptions();
                    updateExitMoodOptions();
                    alert(`✅ 已刪除：${deleted}`);
                } else {
                    alert('❌ 無效的編號！');
                }
            }
        } else {
            alert('❌ 請輸入有效的選項（0、1 或 2）');
        }
    }
}

// 更新幣種篩選器
function updateCoinFilter() {
    const coinFilter = document.getElementById('coinFilter');
    const coins = [...new Set(trades.map(t => t.coinSymbol))].sort();

    coinFilter.innerHTML = '<option value="all">全部</option>';
    coins.forEach(coin => {
        const option = document.createElement('option');
        option.value = coin;
        option.textContent = coin;
        coinFilter.appendChild(option);
    });
}

// 更新統計數據
function updateStats() {
    const filteredTrades = getFilteredTrades();

    // 總交易次數
    document.getElementById('totalTrades').textContent = filteredTrades.length;

    // 總盈虧
    const totalProfitLoss = filteredTrades.reduce((sum, t) => sum + t.profitLoss, 0);
    document.getElementById('totalProfitLoss').textContent = formatCurrency(totalProfitLoss);
    document.getElementById('totalProfitLoss').className = 'value ' + (totalProfitLoss >= 0 ? 'profit' : 'loss');

    // 總手續費
    const totalFees = filteredTrades.reduce((sum, t) => sum + t.fee, 0);
    document.getElementById('totalFees').textContent = formatCurrency(totalFees);

    // 勝率
    const profitableTrades = filteredTrades.filter(t => t.profitLoss > 0).length;
    const winRate = filteredTrades.length > 0 ? (profitableTrades / filteredTrades.length * 100).toFixed(2) : 0;
    document.getElementById('winRate').textContent = winRate + '%';
}

// 顯示記錄
function displayRecords() {
    const tbody = document.getElementById('recordsBody');
    const filteredTrades = getFilteredTrades();

    if (filteredTrades.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="20" style="text-align: center; padding: 30px; color: #999;">
                    沒有符合條件的交易記錄
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = '';

    // 依日期排序（最新的在前）
    const sortedTrades = [...filteredTrades].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedTrades.forEach(trade => {
        const row = tbody.insertRow();
        const total = trade.quantity * trade.price;

        row.innerHTML = `
            <td>${formatDateTime(trade.date)}</td>
            <td>${trade.type}</td>
            <td><strong>${trade.coinSymbol}</strong></td>
            <td>${formatNumber(trade.quantity)}</td>
            <td>${formatCurrency(trade.price)}</td>
            <td>${formatCurrency(total)}</td>
            <td>${formatCurrency(trade.fee)}</td>
            <td class="${trade.profitLoss >= 0 ? 'profit' : 'loss'}">${formatCurrency(trade.profitLoss)}</td>
            <td class="${trade.profitLossPercent >= 0 ? 'profit' : 'loss'}">${trade.profitLossPercent.toFixed(2)}%</td>
            <td>${trade.postTradeMood || '-'}</td>
            <td>${trade.exchange}</td>
            <td>${trade.strategy || '-'}</td>
            <td>${trade.location || '-'}</td>
            <td>${trade.mood || '-'}</td>
            <td>${trade.timeOfDay || '-'}</td>
            <td>${trade.weather || '-'}</td>
            <td>${trade.dayOfWeek || '-'}</td>
            <td>${trade.physicalCondition || '-'}</td>
            <td>${trade.notes || '-'}</td>
            <td class="action-btns">
                <button class="btn-primary btn-small" onclick="editTrade(${trade.id})">編輯</button>
                <button class="btn-danger btn-small" onclick="deleteTrade(${trade.id})">刪除</button>
            </td>
        `;
    });
}

// 篩選記錄
function filterRecords() {
    updateStats();
    displayRecords();
}

// 取得篩選後的交易
function getFilteredTrades() {
    let filtered = [...trades];

    // 時間篩選
    const timeFilter = document.getElementById('timeFilter').value;
    const now = new Date();

    if (timeFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
    } else if (timeFilter === 'month') {
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(t => new Date(t.date) >= monthAgo);
    } else if (timeFilter === 'quarter') {
        const quarter = Math.floor(now.getMonth() / 3);
        const quarterStart = new Date(now.getFullYear(), quarter * 3, 1);
        filtered = filtered.filter(t => new Date(t.date) >= quarterStart);
    } else if (timeFilter === 'custom') {
        const dateFrom = document.getElementById('dateFrom')?.value;
        const dateTo = document.getElementById('dateTo')?.value;

        if (dateFrom) {
            filtered = filtered.filter(t => new Date(t.date) >= new Date(dateFrom));
        }
        if (dateTo) {
            const endDate = new Date(dateTo);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(t => new Date(t.date) <= endDate);
        }
    }

    // 幣種篩選
    const coinFilter = document.getElementById('coinFilter').value;
    if (coinFilter !== 'all') {
        filtered = filtered.filter(t => t.coinSymbol === coinFilter);
    }

    // 類型篩選
    const typeFilter = document.getElementById('typeFilter').value;
    if (typeFilter !== 'all') {
        filtered = filtered.filter(t => t.type === typeFilter);
    }

    return filtered;
}

// 編輯交易
function editTrade(id) {
    const trade = trades.find(t => t.id === id);
    if (!trade) return;

    document.getElementById('tradeDate').value = trade.date;
    document.getElementById('tradeType').value = trade.type;
    document.getElementById('coinSymbol').value = trade.coinSymbol;
    document.getElementById('quantity').value = trade.quantity;
    document.getElementById('price').value = trade.price;
    document.getElementById('fee').value = trade.fee;
    document.getElementById('exchange').value = trade.exchange;
    document.getElementById('tradingPair').value = trade.tradingPair;
    document.getElementById('strategy').value = trade.strategy;
    document.getElementById('leverage').value = trade.leverage || 1;
    document.getElementById('holdingPeriod').value = trade.holdingPeriod || '';
    document.getElementById('riskRewardRatio').value = trade.riskRewardRatio || '';
    document.getElementById('profitLoss').value = trade.profitLoss;
    document.getElementById('profitLossPercent').value = trade.profitLossPercent;
    document.getElementById('maxDrawdown').value = trade.maxDrawdown || '';
    document.getElementById('entryReason').value = trade.entryReason || '';
    document.getElementById('exitReason').value = trade.exitReason || '';
    document.getElementById('postTradeMood').value = trade.postTradeMood || '';
    document.getElementById('review').value = trade.review || '';
    document.getElementById('notes').value = trade.notes;

    // 開倉環境
    document.getElementById('entryTime').value = trade.entryTime || '';
    document.getElementById('entryLocation').value = trade.entryLocation || '';
    document.getElementById('entryMood').value = trade.entryMood || '';
    document.getElementById('entryWeather').value = trade.entryWeather || '';
    document.getElementById('entryPhysical').value = trade.entryPhysical || '';
    document.getElementById('entrySleepHours').value = trade.entrySleepHours || '';
    document.getElementById('entrySurroundings').value = trade.entrySurroundings || '';
    document.getElementById('entryHappenings').value = trade.entryHappenings || '';
    document.getElementById('entryThoughts').value = trade.entryThoughts || '';

    // 平倉環境
    document.getElementById('exitTime').value = trade.exitTime || '';
    document.getElementById('exitLocation').value = trade.exitLocation || '';
    document.getElementById('exitMoodBefore').value = trade.exitMoodBefore || '';
    document.getElementById('exitWeather').value = trade.exitWeather || '';
    document.getElementById('exitPhysical').value = trade.exitPhysical || '';
    document.getElementById('exitSleepHours').value = trade.exitSleepHours || '';
    document.getElementById('exitSurroundings').value = trade.exitSurroundings || '';
    document.getElementById('exitHappenings').value = trade.exitHappenings || '';
    document.getElementById('exitThoughts').value = trade.exitThoughts || '';

    currentEditId = id;
    document.querySelector('.btn-primary').textContent = '更新記錄';

    // 捲動到表單
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// 刪除交易
function deleteTrade(id) {
    if (!confirm('確定要刪除這筆交易記錄嗎？')) return;

    trades = trades.filter(t => t.id !== id);
    saveTrades();
    updateCoinFilter();
    updateStats();
    displayRecords();
}

// 清空所有記錄
function clearAllData() {
    if (!confirm('警告：這將刪除所有交易記錄！\n\n此操作無法復原，確定要繼續嗎？')) return;

    if (!confirm('最後確認：真的要清空所有資料嗎？')) return;

    trades = [];
    saveTrades();
    updateCoinFilter();
    updateStats();
    displayRecords();
    alert('所有記錄已清空');
}

// 匯出到 Excel
function exportToExcel(period) {
    // 暫存當前篩選設定
    const currentFilter = document.getElementById('timeFilter').value;

    // 設定要匯出的期間
    document.getElementById('timeFilter').value = period;
    const dataToExport = getFilteredTrades();

    // 恢復原本的篩選設定
    document.getElementById('timeFilter').value = currentFilter;

    if (dataToExport.length === 0) {
        alert('沒有資料可以匯出！');
        return;
    }

    // 準備 Excel 資料
    const excelData = dataToExport.map(trade => ({
        '日期時間': formatDateTime(trade.date),
        '交易類型': trade.type,
        '幣種': trade.coinSymbol,
        '數量': trade.quantity,
        '單價 (USD)': trade.price,
        '總額 (USD)': trade.quantity * trade.price,
        '手續費 (USD)': trade.fee,
        '槓桿倍數': trade.leverage || 1,
        '持倉時長 (小時)': trade.holdingPeriod || 0,
        '風險報酬比': trade.riskRewardRatio || 0,
        '盈虧 (USD)': trade.profitLoss,
        '盈虧比例 (%)': trade.profitLossPercent,
        '最大回撤 (%)': trade.maxDrawdown || 0,
        '進場理由': trade.entryReason,
        '出場理由': trade.exitReason,
        '平倉後心情': trade.postTradeMood,
        '交易所': trade.exchange,
        '交易對': trade.tradingPair,
        '策略': trade.strategy,
        '開倉時間': trade.entryTime ? formatDateTime(trade.entryTime) : '',
        '開倉地點': trade.entryLocation,
        '開倉心情': trade.entryMood,
        '開倉天氣': trade.entryWeather,
        '開倉身體': trade.entryPhysical,
        '開倉睡眠時間': trade.entrySleepHours,
        '開倉周圍人事物': trade.entrySurroundings,
        '開倉發生的事': trade.entryHappenings,
        '開倉當下感想': trade.entryThoughts,
        '平倉時間': trade.exitTime ? formatDateTime(trade.exitTime) : '',
        '平倉地點': trade.exitLocation,
        '平倉前心情': trade.exitMoodBefore,
        '平倉天氣': trade.exitWeather,
        '平倉身體': trade.exitPhysical,
        '平倉睡眠時間': trade.exitSleepHours,
        '平倉周圍人事物': trade.exitSurroundings,
        '平倉發生的事': trade.exitHappenings,
        '平倉當下感想': trade.exitThoughts,
        '交易檢討': trade.review,
        '備註': trade.notes
    }));

    // 計算基本統計資料
    const totalTrades = dataToExport.length;
    const totalProfitLoss = dataToExport.reduce((sum, t) => sum + t.profitLoss, 0);
    const totalFees = dataToExport.reduce((sum, t) => sum + t.fee, 0);
    const profitableTrades = dataToExport.filter(t => t.profitLoss > 0);
    const losingTrades = dataToExport.filter(t => t.profitLoss < 0);
    const winRate = totalTrades > 0 ? (profitableTrades.length / totalTrades * 100).toFixed(2) : 0;

    // 計算進階統計
    const avgProfit = profitableTrades.length > 0
        ? (profitableTrades.reduce((sum, t) => sum + t.profitLoss, 0) / profitableTrades.length).toFixed(2)
        : 0;
    const avgLoss = losingTrades.length > 0
        ? (losingTrades.reduce((sum, t) => sum + t.profitLoss, 0) / losingTrades.length).toFixed(2)
        : 0;
    const profitFactor = Math.abs(avgLoss) > 0
        ? (Math.abs(avgProfit) / Math.abs(avgLoss)).toFixed(2)
        : 0;

    const maxProfit = dataToExport.length > 0
        ? Math.max(...dataToExport.map(t => t.profitLoss)).toFixed(2)
        : 0;
    const maxLoss = dataToExport.length > 0
        ? Math.min(...dataToExport.map(t => t.profitLoss)).toFixed(2)
        : 0;

    const avgHoldingPeriod = dataToExport.filter(t => t.holdingPeriod > 0).length > 0
        ? (dataToExport.filter(t => t.holdingPeriod > 0).reduce((sum, t) => sum + t.holdingPeriod, 0) /
           dataToExport.filter(t => t.holdingPeriod > 0).length).toFixed(2)
        : 0;

    const totalVolume = dataToExport.reduce((sum, t) => sum + (t.quantity * t.price), 0).toFixed(2);
    const netProfit = (totalProfitLoss - totalFees).toFixed(2);
    const roi = totalVolume > 0 ? ((totalProfitLoss / totalVolume) * 100).toFixed(2) : 0;

    // 按交易類型統計
    const tradeTypeStats = {};
    dataToExport.forEach(t => {
        if (!tradeTypeStats[t.type]) {
            tradeTypeStats[t.type] = { count: 0, profit: 0, win: 0 };
        }
        tradeTypeStats[t.type].count++;
        tradeTypeStats[t.type].profit += t.profitLoss;
        if (t.profitLoss > 0) tradeTypeStats[t.type].win++;
    });

    // 按策略統計
    const strategyStats = {};
    dataToExport.forEach(t => {
        if (t.strategy) {
            if (!strategyStats[t.strategy]) {
                strategyStats[t.strategy] = { count: 0, profit: 0, win: 0 };
            }
            strategyStats[t.strategy].count++;
            strategyStats[t.strategy].profit += t.profitLoss;
            if (t.profitLoss > 0) strategyStats[t.strategy].win++;
        }
    });

    // 按幣種統計
    const coinStats = {};
    dataToExport.forEach(t => {
        if (!coinStats[t.coinSymbol]) {
            coinStats[t.coinSymbol] = { count: 0, profit: 0, win: 0 };
        }
        coinStats[t.coinSymbol].count++;
        coinStats[t.coinSymbol].profit += t.profitLoss;
        if (t.profitLoss > 0) coinStats[t.coinSymbol].win++;
    });

    // 加入統計摘要
    const summary = [
        {},
        { '日期時間': '=== 基本統計 ===' },
        { '日期時間': '總交易次數', '交易類型': totalTrades },
        { '日期時間': '獲利交易', '交易類型': profitableTrades.length },
        { '日期時間': '虧損交易', '交易類型': losingTrades.length },
        { '日期時間': '勝率 (%)', '交易類型': winRate },
        {},
        { '日期時間': '=== 損益分析 ===' },
        { '日期時間': '總盈虧 (USD)', '交易類型': totalProfitLoss.toFixed(2) },
        { '日期時間': '總手續費 (USD)', '交易類型': totalFees.toFixed(2) },
        { '日期時間': '淨利潤 (USD)', '交易類型': netProfit },
        { '日期時間': '總交易量 (USD)', '交易類型': totalVolume },
        { '日期時間': 'ROI (%)', '交易類型': roi },
        {},
        { '日期時間': '=== 績效指標 ===' },
        { '日期時間': '平均獲利 (USD)', '交易類型': avgProfit },
        { '日期時間': '平均虧損 (USD)', '交易類型': avgLoss },
        { '日期時間': '盈虧比 (Profit Factor)', '交易類型': profitFactor },
        { '日期時間': '最大單筆獲利 (USD)', '交易類型': maxProfit },
        { '日期時間': '最大單筆虧損 (USD)', '交易類型': maxLoss },
        { '日期時間': '平均持倉時長 (小時)', '交易類型': avgHoldingPeriod },
        {},
        { '日期時間': '=== 交易類型分析 ===' }
    ];

    Object.keys(tradeTypeStats).forEach(type => {
        const stats = tradeTypeStats[type];
        const typeWinRate = ((stats.win / stats.count) * 100).toFixed(2);
        summary.push({
            '日期時間': `${type}`,
            '交易類型': `次數: ${stats.count}`,
            '幣種': `盈虧: $${stats.profit.toFixed(2)}`,
            '數量': `勝率: ${typeWinRate}%`
        });
    });

    summary.push({});
    summary.push({ '日期時間': '=== 策略分析 ===' });

    Object.keys(strategyStats).forEach(strategy => {
        const stats = strategyStats[strategy];
        const strategyWinRate = ((stats.win / stats.count) * 100).toFixed(2);
        summary.push({
            '日期時間': `${strategy}`,
            '交易類型': `次數: ${stats.count}`,
            '幣種': `盈虧: $${stats.profit.toFixed(2)}`,
            '數量': `勝率: ${strategyWinRate}%`
        });
    });

    summary.push({});
    summary.push({ '日期時間': '=== 幣種分析 ===' });

    // 按盈虧排序幣種
    const sortedCoins = Object.keys(coinStats).sort((a, b) =>
        coinStats[b].profit - coinStats[a].profit
    );

    sortedCoins.forEach(coin => {
        const stats = coinStats[coin];
        const coinWinRate = ((stats.win / stats.count) * 100).toFixed(2);
        summary.push({
            '日期時間': `${coin}`,
            '交易類型': `次數: ${stats.count}`,
            '幣種': `盈虧: $${stats.profit.toFixed(2)}`,
            '數量': `勝率: ${coinWinRate}%`
        });
    });

    // 合併資料
    const fullData = [...excelData, ...summary];

    // 建立工作簿
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(fullData);

    // 設定欄位寬度
    const colWidths = [
        { wch: 18 }, // 日期時間
        { wch: 10 }, // 交易類型
        { wch: 10 }, // 幣種
        { wch: 15 }, // 數量
        { wch: 12 }, // 單價
        { wch: 12 }, // 總額
        { wch: 12 }, // 手續費
        { wch: 12 }, // 盈虧
        { wch: 12 }, // 盈虧比例
        { wch: 12 }, // 平倉後心情
        { wch: 12 }, // 交易所
        { wch: 12 }, // 交易對
        { wch: 10 }, // 策略
        { wch: 12 }, // 地點
        { wch: 12 }, // 交易時心情
        { wch: 15 }, // 時段
        { wch: 10 }, // 天氣
        { wch: 10 }, // 星期
        { wch: 12 }, // 身體狀況
        { wch: 30 }, // 當下發生的事
        { wch: 30 }, // 附近人事物
        { wch: 30 }  // 備註
    ];
    ws['!cols'] = colWidths;

    // 加入工作表
    XLSX.utils.book_append_sheet(wb, ws, '交易記錄');

    // 建立檔案名稱
    const periodNames = {
        'all': '全部',
        'week': '本週',
        'month': '本月',
        'quarter': '本季'
    };
    const periodName = periodNames[period] || period;
    const fileName = `加密貨幣交易記錄_${periodName}_${formatDate(new Date())}.xlsx`;

    // 下載檔案
    XLSX.writeFile(wb, fileName);

    alert(`已匯出 ${totalTrades} 筆交易記錄！`);
}

// 格式化日期時間
function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// 格式化貨幣
function formatCurrency(value) {
    return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// 格式化數字
function formatNumber(value) {
    if (value >= 1) {
        return value.toFixed(4);
    }
    return value.toFixed(8);
}

// ==================== JSON 匯出/匯入功能 ====================

// 匯出所有資料為 JSON
function exportToJSON() {
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        trades: trades,
        customOptions: {
            exchanges: customExchanges,
            strategies: customStrategies,
            tradeTypes: customTradeTypes,
            entryMoods: customEntryMoods,
            exitMoods: customExitMoods
        }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto_trading_backup_${formatDate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`✅ 資料匯出成功！\n\n交易記錄：${trades.length} 筆\n自訂選項已包含\n\n檔案已下載，請妥善保存。`);
}

// 匯入 JSON 資料
function importFromJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const importData = JSON.parse(event.target.result);

                // 驗證資料格式
                if (!importData.trades || !importData.customOptions) {
                    alert('❌ 檔案格式錯誤！\n請選擇正確的備份檔案。');
                    return;
                }

                // 詢問匯入方式
                const importMode = confirm(
                    `檔案資訊：\n` +
                    `• 交易記錄：${importData.trades.length} 筆\n` +
                    `• 匯出日期：${new Date(importData.exportDate).toLocaleString('zh-TW')}\n\n` +
                    `請選擇匯入方式：\n\n` +
                    `【確定】= 覆蓋模式（清空現有資料，完全取代）\n` +
                    `【取消】= 合併模式（保留現有資料，新增匯入）`
                );

                if (importMode) {
                    // 覆蓋模式
                    trades = importData.trades;
                    customExchanges = importData.customOptions.exchanges || [];
                    customStrategies = importData.customOptions.strategies || [];
                    customTradeTypes = importData.customOptions.tradeTypes || [];
                    customEntryMoods = importData.customOptions.entryMoods || [];
                    customExitMoods = importData.customOptions.exitMoods || [];

                    saveTrades();
                    saveCustomOptions();

                    alert(`✅ 覆蓋匯入成功！\n\n已匯入 ${trades.length} 筆交易記錄\n所有自訂選項已更新`);
                } else {
                    // 合併模式
                    const beforeCount = trades.length;

                    // 合併交易記錄（避免 ID 重複）
                    const existingIds = new Set(trades.map(t => t.id));
                    const newTrades = importData.trades.filter(t => !existingIds.has(t.id));
                    trades = [...trades, ...newTrades];

                    // 合併自訂選項（去重）
                    customExchanges = [...new Set([...customExchanges, ...(importData.customOptions.exchanges || [])])];
                    customStrategies = [...new Set([...customStrategies, ...(importData.customOptions.strategies || [])])];
                    customTradeTypes = [...new Set([...customTradeTypes, ...(importData.customOptions.tradeTypes || [])])];
                    customEntryMoods = [...new Set([...customEntryMoods, ...(importData.customOptions.entryMoods || [])])];
                    customExitMoods = [...new Set([...customExitMoods, ...(importData.customOptions.exitMoods || [])])];

                    saveTrades();
                    saveCustomOptions();

                    const addedCount = trades.length - beforeCount;
                    alert(`✅ 合併匯入成功！\n\n新增 ${addedCount} 筆交易記錄\n總計 ${trades.length} 筆\n自訂選項已合併`);
                }

                // 更新介面
                updateTradeTypeOptions();
                updateExchangeOptions();
                updateStrategyOptions();
                updateEntryMoodOptions();
                updateExitMoodOptions();
                updateCoinFilter();
                updateStats();
                displayRecords();

            } catch (error) {
                alert(`❌ 匯入失敗！\n\n錯誤訊息：${error.message}\n\n請確認檔案格式正確。`);
                console.error('Import error:', error);
            }
        };

        reader.readAsText(file);
    };

    input.click();
}