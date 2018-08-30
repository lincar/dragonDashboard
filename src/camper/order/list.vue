<template>
  <section class="plr-sm">
    <header class="y-center ptb-md sticky">
      <span class="size-md bolder">订单列表</span>
    </header>
    <el-tabs v-model="search.status" @tab-click="getOrderList">
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane label="未支付" name="1"></el-tab-pane>
      <el-tab-pane label="待确定" name="2"></el-tab-pane>
      <el-tab-pane label="待完成" name="3"></el-tab-pane>
      <el-tab-pane label="已完成" name="4"></el-tab-pane>
      <el-tab-pane label="已取消" name="-1"></el-tab-pane>
      <el-tab-pane label="已退款" name="-2"></el-tab-pane>
    </el-tabs>
    <section class="order__wrapper">
      <el-row class="order__header">
        <el-col :span="15">
          <el-row>
            <el-col :span="12">产品信息</el-col>
            <el-col :span="6">单价</el-col>
            <el-col :span="6">数量</el-col>
          </el-row>
        </el-col>
        <el-col :span="3">订单状态</el-col>
        <el-col :span="3">已优惠</el-col>
        <el-col :span="3">订单价格</el-col>
      </el-row>
      <el-row class="order__item" v-for="order in orderList">
        <el-col :span="24">
          <el-row class="order__product">
            <el-col :span="15">
              <el-row class="order-product__info" v-for="product in order.products">
                <el-col class="y-center" :span="12">
                  <img class="mr-md" :src="product.imgUrl">
                  <span>{{product.name}}</span>
                </el-col>
                <el-col :span="6">{{(product.price/100).toFixed(2)}}</el-col>
                <el-col :span="6">{{product.count}}</el-col>
              </el-row>
            </el-col>
            <el-col :style="{color:orderStatusName(order.status).color}" :span="3">{{orderStatusName(order.status).name}}</el-col>
            <el-col class="text-danger" :span="3">{{(((order.price||0)-(order.originPrice||0))/100).toFixed(2)}}</el-col>
            <el-col class="text-success order__price" :span="3">
              <span>{{((order.price||0)/100).toFixed(2)}}</span>
              <i @click="showOrderEditModal(order)" v-if="order.status===1" class="el-icon-edit"></i>
            </el-col>
          </el-row>
        </el-col>
        <el-col class="item__info" :span="24">
          <el-row class="y-center">
            <el-col :span="9">订单号：{{order.wxOrder.num}}</el-col>
            <el-col :span="9">下单时间：{{order.wxOrder.createdAt}}</el-col>
            <el-col :span="6">
              <router-link :to="'/order/detail?orderId=' + order.id">
                <el-button size="small" type="primary">订单详情</el-button>
              </router-link>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </section>

    <div v-if="orderList.length" class="text-center p-sm">
      <el-pagination
        @current-change="getOrderList"
        :current-page.sync="search.page"
        :page-size="search.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="orderSum">
      </el-pagination>
    </div>

    <!--修改价格-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div>
        <div class="edit-modal-item">
          <span class="plr-sm">订单价格</span>
          <el-input placeholder="请输入修改后的订单价格" v-model="orderItem.price" class="w-5"></el-input>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="commitOrderItem()" type="success">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import Order from '@/tool/classFactory/Order.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "order-list",
    data() {
      return {
        search: {
          page: 1,
          pageSize: 15,
          status: '0'
        },
        orderList: [],
        orderSum: 0,
        orderItem: {},
        showEditModal: false
      }
    },

    components: {
      myTable
    },

    activated() {
      this.search.status = localStorage.searchStatus || '0';
      this.getOrderList();
    },

    methods: {
      showOrderEditModal(item = {}) {
        this.orderItem = {...item};
        this.orderItem.price = (this.orderItem.price / 100).toFixed(2);
        this.showEditModal = true;
      },

      commitOrderItem() {
        const that = this;
        let orderItem = new Order(that.orderItem);
        orderItem.editPrice().then(() => {
          that.getOrderList(that.search.page);
          that.showEditModal = false;
        });
      },

      orderStatusName(status) {
        let name = '';
        let color = '';
        switch (status) {
          case 1 :
            name = '未支付';
            color = '#ffad33';
            break;
          case 2 :
            name = '待确定';
            color = '#ffad33';
            break;
          case 3 :
            name = '待完成';
            color = '#68B3C8';
            break;
          case 4 :
            name = '已完成';
            color = '#19be6b';
            break;
          case -1 :
            name = '已取消';
            color = '#a4a4a4';
            break;
          case -2 :
            name = '已退款';
            color = '#ff3f66';
            break;
        }
        return {name, color}
      },

      filterOrderList(list) {
        list.map(item => {
          item.wxOrder.price = (item.wxOrder.price / 100).toFixed(2)
        });
      },

      getOrderList(isPage) {
        const that = this;
        let search = that.search;
        search.page = isPage ? 1 : search.page;
        let params = {
          page: that.search.page,
          pageSize: that.search.pageSize,
        };
        localStorage.searchStatus = search.status;
        if (search.status !== '0') {
          params.status = +search.status;
        }
        Order.prototype.getList(params).then(res => {
          let list = res.data.data || [];
          that.filterOrderList(list);
          that.orderList.splice(0, that.orderList.length, ...list);
          that.orderSum = res.data.extra.count || list.length;
        });
      }
    }
  }
</script>

<style scoped>
  .edit-modal-item {
    display: flex;
    align-items: center;
    padding: var(--sm);
    justify-content: center;
  }

  .edit-modal-item span {
    display: inline-block;
    min-width: 6em;
    text-align: right;
  }

  .order__wrapper {
    text-align: center;
  }

  .order__header {
    background-color: white;
    font-weight: bold;
    padding: 15px 0;
    border: 1px solid #efeae3;
  }

  .order__item {
    border: 1px solid var(--border-color);
    border-top: none;
  }

  .order__item:nth-child(even) {
    background-color: #f9f9f9;
  }

  .item__info {
    padding: 15px 0;
    /*background-color: rgba(188, 188, 188, 0.07);*/
  }

  .order__product {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(187, 187, 187, .2);
    padding: 0 15px;
  }

  .order-product__info {
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-right: 1px solid rgba(187, 187, 187, .2);
  }

  .order-product__info img {
    width: 50px;
    object-fit: cover;
  }

  .order-product__info:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }

  .order__price {
    cursor: default;
  }
</style>
