// Format numbers with commas and appropriate units
function formatNumber(num) {
    if (num === undefined || num === null) return 'N/A';
    if (isNaN(num)) return 'N/A';
    
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
}

// Format price with appropriate decimals
function formatPrice(price) {
    if (price === undefined || price === null) return 'N/A';
    if (isNaN(price)) return 'N/A';
    return parseFloat(price).toFixed(8);
}

// Format percentage change
function formatChange(change) {
    if (change === undefined || change === null) return 'N/A';
    if (isNaN(change)) return 'N/A';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
}

// Format supply with appropriate decimals
function formatSupply(supply, decimals) {
    if (supply === undefined || supply === null) return 'N/A';
    return formatNumber(parseInt(supply) / Math.pow(10, decimals));
}

// Update metric display (for inner span)
function updateMetric(id, value, formatter = formatNumber) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = formatter(value);
    }
}

// Fetch token data from Vestige API
async function fetchTokenData() {
    try {
        // Fetch market data
        const marketResponse = await fetch('https://free-api.vestige.fi/asset/1285492943/list?provider=T3&currency=USD');
        if (!marketResponse.ok) {
            throw new Error(`HTTP error! status: ${marketResponse.status}`);
        }
        const marketData = await marketResponse.json();
        
        console.log('Market Data:', marketData);
        
        if (marketData) {
            // Update metrics with market data (update only the value spans)
            updateMetric('priceValue', marketData.price, formatPrice);
            updateMetric('marketCapValue', marketData.fdmc);
            updateMetric('volume24hValue', marketData.volume24h);
            
            // Add price change indicator if available
            const priceChange = document.getElementById('priceChange');
            if (priceChange) {
                const change = marketData.change24h;
                priceChange.textContent = formatChange(change);
                priceChange.className = change >= 0 ? 'positive' : 'negative';
            }
        } else {
            throw new Error('No data received from API');
        }
    } catch (error) {
        console.error('Error fetching token data:', error);
        // Update all metrics to show error state
        ['priceValue', 'marketCapValue', 'volume24hValue'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'Error';
            }
        });
    }
}

// Fetch data immediately and then every 30 seconds
fetchTokenData();
setInterval(fetchTokenData, 30000);
