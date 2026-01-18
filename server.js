const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// 股票代码数据库（用于识别和显示名称）
const stockDatabase = {
    // A股
    'sh600519': { name: '贵州茅台', market: 'A股', type: 'CN' },
    'sh600036': { name: '招商银行', market: 'A股', type: 'CN' },
    'sh601398': { name: '工商银行', market: 'A股', type: 'CN' },
    'sh600050': { name: '中国联通', market: 'A股', type: 'CN' },
    'sh600030': { name: '中信证券', market: 'A股', type: 'CN' },
    'sh600276': { name: '恒瑞医药', market: 'A股', type: 'CN' },
    'sh000001': { name: '平安银行', market: 'A股', type: 'CN' },
    'sz000001': { name: '平安银行', market: 'A股', type: 'CN' },
    'sz002594': { name: '比亚迪', market: 'A股', type: 'CN' },
    'sz000651': { name: '格力电器', market: 'A股', type: 'CN' },
    'sh000001': { name: '上证指数', market: 'A股', type: 'CN' },
    
    // 港股
    'hk00700': { name: '腾讯控股', market: '港股', type: 'HK' },
    'hk09988': { name: '阿里巴巴', market: '港股', type: 'HK' },
    'hk03690': { name: '美团-W', market: '港股', type: 'HK' },
    'hk02318': { name: '平安保险', market: '港股', type: 'HK' },
    'hk00981': { name: '中芯国际', market: '港股', type: 'HK' },
    'hk09618': { name: '京东-SW', market: '港股', type: 'HK' },
    'hk09868': { name: '小鹏汽车', market: '港股', type: 'HK' },
    'hk01024': { name: '快手-W', market: '港股', type: 'HK' },
    
    // 美股
    'AAPL': { name: '苹果公司', market: '美股', type: 'US' },
    'MSFT': { name: '微软', market: '美股', type: 'US' },
    'GOOGL': { name: '谷歌', market: '美股', type: 'US' },
    'GOOG': { name: '谷歌-C', market: '美股', type: 'US' },
    'AMZN': { name: '亚马逊', market: '美股', type: 'US' },
    'TSLA': { name: '特斯拉', market: '美股', type: 'US' },
    'NVDA': { name: '英伟达', market: '美股', type: 'US' },
    'META': { name: 'Meta', market: '美股', type: 'US' },
    'AMD': { name: 'AMD', market: '美股', type: 'US' },
    'INTC': { name: '英特尔', market: '美股', type: 'US' },
    'NFLX': { name: '奈飞', market: '美股', type: 'US' },
    'DIS': { name: '迪士尼', market: '美股', type: 'US' },
    'PYPL': { name: 'PayPal', market: '美股', type: 'US' },
    'COIN': { name: 'Coinbase', market: '美股', type: 'US' },
    'BABA': { name: '阿里巴巴', market: '美股', type: 'US' },
    'JD': { name: '京东', market: '美股', type: 'US' },
    'PDD': { name: '拼多多', market: '美股', type: 'US' },
    'NIO': { name: '蔚来', market: '美股', type: 'US' },
};

// 获取A股/港股数据（腾讯API）
async function fetchTencentData(symbol) {
    try {
        const url = `https://qt.gtimg.cn/q=${symbol}`;
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const data = response.data;
        
        // 腾讯返回格式: v_sh600519="0~腾讯控股~hk00700~378.60~...~"
        const match = data.match(/"([^"]+)"/);
        if (!match) throw new Error('数据格式错误');
        
        const parts = match[1].split('~');
        
        if (parts.length < 50) {
            throw new Error('数据解析失败');
        }
        
        const name = parts[1] || stockDatabase[symbol]?.name || symbol;
        const price = parseFloat(parts[3]) || 0;
        const prevClose = parseFloat(parts[4]) || 0;
        const open = parseFloat(parts[5]) || 0;
        const high = parseFloat(parts[33]) || 0;
        const low = parseFloat(parts[34]) || 0;
        const volume = parseInt(parts[6]) || 0;
        const change = parseFloat(parts[31]) || 0;
        const changePercent = parseFloat(parts[32]) || 0;
        
        const dbInfo = stockDatabase[symbol] || { name, market: symbol.startsWith('hk') ? '港股' : 'A股', type: symbol.startsWith('hk') ? 'HK' : 'CN' };
        
        return {
            symbol: symbol,
            name: dbInfo.name || name,
            market: dbInfo.market,
            type: dbInfo.type,
            currency: dbInfo.type === 'CN' ? '¥' : (dbInfo.type === 'HK' ? 'HK$' : '$'),
            currentPrice: price,
            prevClose: prevClose,
            open: open,
            high: high,
            low: low,
            volume: volume,
            change: change,
            changePercent: changePercent,
            source: '腾讯财经'
        };
        
    } catch (error) {
        console.error('腾讯API错误:', error.message);
        throw error;
    }
}

