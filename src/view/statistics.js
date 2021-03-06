import Abstract from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getTotalsByType, countPrice, countDuration, countQuantity, getFormatter} from '../utils/statistics';
import { ChartNames } from '../constants';

const CHART_TYPE = 'horizontalBar';
const BAR_THICKNESS = 44;
const MIN_BAR_LENGTH = 50;
const BACKGROUND_COLOR = '#ffffff';
const HOVER_BACKGROUND_COLOR = '#ffffff';
const DATA_ANCHOR = 'start';
const PLUGIN_ANCHOR = 'end';
const PLUGIN_ALIGN = 'start';
const LABEL_COLOR = '#000000';
const TITLE_FONT_SIZE = 23;
const TITLE_POSITION = 'left';
const LABEL_FONT_SIZE = 13;
const TICKS_COLOR = '#000000';
const TICKS_PADDING = 5;
const TICKS_FONT_SIZE = 13;

const getSettings = (totals, type) => ({
  plugins: [ChartDataLabels],
  type: CHART_TYPE,
  data: {
    labels: [...totals.keys()],
    datasets: [{
      data: [...totals.values()],
      backgroundColor: BACKGROUND_COLOR,
      hoverBackgroundColor: HOVER_BACKGROUND_COLOR,
      anchor: DATA_ANCHOR,
      barThickness: BAR_THICKNESS,
      minBarLength: MIN_BAR_LENGTH,
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: LABEL_FONT_SIZE,
        },
        color: LABEL_COLOR,
        anchor: PLUGIN_ANCHOR,
        align: PLUGIN_ALIGN,
        formatter: (val) => getFormatter(val, type),
      },
    },
    title: {
      display: true,
      text: type,
      fontColor: LABEL_COLOR,
      fontSize: TITLE_FONT_SIZE,
      position: TITLE_POSITION,
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: TICKS_COLOR,
          padding: TICKS_PADDING,
          fontSize: TICKS_FONT_SIZE,
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
});

const renderChart = (context, points, type, callback) => {
  const totals = getTotalsByType(points, callback);
  return new Chart(context, getSettings(totals, type));
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

    this._moneyChart = renderChart(moneyCtx, this._points, ChartNames.MONEY, countPrice);
    this._typeChart = renderChart(typeCtx, this._points, ChartNames.TYPE, countQuantity);
    this._timeSpentChart = renderChart(timeSpentCtx, this._points, ChartNames.TIME, countDuration);
  }
}
