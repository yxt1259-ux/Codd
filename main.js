// ==========================================
// 1. 基础配置与工具函数
// ==========================================
function updateDate() {
    const now = new Date();
    document.getElementById('currentDate').textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
}

function getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return "春季";
    if (month >= 6 && month <= 8) return "夏季";
    if (month >= 9 && month <= 11) return "秋季";
    return "冬季";
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// 2. 核心数据字典：降维匹配、当季景点、美食配置
// ==========================================
const yunnanConfig = [
    { geoNames: ["昆明市", "昆明"], queryAdcode: "530100", standardName: "昆明市", shortName: "昆明", center: [25.0389, 102.7183] },
    { geoNames: ["曲靖市", "曲靖"], queryAdcode: "530302", standardName: "曲靖市", shortName: "曲靖", center: [25.5984, 103.7918] },
    { geoNames: ["玉溪市", "玉溪"], queryAdcode: "530402", standardName: "玉溪市", shortName: "玉溪", center: [24.3522, 102.5487] },
    { geoNames: ["保山市", "保山"], queryAdcode: "530502", standardName: "保山市", shortName: "保山", center: [25.1167, 99.1333] },
    { geoNames: ["昭通市", "昭通"], queryAdcode: "530602", standardName: "昭通市", shortName: "昭通", center: [27.3372, 103.7228] },
    { geoNames: ["丽江市", "丽江"], queryAdcode: "530702", standardName: "丽江市", shortName: "丽江", center: [26.8679, 100.2202] },
    { geoNames: ["普洱市", "普洱"], queryAdcode: "530802", standardName: "普洱市", shortName: "普洱", center: [22.7974, 100.9736] },
    { geoNames: ["临沧市", "临沧"], queryAdcode: "530902", standardName: "临沧市", shortName: "临沧", center: [23.8766, 100.0998] },
    { geoNames: ["楚雄州", "楚雄彝族自治州", "楚雄"], queryAdcode: "532301", standardName: "楚雄彝族自治州", shortName: "楚雄州", center: [25.0208, 101.5300] },
    { geoNames: ["红河州", "红河哈尼族彝族自治州", "红河"], queryAdcode: "532502", standardName: "红河哈尼族彝族自治州", shortName: "红河州", center: [23.3789, 103.1939] },
    { geoNames: ["文山州", "文山壮族苗族自治州", "文山"], queryAdcode: "532601", standardName: "文山壮族苗族自治州", shortName: "文山州", center: [23.3901, 104.2482] },
    { geoNames: ["西双版纳", "西双版纳州", "西双版纳傣族自治州"], queryAdcode: "532801", standardName: "西双版纳傣族自治州", shortName: "西双版纳", center: [22.0085, 100.8133] },
    { geoNames: ["大理州", "大理白族自治州", "大理"], queryAdcode: "532901", standardName: "大理白族自治州", shortName: "大理州", center: [25.6977, 100.1996] },
    { geoNames: ["德宏州", "德宏傣族景颇族自治州", "德宏"], queryAdcode: "533103", standardName: "德宏傣族景颇族自治州", shortName: "德宏州", center: [24.4432, 97.9500] },
    { geoNames: ["怒江州", "怒江傈僳族自治州", "怒江"], queryAdcode: "533301", standardName: "怒江傈僳族自治州", shortName: "怒江州", center: [26.9402, 98.7855] },
    { geoNames: ["迪庆州", "迪庆藏族自治州", "迪庆"], queryAdcode: "533401", standardName: "迪庆藏族自治州", shortName: "迪庆州", center: [27.8373, 99.7078] }
];

const travelSpotsConfig = {
    "昆明市": {"春季": ["圆通山赏樱花", "金殿风景区", "翠湖公园"], "夏季": ["石林风景区避暑", "九乡溶洞", "云南民族村"], "秋季": ["东川红土地", "捞鱼河湿地公园", "植物园赏枫"], "冬季": ["滇池喂红嘴鸥", "轿子雪山赏雪", "安宁泡温泉"]},
    "大理白族自治州": {"春季": ["大理古城", "苍山洗马潭杜鹃", "喜洲古镇"], "夏季": ["洱海游船", "双廊古镇", "蝴蝶泉"], "秋季": ["喜洲看金黄麦浪", "沙溪古镇", "苍山玉带云"], "冬季": ["无量山樱花谷", "小普陀看海鸥", "南诏风情岛"]},
    "丽江市": {"春季": ["拉市海赏花", "丽江古城", "蓝月谷"], "夏季": ["泸沽湖避暑", "虎跳峡观壮阔水流", "老君山"], "秋季": ["玉龙雪山秋景", "束河古镇闲逛", "白沙古镇"], "冬季": ["玉龙雪山赏雪", "清溪水库看雪山倒影", "黑龙潭"]},
    "西双版纳傣族自治州": {"春季": ["曼听公园", "泼水节广场"], "夏季": ["中科院热带植物园", "南腊河漂流"], "秋季": ["野象谷看大象", "原始森林公园"], "冬季": ["星光夜市", "告庄西双景", "傣族园"]},
    "迪庆藏族自治州": {"春季": ["普达措高山杜鹃", "白水台"], "夏季": ["纳帕海草原", "巴拉格宗"], "秋季": ["梅里雪山日照金山", "狼毒花海"], "冬季": ["松赞林寺", "哈巴雪山攀登", "独克宗古城"]},
    "保山市": {"春季": ["和顺古镇", "高黎贡山茶花"], "夏季": ["北海湿地泛舟", "火山地质公园"], "秋季": ["固东银杏村", "高黎贡山徒步"], "冬季": ["腾冲热海泡温泉", "和顺古镇晒太阳"]},
    "红河哈尼族彝族自治州": {"春季": ["元阳梯田", "建水古城"], "夏季": ["弥勒锦屏山", "建水团山民居"], "秋季": ["元阳梯田", "阿庐古洞"], "冬季": ["弥勒泡温泉", "石屏异龙湖"]},
    "文山壮族苗族自治州": {"春季": ["坝美世外桃源", "英雄老山"], "夏季": ["普者黑(万亩荷花)", "仙人洞村"], "秋季": ["普者黑湿地秋色", "八宝风景区"], "冬季": ["老山神炮", "文山三七交易市场"]},
    "曲靖市": {"春季": ["罗平油菜花海", "九龙瀑布群"], "夏季": ["珠江源风景区", "多依河"], "秋季": ["尼珠河大峡谷", "陆良彩色沙林"], "冬季": ["会泽大桥乡看黑颈鹤", "马龙温泉"]},
    "玉溪市": {"春季": ["抚仙湖春游", "澄江化石地"], "夏季": ["抚仙湖避暑潜水", "哀牢山寻凉"], "秋季": ["红塔山", "易门龙泉公园"], "冬季": ["秀山历史文化公园", "华宁温泉"]},
    "昭通市": {"春季": ["西部大峡谷温泉", "豆沙关"], "夏季": ["黄连河瀑布群避暑", "扎西古镇"], "秋季": ["铜锣坝国家森林公园"], "冬季": ["大山包看黑颈鹤", "大山包雾凇"]},
    "普洱市": {"春季": ["茶马古道寻春", "娜允古镇"], "夏季": ["普洱国家公园", "北回归线标志园"], "秋季": ["梅子湖公园", "孟连大金塔"], "冬季": ["中华普洱茶博览苑", "景迈山茶林"]},
    "临沧市": {"春季": ["翁丁佤族原始群落", "沧源崖画"], "夏季": ["南滚河自然保护区", "五老山"], "秋季": ["鲁史古镇", "冰岛茶山"], "冬季": ["大雪山", "沧源司岗里"]},
    "楚雄彝族自治州": {"春季": ["武定狮子山赏牡丹", "紫溪山"], "夏季": ["世界恐龙谷", "彝人古镇"], "秋季": ["元谋人博物馆", "咪依噜风情谷"], "冬季": ["元谋土林", "黑井古镇"]},
    "德宏傣族景颇族自治州": {"春季": ["景颇族目瑙纵歌节", "勐焕大金塔"], "夏季": ["莫里热带雨林", "大盈江"], "秋季": ["瑞丽一寨两国", "畹町桥"], "冬季": ["芒市遮放树洞温泉", "瑞丽边贸街"]},
    "怒江傈僳族自治州": {"春季": ["怒江第一湾", "丙中洛"], "夏季": ["怒江大峡谷", "石月亮"], "秋季": ["老姆登村", "秋那桶"], "冬季": ["独龙江探秘", "澡堂会"]}
};

