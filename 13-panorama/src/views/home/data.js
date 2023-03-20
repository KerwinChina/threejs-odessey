import { Vector3 } from 'three';

const rooms = [
  {
    name: '客厅',
    key: 'living-room',
    position: new Vector3(0, 0, 0),
    map: new URL('@/assets/images/map/map_living_room.png', import.meta.url).href,
    sliders: [
      {
        name: 'aaaaa',
        cover: new URL('@/assets/images/family/cover_living_room_0.png', import.meta.url).href,
        details: [
          {
            title: 'aaaa',
            description: 'aaaaaaaaa',
            video: new URL('@/assets/videos/szjt.mp4', import.meta.url).href,
          },
          {
            title: 'aaaaaa',
            description: 'aaaaaa',
          },
          {
            title: 'aaaa',
            description: 'aaaaa',
          },
          {
            title: 'aaa',
            description: 'aaaaa',
          },
          {
            title: 'aaa',
            description: 'aaaa',
          },
          {
            title: 'aaaa',
            description: 'aaa',
          },
          {
            title: 'aaaa',
            description: 'aaaa',
          },
          {
            title: 'aaaa',
            description: 'aaaaa',
          },
        ],
      },
      {
        name: 'aaaa',
        cover: new URL('@/assets/images/family/cover_living_room_1.png', import.meta.url).href,
        details: [
          {
            title: 'aaa',
            description: 'aaaaa',
          },
          {
            title: 'aaa',
            description: 'aaaa',
          },
          {
            title: 'aaa',
            description: 'aaaa',
          },
          {
            title: 'aaaa',
            description: 'aaaa',
          },
          {
            title: 'aaaa',
            description: 'aaaa',
          },
        ],
      },
      {
        name: 'aaa',
        cover: new URL('@/assets/images/family/cover_living_room_2.png', import.meta.url).href,
        details: [
          {
            title: 'aaa',
            description: 'aaa',
          },
          {
            title: 'aaa',
            description: 'xxxx',
          },
          {
            title: 'xxxx',
            description: 'xxxx',
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
        name: 'xx',
        cover: new URL('@/assets/images/family/cover_living_room_3.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_4.png', import.meta.url).href,
        details: [
          {
            title: 'xx',
            description: 'xxxx',
          },
        ],
      },
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_living_room_5.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxxx',
          },
        ],
      },
    ],
  },
  {
    name: 'xxx',
    key: 'bed-room',
    position: new Vector3(-32, 0, 0),
    map: new URL('@/assets/images/map/map_bed_room.png', import.meta.url).href,
    sliders: [
      {
        name: 'xxx',
        cover: new URL('@/assets/images/family/cover_bed_room_0.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
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
          },
        ],
      },
    ],
  },
  {
    name: '厨房',
    key: 'kitchen',
    position: new Vector3(32, 0, 0),
    map: new URL('@/assets/images/map/map_kitchen.png', import.meta.url).href,
    sliders: [
      {
        name: 'xxxx',
        cover: new URL('@/assets/images/family/cover_kitchen_0.png', import.meta.url).href,
        details: [
          {
            title: 'xxx',
            description: 'xxx',
          },
        ],
      },
      {
        name: 'xx',
        cover: new URL('@/assets/images/family/cover_kitchen_1.png', import.meta.url).href,
        details: [
          {
            title: 'xx',
            description: 'xxxx',
          },
        ],
      },
    ],
  },
];

export default rooms;
