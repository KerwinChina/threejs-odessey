/* eslint-disable */
import { Vector3 } from 'three';

export const rooms = [
  {
    name: '客厅',
    key: 'living-room',
    map: new URL('@/assets/images/map/map_living_room.jpg', import.meta.url).href,
    showSwitch: true,
    position: new Vector3(0, 0, 0),
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
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(0, 0, 0),
      },
      {
        key: 'tyzp',
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(4, 0, -15),
      },
      {
        key: 'tykj',
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(-4, 6, -15),
      },
    ],
  },
  {
    name: '卧室',
    key: 'bed-room',
    map: new URL('@/assets/images/map/map_bed_room.jpg', import.meta.url).href,
    showSwitch: true,
    position: new Vector3(-32, 0, 0),
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
    name: '书房',
    key: 'study-room',
    map: new URL('@/assets/images/map/map_study_room.jpg', import.meta.url).href,
    showSwitch: true,
    position: new Vector3(32, 0, 0),
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
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(-2, 5, -13),
      },
      {
        key: 'water',
        value: 'xxx',
        description: 'xxx',
        position: new Vector3(-12, -2, 1),
      },
    ]
  },
];
