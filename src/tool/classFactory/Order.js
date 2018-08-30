import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Order {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  confirm() {
    return Axios({
      url: `/api/admin/order/confirm`,
      method: 'post',
      isFormData: true,
      showSuccess: true,
      data: {
        orderId: this.id
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  complete() {
    return Axios({
      url: `/api/admin/order/complete`,
      method: 'post',
      isFormData: true,
      showSuccess: true,
      data: {
        orderId: this.id
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  refund() {
    return Axios({
      url: `/api/admin/order/refund`,
      method: 'post',
      isFormData: true,
      showSuccess: true,
      data: {
        orderId: this.id,
        msg: this.msg || ''
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  editPrice() {
    return Axios({
      url: `/api/admin/order/price`,
      method: 'put',
      isFormData: true,
      data: {
        orderId: this.id,
        price: this.price * 100
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getOne() {
    return Axios({
      url: `/api/admin/order/${this.id}`,
      method: 'get'
    }).then(
      res => {
        let order = res.data.data;
        order.wxOrder = order.wxOrder || {};
        order.wxOrder.createdAt = dateFormat(order.wxOrder.createdAt, true);
        return Promise.resolve(res);
      },
      err => Promise.reject(err)
    );
  }

  getList(search) {
    return Axios({
      url: `/api/admin/order`,
      method: 'get',
      params: search
    }).then(
      res => {
        res.data.data = res.data.data || [];
        let list = res.data.data;
        list.map(item => {
          item.wxOrder = item.wxOrder || {};
          item.wxOrder.createdAt = dateFormat(item.wxOrder.createdAt, true);
        });
        return Promise.resolve(res);
      },
      err => Promise.reject(err)
    );
  }
}
