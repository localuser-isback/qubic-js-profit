//run this with node or open browser console and paste it in (qubic site or any site without cors).

const myHashrate = 9999; //modify to your hashrate (it/s)

async function getData() {
    const loginBody = JSON.stringify({ userName: 'guest@qubic.li', password: 'guest13@Qubic.li', twoFactorCode: '' });
    const loginHeaders = { 'Accept': 'application/json', 'Content-Type': 'application/json-patch+json' };
    const loginResponse = await fetch('https://api.qubic.li/Auth/Login', { method: 'POST', body: loginBody, headers: loginHeaders });
    const { token } = await loginResponse.json();

    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + token };
    const response = await fetch('https://api.qubic.li/Score/Get', { headers });
    const networkStat = await response.json();

    const epochNumber = networkStat.scoreStatistics[0].epoch;
    const epoch97Begin = new Date('2024-02-21T12:00:00');
    const curEpochBegin = new Date(epoch97Begin.getTime() + (7 * (epochNumber - 97) * 24 * 60 * 60 * 1000));
    const curEpochEnd = new Date(curEpochBegin.getTime() + (7 * 24 * 60 * 60 * 1000) - 1000);
    const curEpochProgress = (Date.now() - curEpochBegin.getTime()) / (7 * 24 * 60 * 60 * 1000);

    const netHashrate = networkStat.estimatedIts;
    const netAvgScores = networkStat.averageScore;
    const netSolsPerHour = networkStat.solutionsPerHour;

    const crypto_currency = 'qubic-network';
    const destination_currency = 'usd';
    const pricesResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto_currency}&vs_currencies=${destination_currency}`);
    const prices = await pricesResponse.json();
    const qubicPrice = prices[crypto_currency][destination_currency];
    const poolReward = 0.85;
    const incomerPerOneITS = (poolReward * qubicPrice * 1000000000000) / (netHashrate * 7 * 1.06);
    const curSolPrice = (1479289940 * poolReward * curEpochProgress * qubicPrice) / (netAvgScores * 1.06);

    console.log('\n\nCurrent epoch info:');
    console.log('Current epoch:', epochNumber);
    console.log('Epoch start UTC:', curEpochBegin);
    console.log('Epoch end UTC:', curEpochEnd);
    console.log('Epoch progress:', `${(100 * curEpochProgress).toFixed(1)}%\n`);
    console.log('Network info:');
    console.log('Estimated network hashrate:', `${netHashrate.toLocaleString()} it/s`);
    console.log('Average score:', `${netAvgScores.toFixed(1)}`);
    console.log('Scores per hour:', `${netSolsPerHour.toFixed(1)}\n`);
    console.log('Income estimations:');
    console.log('Using pool with fixed 85% reward\n');
    console.log('Qubic price:', `${qubicPrice.toFixed(8)}$`);
    console.log('Estimated income per 1 it/s per day:', `${incomerPerOneITS.toFixed(4)}$\n`);
    console.log('Your estimated income per day:', `${(myHashrate * incomerPerOneITS).toFixed(2)}$`);
    console.log('Estimated income per 1 sol:', `${curSolPrice.toFixed(2)}$`);
    console.log('Your estimated sols per day:', `${(24 * myHashrate * netSolsPerHour / netHashrate).toFixed(1)}\n\n`);
}

getData();
