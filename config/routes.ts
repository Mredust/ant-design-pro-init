export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {name: '登录', path: '/user/login', component: './User/Login'},
      {name: '注册', path: '/user/register', component: './User/Register'},
    ],
  },
  {path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome'},
  {
    path: '/admin/user-manage',
    name: '用户管理',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin/UserManage',
  },
  {path: '/', redirect: '/welcome'},
  {path: '*', layout: false, component: './404'},
];
