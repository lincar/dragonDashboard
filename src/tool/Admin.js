import Axios from '@/tool/axios.js';

export default class Admin {
  constructor(admin) {
    admin = admin || {};
    this.id = admin.id || '';
    this.username = admin.username || '';
    this.password = admin.password || '';
  }

  add() {
    const that = this;
    return Axios({
      url: `/api/user`,
      method: 'post',
      isFormData: true,
      data: {
        username: that.username,
        password: that.password,
        role: 'admin'
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  edit() {
    const that = this;
    return Axios({
      url: `/api/user/${that.id}`,
      method: 'put',
      isFormData: true,
      data: {
        username: that.username,
        password: that.password
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  delete() {
    const that = this;
    return Axios({
      url: `/api/user/${that.id}`,
      method: 'delete'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getList() {
    return Axios({
      url: `/api/user/admin`,
      method: 'get'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  login() {
    const that = this;
    return Axios({
      url: `/api/user/login`,
      method: 'put',
      isFormData: true,
      data: {
        username: that.username,
        password: that.password
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  logout() {
    return Axios({
      url: `/api/user/logout`,
      method: 'put'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getCurrentInfo() {
    return Axios({
      url: `/api/user/current`,
      method: 'get'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }
}

