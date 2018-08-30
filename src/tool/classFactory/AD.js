import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class AD {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  add() {
    return Axios({
      url: `/api/admin/ads`,
      method: 'post',
      data: {
        type: 'banner',
        imgUrl: this.imgUrl,
        seq: this.seq
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  edit() {
    return Axios({
      url: `/api/admin/ads/${this.id}`,
      method: 'put',
      data: {
        type: 'banner',
        imgUrl: this.imgUrl,
        seq: this.seq
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  delete() {
    return Axios({
      url: `/api/admin/ads/${this.id}`,
      method: 'delete'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getList() {
    return Axios({
      url: `/api/admin/ads`,
      method: 'get',
      params: {
        type: 'banner'
      }
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