// 新增：本地特色美食配置
const foodConfig = {
    "昆明市": ["过桥米线：汤鲜味美，米线爽滑", "汽锅鸡：原汁原味，滋补佳品", "烧饵块：软糯咸香，街头风味"],
    "大理白族自治州": ["大理酸辣鱼：洱海鱼鲜，酸辣开胃", "乳扇：奶香浓郁，可烤可炸", "喜洲粑粑：外酥里软，甜咸皆宜"],
    "丽江市": ["腊排骨火锅：咸香浓郁，越煮越香", "鸡豆凉粉：爽滑酸辣，夏日必吃", "纳西烤鱼：外焦里嫩，香料独特"],
    "西双版纳傣族自治州": ["傣味烧烤：香茅草烤鱼，酸辣入味", "菠萝紫米饭：果香米香交融", "喃咪拼盘：傣家蘸酱，清爽开胃"],
    "迪庆藏族自治州": ["牦牛肉火锅：高原风味，暖身滋补", "酥油茶：咸香醇厚，御寒佳品", "青稞饼：麦香浓郁，越嚼越香"],
    "保山市": ["大救驾：饵块炒制，典故名菜", "火烧肉：皮脆肉嫩，蘸水一绝", "腾冲土锅子：食材丰富，汤鲜味美"],
    "红河哈尼族彝族自治州": ["建水烧豆腐：外焦里嫩，蘸料灵魂", "蒙自过桥米线：发源之地，风味正宗", "石屏豆腐：天然井水点制，鲜嫩爽滑"],
    "文山壮族苗族自治州": ["三七汽锅鸡：药膳同源，滋补强身", "广南岜夯鸡：酸汤开胃，鸡肉鲜嫩", "花糯米饭：色彩缤纷，清香软糯"],
    "曲靖市": ["沾益辣子鸡：香辣过瘾，滇菜代表", "宣威火腿：咸香回甘，煲汤炒菜皆宜", "蒸饵丝：软糯弹牙，甜咸酱香"],
    "玉溪市": ["抚仙湖铜锅鱼：鱼肉鲜甜，原汤化原食", "江川盐水鱼：咸香紧实，冷热皆宜", "通海豆末糖：酥脆香甜，入口即化"],
    "昭通市": ["昭通小肉串：麻辣鲜香，深夜食堂", "天麻火腿鸡：药膳滋补，汤鲜肉烂", "油糕饵块：酥脆软糯，早餐标配"],
    "普洱市": ["普洱鸡豆腐：鸡肉嫩滑，汤底醇厚", "江城黄牛干巴：嚼劲十足，越嚼越香", "景东火腿木瓜鸡：酸香开胃，风味独特"],
    "临沧市": ["火腿木瓜鸡：酸辣开胃，鸡肉鲜嫩", "佤族鸡肉烂饭：软糯鲜香，民族风味", "凤庆腊肉：晶莹剔透，咸香不腻"],
    "楚雄彝族自治州": ["野生菌火锅：菌香四溢，山珍荟萃", "元谋凉鸡：皮爽肉滑，蘸水提味", "姚安套肠：层层相套，风味独特"],
    "德宏傣族景颇族自治州": ["撒撇：苦凉回甘，傣味灵魂", "景颇鬼鸡：酸辣开胃，香料独特", "泡鲁达：椰香浓郁，甜品首选"],
    "怒江傈僳族自治州": ["漆油鸡：漆油炖煮，滋补暖身", "傈僳手抓饭：食材丰富，民族盛宴", "老窝火腿：高山放养，肉质紧实"]
};

let weatherData = {}; 
let geoJsonLayer = null;
let currentMapType = 'standard';
let routeLayers = [];
let cityLabelsLayer = null;
let cityCenters = {};

// 用于临时标记起终点的图层变量
let tempStartMarker = null;
let tempEndMarker = null;

// 缓存对象：用于存储天气预报数据
let forecastCache = {}; 
const CACHE_DURATION = 10 * 60 * 1000; 

// 均值数据变量
let avgWeatherData = {};

// 地图显示模式：'realtime' 或 'average'
let mapDisplayMode = 'realtime';

// 当前选中的城市（用于POI自动搜索）
let currentSelectedCity = null;

// 标签页切换逻辑
function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // 移除所有按钮的active类
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 隐藏所有内容面板
            const panels = document.querySelectorAll('.tab-panel-content');
            panels.forEach(p => p.classList.remove('active'));
            
            // 显示对应面板
            const activePanel = document.getElementById(`${tabId}Panel`);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });
}

// 修改为请求我们自己的 Python 后端
async function getAIOutfit(city, weather, temp) {
    const outfitContent = document.getElementById('aiOutfitContent');
    outfitContent.innerHTML = `<div style="text-align:center; padding:15px; color:#3b82f6;">⏳ 正在呼叫 Python 后端，请求 AI 穿搭...</div>`;
    
    try {
        const response = await fetch('https://weather-map-x2it.onrender.com/api/outfit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                city: city,
                season: getCurrentSeason(),
                weather: weather,
                temp: temp
            })
        });
        
        const data = await response.json();
        
        if(data.success) {
            const formattedText = data.text.replace(/\n/g, '<br>');
            outfitContent.innerHTML = `<div class="ai-bubble"><span class="ai-tag">✨ AI 穿搭建议：</span>${formattedText}</div>`;
        } else {
            throw new Error(data.error);
        }
    } catch (err) {
        console.error(err);
        outfitContent.innerHTML = `<p style="color:#ef4444;">后端请求失败，请稍后重试。</p>`;
    }
}

