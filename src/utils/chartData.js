import { generateHourlyDataFor, generateDailyData, expandDatasetTo, randInt } from './helpers';

export function getChartDataset(range, state) {
    const { dailyData, weeklyData, monthlyData, currentAQI, startDate, endDate } = state;
    
    if (range === 'daily') return dailyData;
    if (range === 'weekly') return weeklyData;
    if (range === 'monthly') return monthlyData;
    if (range === 'today') {
        return generateHourlyDataFor(new Date(), 24, null, currentAQI);
    }
    if (range === 'yesterday') {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return generateHourlyDataFor(d, 24, Math.max(50, Math.round(currentAQI + randInt(-10, 10))), currentAQI);
    }
    if (range === 'last7') return generateDailyData(7, new Date(), null, currentAQI);
    if (range === 'last30') return generateDailyData(30, new Date(), null, currentAQI);
    if (range === 'last90') return generateDailyData(90, new Date(), null, currentAQI);
    // custom: try to infer number of days between startDate and endDate
    if (range === 'custom' && startDate && endDate) {
        const sd = new Date(startDate);
        const ed = new Date(endDate);
        const diff = Math.max(1, Math.round((ed - sd) / (1000 * 60 * 60 * 24)) + 1);
        return expandDatasetTo(dailyData, diff);
    }
    return dailyData;
}

