/* eslint-disable */
import { Vector3, TextureLoader } from 'three';

export const rooms = [
  {
    name: '走廊-0',
    key: 'hall-0',
    map: new URL('@/assets/images/map/map_hall_0.jpg', import.meta.url).href,
    showSwitch: false,
    tinyMapPosition: {
      top: 148,
      left: 75
    },
  },
  {
    name: '走廊-1',
    key: 'hall-1',
    map: new URL('@/assets/images/map/map_hall_1.jpg', import.meta.url).href,
    showSwitch: false,
    tinyMapPosition: {
      top: 135,
      left: 75
    },
  },
  {
    name: '走廊-2',
    key: 'hall-2',
    map: new URL('@/assets/images/map/map_hall_2.jpg', import.meta.url).href,
    showSwitch: false,
    tinyMapPosition: {
      top: 120,
      left: 75
    },
  },
  {
    name: '走廊-3',
    key: 'hall-3',
    map: new URL('@/assets/images/map/map_hall_3.jpg', import.meta.url).href,
    showSwitch: false,
    tinyMapPosition: {
      top: 90,
      left: 75
    },
  },
  {
    name: '走廊-4',
    key: 'hall-4',
    position: new Vector3(32, 0, -32),
    map: new URL('@/assets/images/map/map_hall_4.jpg', import.meta.url).href,
    showSwitch: false,
    tinyMapPosition: {
      top: 70,
      left: 75
    },
  },
  {
    name: '走廊-5',
    key: 'hall-5',
    map: new URL('@/assets/images/map/map_hall_5.jpg', import.meta.url).href,
    showSwitch: false,
    tinyMapPosition: {
      top: 35,
      left: 75
    },
  },
  {
    name: '阳台',
    key: 'balcony',
    map: new URL('@/assets/images/map/map_balcony.jpg', import.meta.url).href,
    showSwitch: false,
    tinyMapPosition: {
      top: 75,
      left: 20
    },
  },
  {
    name: '客厅',
    key: 'living-room-out',
    map: new URL('@/assets/images/map/map_living_room_out.jpg', import.meta.url).href,
    showSwitch: true,
    tinyMapPosition: {
      top: 85,
      left: 50
    },
    sliders: [
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_0.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
            video: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
            image: new URL('@/assets/images/family/living_room_volume.png', import.meta.url).href,
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_1.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: new URL('@/assets/videos/szjt.mp4', import.meta.url).href,
          },
          {
            title: 'xxx',
            description: 'xxx',
            image: new URL('@/assets/images/family/shilian.png', import.meta.url).href,
          },
          {
            title: 'AI智能',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_2.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: new URL('@/assets/videos/szjt.mp4', import.meta.url).href,
          },
          {
            title: 'xxx',
            description: 'xxx',
            image: new URL('@/assets/images/family/shilian.png', import.meta.url).href,
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_3.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: 'xxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_4.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: 'xxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_5.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: 'xxx',
          },
        ],
      },
    ],
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
    name: '客厅内部',
    key: 'living-room',
    map: new URL('@/assets/images/map/map_living_room.jpg', import.meta.url).href,
    showSwitch: false,
    tinyMapPosition: {
      top: 70,
      left: 50
    },
    sliders: [
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_0.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
            video: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
            image: new URL('@/assets/images/family/living_room_volume.png', import.meta.url).href,
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_1.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: new URL('@/assets/videos/szjt.mp4', import.meta.url).href,
          },
          {
            title: 'xxx',
            description: 'xxx',
            image: new URL('@/assets/images/family/shilian.png', import.meta.url).href,
          },
          {
            title: 'AI智能',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_2.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: new URL('@/assets/videos/szjt.mp4', import.meta.url).href,
          },
          {
            title: 'xxx',
            description: 'xxx',
            image: new URL('@/assets/images/family/shilian.png', import.meta.url).href,
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
          {
            title: 'xxx',
            description: 'xxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_3.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: 'xxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_4.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: 'xxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_5.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: 'xxx',
          },
        ],
      },
    ],
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
      top: 20,
      left: 50
    },
    sliders: [
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_bed_room_0.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: 'xxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_bed_room_1.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: new URL('@/assets/videos/szjt.mp4', import.meta.url).href,
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_bed_room_2.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: new URL('@/assets/videos/szjt.mp4', import.meta.url).href,
          },
        ],
      },
    ],
  },
  {
    name: '厨房',
    key: 'kitchen',
    map: new URL('@/assets/images/map/map_kitchen.jpg', import.meta.url).href,
    showSwitch: true,
    tinyMapPosition: {
      top: 145,
      left: 50
    },
    sliders: [
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_kitchen_0.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: new URL('@/assets/videos/szjt.mp4', import.meta.url).href,
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_kitchen_1.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
            video: new URL('@/assets/videos/szjt.mp4', import.meta.url).href,
          },
        ],
      },
    ],
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
    name: '餐厅',
    key: 'canting',
    map: new URL('@/assets/images/map/map_canting.jpg', import.meta.url).href,
    showSwitch: true,
    tinyMapPosition: {
      top: 110,
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
  // 走廊0
  // ------------------------------------------------------------------------
  // 向走廊1
  {
    currentRoom: 'hall-0',
    destinationRoom: 'hall-1',
    origin: getMap('hall-0'),
    destination: getMap('hall-1'),
    position: new Vector3(-2.5, -2, -15)
  },
  // ------------------------------------------------------------------------
  // 走廊1
  // ------------------------------------------------------------------------
  // 向走廊2
  {
    currentRoom: 'hall-1',
    destinationRoom: 'hall-2',
    origin: getMap('hall-1'),
    destination: getMap('hall-2'),
    position: new Vector3(-2.5, -4, -15),
  },
  // 向走廊0
  {
    currentRoom: 'hall-1',
    destinationRoom: 'hall-0',
    origin: getMap('hall-1'),
    destination: getMap('hall-0'),
    position: new Vector3(1, -5, 15),
  },
  // ------------------------------------------------------------------------
  // 走廊2
  // ------------------------------------------------------------------------
  // 向走廊3
  {
    currentRoom: 'hall-2',
    destinationRoom: 'hall-3',
    origin: getMap('hall-2'),
    destination: getMap('hall-3'),
    position: new Vector3(-2.5, -2, -15),
  },
  // 向走廊1
  {
    currentRoom: 'hall-2',
    destinationRoom: 'hall-1',
    origin: getMap('hall-2'),
    destination: getMap('hall-1'),
    position: new Vector3(1, -4, 15),
  },
  // 向餐厅
  {
    currentRoom: 'hall-2',
    destinationRoom: 'canting',
    origin: getMap('hall-2'),
    destination: getMap('canting'),
    position: new Vector3(-15, -2, 6),
  },
  // 向客厅过道
  {
    currentRoom: 'hall-2',
    destinationRoom: 'living-room-out',
    origin: getMap('hall-2'),
    destination: getMap('living-room-out'),
    position: new Vector3(-14, -2, -15),
  },
  // ------------------------------------------------------------------------
  // 走廊3
  // ------------------------------------------------------------------------
  // 向走廊4
  {
    currentRoom: 'hall-3',
    destinationRoom: 'hall-4',
    origin: getMap('hall-3'),
    destination: getMap('hall-4'),
    position: new Vector3(-2.5, -2, -15),
  },
  // 向走廊2
  {
    currentRoom: 'hall-3',
    destinationRoom: 'hall-2',
    origin: getMap('hall-3'),
    destination: getMap('hall-2'),
    position: new Vector3(1, -2, 11),
  },
  // 向客厅过道
  {
    currentRoom: 'hall-3',
    destinationRoom: 'living-room-out',
    origin: getMap('hall-3'),
    destination: getMap('living-room-out'),
    position: new Vector3(-8, -1, 1),
  },
  // 向客厅
  {
    key: 'marker-9',
    currentRoom: 'hall-3',
    destinationRoom: 'living-room',
    origin: getMap('hall-3'),
    destination: getMap('living-room'),
    position: new Vector3(-12, 1, -15),
  },
  // ------------------------------------------------------------------------
  // 走廊4
  // ------------------------------------------------------------------------
  // 向走廊5
  {
    currentRoom: 'hall-4',
    destinationRoom: 'hall-5',
    origin: getMap('hall-4'),
    destination: getMap('hall-5'),
    position: new Vector3(-2, -2, -15),
  },
  // 向走廊3
  {
    currentRoom: 'hall-4',
    destinationRoom: 'hall-3',
    origin: getMap('hall-4'),
    destination: getMap('hall-3'),
    position: new Vector3(1, -2, 11),
  },
  // 向走廊2
  // {
  //   currentRoom: 'hall-4',
  //   destinationRoom: 'hall-2',
  //   origin: getMap('hall-4'),
  //   destination: getMap('hall-2'),
  //   position: new Vector3(1, 2.5, 15),
  // },
  // 向客厅
  {
    currentRoom: 'hall-4',
    destinationRoom: 'living-room',
    origin: getMap('hall-4'),
    destination: getMap('living-room'),
    position: new Vector3(-15, -2, 0),
  },
  // ------------------------------------------------------------------------
  // 走廊5
  // ------------------------------------------------------------------------
  // 向走廊4
  {
    currentRoom: 'hall-5',
    destinationRoom: 'hall-4',
    origin: getMap('hall-5'),
    destination: getMap('hall-4'),
    position: new Vector3(1, -2, 15),
  },
  // 向卧室
  {
    currentRoom: 'hall-5',
    destinationRoom: 'bed-room',
    origin: getMap('hall-5'),
    destination: getMap('bed-room'),
    position: new Vector3(-12, -2, 0),
  },
  // ------------------------------------------------------------------------
  // 卧室
  // ------------------------------------------------------------------------
  // 向走廊5
  {
    currentRoom: 'bed-room',
    destinationRoom: 'hall-5',
    origin: getMap('bed-room'),
    destination: getMap('hall-5'),
    position: new Vector3(15, -2.5, 8.5),
  },
  // ------------------------------------------------------------------------
  // 餐厅
  // ------------------------------------------------------------------------
  // 向厨房
  {
    currentRoom: 'canting',
    destinationRoom: 'kitchen',
    origin: getMap('canting'),
    destination: getMap('kitchen'),
    position: new Vector3(0, -2, 11),
  },
  // 向走廊2
  {
    currentRoom: 'canting',
    destinationRoom: 'hall-2',
    origin: getMap('canting'),
    destination: getMap('hall-2'),
    position: new Vector3(15, -1, -6),
  },
  // 厨房
  {
    currentRoom: 'kitchen',
    destinationRoom: 'canting',
    origin: getMap('kitchen'),
    destination: getMap('canting'),
    position: new Vector3(15, -1, -4),
  },
  // ------------------------------------------------------------------------
  // 阳台
  // ------------------------------------------------------------------------
  // 向客厅
  {
    currentRoom: 'balcony',
    destinationRoom: 'living-room',
    origin: getMap('balcony'),
    destination: getMap('living-room'),
    position: new Vector3(13, -5, -13),
  },
  // ------------------------------------------------------------------------
  // 客厅
  // ------------------------------------------------------------------------
  // 向走廊3
  {
    currentRoom: 'living-room',
    destinationRoom: 'hall-3',
    origin: getMap('living-room'),
    destination: getMap('hall-3'),
    position: new Vector3(15, -1, 7),
  },
  // 向走廊4
  {
    currentRoom: 'living-room',
    destinationRoom: 'hall-4',
    origin: getMap('living-room'),
    destination: getMap('hall-4'),
    position: new Vector3(15, -2, -8),
  },
  // 向阳台
  {
    currentRoom: 'living-room',
    destinationRoom: 'balcony',
    origin: getMap('living-room'),
    destination: getMap('balcony'),
    position: new Vector3(-15, -2, -1),
  },
  // ------------------------------------------------------------------------
  // 客厅过道
  // ------------------------------------------------------------------------
  // 向客厅
  {
    currentRoom: 'living-room-out',
    destinationRoom: 'living-room',
    origin: getMap('living-room-out'),
    destination: getMap('living-room'),
    position: new Vector3(0, 0, -15),
  },
  {
    currentRoom: 'living-room-out',
    destinationRoom: 'hall-3',
    origin: getMap('living-room-out'),
    destination: getMap('hall-3'),
    position: new Vector3(14, -1, 0),
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