// ==========================================
// 4. 数据获取与面板更新逻辑
// ==========================================
async function fetchAllWeather() {
    const apiKey = config.amapApiKey;
    let alertMessages = [];
    
    async function fetchWithRetry(adcode, standardName, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const res = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?key=${apiKey}&city=${adcode}&extensions=base`);
                const data = await res.json();
                if (data.status === '1' && data.lives.length > 0) {
                    return data.lives[0]; 
                } else {
                    throw new Error("接口返回状态异常");
                }
            } catch (err) {
                console.warn(`[${standardName}] 第 ${i + 1} 次请求失败，正在准备重试...`);
                if (i < maxRetries - 1) await sleep(500);
            }
        }
        console.error(`[${standardName}] 连续 ${maxRetries} 次请求彻底失败。`);
        return null; 
    }

    for (const item of yunnanConfig) {
        await sleep(100);
        const w = await fetchWithRetry(item.queryAdcode, item.standardName);
        if (w) {
            weatherData[item.standardName] = {
                adcode: item.queryAdcode, 
                standardName: item.standardName,
                temp: w.temperature,
                text: w.weather,
                humidity: w.humidity,
                windDir: w.winddirection,
                windScale: w.windpower
            };
            const alertKeywords = ["大雨", "暴雨", "阵雨", "雷", "大风", "冰雹", "雪"];
            if (alertKeywords.some(key => w.weather.includes(key))) {
                alertMessages.push(`【${item.standardName}】${w.weather}`);
            }
        }
    }
    
    if (alertMessages.length > 0) {
        document.getElementById('alertBar').style.display = 'flex';
        document.getElementById('alertText').innerText = alertMessages.join(" ｜ ") + "，请注意防范！";
    }
}

function getSafeWeatherData(geoName) {
    const shortName = geoName.replace(/(市|州|自治州|地区|傣族|景颇族|傈僳族|藏族|白族|壮族|苗族|哈尼族|彝族)/g, '');
    const configItem = yunnanConfig.find(item => item.geoNames.some(n => n.includes(shortName)));
    if (!configItem) return null;
    
    // 根据显示模式返回不同的数据
    if (mapDisplayMode === 'average') {
        return avgWeatherData[configItem.standardName] || null;
    } else {
        return weatherData[configItem.standardName] || null;
    }
}

function updateForecast(adcode) {
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '<p style="font-size:12px;opacity:0.8;">加载预报中...</p>';
    
    // 检查缓存
    const cached = forecastCache[adcode];
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        // 使用缓存数据
        renderForecast(cached.forecasts, adcode);
        return;
    }
    
    // 请求新数据
    fetch(`https://restapi.amap.com/v3/weather/weatherInfo?key=${config.amapApiKey}&city=${adcode}&extensions=all`)
        .then(res => res.json())
        .then(data => {
            if (data.status === '1' && data.forecasts.length > 0) {
                const casts = data.forecasts[0].casts;
                // 存入缓存
                forecastCache[adcode] = {
                    forecasts: casts,
                    timestamp: Date.now()
                };
                renderForecast(casts, adcode);
            } else {
                container.innerHTML = '<p style="font-size:12px;opacity:0.8;">暂无预报数据</p>';
            }
        })
        .catch(err => {
            console.error('获取预报失败', err);
            container.innerHTML = '<p style="font-size:12px;color:#ef4444;">预报加载失败</p>';
        });
}

// 提取渲染预报的逻辑
function renderForecast(casts, adcode) {
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '';
    // 更新今日气温范围（使用当天数据）
    document.getElementById('tempRangeDisplay').textContent = `今日气温：${casts[0].nighttemp}℃ ~ ${casts[0].daytemp}℃`;
    
    casts.forEach(f => {
        const dateShort = f.date.split('-').slice(1).join('/');
        container.innerHTML += `
            <div class="forecast-card">
                <div style="opacity:0.8; font-size: 11px;">${dateShort}</div>
                <div style="font-size: 16px; margin: 5px 0;">
                    ${f.dayweather.includes('晴') ? '☀️' : f.dayweather.includes('雨') ? '🌧️' : '☁️'}
                </div>
                <div style="font-weight:bold; font-size:11px;">${f.dayweather}</div>
                <div style="font-size:11px; margin-top:4px;">${f.nighttemp}~${f.daytemp}℃</div>
            </div>
        `;
    });
}

// 计算未来 n 天（不含当天）的均值，n 默认为 3 
function computeForecastAverage(adcode, days = 3) { 
    const cached = forecastCache[adcode]; 
    if (!cached) { 
        return null; // 还未请求预报 
    } 
    const casts = cached.forecasts; 
    // casts[0] 是当天，从索引 1 开始取 days 天 
    const futureCasts = casts.slice(1, 1 + days); 
    if (futureCasts.length === 0) return null; 
    
    let sumDayTemp = 0, sumNightTemp = 0; 
    let weatherCount = {}; 
    futureCasts.forEach(cast => { 
        sumDayTemp += parseInt(cast.daytemp); 
        sumNightTemp += parseInt(cast.nighttemp); 
        const weather = cast.dayweather; 
        weatherCount[weather] = (weatherCount[weather] || 0) + 1; 
    }); 
    const avgDayTemp = (sumDayTemp / futureCasts.length).toFixed(1); 
    const avgNightTemp = (sumNightTemp / futureCasts.length).toFixed(1); 
    // 天气众数 
    let modeWeather = ''; 
    let maxCount = 0; 
    for (let [w, count] of Object.entries(weatherCount)) { 
        if (count > maxCount) { 
            maxCount = count; 
            modeWeather = w; 
        } 
    } 
    return { 
        avgDayTemp, 
        avgNightTemp, 
        modeWeather, 
        days: futureCasts.length 
    }; 
} 

// 显示均值结果（不显示 toast 浮动提示） 
function showAvgResult(adcode, cityName) { 
    const result = computeForecastAverage(adcode); 
    if (!result) { 
        // 如果还没有预报缓存，主动触发一次预报请求，然后等待完成后再计算 
        const container = document.getElementById('forecastContainer'); 
        const observer = new MutationObserver(function(mutations) { 
            if (forecastCache[adcode]) { 
                observer.disconnect(); 
            } 
        }); 
        observer.observe(container, { childList: true, subtree: true }); 
        // 如果已经请求过但还没有缓存（请求中），等待；否则主动请求 
        if (!forecastCache[adcode]) { 
            updateForecast(adcode); 
        } 
        return; 
    } 
} 

// 更新分级图列
function updateLegend() {
    const legendTitle = document.querySelector('.temp-legend .legend-title');
    if (legendTitle) {
        if (mapDisplayMode === 'average') {
            legendTitle.textContent = '平均温度 (℃)';
        } else {
            legendTitle.textContent = '温度 (℃)';
        }
    }
}

// 计算所有城市的天气均值并更新地图显示
async function showAllCitiesAvg() {
    // 清空之前的均值数据
    avgWeatherData = {};
    
    // 为所有城市获取预报数据
    for (const cityItem of yunnanConfig) {
        const adcode = cityItem.queryAdcode;
        const standardName = cityItem.standardName;
        
        // 检查缓存，如果没有缓存则请求数据
        if (!forecastCache[adcode]) {
            // 等待预报数据加载
            await new Promise(resolve => {
                const container = document.getElementById('forecastContainer');
                const observer = new MutationObserver(() => {
                    if (forecastCache[adcode]) {
                        observer.disconnect();
                        resolve();
                    }
                });
                observer.observe(container, { childList: true, subtree: true });
                updateForecast(adcode);
                
                // 设置超时
                setTimeout(() => {
                    observer.disconnect();
                    resolve();
                }, 5000);
            });
        }
        
        // 计算均值
        const avgResult = computeForecastAverage(adcode);
        if (avgResult) {
            // 构建均值数据对象，结构与weatherData保持一致
            avgWeatherData[standardName] = {
                adcode: adcode,
                standardName: standardName,
                temp: avgResult.avgDayTemp, // 使用平均最高气温作为显示温度
                text: avgResult.modeWeather, // 使用代表性天气
                humidity: 'N/A', // 均值数据中没有湿度
                windDir: 'N/A', // 均值数据中没有风向
                windScale: 'N/A' // 均值数据中没有风速
            };
        }
    }
    
    // 切换到均值显示模式
    mapDisplayMode = 'average';
    
    // 刷新地图图层，显示均值的分级色彩
    if (geoJsonLayer) {
        geoJsonLayer.eachLayer(layer => {
            const w = getSafeWeatherData(layer.feature.properties.name);
            layer.setStyle(getFeatureStyle(w ? w.temp : 20, false));
            layer.bringToBack();
        });
    }
    
    // 刷新城市标签，确保悬停时显示正确的数据
    createCityLabels();
    
    // 更新分级图列
    updateLegend();
}

// 切换到实时天气显示模式
function switchToRealtimeMode() {
    mapDisplayMode = 'realtime';
    
    // 刷新地图图层，显示实时天气的分级色彩
    if (geoJsonLayer) {
        geoJsonLayer.eachLayer(layer => {
            const w = getSafeWeatherData(layer.feature.properties.name);
            layer.setStyle(getFeatureStyle(w ? w.temp : 20, false));
            layer.bringToBack();
        });
    }
    
    // 刷新城市标签，确保悬停时显示正确的数据
    createCityLabels();
    
    // 更新分级图列
    updateLegend();
    
    // 更新按钮状态
    const avgBtn = document.getElementById('avgForecastBtn');
    if (avgBtn) {
        avgBtn.textContent = '📊 未来天气均值';
        // 移除之前的点击事件
        avgBtn.removeEventListener('click', switchToRealtimeMode);
        // 添加新的点击事件
        avgBtn.addEventListener('click', showAverageMode);
    }
}

// 显示均值模式
async function showAverageMode() {
    const currentCity = document.getElementById('cityNameDisplay').textContent;
    if (!currentCity || currentCity === '云南省') {
        alert('请先点击地图选择一个城市');
        return;
    }
    // 根据城市名称找到对应的 adcode
    const cityItem = yunnanConfig.find(item => item.standardName === currentCity);
    if (!cityItem) {
        alert('无法获取该城市代码');
        return;
    }
    // 禁用按钮防止重复点击
    const avgBtn = document.getElementById('avgForecastBtn');
    if (avgBtn) {
        avgBtn.disabled = true;
        avgBtn.textContent = '⏳ 计算中...';
    }
    
    try {
        // 确保当前城市的预报已加载
        if (!forecastCache[cityItem.queryAdcode]) {
            await new Promise(resolve => {
                const container = document.getElementById('forecastContainer');
                const observer = new MutationObserver(() => {
                    if (forecastCache[cityItem.queryAdcode]) {
                        observer.disconnect();
                        resolve();
                    }
                });
                observer.observe(container, { childList: true, subtree: true });
                updateForecast(cityItem.queryAdcode);
                
                // 设置超时
                setTimeout(() => {
                    observer.disconnect();
                    resolve();
                }, 10000);
            });
        }
        
        // 显示当前城市的均值
        showAvgResult(cityItem.queryAdcode, currentCity);
        
        // 计算所有城市的均值并更新地图显示
        await showAllCitiesAvg();
        
        // 更新按钮状态，变为切换回实时模式
        if (avgBtn) {
            avgBtn.textContent = '🌤️ 实时天气';
            // 移除之前的点击事件
            avgBtn.removeEventListener('click', showAverageMode);
            // 添加新的点击事件
            avgBtn.addEventListener('click', switchToRealtimeMode);
        }
    } catch (error) {
        console.error('计算均值失败:', error);
        alert('计算均值失败，请稍后再试');
        // 恢复按钮状态
        if (avgBtn) {
            avgBtn.disabled = false;
            avgBtn.textContent = '📊 未来天气均值';
        }
    } finally {
        // 恢复按钮状态
        if (avgBtn) {
            avgBtn.disabled = false;
        }
    }
}

// 绑定均值按钮的事件 
let avgBtn = document.getElementById('avgForecastBtn'); 
if (avgBtn) { 
    avgBtn.addEventListener('click', showAverageMode);
}

// 绑定显示路线气温折线图按钮的事件
let showWeatherChartBtn = document.getElementById('showWeatherChartBtn');
if (showWeatherChartBtn) {
    showWeatherChartBtn.addEventListener('click', function() {
        if (routeWeatherData.length === 0) {
            alert('请先规划路线并获取路径天气数据');
            return;
        }
        
        const routeOptions = document.getElementById('routeOptions');
        const chartHtml = createWeatherChart(routeWeatherData);
        
        if (routeOptions && chartHtml) {
            const existingChart = routeOptions.querySelector('.weather-chart-container');
            if (existingChart) {
                existingChart.innerHTML = chartHtml;
            } else {
                const chartContainer = document.createElement('div');
                chartContainer.className = 'weather-chart-container';
                chartContainer.innerHTML = chartHtml;
                routeOptions.appendChild(chartContainer);
            }
        }
    });
}

function updateTouristSpots(standardName) {
    const seasonData = travelSpotsConfig[standardName];
    const contentDiv = document.getElementById('spotsContent');
    
    if (seasonData) {
        const currentSeason = getCurrentSeason(); 
        const currentSpots = seasonData[currentSeason] || [];

        let html = `<div style="background: #dbeafe; padding: 12px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">`;
        html += `<div style="font-weight: bold; color: #1d4ed8; margin-bottom: 10px;">✨ ${currentSeason}最适宜</div>`;
        
        if (currentSpots.length > 0) {
            currentSpots.forEach(spot => {
                html += `<div class="spots-item"><span style="margin-right:8px; color:#ef4444;">📍</span><span style="font-weight:bold; color:#1f2937;">${spot}</span></div>`;
            });
        }
        html += `</div>`;

        const seasonsIcon = {"春季": "🌸", "夏季": "🍃", "秋季": "🍁", "冬季": "❄️"};
        html += `<div style="font-size:13px; font-weight:bold; color:#6b7280; margin-bottom:8px;">💡 其他季节参考：</div>`;
        
        for (let season in seasonData) {
            if (season !== currentSeason && seasonData[season].length > 0) {
                html += `<div style="margin-bottom: 10px;"><div style="font-size: 12px; color: #4b5563; margin-bottom: 5px;">${seasonsIcon[season]} ${season}</div><div style="display: flex; flex-wrap: wrap; gap: 6px;">`;
                seasonData[season].forEach(spot => {
                    html += `<span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #4b5563; border: 1px solid #e5e7eb;">${spot}</span>`;
                });
                html += `</div></div>`;
            }
        }
        contentDiv.innerHTML = html;
    } else {
        contentDiv.innerHTML = `<p style="text-align:center; color:#9ca3af; padding:20px;">暂无景点数据</p>`;
    }
}

// 本地美食渲染函数
function updateLocalFood(standardName) {
    const foodContent = document.getElementById('foodContent');
    const foodList = foodConfig[standardName];
    
    if (foodList && foodList.length > 0) {
        let html = `<div style="background: #fef3c7; padding: 12px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">`;
        html += `<div style="font-weight: bold; color: #92400e; margin-bottom: 10px;">🍜 ${standardName} 特色美食</div>`;
        
        foodList.forEach(food => {
            let parts = food.split(/[：:]/);
            if (parts.length >= 2) {
                let name = parts[0].trim();
                let desc = parts.slice(1).join(':').trim();
                html += `<div class="spots-item" style="border-left-color: #f59e0b;"><span style="margin-right:8px; color:#d97706;">🍴</span><span style="font-weight:bold; color:#1f2937;">${name}</span><span style="margin-left:8px; font-size:12px; color:#6b7280;">${desc}</span></div>`;
            } else {
                html += `<div class="spots-item" style="border-left-color: #f59e0b;"><span style="margin-right:8px; color:#d97706;">🍴</span><span style="font-weight:bold; color:#1f2937;">${food}</span></div>`;
            }
        });
        html += `</div>`;
        foodContent.innerHTML = html;
    } else {
        foodContent.innerHTML = `<p style="text-align:center; color:#9ca3af; padding:20px;">暂无美食数据</p>`;
    }
}

function updateMainPanel(standardName, w) {
    document.getElementById('cityNameDisplay').textContent = standardName;
    document.getElementById('currentTempDisplay').textContent = `${w.temp}℃`;
    
    const icon = document.getElementById('weatherIconDisplay');
    if (w.text.includes('晴')) icon.textContent = '☀️';
    else if (w.text.includes('云')) icon.textContent = '☁️';
    else if (w.text.includes('雨')) icon.textContent = '🌧️';
    else if (w.text.includes('雪')) icon.textContent = '❄️';
    else icon.textContent = '🌤️';
    
    document.getElementById('humidity').textContent = w.humidity;
    document.getElementById('windSpeed').textContent = w.windScale;
    document.getElementById('windDir').textContent = w.windDir.includes('风') ? w.windDir : w.windDir + '风';
    
    updateForecast(w.adcode);
    getAIOutfit(standardName, w.text, w.temp);
    
    currentSelectedCity = standardName;
    autoSearchNearby(standardName);
}

async function autoSearchNearby(cityName) {
    const poiResults = document.getElementById('poiResults');
    const currentType = document.querySelector('.poi-tab-btn.active').dataset.type;
    
    poiResults.innerHTML = `<p style="text-align:center; padding:20px; color:#3b82f6;">🔍 正在搜索 ${cityName} 周边...</p>`;
    
    const result = await searchPOI(cityName, currentType);
    
    if (result.success) {
        renderPOIResults(result.data, currentType);
        showPOIMarkers(result.data, currentType);
    } else {
        poiResults.innerHTML = `<p style="font-size:13px; color:#ef4444; text-align:center; padding:20px;">${result.message}</p>`;
    }
}

// ==========================================
// 5. 地图初始化与渲染交互
// ==========================================
const leafletMap = L.map('map', { center: [25.0, 102.7], zoom: 7, minZoom: 6, maxZoom: 10, zoomControl: true, attributionControl: false });
L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}', { subdomains: ['1', '2', '3', '4'] }).addTo(leafletMap);

