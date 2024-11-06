export interface PaginationDataType {
  status?: string;
  avatar?: string;
  name?: string;
  project?: string;
  percent?: number;
  users:{
     img:string;
  }[];
}

export const basicsTableData: PaginationDataType[] = [
  {
    status: 'active',
    avatar: '/images/profile/user-1.jpg',
    name: 'Olivia Rhye',
    project: 'Xtreme admin',
    percent: 60,
    users: [{ img: '/images/profile/user-1.jpg' }, { img: '/images/profile/user-2.jpg' }],
  },
  {
    status: 'cancel',
    avatar: '/images/profile/user-2.jpg',
    name: 'Barbara Steele',
    project: 'Adminpro admin',
    percent: 30,
    users: [
      { img: '/images/profile/user-1.jpg' },
      { img: '/images/profile/user-2.jpg' },
      { img: '/images/profile/user-3.jpg' },
    ],
  },
  {
    status: 'pending',
    avatar: '/images/profile/user-6.jpg',
    name: 'Isabel Vasquez',
    project: 'Modernize admin',
    percent: 32,
    users: [{ img: '/images/profile/user-2.jpg' }, { img: '/images/profile/user-4.jpg' }],
  },
  {
    status: 'active',
    avatar: '/images/profile/user-1.jpg',
    name: 'Olivia Rhye',
    project: 'Xtreme admin',
    percent: 60,
    users: [{ img: '/images/profile/user-1.jpg' }, { img: '/images/profile/user-2.jpg' }],
  },
  {
    status: 'cancel',
    avatar: '/images/profile/user-2.jpg',
    name: 'Barbara Steele',
    project: 'Adminpro admin',
    percent: 30,
    users: [
      { img: '/images/profile/user-1.jpg' },
      { img: '/images/profile/user-2.jpg' },
      { img: '/images/profile/user-3.jpg' },
    ],
  },
  {
    status: 'active',
    avatar: '/images/profile/user-3.jpg',
    name: 'Leonard Gordon',
    project: 'Monster admin',
    percent: 45,
    users: [{ img: '/images/profile/user-3.jpg' }, { img: '/images/profile/user-2.jpg' }],
  },
  {
    status: 'pending',
    avatar: '/images/profile/user-4.jpg',
    name: 'Evelyn Pope',
    project: 'Materialpro admin',
    percent: 37,
    users: [
      { img: '/images/profile/user-1.jpg' },
      { img: '/images/profile/user-2.jpg' },
      { img: '/images/profile/user-5.jpg' },
    ],
  },
  {
    status: 'active',
    avatar: '/images/profile/user-3.jpg',
    name: 'Leonard Gordon',
    project: 'Monster admin',
    percent: 45,
    users: [{ img: '/images/profile/user-3.jpg' }, { img: '/images/profile/user-2.jpg' }],
  },
  {
    status: 'pending',
    avatar: '/images/profile/user-4.jpg',
    name: 'Evelyn Pope',
    project: 'Materialpro admin',
    percent: 37,
    users: [
      { img: '/images/profile/user-1.jpg' },
      { img: '/images/profile/user-2.jpg' },
      { img: '/images/profile/user-5.jpg' },
    ],
  },
  {
    status: 'cancel',
    avatar: '/images/profile/user-5.jpg',
    name: 'Tommy Garza',
    project: 'Elegant admin',
    percent: 87,
    users: [{ img: '/images/profile/user-5.jpg' }, { img: '/images/profile/user-6.jpg' }],
  },
  {
    status: 'pending',
    avatar: '/images/profile/user-6.jpg',
    name: 'Isabel Vasquez',
    project: 'Modernize admin',
    percent: 32,
    users: [{ img: '/images/profile/user-2.jpg' }, { img: '/images/profile/user-4.jpg' }],
  },
  {
    status: 'active',
    avatar: '/images/profile/user-1.jpg',
    name: 'Olivia Rhye',
    project: 'Xtreme admin',
    percent: 60,
    users: [{ img: '/images/profile/user-1.jpg' }, { img: '/images/profile/user-2.jpg' }],
  },
  {
    status: 'cancel',
    avatar: '/images/profile/user-2.jpg',
    name: 'Barbara Steele',
    project: 'Adminpro admin',
    percent: 30,
    users: [
      { img: '/images/profile/user-1.jpg' },
      { img: '/images/profile/user-2.jpg' },
      { img: '/images/profile/user-3.jpg' },
    ],
  },
  {
    status: 'active',
    avatar: '/images/profile/user-3.jpg',
    name: 'Leonard Gordon',
    project: 'Monster admin',
    percent: 45,
    users: [{ img: '/images/profile/user-3.jpg' }, { img: '/images/profile/user-2.jpg' }],
  },
  {
    status: 'pending',
    avatar: '/images/profile/user-4.jpg',
    name: 'Evelyn Pope',
    project: 'Materialpro admin',
    percent: 37,
    users: [
      { img: '/images/profile/user-1.jpg' },
      { img: '/images/profile/user-2.jpg' },
      { img: '/images/profile/user-5.jpg' },
    ],
  },
  {
    status: 'cancel',
    avatar: '/images/profile/user-5.jpg',
    name: 'Tommy Garza',
    project: 'Elegant admin',
    percent: 87,
    users: [{ img: '/images/profile/user-5.jpg' }, { img: '/images/profile/user-6.jpg' }],
  },
  {
    status: 'pending',
    avatar: '/images/profile/user-6.jpg',
    name: 'Isabel Vasquez',
    project: 'Modernize admin',
    percent: 32,
    users: [{ img: '/images/profile/user-2.jpg' }, { img: '/images/profile/user-4.jpg' }],
  },
];
