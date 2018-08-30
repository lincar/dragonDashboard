import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Coupon {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  add() {
    return Axios({
      url: `/api/admin/coupon`,
      method: 'post',
      data: {
        name: this.name,
        discount: this.discount * 100,
        type: 2
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  edit() {
    return Axios({
      url: `/api/admin/coupon/${this.id}`,
      method: 'put',
      data: {
        name: this.name,
        discount: this.discount * 100,
        type: 2
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  delete() {
    return Axios({
      url: `/api/admin/coupon/${this.id}`,
      method: 'delete'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  deliver() {
    return Axios({
      url: `/api/admin/coupon/deliver`,
      method: 'post',
      isFormData: true,
      showSuccess: true,
      params: {
        customerId: this.customerId,
        couponId: this.couponId,
        count: this.count
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  history() {
    return Axios({
      url: `/api/admin/coupon/deliver/history`,
      method: 'get',
      params: {
        customerId: this.customerId
      }
    }).then(
      res => {
        res.data.data = res.data.data || [];
        let list = res.data.data;
        list.map(item => {
          item.createdAt = dateFormat(item.createdAt, true);
        });
        return Promise.resolve(res);
      },
      err => Promise.reject(err)
    );
  }

  getList() {
    return Axios({
      url: `/api/admin/coupon`,
      method: 'get'
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