window.changeMapLayer = function(type) {
    currentMapType = type;
    const url = type === 'standard' 
        ? 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
        : 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
    
    leafletMap.eachLayer(l => { if(l._url) leafletMap.removeLayer(l); });
    L.tileLayer(url, { subdomains: ['1', '2', '3', '4'] }).addTo(leafletMap);
    
    if (geoJsonLayer) {
        geoJsonLayer.eachLayer(layer => {
            const w = getSafeWeatherData(layer.feature.properties.name);
            layer.setStyle(getFeatureStyle(w ? w.temp : 20, false));
            layer.bringToBack();
        });
    }
    
    if (cityLabelsLayer) {
        leafletMap.addLayer(cityLabelsLayer);
    }
};

leafletMap.on('zoomend', updateCityLabelsSize);

document.getElementById('cityLabelsToggle').addEventListener('change', function() {
    cityLabelsEnabled = this.checked;
    saveCityLabelsState();
    createCityLabels();
});

function getColorByTemperature(temp) {
    const t = parseInt(temp);
    if (isNaN(t)) return '#60a5fa'; 
    if (t > 30) return '#ef4444'; 
    if (t > 25) return '#f97316'; 
    if (t > 18) return '#fcd34d'; 
    if (t > 10) return '#60a5fa'; 
    return '#93c5fd';
}

function getFeatureStyle(temp, isHover = false) {
    const color = getColorByTemperature(temp);
    if (currentMapType === 'satellite') {
        return { color: isHover ? '#ffffff' : color, weight: isHover ? 3 : 2.5, fillColor: color, fillOpacity: isHover ? 0.3 : 0.1 };
    } else {
        return { color: isHover ? '#1e40af' : '#ffffff', weight: isHover ? 3 : 1.5, fillColor: color, fillOpacity: isHover ? 0.9 : 0.7 };
    }
}

const coreCities = ['昆明市', '玉溪市', '曲靖市'];
let cityLabelsEnabled = true;

function loadCityLabelsState() {
    const savedState = localStorage.getItem('cityLabelsEnabled');
    if (savedState !== null) {
        cityLabelsEnabled = savedState === 'true';
        const toggleBtn = document.getElementById('cityLabelsToggle');
        if (toggleBtn) toggleBtn.checked = cityLabelsEnabled;
    }
}

function saveCityLabelsState() {
    localStorage.setItem('cityLabelsEnabled', cityLabelsEnabled.toString());
}

function createCityLabels() {
    if (cityLabelsLayer) {
        leafletMap.removeLayer(cityLabelsLayer);
    }
    if (!cityLabelsEnabled) return;
    
    cityLabelsLayer = L.layerGroup();
    const zoom = leafletMap.getZoom();
    
    yunnanConfig.forEach(item => {
        let cityName = item.standardName;
        
        // 缩放级别小于8时，优先使用短名称，避免重叠和超出
        if (zoom < 8 && item.shortName) {
            cityName = item.shortName;
        } else {
            // 对长地名进行智能换行（超过6个字符时插入<br>）
            if (cityName.length > 6) {
                // 在民族名称后或适当位置换行
                cityName = cityName.replace(/(哈尼族|彝族|壮族|苗族|白族|傣族|景颇族|傈僳族|藏族)/g, '$1<br>');
                // 如果替换后还是太长，再在“自治州”前换行
                cityName = cityName.replace('自治州', '<br>自治州');
            }
        }
        
        // 处理核心城市显示
        if (zoom > 10 && !coreCities.includes(item.standardName) && !coreCities.includes(item.shortName)) return;
        
        let center = cityCenters[item.standardName];
        if (!center) {
            console.warn(`未找到 ${item.standardName} 的中心坐标，使用配置中心`);
            center = item.center;
        }
        
        let baseFontSize = Math.max(11, Math.min(16, 10 + (zoom - 6) * 1.5));
        const displayName = cityName;
        const charCount = displayName.replace(/<br>/g, '').length;
        if (charCount > 8) baseFontSize = Math.max(10, baseFontSize - 2);
        
        const labelHtml = `<div class="city-label" style="
            font-size: ${baseFontSize}px;
            font-weight: bold;
            font-family: 'KaiTi', '楷体', 'STKaiti', serif;
            color: #000;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
            background: rgba(255, 255, 255, 0.7);
            padding: 4px 8px;
            border-radius: 6px;
            border: 1px solid rgba(100,100,100,0.3);
            white-space: nowrap;
            text-align: center;
            line-height: 1.4;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
            backdrop-filter: blur(2px);
            max-width: 120px;
            word-break: keep-all;
        ">${displayName}</div>`;
        
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.fontSize = baseFontSize + 'px';
        tempSpan.style.fontWeight = 'bold';
        tempSpan.style.fontFamily = "'KaiTi', '楷体', 'STKaiti', serif";
        tempSpan.style.padding = '4px 8px';
        tempSpan.style.whiteSpace = 'nowrap';
        tempSpan.innerHTML = displayName.replace(/<br>/g, '');
        document.body.appendChild(tempSpan);
        let textWidth = tempSpan.offsetWidth;
        let textHeight = tempSpan.offsetHeight;
        document.body.removeChild(tempSpan);
        
        if (displayName.includes('<br>')) {
            textHeight = textHeight * 1.8;
            textWidth = Math.min(textWidth, 120);
        }
        
        const label = L.divIcon({
            html: labelHtml,
            className: 'city-label-icon',
            iconSize: [textWidth + 10, textHeight + 8],
            iconAnchor: [(textWidth + 10) / 2, (textHeight + 8) / 2]
        });
        
        L.marker(center, { icon: label, zIndexOffset: 300 }).addTo(cityLabelsLayer);
    });
    
    cityLabelsLayer.addTo(leafletMap);
    leafletMap.addLayer(cityLabelsLayer);
}

