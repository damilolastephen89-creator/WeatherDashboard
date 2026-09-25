// /ai/forecasting.js
// Basic TensorFlow.js regression model for weather prediction

// Import TensorFlow.js (make sure you include <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script> in index.html)

async function trainForecastModel(historicalData) {
  // historicalData = array of { dayIndex, temperature }
  const xs = tf.tensor1d(historicalData.map(d => d.dayIndex));
  const ys = tf.tensor1d(historicalData.map(d => d.temperature));

  // Define simple regression model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  // Train model
  await model.fit(xs, ys, { epochs: 200 });

  return model;
}

async function predictTemperature(model, nextDayIndex) {
  const prediction = model.predict(tf.tensor1d([nextDayIndex]));
  const value = (await prediction.data())[0];
  return value.toFixed(1); // round to 1 decimal place
}

// Example usage
// In script.js, after fetching historical data:
async function runForecasting() {
  const historicalData = [
    { dayIndex: 1, temperature: 28 },
    { dayIndex: 2, temperature: 29 },
    { dayIndex: 3, temperature: 30 },
    { dayIndex: 4, temperature: 31 },
    { dayIndex: 5, temperature: 32 }
  ];

  const model = await trainForecastModel(historicalData);
  const tomorrowPrediction = await predictTemperature(model, 6);

  // Display prediction in dashboard
  const aiCard = document.getElementById('aiForecastCard');
  if (aiCard) {
    aiCard.textContent = `🤖 AI Forecast: ${tomorrowPrediction}°C (predicted)`;
  }
}
