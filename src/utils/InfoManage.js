import axios from 'axios';

export function getHistory() {
  return axios.get(`https://defigamecove.com/history`);
}

export function addHistory(req) {
  return axios.put(`https://defigamecove.com/history`, { req });
}