function updateCityLabelsSize() {
    createCityLabels();
}

function loadGeo() {
    fetch('yunnan_geo.json')
        .then(res => res.json())
        .then(data => {
            geoJsonLayer = L.geoJSON(data, {
                style: function(feature) {
                    const w = getSafeWeatherData(feature.properties.name);
                    return getFeatureStyle(w ? w.temp : 20, false);
                },
                onEachFeature: function(feature, layer) {
                    layer.on({
                        mouseover: function(e) {
                            const w = getSafeWeatherData(feature.properties.name);
                            layer.setStyle(getFeatureStyle(w ? w.temp : 20, true));
                            if (w) {
                                L.popup({ className: 'city-popup' })
                                    .setLatLng(e.latlng)
                                    .setContent(`
                                        <div style="text-align:center;">
                                            <h4 style="color: #1e40af; margin-bottom: 5px;">${w.standardName}</h4>
                                            <div style="font-size: 20px; font-weight: bold;">${w.temp}°C</div>
                                            <div style="color: #6b7280; font-size:12px;">${w.text}</div>
                                            <div style="color: #3b82f6; font-size:12px; margin-top:5px; font-weight:bold;">点击获取 AI 穿搭 👉</div>
                                        </div>
                                    `).openOn(leafletMap);
                            }
                        },
                        mouseout: function(e) {
                            const w = getSafeWeatherData(feature.properties.name);
                            layer.setStyle(getFeatureStyle(w ? w.temp : 20, false));
                            leafletMap.closePopup();
                        },
                        click: function(e) {
                            const w = getSafeWeatherData(feature.properties.name);
                            if (w) updateMainPanel(w.standardName, w);
                        }
                    });
                }
            }).addTo(leafletMap);
            
            geoJsonLayer.eachLayer(layer => {
                const name = layer.feature.properties.name;
                const center = layer.getBounds().getCenter();
                cityCenters[name] = [center.lat, center.lng];
            });
            
            geoJsonLayer.eachLayer(layer => layer.bringToBack());
            createCityLabels();
        }).catch(err => console.error("GeoJSON加载失败:", err));
}

// ==========================================
// 6. 路线规划与分析
// ==========================================
document.getElementById('routeBtn').onclick = () => {
    document.getElementById('routePanel').classList.toggle('show');
};

document.getElementById('recommendBtn').onclick = () => {
    if (Object.keys(weatherData).length === 0) return alert("数据仍在加载中，请稍候...");
    const cityList = Object.keys(weatherData);
    let i = Math.floor(Math.random() * cityList.length), j;
    do { j = Math.floor(Math.random() * cityList.length); } while (i === j);
    
    document.getElementById('origin').value = cityList[i];
    document.getElementById('destination').value = cityList[j];
    document.getElementById('routePanel').classList.add('show');
    document.getElementById('searchRoute').click(); 
};

let weatherPathLayers = [];
let currentAdminLevel = 'city';
let weatherPathEnabled = true;
let routeWeatherData = [];

function loadRouteStates() {
    const savedLevel = localStorage.getItem('adminLevel');
    const savedWeatherPath = localStorage.getItem('weatherPathEnabled');
    if (savedLevel) currentAdminLevel = savedLevel;
    if (savedWeatherPath !== null) {
        weatherPathEnabled = savedWeatherPath === 'true';
        document.getElementById('weatherPathToggle').checked = weatherPathEnabled;
    }
}

function saveRouteStates() {
    localStorage.setItem('adminLevel', currentAdminLevel);
    localStorage.setItem('weatherPathEnabled', weatherPathEnabled.toString());
}

function clearWeatherPathLayers() {
    weatherPathLayers.forEach(layer => { if (leafletMap.hasLayer(layer)) leafletMap.removeLayer(layer); });
    weatherPathLayers = [];
}

document.getElementById('weatherPathToggle').addEventListener('change', function() {
    weatherPathEnabled = this.checked;
    saveRouteStates();
    if (!weatherPathEnabled) clearWeatherPathLayers();
});

async function getCoordinatesInfo(address) {
    const res = await fetch(`https://restapi.amap.com/v3/geocode/geo?address=${address}&key=${config.amapApiKey}`);
    const data = await res.json();
    if(data.status === '1' && data.geocodes.length > 0) {
        return { 
            location: data.geocodes[0].location, 
            adcode: data.geocodes[0].adcode,
            level: data.geocodes[0].level
        };
    }
    return null;
}

function getWeatherIcon(weather) {
    if (weather.includes('晴')) return '☀️';
    if (weather.includes('雨')) return '🌧️';
    if (weather.includes('云')) return '☁️';
    if (weather.includes('雪')) return '❄️';
    if (weather.includes('雾')) return '🌫️';
    if (weather.includes('霾')) return '😷';
    return '🌤️';
}

