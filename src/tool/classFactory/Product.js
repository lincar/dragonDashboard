import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Product {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  getOne() {
    return Axios({
      url: `/api/admin/product/${this.id}`,
      method: 'get'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getQRCode() {
    return Axios({
      url: `/api/admin/product/qrcode`,
      method: 'get',
      params: {
        productId: this.id
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  add(data) {
    return Axios({
      url: `/api/admin/product`,
      method: 'post',
      data
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  edit(data) {
    return Axios({
      url: `/api/admin/product/${this.id}`,
      method: 'put',
      data
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  delete() {
    return Axios({
      url: `/api/admin/product/${this.id}`,
      method: 'delete'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  upOrDown(type) {
    type = type || 'down';
    return Axios({
      url: `/api/admin/product/status/${type}`,
      method: 'put',
      params: {
        productId: this.id
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getList(search) {
    return Axios({
      url: `/api/admin/product`,
      method: 'get',
      params: search
    }).then(
      res => {
        res.data.data = res.data.data || [];
        let list = res.data.data;
        list.map(item => {
          item.createdAt = dateFormat(item.createdAt);
        });
        return Promise.resolve(res);
      },
      err => Promise.reject(err)
    );
  }
}
