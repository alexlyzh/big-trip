import Abstract from './abstract';

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
    this._data = [...points];
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    // Рисуем диаграммы
  }
}