async function getWeatherAlongRoute(steps) {
    const weatherData = [];
    const processedDistricts = new Set();
    const maxLabels = 8;
    let labelCount = 0;
    
    for (const step of steps) {
        if (labelCount >= maxLabels) break;
        const polyline = step.polyline.split(';');
        const centerIndex = Math.floor(polyline.length / 2);
        const centerPoint = polyline[centerIndex];
        const [lng, lat] = centerPoint.split(',');
        try {
            const geoRes = await fetch(`https://restapi.amap.com/v3/geocode/regeo?location=${lng},${lat}&key=${config.amapApiKey}`);
            const geoData = await geoRes.json();
            if (geoData.status === '1' && geoData.regeocode.addressComponent) {
                const addressComponent = geoData.regeocode.addressComponent;
                const adcode = addressComponent.adcode;
                const district = addressComponent.district || addressComponent.city || addressComponent.province;
                if (processedDistricts.has(district)) continue;
                processedDistricts.add(district);
                
                // 使用 extensions=all 获取预报数据
                const weatherRes = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?key=${config.amapApiKey}&city=${adcode}&extensions=all`);
                const weatherInfo = await weatherRes.json();
                
                if (weatherInfo.status === '1') {
                    let temperature = '';
                    let weather = '';
                    let humidity = '';
                    let windDirection = '';
                    let windPower = '';
                    
                    // 如果有预报数据，计算未来3天的平均温度（白天温度）
                    if (weatherInfo.forecasts && weatherInfo.forecasts.length > 0) {
                        const forecasts = weatherInfo.forecasts[0];
                        if (forecasts.casts && forecasts.casts.length > 0) {
                            const futureCasts = forecasts.casts.slice(1, 4);
                            if (futureCasts.length > 0) {
                                const sumDayTemp = futureCasts.reduce((sum, cast) => sum + parseInt(cast.daytemp), 0);
                                temperature = (sumDayTemp / futureCasts.length).toFixed(1);
                                const weatherCount = {};
                                futureCasts.forEach(cast => {
                                    const w = cast.dayweather;
                                    weatherCount[w] = (weatherCount[w] || 0) + 1;
                                });
                                let maxCount = 0;
                                for (let [w, count] of Object.entries(weatherCount)) {
                                    if (count > maxCount) {
                                        maxCount = count;
                                        weather = w;
                                    }
                                }
                            }
                        }
                    }
                    
                    // 如果没有预报数据，使用实时天气作为备选
                    if (!temperature && weatherInfo.lives && weatherInfo.lives.length > 0) {
                        const liveWeather = weatherInfo.lives[0];
                        temperature = liveWeather.temperature;
                        weather = liveWeather.weather;
                        humidity = liveWeather.humidity;
                        windDirection = liveWeather.winddirection;
                        windPower = liveWeather.windpower;
                    }
                    
                    weatherData.push({
                        location: [parseFloat(lat), parseFloat(lng)],
                        district: district,
                        adcode: adcode,
                        weather: weather || '晴',
                        temperature: temperature || '20',
                        humidity: humidity || 'N/A',
                        windDirection: windDirection || 'N/A',
                        windPower: windPower || 'N/A'
                    });
                    labelCount++;
                }
            }
        } catch (err) {
            console.error('获取途经区域天气失败:', err);
        }
        await sleep(100);
    }
    return weatherData;
}

function createWeatherChart(weatherData) {
    if (!weatherData || weatherData.length === 0) return '';
    
    const temps = weatherData.map(w => parseInt(w.temperature));
    const minTemp = Math.min(...temps) - 2;
    const maxTemp = Math.max(...temps) + 2;
    const range = maxTemp - minTemp || 1;
    
    const width = 280;
    const height = 80;
    const padding = 30;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const points = weatherData.map((w, i) => {
        const x = padding + (i / (weatherData.length - 1 || 1)) * chartWidth;
        const y = padding + chartHeight - ((parseInt(w.temperature) - minTemp) / range) * chartHeight;
        return `${x},${y}`;
    });
    
    const linePath = `M${points.join(' L')}`;
    const areaPath = `${linePath} L${width - padding},${height - padding} L${padding},${height - padding} Z`;
    
    const labels = weatherData.map((w, i) => {
        const x = padding + (i / (weatherData.length - 1 || 1)) * chartWidth;
        return `<text x="${x}" y="${height - 5}" text-anchor="middle" font-size="9" fill="#6b7280">${w.district.slice(0, 4)}</text>`;
    }).join('');
    
    return `
        <div style="margin-top: 10px; background: #f8fafc; border-radius: 8px; padding: 10px;">
            <div style="font-size: 12px; font-weight: bold; color: #1e40af; margin-bottom: 8px;">🌡️ 路线温度变化</div>
            <svg width="${width}" height="${height}" style="display: block;">
                <defs>
                    <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#ef4444;stop-opacity:0.3"/>
                        <stop offset="100%" style="stop-color:#ef4444;stop-opacity:0.05"/>
                    </linearGradient>
                </defs>
                <path d="${areaPath}" fill="url(#tempGradient)"/>
                <path d="${linePath}" fill="none" stroke="#ef4444" stroke-width="2"/>
                ${weatherData.map((w, i) => {
                    const x = padding + (i / (weatherData.length - 1 || 1)) * chartWidth;
                    const y = padding + chartHeight - ((parseInt(w.temperature) - minTemp) / range) * chartHeight;
                    return `<circle cx="${x}" cy="${y}" r="4" fill="#ef4444" stroke="white" stroke-width="1.5"/>`;
                }).join('')}
                ${labels}
            </svg>
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #6b7280; margin-top: 5px;">
                <span>最高: ${maxTemp}℃</span>
                <span>最低: ${minTemp}℃</span>
            </div>
        </div>
    `;
}

function showWeatherAlongRoute(weatherData) {
    clearWeatherPathLayers();
    if (!weatherPathEnabled) return;
    
    // 保存天气数据到全局变量
    routeWeatherData = weatherData;
    
    setTimeout(() => {
        weatherData.forEach((item, index) => {
            const icon = getWeatherIcon(item.weather);
            const weatherMarker = L.divIcon({
                html: `<div class="weather-path-marker" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); padding: 5px 10px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 5px; transition: all 0.3s ease; z-index: 150;">
                        <span>${icon}</span>
                        <span style="font-size: 12px; font-weight: bold;">${item.weather}</span>
                      </div>`,
                className: 'weather-path-marker',
                iconSize: [80, 30],
                iconAnchor: [40, 15],
                popupAnchor: [0, -15]
            });
            const marker = L.marker(item.location, { icon: weatherMarker, zIndexOffset: 220 })
            .bindPopup(`
                <div style="padding: 10px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">${item.district}</div>
                    <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 3px;">
                        <span>${icon}</span>
                        <span>${item.weather}</span>
                    </div>
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">温度: ${item.temperature}℃</div>
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">湿度: ${item.humidity}%</div>
                    <div style="font-size: 12px; color: #6b7280;">风向: ${item.windDirection} ${item.windPower}级</div>
                </div>
            `)
            .addTo(leafletMap);
            marker.on('mouseover', function() {
                const iconEl = this._icon;
                if (iconEl) { iconEl.style.transform = 'scale(1.1)'; iconEl.style.zIndex = 180; }
            });
            marker.on('mouseout', function() {
                const iconEl = this._icon;
                if (iconEl) { iconEl.style.transform = 'scale(1)'; iconEl.style.zIndex = 150; }
            });
            marker.on('click', function(e) {
                e.originalEvent.stopPropagation();
                leafletMap.removeLayer(this);
                const idx = weatherPathLayers.indexOf(this);
                if (idx > -1) weatherPathLayers.splice(idx, 1);
            });
            weatherPathLayers.push(marker);
        });
    }, 500);
}

function createTeardropIconWithLabel(color, labelText) {
    return L.divIcon({
        html: `
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="
                    width: 0;
                    height: 0;
                    border-left: 12px solid transparent;
                    border-right: 12px solid transparent;
                    border-bottom: 20px solid ${color};
                    border-radius: 50%;
                    transform: rotate(180deg);
                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                    margin-bottom: 2px;
                "></div>
                <div style="
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: bold;
                    white-space: nowrap;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.3);
                    backdrop-filter: blur(4px);
                    margin-top: -8px;
                ">${labelText}</div>
            </div>
        `,
        className: 'teardrop-marker-label',
        iconSize: [24, 50],
        iconAnchor: [12, 48],
        popupAnchor: [0, -48]
    });
}

document.getElementById('searchRoute').onclick = async () => {
    const origin = document.getElementById('origin').value;
    const dest = document.getElementById('destination').value;
    const optionsPanel = document.getElementById('routeOptions');
    
    if(!origin || !dest) return alert("请输入起终点");
    
    routeLayers.forEach(layer => leafletMap.removeLayer(layer));
    routeLayers = [];
    clearWeatherPathLayers();
    if (tempStartMarker) leafletMap.removeLayer(tempStartMarker);
    if (tempEndMarker) leafletMap.removeLayer(tempEndMarker);
    
    optionsPanel.innerHTML = '<p style="text-align:center; padding:10px; color:#6b7280;">🔍 正在智能规划与拉取天气...</p>';
    
    const originInfo = await getCoordinatesInfo(origin);
    const destInfo = await getCoordinatesInfo(dest);
    if(!originInfo || !destInfo) {
        optionsPanel.innerHTML = '<p style="color:#ef4444;">解析失败，请输入更具体的地址(如:大理古城)</p>';
        return;
    }
    
    const [originLng, originLat] = originInfo.location.split(',').map(Number);
    const [destLng, destLat] = destInfo.location.split(',').map(Number);
    
    const startIcon = createTeardropIconWithLabel('#10b981', origin);
    const endIcon = createTeardropIconWithLabel('#ef4444', dest);
    
    tempStartMarker = L.marker([originLat, originLng], { icon: startIcon, zIndexOffset: 500 })
        .bindPopup(`<b>起点</b><br>${origin}`).addTo(leafletMap);
    tempEndMarker = L.marker([destLat, destLng], { icon: endIcon, zIndexOffset: 500 })
        .bindPopup(`<b>终点</b><br>${dest}`).addTo(leafletMap);
    
    routeLayers.push(tempStartMarker, tempEndMarker);

    try {
        const res = await fetch(`https://restapi.amap.com/v3/direction/driving?origin=${originInfo.location}&destination=${destInfo.location}&key=${config.amapApiKey}`);
        const data = await res.json();
        
        if(data.status === '1' && data.route.paths.length > 0) {
            const path = data.route.paths[0];
            const distance = (path.distance / 1000).toFixed(1);
            const durationMins = Math.floor(path.duration / 60);
            const hours = Math.floor(durationMins / 60);
            const mins = durationMins % 60;
            const timeStr = hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
            const arrivalTime = new Date(new Date().getTime() + path.duration * 1000);
            const arrivalStr = `${arrivalTime.getHours().toString().padStart(2,'0')}:${arrivalTime.getMinutes().toString().padStart(2,'0')}`;
            
            let highways = new Set();
            let latlngs = [];
            path.steps.forEach(step => {
                if(step.road && step.road.includes("高速")) highways.add(step.road);
                const polyline = step.polyline.split(';');
                polyline.forEach(point => {
                    const [lng, lat] = point.split(',');
                    latlngs.push([parseFloat(lat), parseFloat(lng)]);
                });
            });

            const weatherRes = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?key=${config.amapApiKey}&city=${destInfo.adcode}&extensions=all`);
            const weatherDataDest = await weatherRes.json();
            let destWeatherHtml = "目的地天气暂无数据";
            if(weatherDataDest.status === '1' && weatherDataDest.forecasts.length > 0) {
                const destWeather = weatherDataDest.forecasts[0].casts[0];
                destWeatherHtml = `目的地今日预计：<span style="color:#f97316; font-weight:bold;">${destWeather.dayweather} (${destWeather.nighttemp}~${destWeather.daytemp}℃)</span>`;
            }

            optionsPanel.innerHTML = `
                <div style="background:#eff6ff; padding:15px; border-radius:8px; margin-top:15px;">
                    <div style="font-weight:bold; color:#1e40af; margin-bottom:10px;">✅ 路线规划成功</div>
                    <div style="font-size:14px; margin-bottom:5px;">📏 总里程：${distance} km</div>
                    <div style="font-size:14px; margin-bottom:5px;">⏱️ 预计驾车：${timeStr}</div>
                    <div class="arrival-info">
                        <strong>🕒 预计 ${arrivalStr} 到达</strong><br>
                        ${destWeatherHtml}
                    </div>
                    <div style="margin-top:12px; font-size:13px;">
                        <p style="color:#6b7280; margin-bottom:5px;">🛣️ 途径主要高速：</p>
                        ${Array.from(highways).map(h => `<span class="highway-tag">${h}</span>`).join('') || '暂无高速路段'}
                    </div>
                </div>
            `;
            
            if (tempStartMarker) leafletMap.removeLayer(tempStartMarker);
            if (tempEndMarker) leafletMap.removeLayer(tempEndMarker);
            routeLayers = routeLayers.filter(l => l !== tempStartMarker && l !== tempEndMarker);
            
            const polylineLayer = L.polyline(latlngs, {color: '#ef4444', weight: 5, opacity: 0.8, zIndexOffset: 200}).addTo(leafletMap);
            
            const formalStartIcon = createTeardropIconWithLabel('#059669', origin);
            const formalEndIcon = createTeardropIconWithLabel('#dc2626', dest);
            
            const startMarker = L.marker(latlngs[0], { icon: formalStartIcon, zIndexOffset: 400 }).bindPopup("起点: " + origin).addTo(leafletMap);
            const endMarker = L.marker(latlngs[latlngs.length - 1], { icon: formalEndIcon, zIndexOffset: 400 }).bindPopup("终点: " + dest).addTo(leafletMap);
            
            routeLayers.push(polylineLayer, startMarker, endMarker);
            leafletMap.fitBounds(polylineLayer.getBounds(), {padding: [50, 50]});
            
            if (weatherPathEnabled) {
                const weatherAlongRoute = await getWeatherAlongRoute(path.steps);
                showWeatherAlongRoute(weatherAlongRoute);
            }
            
            if (originInfo.level === 'district' || destInfo.level === 'district') {
                currentAdminLevel = 'district';
            } else {
                currentAdminLevel = 'city';
            }
            saveRouteStates();
            
        } else {
            optionsPanel.innerHTML = '<p style="color:#ef4444;">路线规划异常，可能无法驾车到达</p>';
        }
    } catch (err) {
        optionsPanel.innerHTML = '<p style="color:#ef4444;">请求失败，请检查网络</p>';
    }
};

// ==========================================
// 7. 程序启动入口
// ==========================================
window.onload = async () => {
    updateDate();
    loadGeo(); 
    loadRouteStates();
    loadCityLabelsState();
    await fetchAllWeather();
    if (geoJsonLayer) {
        geoJsonLayer.eachLayer(layer => {
            const w = getSafeWeatherData(layer.feature.properties.name);
            layer.setStyle(getFeatureStyle(w ? w.temp : 20, false));
        });
    }
    document.getElementById('dataStatus').textContent = "数据已同步";
    document.getElementById('dataStatus').style.color = "#a7f3d0"; 
    initTheme();
    initWallpaper();
};

// ==========================================
// 8. 主题切换功能
// ==========================================
let panelOpacity = 0.8;

function loadPanelOpacity() {
    const savedOpacity = localStorage.getItem('panelOpacity');
    if (savedOpacity !== null) {
        panelOpacity = parseFloat(savedOpacity);
    } else {
        panelOpacity = 0.8;
        savePanelOpacity(panelOpacity);
    }
    const opacitySlider = document.getElementById('opacitySlider');
    const opacityValue = document.getElementById('opacityValue');
    if (opacitySlider && opacityValue) {
        opacitySlider.value = Math.round(panelOpacity * 100);
        opacityValue.textContent = `${Math.round(panelOpacity * 100)}%`;
    }
    setPanelOpacity(panelOpacity);
}

function savePanelOpacity(opacity) {
    localStorage.setItem('panelOpacity', opacity.toString());
}

function setPanelOpacity(opacity) {
    const leftPanels = document.querySelectorAll('.left-panel .card');
    const rightPanels = document.querySelectorAll('.right-panel .card');
    const panels = [...leftPanels, ...rightPanels];
    panels.forEach(panel => {
        panel.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        const body = document.body;
        if (body.classList.contains('theme-girl')) {
            panel.style.backgroundColor = `rgba(255, 182, 193, ${opacity})`;
        } else if (body.classList.contains('theme-hard')) {
            panel.style.backgroundColor = `rgba(30, 30, 46, ${opacity})`;
        }
    });
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'normal';
    setTheme(savedTheme);
    const themeBtn = document.getElementById('themeBtn');
    const themeMenu = document.getElementById('themeMenu');
    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeMenu.style.display = themeMenu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', () => {
        themeMenu.style.display = 'none';
    });
    const themeOptions = document.querySelectorAll('.theme-option[data-theme]');
    themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const theme = option.getAttribute('data-theme');
            setTheme(theme);
            setPanelOpacity(panelOpacity);
            themeMenu.style.display = 'none';
        });
    });
    const opacitySlider = document.getElementById('opacitySlider');
    const opacityValue = document.getElementById('opacityValue');
    if (opacitySlider && opacityValue) {
        opacitySlider.value = Math.round(panelOpacity * 100);
        opacityValue.textContent = `${Math.round(panelOpacity * 100)}%`;
        opacitySlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            panelOpacity = value / 100;
            opacityValue.textContent = `${value}%`;
            setPanelOpacity(panelOpacity);
            savePanelOpacity(panelOpacity);
        });
        opacitySlider.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            panelOpacity = value / 100;
            opacityValue.textContent = `${value}%`;
            setPanelOpacity(panelOpacity);
            savePanelOpacity(panelOpacity);
        });
    }
    loadPanelOpacity();
}

function setTheme(theme) {
    document.body.classList.remove('theme-girl', 'theme-hard');
    if (theme !== 'normal') {
        document.body.classList.add(`theme-${theme}`);
    }
    localStorage.setItem('theme', theme);
}

// ==========================================
// 9. 自定义壁纸功能
// ==========================================
function initWallpaper() {
    const savedWallpaper = localStorage.getItem('wallpaper');
    const savedDynamicWallpaper = localStorage.getItem('dynamicWallpaper');
    if (savedWallpaper) {
        createWallpaper(savedWallpaper);
    } else if (savedDynamicWallpaper) {
        createDynamicWallpaper(JSON.parse(savedDynamicWallpaper));
    }
    const customWallpaperBtn = document.getElementById('customWallpaperBtn');
    const wallpaperInput = document.getElementById('wallpaperInput');
    customWallpaperBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        wallpaperInput.click();
    });
    wallpaperInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                createWallpaper(imageData);
                localStorage.setItem('wallpaper', imageData);
                localStorage.removeItem('dynamicWallpaper');
                document.getElementById('wallpaperControls').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
    const dynamicWallpaperBtn = document.getElementById('dynamicWallpaperBtn');
    const dynamicWallpaperInput = document.getElementById('dynamicWallpaperInput');
    dynamicWallpaperBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dynamicWallpaperInput.click();
    });
    dynamicWallpaperInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const mediaData = event.target.result;
                const isVideo = file.type.startsWith('video/');
                const dynamicWallpaperData = {
                    data: mediaData,
                    type: isVideo ? 'video' : 'gif',
                    isPlaying: true,
                    isMuted: true
                };
                createDynamicWallpaper(dynamicWallpaperData);
                localStorage.setItem('dynamicWallpaper', JSON.stringify(dynamicWallpaperData));
                localStorage.removeItem('wallpaper');
                document.getElementById('wallpaperControls').style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }
    });
    const playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.addEventListener('click', () => {
        const dynamicWallpaper = document.querySelector('.dynamic-wallpaper-container video') || document.querySelector('.dynamic-wallpaper-container img');
        if (dynamicWallpaper) {
            if (dynamicWallpaper.paused || dynamicWallpaper.ended) {
                dynamicWallpaper.play();
                playPauseBtn.textContent = '⏸️';
                updateDynamicWallpaperState(true);
            } else {
                dynamicWallpaper.pause();
                playPauseBtn.textContent = '▶️';
                updateDynamicWallpaperState(false);
            }
        }
    });
    const muteBtn = document.getElementById('muteBtn');
    muteBtn.addEventListener('click', () => {
        const video = document.querySelector('.dynamic-wallpaper-container video');
        if (video) {
            video.muted = !video.muted;
            muteBtn.textContent = video.muted ? '🔇' : '🔊';
            updateDynamicWallpaperMute(video.muted);
        }
    });
    const resetWallpaperBtn = document.getElementById('resetWallpaperBtn');
    resetWallpaperBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeWallpaper();
        localStorage.removeItem('wallpaper');
        localStorage.removeItem('dynamicWallpaper');
        document.getElementById('wallpaperControls').style.display = 'none';
    });
}

function createWallpaper(imageData) {
    removeWallpaper();
    const wallpaperContainer = document.createElement('div');
    wallpaperContainer.className = 'wallpaper-container';
    wallpaperContainer.style.backgroundImage = `url(${imageData})`;
    document.body.insertBefore(wallpaperContainer, document.body.firstChild);
}

function createDynamicWallpaper(data) {
    removeWallpaper();
    const dynamicWallpaperContainer = document.createElement('div');
    dynamicWallpaperContainer.className = 'dynamic-wallpaper-container';
    if (data.type === 'video') {
        const video = document.createElement('video');
        video.src = data.data;
        video.loop = true;
        video.autoplay = data.isPlaying;
        video.muted = data.isMuted;
        video.playsInline = true;
        dynamicWallpaperContainer.appendChild(video);
        document.getElementById('playPauseBtn').textContent = data.isPlaying ? '⏸️' : '▶️';
        document.getElementById('muteBtn').textContent = data.isMuted ? '🔇' : '🔊';
    } else {
        const img = document.createElement('img');
        img.src = data.data;
        dynamicWallpaperContainer.appendChild(img);
        document.getElementById('playPauseBtn').textContent = '⏸️';
        document.getElementById('muteBtn').textContent = '🔇';
    }
    document.body.insertBefore(dynamicWallpaperContainer, document.body.firstChild);
    document.getElementById('wallpaperControls').style.display = 'flex';
}

function removeWallpaper() {
    const existingWallpaper = document.querySelector('.wallpaper-container');
    if (existingWallpaper) existingWallpaper.remove();
    const existingDynamicWallpaper = document.querySelector('.dynamic-wallpaper-container');
    if (existingDynamicWallpaper) existingDynamicWallpaper.remove();
}

function updateDynamicWallpaperState(isPlaying) {
    const savedDynamicWallpaper = localStorage.getItem('dynamicWallpaper');
    if (savedDynamicWallpaper) {
        const dynamicWallpaperData = JSON.parse(savedDynamicWallpaper);
        dynamicWallpaperData.isPlaying = isPlaying;
        localStorage.setItem('dynamicWallpaper', JSON.stringify(dynamicWallpaperData));
    }
}

function updateDynamicWallpaperMute(isMuted) {
    const savedDynamicWallpaper = localStorage.getItem('dynamicWallpaper');
    if (savedDynamicWallpaper) {
        const dynamicWallpaperData = JSON.parse(savedDynamicWallpaper);
        dynamicWallpaperData.isMuted = isMuted;
        localStorage.setItem('dynamicWallpaper', JSON.stringify(dynamicWallpaperData));
    }
}

// ==========================================
// POI搜索功能（美食、景点）
// ==========================================

// POI缓存和调用限制机制
let poiCache = {};
const POI_CACHE_DURATION = 30 * 60 * 1000; // 30分钟缓存
let lastPOICallTime = 0;
const POI_CALL_INTERVAL = 2000; // 2秒调用间隔
let poiMarkers = [];

// POI类型映射
const poiTypeMap = {
    food: { types: '餐饮服务', icon: '🍜', color: '#ef4444' },
    spots: { types: '旅游景点', icon: '🏞️', color: '#22c55e' }
};

// 获取POI数据（带缓存和调用限制）
async function searchPOI(keyword, type = 'food', radius = 3000) {
    const now = Date.now();
    
    // 调用频率限制
    if (now - lastPOICallTime < POI_CALL_INTERVAL) {
        console.warn('POI搜索过于频繁，请稍后再试');
        return { success: false, message: '搜索过于频繁，请稍后再试' };
    }
    
    // 检查缓存
    const cacheKey = `${keyword}_${type}_${radius}`;
    if (poiCache[cacheKey] && (now - poiCache[cacheKey].timestamp) < POI_CACHE_DURATION) {
        console.log('使用POI缓存数据');
        return { success: true, data: poiCache[cacheKey].data };
    }
    
    // 获取地点坐标
    const coordInfo = await getCoordinatesInfo(keyword);
    if (!coordInfo) {
        return { success: false, message: '无法解析地点，请输入更具体的地址' };
    }
    
    lastPOICallTime = now;
    
    try {
        const typeConfig = poiTypeMap[type];
        const url = `https://restapi.amap.com/v3/place/around?key=${config.amapApiKey}&location=${coordInfo.location}&keywords=&types=${encodeURIComponent(typeConfig.types)}&radius=${radius}&offset=20&page=1&extensions=all`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.status === '1' && data.pois && data.pois.length > 0) {
            // 存入缓存
            poiCache[cacheKey] = {
                data: data.pois,
                timestamp: Date.now()
            };
            return { success: true, data: data.pois };
        } else {
            return { success: false, message: '未找到相关商户信息' };
        }
    } catch (err) {
        console.error('POI搜索失败:', err);
        return { success: false, message: '搜索失败，请稍后重试' };
    }
}

