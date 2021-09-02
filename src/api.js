import PointsModel from './model/points';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: 'points'})
      .then(Api.parseJSON)
      .then((points) => points.map((point) => PointsModel.adaptToClient(point)))
      .catch(Api.catchError);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.parseJSON)
      .then(PointsModel.adaptToClient)
      .catch(Api.catchError);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static parseJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw new Error(err);
  }
}

