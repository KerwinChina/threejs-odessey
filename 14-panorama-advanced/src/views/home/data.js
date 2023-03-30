/* eslint-disable */
import { Vector3, TextureLoader } from 'three';

export const rooms = [
  {
    name: '客厅过道',
    key: 'living-room-out',
    map: new URL('@/assets/images/map/map_living_room_out.jpg', import.meta.url).href,
    showSwitch: false,
    tinyMapPosition: {
      top: 80,
      left: 50
    },
  },
  {
    name: '客厅',
    key: 'living-room',
    map: new URL('@/assets/images/map/map_living_room.jpg', import.meta.url).href,
    showSwitch: true,
    tinyMapPosition: {
      top: 100,
      left: 50
    },
    interactivePoints: [
      {
        key: 'tv',
        value: '电视',
        description: '智能电视',
        cover: new URL('@/assets/images/home/cover_living_room_tv.png', import.meta.url).href,
        position: new Vector3(-8, 2, -15),
      },
      {
        key: 'art',
        value: '艺术品',
        description: 'BE@RBRICK',
        cover: new URL('@/assets/images/home/cover_living_room_art.png', import.meta.url).href,
        position: new Vector3(10.5, 0, -15),
      },
      {
        key: 'plant',
        value: '绿植',
        description: '自由呼吸',
        cover: new URL('@/assets/images/home/cover_living_room_plant.png', import.meta.url).href,
        position: new Vector3(-15, 5, -15),
      },
      {
        key: 'sofa',
        value: '沙发',
        description: '现在家居',
        cover: new URL('@/assets/images/home/cover_living_room_sofa.png', import.meta.url).href,
        position: new Vector3(-10, -4, 15),
      },
    ],
  },
  {
    name: '卧室',
    key: 'bed-room',
    map: new URL('@/assets/images/map/map_bed_room.jpg', import.meta.url).href,
    showSwitch: true,
    tinyMapPosition: {
      top: 30,
      left: 110
    },
    interactivePoints: [
      {
        key: 'bed',
        value: '床',
        description: '温暖的床',
        cover: new URL('@/assets/images/home/cover_bed_room_bed.png', import.meta.url).href,
        position: new Vector3(-5, -2, -15),
      },
    ],
  },
  {
    name: '厨房',
    key: 'kitchen',
    map: new URL('@/assets/images/map/map_kitchen.jpg', import.meta.url).href,
    showSwitch: true,
    tinyMapPosition: {
      top: 75,
      left: 110
    },
    interactivePoints: [
      {
        key: 'fridge',
        value: '冰箱',
        description: '智能家电',
        cover: new URL('@/assets/images/home/cover_kitchen_fridge.png', import.meta.url).href,
        position: new Vector3(15, 4, 5),
      },
      {
        key: 'fruit',
        value: '水果',
        description: '美味食物',
        cover: new URL('@/assets/images/home/cover_kitchen_fruit.png', import.meta.url).href,
        position: new Vector3(2, -2, -15),
      },
    ]
  },
  {
    name: '卫生间',
    key: 'bath-room',
    map: new URL('@/assets/images/map/map_bath_room.jpg', import.meta.url).href,
    showSwitch: true,
    tinyMapPosition: {
      top: 20,
      left: 50
    },
  },
  {
    name: '走廊',
    key: 'hall',
    map: new URL('@/assets/images/map/map_hall.jpg', import.meta.url).href,
    showSwitch: true,
    tinyMapPosition: {
      top: 30,
      left: 75
    },
  },
];

const maps = rooms.map((item) => {
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
  // 走廊
  // ------------------------------------------------------------------------
  // 向卫生间
  {
    currentRoom: 'hall',
    destinationRoom: 'bath-room',
    origin: getMap('hall'),
    destination: getMap('bath-room'),
    position: new Vector3(-13, -2, -10)
  },
  // 向卧室
  {
    currentRoom: 'hall',
    destinationRoom: 'bed-room',
    origin: getMap('hall'),
    destination: getMap('bed-room'),
    position: new Vector3(13, 0, 6)
  },
  // 向客厅
  {
    currentRoom: 'hall',
    destinationRoom: 'living-room-out',
    origin: getMap('hall'),
    destination: getMap('living-room-out'),
    position: new Vector3(-12, -4, 15)
  },
  // ------------------------------------------------------------------------
  // 卫生间
  // ------------------------------------------------------------------------
  // 向走廊
  {
    currentRoom: 'bath-room',
    destinationRoom: 'hall',
    origin: getMap('bath-room'),
    destination: getMap('hall'),
    position: new Vector3(13, 0, -4)
  },
  // ------------------------------------------------------------------------
  // 卧室
  // ------------------------------------------------------------------------
  // 向走廊
  {
    currentRoom: 'bed-room',
    destinationRoom: 'hall',
    origin: getMap('bed-room'),
    destination: getMap('hall'),
    position: new Vector3(-15, 1, 4),
  },
  // ------------------------------------------------------------------------
  // 客厅外
  // ------------------------------------------------------------------------
  // 向客厅
  {
    currentRoom: 'living-room-out',
    destinationRoom: 'living-room',
    origin: getMap('living-room-out'),
    destination: getMap('living-room'),
    position: new Vector3(-4, -4, 15),
  },
  // 向走廊
  {
    currentRoom: 'living-room-out',
    destinationRoom: 'hall',
    origin: getMap('living-room-out'),
    destination: getMap('hall'),
    position: new Vector3(15, -5, -5),
  },
  // 向厨房
  {
    currentRoom: 'living-room-out',
    destinationRoom: 'kitchen',
    origin: getMap('living-room-out'),
    destination: getMap('kitchen'),
    position: new Vector3(15, -3, 5),
  },
  // ------------------------------------------------------------------------
  // 客厅
  // ------------------------------------------------------------------------
  // 向走廊
  {
    currentRoom: 'living-room',
    destinationRoom: 'hall',
    origin: getMap('living-room'),
    destination: getMap('hall'),
    position: new Vector3(15, -3, -12),
  },
  // 向客厅外
  {
    currentRoom: 'living-room',
    destinationRoom: 'living-room-out',
    origin: getMap('living-room'),
    destination: getMap('living-room-out'),
    position: new Vector3(13, -6, -14),
  },
  // 向厨房
  {
    currentRoom: 'living-room',
    destinationRoom: 'kitchen',
    origin: getMap('living-room'),
    destination: getMap('kitchen'),
    position: new Vector3(13, -3, 0),
  },
  // ------------------------------------------------------------------------
  // 厨房
  // ------------------------------------------------------------------------
  // 向客厅
  {
    currentRoom: 'kitchen',
    destinationRoom: 'living-room',
    origin: getMap('kitchen'),
    destination: getMap('living-room'),
    position: new Vector3(-12, -3.5, -15),
  },
];

export const roomLabels = [
  {
    key: 'kitchen',
    name: '厨房',
    visible: true,
    visibleRooms: [
      {
        key: 'living-room',
        position: new Vector3(13, 2, 0),
      },
      {
        key: 'living-room-out',
        position: new Vector3(15, 2, 4),
      },
    ],
  },
  {
    key: 'bed-room',
    name: '卧室',
    visible: true,
    visibleRooms: [
      {
        key: 'hall',
        position: new Vector3(13, 4, 6),
      },
      {
        key: 'living-room',
        position: new Vector3(15, 3, -12),
      },
      {
        key: 'living-room-out',
        position: new Vector3(15, 3, -5),
      },
    ],
  },
];