// 在地图上显示POI标记
function showPOIMarkers(pois, type) {
    // 清除之前的标记
    clearPOIMarkers();
    
    const typeConfig = poiTypeMap[type];
    
    pois.forEach(poi => {
        const [lng, lat] = poi.location.split(',').map(Number);
        const icon = L.divIcon({
            html: `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        background: ${typeConfig.color};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 16px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        border: 2px solid white;
                    ">${typeConfig.icon}</div>
                    <div style="
                        background: rgba(0,0,0,0.8);
                        color: white;
                        padding: 2px 6px;
                        border-radius: 8px;
                        font-size: 10px;
                        white-space: nowrap;
                        margin-top: 2px;
                        max-width: 80px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    ">${poi.name}</div>
                </div>
            `,
            className: 'poi-marker',
            iconSize: [40, 50],
            iconAnchor: [20, 45],
            popupAnchor: [0, -45]
        });
        
        const marker = L.marker([lat, lng], { icon: icon, zIndexOffset: 300 })
            .bindPopup(`
                <div style="padding: 10px; min-width: 180px;">
                    <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">${typeConfig.icon} ${poi.name}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 3px;">📍 ${poi.address}</div>
                    ${poi.tel ? `<div style="font-size: 12px; color: #6b7280; margin-bottom: 3px;">📞 ${poi.tel}</div>` : ''}
                    ${poi.distance ? `<div style="font-size: 12px; color: #6b7280;">📏 距离: ${poi.distance}m</div>` : ''}
                </div>
            `)
            .addTo(leafletMap);
        
        poiMarkers.push(marker);
    });
    
    // 显示清除按钮
    document.getElementById('clearPOIMarkers').style.display = 'block';
    
    // 调整地图视野
    if (pois.length > 0) {
        const bounds = L.latLngBounds(pois.map(p => {
            const [lng, lat] = p.location.split(',').map(Number);
            return [lat, lng];
        }));
        leafletMap.fitBounds(bounds, { padding: [50, 50] });
    }
}

