/* eslint-disable */
import { Vector3, TextureLoader } from 'three';

export const rooms = [
  {
    name: '走廊',
    key: 'hall',
    map: new URL('@/assets/images/map/map_hall.jpg', import.meta.url).href,
    showSwitch: false,
    tinyMapPosition: {
      top: 30,
      left: 75
    },
  },
  {
    name: '客厅过道',
    key: 'living-room-out',
    map: new URL('@/assets/images/map/map_living_room_out.jpg', import.meta.url).href,
    showSwitch: false,
    tinyMapPosition: {
      top: 80,
      left: 50
    },
    interactivePoints: [
      {
        key: 'tyyh',
        room: 'living-room-out',
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(-7, 0, -15),
      },
      {
        key: 'tyzp',
        room: 'living-room-out',
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(4, 0, -15),
      },
      {
        key: 'tykj',
        room: 'living-room-out',
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(-4, 6, -15),
      },
    ],
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
        key: 'tyyh',
        room: 'living-room',
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(-7, -2, -15),
      },
      {
        key: 'tyzp',
        room: 'living-room',
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(9, -2, -15),
      },
      {
        key: 'tykj',
        room: 'living-room',
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(-6, 9, -15),
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
        key: 'fire',
        room: 'kitchen',
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(-2, 5, -13),
      },
      {
        key: 'water',
        room: 'kitchen',
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(-12, -2, 1),
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
    position: new Vector3(15, -2, -1),
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
        key: 'hall-2',
        position: new Vector3(-11, 1, 3),
      },
      {
        key: 'hall-3',
        position: new Vector3(-16, 5, 14),
      },
      {
        key: 'hall-4',
        position: new Vector3(-8, 3, 16),
      },
      {
        key: 'hall-5',
        position: new Vector3(-6, 2, 16),
      },
      {
        key: 'canting',
        position: new Vector3(-1, 2, 16),
      },
      {
        key: 'living-room',
        position: new Vector3(0, 2, 16),
      },
      {
        key: 'living-room-out',
        position: new Vector3(0, 3, 16),
      }
    ],
  },
  {
    key: 'bed-room',
    name: '卧室',
    visible: true,
    visibleRooms: [
      {
        key: 'hall-0',
        position: new Vector3(0, 2, -16),
      },
      {
        key: 'hall-1',
        position: new Vector3(0, 2.2, -16),
      },
      {
        key: 'hall-2',
        position: new Vector3(-1.2, 2.5, -16),
      },
      {
        key: 'hall-3',
        position: new Vector3(-1.5, 2.5, -16),
      },
      {
        key: 'hall-4',
        position: new Vector3(-3, 8, -16),
      },
      {
        key: 'hall-5',
        position: new Vector3(-8, 3, -6),
      },
      {
        key: 'canting',
        position: new Vector3(6, 2, -16),
      },
      {
        key: 'living-room',
        position: new Vector3(16, 6, -11),
      },
      {
        key: 'living-room-out',
        position: new Vector3(8, 3, -12),
      }
    ],
  }
];