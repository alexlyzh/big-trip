import Abstract from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getTotalsByType, countPrice, countDuration, countQuantity, getUniquePointTypes} from '../utils/statistics';

const BAR_THICKNESS = 44;
const MIN_BAR_LENGTH = 50;
const BACKGROUND_COLOR = '#ffffff';
const HOVER_BACKGROUND_COLOR = '#ffffff';
const ANCHOR = 'start';
const DEFAULT_CHART_SETTINGS = {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
      barThickness: 44,
      minBarLength: 50,
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter: (val) => `${val}`,
      },
    },
    title: {
      display: true,
      text: 'TYPE',
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
};

const renderChart = (context, points, callback) => {
  const types = getUniquePointTypes(points);

  const updData = {
    data: {
      labels: types,
      datasets: [{
        data: getTotalsByType(points, callback),
        backgroundColor: BACKGROUND_COLOR,
        hoverBackgroundColor: HOVER_BACKGROUND_COLOR,
        anchor: ANCHOR,
        barThickness: BAR_THICKNESS,
        minBarLength: MIN_BAR_LENGTH,
      }],
    },
  };

  return new Chart(context, Object.assign({}, DEFAULT_CHART_SETTINGS, updData));
};

const createStatisticsTemplate = () => (
  `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item">
        <canvas class="statistics__chart" id="money" width="900"></canvas>
      </div>

      <div class="statistics__item">
        <canvas class="statistics__chart" id="type" width="900"></canvas>
      </div>

      <div class="statistics__item">
        <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
      </div>
    </section>`);

export default class Statistics extends Abstract {
  constructor(points) {
    super();
    this._points = points;
    this._moneyChart = null;
    this._typeChart = null;
    this._timeSpentChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  removeElement() {
    super.removeElement();
    this._moneyChart = null;
    this._typeChart = null;
    this._timeSpentChart = null;
  }

  _renderCharts() {
    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx = this.getElement().querySelector('#type');
    const timeSpentCtx = this.getElement().querySelector('#time-spend');

    this._moneyChart = renderChart(moneyCtx, this._points, countPrice);
    this._typeChart = renderChart(typeCtx, this._points, countQuantity);
    this._timeSpentChart = renderChart(timeSpentCtx, this._points, countDuration);
  }
}