// 清除POI标记
function clearPOIMarkers() {
    poiMarkers.forEach(marker => {
        leafletMap.removeLayer(marker);
    });
    poiMarkers = [];
    document.getElementById('clearPOIMarkers').style.display = 'none';
}

// 渲染POI搜索结果
function renderPOIResults(pois, type) {
    const container = document.getElementById('poiResults');
    const typeConfig = poiTypeMap[type];
    
    if (!pois || pois.length === 0) {
        container.innerHTML = `<p style="font-size:13px; color:#6b7280; text-align:center; padding:20px;">未找到相关${type === 'food' ? '美食' : '景点'}</p>`;
        return;
    }
    
    container.innerHTML = `
        <div style="max-height: 250px; overflow-y: auto;">
            ${pois.slice(0, 10).map((poi, index) => `
                <div class="poi-item" data-index="${index}">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 20px;">${typeConfig.icon}</span>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; font-size: 14px;">${poi.name}</div>
                            <div style="font-size: 12px; color: #6b7280;">${poi.address}</div>
                            ${poi.distance ? `<div style="font-size: 11px; color: #9ca3af;">距离: ${poi.distance}m</div>` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // 添加点击事件
    container.querySelectorAll('.poi-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            const poi = pois[index];
            const [lng, lat] = poi.location.split(',').map(Number);
            leafletMap.setView([lat, lng], 15);
            
            // 高亮对应标记
            if (poiMarkers[index]) {
                poiMarkers[index].openPopup();
            }
        });
    });
}

// 初始化POI搜索功能
function initPOISearch() {
    // 类型切换
    const poiTabBtns = document.querySelectorAll('.poi-tab-btn');
    poiTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            poiTabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (currentSelectedCity) {
                autoSearchNearby(currentSelectedCity);
            }
        });
    });
    
    // 搜索按钮
    document.getElementById('searchPOI').addEventListener('click', async () => {
        const keyword = document.getElementById('poiSearchInput').value.trim();
        const type = document.querySelector('.poi-tab-btn.active').dataset.type;
        
        if (!keyword) {
            alert('请输入搜索地点');
            return;
        }
        
        currentSelectedCity = keyword;
        
        const resultsContainer = document.getElementById('poiResults');
        resultsContainer.innerHTML = `<p style="text-align:center; padding:20px; color:#3b82f6;">🔍 正在搜索周边${type === 'food' ? '美食' : '景点'}...</p>`;
        
        const result = await searchPOI(keyword, type);
        
        if (result.success) {
            renderPOIResults(result.data, type);
            showPOIMarkers(result.data, type);
        } else {
            resultsContainer.innerHTML = `<p style="font-size:13px; color:#ef4444; text-align:center; padding:20px;">${result.message}</p>`;
        }
    });
    
    // 清除标记按钮
    document.getElementById('clearPOIMarkers').addEventListener('click', () => {
        clearPOIMarkers();
        document.getElementById('poiResults').innerHTML = `<p style="font-size:13px; color:#6b7280; text-align:center; padding:20px;">输入地点并选择类型进行搜索</p>`;
    });
    
    // 回车键搜索
    document.getElementById('poiSearchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('searchPOI').click();
        }
    });
}

// 页面加载完成后初始化POI搜索
document.addEventListener('DOMContentLoaded', () => {
    initPOISearch();
});