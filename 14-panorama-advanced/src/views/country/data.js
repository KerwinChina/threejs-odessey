/* eslint-disable */
import { Vector3, TextureLoader } from 'three';

export const countrys = [
  {
    name: '道路-0',
    key: 'road-0',
    map: new URL('@/assets/images/map/map_country_0.jpg', import.meta.url).href,
    showSwitch: false,
  },
  {
    name: '道路-1',
    key: 'road-1',
    map: new URL('@/assets/images/map/map_country_1.jpg', import.meta.url).href,
    showSwitch: false,
  }
];

const maps = countrys.map((item) => {
  return {
    key: item.key,
    map: new TextureLoader().load(item.map),
  }
});

const getMap = (key) => {
  return maps.filter((item) => item.key === key)[0].map || '';
}

export const markers = [
  // ------------------------------------------------------------------------
  // 道路0
  // ------------------------------------------------------------------------
  // 向道路1
  {
    currentRoom: 'road-0',
    destinationRoom: 'road-1',
    origin: getMap('road-0'),
    destination: getMap('road-1'),
    position: new Vector3(-10, -20, -105)
  },
  // ------------------------------------------------------------------------
  // 道路1
  // ------------------------------------------------------------------------
  // 向道路0
  {
    currentRoom: 'road-1',
    destinationRoom: 'road-0',
    origin: getMap('road-1'),
    destination: getMap('road-0'),
    position: new Vector3(0, -2, 11),
  },
];