<template>
  <section class="plr-sm">
    <header class="y-center ptb-md sticky">
      <span class="size-md bolder">会员列表</span>
      <el-input placeholder="输入关键字搜索" v-model="search.keywords" class="ml-sm w-4 input-with-select">
        <el-select style="width: 90px;" v-model="search.type" slot="prepend" placeholder="请选择">
          <el-option label="姓名" value="name"></el-option>
          <el-option label="电话" value="phone"></el-option>
        </el-select>
        <el-button @click="getCustomerList(1)" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </header>
    <my-table :data="customerList" :config="tableConfig">
      <div slot="operating" slot-scope="customer">
        <el-button @click="prevShowEditModal(customer.item)" size="small">派发</el-button>
        <el-button type="primary" size="small" @click="gotoDetail(customer.item)">详情</el-button>
      </div>
    </my-table>

    <div v-if="customerList.length" class="text-center p-sm">
      <el-pagination
        @current-change="getCustomerList"
        :current-page.sync="search.page"
        :page-size="search.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="customerSum">
      </el-pagination>
    </div>

    <!--编辑套餐-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div class="coupon__wrapper">
        <div v-for="(item,index) in couponList" class="coupon__item">
          <div class="coupon__info">
            <div class="coupon-info__label">￥{{item.discount/100}}</div>
            <div class="text-center">{{item.name}}</div>
          </div>
          <div class="coupon__operating">
            <el-input :min="1" type=number class="coupon-operating__number" v-model="item.count"></el-input>
            <el-button @click="deliverCoupon(index)" type="danger">赠送</el-button>
          </div>
        </div>
      </div>
      <div slot="footer" class="text-center"></div>
    </el-dialog>
  </section>
</template>

<script>
  import Coupon from '@/tool/classFactory/Coupon.js';
  import Customer from '@/tool/classFactory/Customer.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "customer-list",
    data() {
      return {
        search: {
          page: 1,
          pageSize: 15,
          keywords: '',
          type: 'name'
        },
        showEditModal: false,
        customerItem: {},
        customerList: [],
        customerSum: 0,
        couponList: [],
        tableConfig: [
          {
            label: '姓名',
            property: 'name'
          },
          {
            label: '联系电话',
            property: 'phone'
          },
          {
            label: '等级',
            property: 'levelName'
          },
          {
            label: '直属会员数',
            property: 'directSubordinateCount'
          },
          {
            label: '所有会员数',
            property: 'allSubordinateCount'
          },
          {
            label: '操作',
            type: 'operating'
          }
        ]
      }
    },

    components: {
      myTable
    },

    activated() {
      this.getCustomerList();
      this.getCouponList();
    },

    methods: {
      deliverCoupon: function () {
        let timer = null;
        return function (index) {
          const that = this;
          clearTimeout(timer);
          timer = setTimeout(function () {
            let list = that.couponList;
            let customerItem = that.customerItem;
            let obj = new Coupon({
              customerId: customerItem.id,
              couponId: list[index].id,
              count: list[index].count
            });
            obj.deliver();
          }, 400);
        };
      }(),

      gotoDetail(item) {
        const that = this;
        localStorage.customer = JSON.stringify(item);
        that.$router.push('/customer/detail');
      },

      prevShowEditModal(obj) {
        this.customerItem = {...obj};
        this.couponList.map(item => {
          item.count = 1;
        });
        this.showEditModal = true;
      },

      getCouponList() {
        const that = this;
        Coupon.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.couponList.splice(0, that.couponList.length, ...list);
        });
      },

      getCustomerList(page) {
        const that = this;
        let search = that.search;
        search.page = page || search.page;
        let params = {
          page: that.search.page,
          pageSize: that.search.pageSize,
        };

        if (search.keywords) {
          params[search.type] = search.keywords;
        }

        Customer.prototype.getList(params).then(res => {
          let list = res.data.data || [];
          that.customerList.splice(0, that.customerList.length, ...list);
          that.customerSum = res.data.extra.count || list.length;
        });
      }
    }
  }
</script>

<style scoped>

  .coupon__wrapper {
    max-height: 600px;
    overflow: auto;
  }

  .coupon__item {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 20px 15px;
    background-color: #f6f6f6;
    border-radius: 10px;
  }

  .coupon__info {
    border: 1px solid var(--text-old);
    border-top: 2px solid var(--text-success);
    padding: 10px;
    border-radius: 10px;
    margin: 15px 0;
    width: 250px;
  }

  .coupon-info__label {
    font-size: 22px;
    color: var(--text-success);
    text-align: center;
  }

  .coupon__operating {
    text-align: center;
  }

  .coupon-operating__number {
    width: 100px;
  }


</style>