// 获取美股数据（Yahoo Finance API）
async function fetchYahooData(symbol) {
    try {
        // Yahoo Finance v8 API
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`;
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const result = response.data.chart.result;
        if (!result || result.length === 0) {
            throw new Error('无数据返回');
        }
        
        const meta = result[0].meta;
        const currentPrice = meta.regularMarketPrice || 0;
        const prevClose = meta.previousClose || 0;
        
        const dbInfo = stockDatabase[symbol.toUpperCase()] || { 
            name: symbol.toUpperCase(), 
            market: '美股', 
            type: 'US' 
        };
        
        // 计算涨跌幅
        const change = currentPrice - prevClose;
        const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
        
        return {
            symbol: symbol.toUpperCase(),
            name: dbInfo.name,
            market: dbInfo.market,
            type: dbInfo.type,
            currency: '$',
            currentPrice: currentPrice,
            prevClose: prevClose,
            open: -1,
            high: -1,
            low: -1,
            volume: meta.regularMarketVolume || 0,
            change: change,
            changePercent: changePercent,
            source: 'Yahoo Finance'
        };
        
    } catch (error) {
        console.error('Yahoo API错误:', error.message);
        throw error;
    }
}

// 获取股票数据API
app.get('/api/stock', async (req, res) => {
    const symbol = req.query.symbol;
    
    if (!symbol) {
        return res.status(400).json({
            success: false,
            error: '请提供股票代码'
        });
    }
    
    const normalizedSymbol = symbol.toLowerCase().trim();
    
    try {
        let data;
        
        // 判断市场类型
        if (normalizedSymbol.startsWith('sh') || 
            normalizedSymbol.startsWith('sz') || 
            normalizedSymbol.startsWith('hk')) {
            // A股或港股
            data = await fetchTencentData(normalizedSymbol);
        } else {
            // 美股或其他
            data = await fetchYahooData(normalizedSymbol);
        }
        
        res.json({
            success: true,
            data: data
        });
        
    } catch (error) {
        console.error('获取股票数据失败:', error.message);
        res.status(500).json({
            success: false,
            error: '获取数据失败',
            message: error.message,
            hint: '请检查股票代码是否正确（A股需加sh/sz前缀，如sh600519）'
        });
    }
});

// 获取K线数据API
app.get('/api/kline', async (req, res) => {
    const symbol = req.query.symbol;
    const period = req.query.period || 'day';
    
    if (!symbol) {
        return res.status(400).json({
            success: false,
            error: '请提供股票代码'
        });
    }
    
    try {
        let interval, range;
        
        // 根据周期设置参数
        switch(period) {
            case 'week':
                interval = '1wk';
                range = '1y';
                break;
            case 'month':
                interval = '1mo';
                range = '5y';
                break;
            default:
                interval = '1d';
                range = '3mo';
        }
        
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const result = response.data.chart.result;
        if (!result || result.length === 0) {
            throw new Error('无K线数据');
        }
        
        const quote = result[0].indicators.quote[0];
        const timestamps = result[0].timestamp;
        
        const kLineData = [];
        
        for (let i = 0; i < timestamps.length; i++) {
            if (quote.open[i] !== null) {
                const date = new Date(timestamps[i] * 1000);
                kLineData.push({
                    date: date.toISOString().split('T')[0],
                    open: quote.open[i],
                    high: quote.high[i],
                    low: quote.low[i],
                    close: quote.close[i],
                    volume: quote.volume[i] || 0
                });
            }
        }
        
        res.json({
            success: true,
            data: kLineData
        });
        
    } catch (error) {
        console.error('获取K线数据失败:', error.message);
        res.status(500).json({
            success: false,
            error: '获取K线数据失败',
            message: error.message
        });
    }
});

// 搜索建议API
app.get('/api/search', async (req, res) => {
    const query = req.query.q || '';
    
    if (query.length < 1) {
        return res.json({
            success: true,
            data: []
        });
    }
    
    const results = [];
    const queryLower = query.toLowerCase();
    
    // 在数据库中搜索
    for (const [code, info] of Object.entries(stockDatabase)) {
        if (code.toLowerCase().includes(queryLower) || 
            info.name.toLowerCase().includes(queryLower)) {
            results.push({
                code: code,
                name: info.name,
                market: info.market
            });
        }
    }
    
    // 限制返回数量
    res.json({
        success: true,
        data: results.slice(0, 10)
    });
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// 首页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 股票分析服务器已启动`);
    console.log(`📡 访问地址: http://localhost:${PORT}`);
    console.log(`📊 API端点: http://localhost:${PORT}/api/stock?symbol=AAPL`);
    console.log(`\n支持的股票代码:`);
    console.log(`  A股: sh600519 (贵州茅台), sh600036 (招商银行), 等`);
    console.log(`  港股: hk00700 (腾讯控股), hk09988 (阿里巴巴), 等`);
    console.log(`  美股: AAPL (苹果), TSLA (特斯拉), NVDA (英伟达), 等`);
});
