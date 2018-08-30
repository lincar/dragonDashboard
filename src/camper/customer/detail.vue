<template>
  <section class="plr-sm">
    <header class="y-center ptb-md sticky">
      <span class="size-md bolder">会员详情</span>
    </header>
    <el-card v-if="customer">
      <div class="customer__wrapper">
        <img :src="customer.avatarUrl">
        <div class="customer__wrapper__info">
          <div>姓名：{{customer.name}}</div>
          <div>
            <span>等级：</span>
            <span class="text-success size-md">{{customer.levelName}}</span>
          </div>
          <div>
            <span>直属会员数：</span>
            <span class="text-warning size-md">{{customer.directSubordinateCount}}</span>
          </div>
          <div>
            <span>所有会员数：</span>
            <span class="text-warning size-md">{{customer.allSubordinateCount}}</span></div>
          <div>
            <span>联系电话：</span>
            <span class="text-info">{{customer.phone}}</span>
          </div>
          <div>
            <span>注册时间：</span>
            <span class="text-old">{{customer.createdAt}}</span>
          </div>
        </div>
      </div>
    </el-card>
    <div v-if="historyCoupons.length" class="mt-md">
      <div class="ptb-xs size-md bolder">派发记录</div>
      <el-card>
        <div class="coupon__item bolder">
          <div>名称</div>
          <div>金额￥</div>
          <div>时间</div>
        </div>
        <div class="coupon__item" v-for="item in historyCoupons">
          <div>{{item.name}}</div>
          <div>{{(item.discount/100).toFixed(2)}}</div>
          <div>{{item.createdAt}}</div>
        </div>
      </el-card>
    </div>
  </section>
</template>

<script>
  import Coupon from '@/tool/classFactory/Coupon.js';

  export default {
    name: 'customer-detail',
    data() {
      return {
        customer: null,
        historyCoupons: []
      }
    },
    activated() {
      this.customer = JSON.parse(localStorage.customer || null);
      if (this.customer) {
        this.getHistoryCoupons();
      } else {
        this.$router.go(-1);
      }
    },
    methods: {
      getHistoryCoupons() {
        const that = this;
        let customer = {...that.customer};
        customer.customerId = customer.id;
        customer = new Coupon(customer);
        customer.history().then(res => {
          let list = res.data.data || [];
          that.historyCoupons.splice(0, that.historyCoupons.length, ...list);
        });
      }
    }
  }
</script>

<style scoped>
  .customer__wrapper {
    display: flex;
    align-items: center;
  }

  .customer__wrapper img {
    width: 100px;
    height: 100px;
    border-radius: 100px;
    object-fit: cover;
    margin-right: 10px;
  }

  .customer__wrapper__info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .customer__wrapper__info > * {
    flex: none;
    width: 50%;
    padding: 10px;
  }

  .coupon__item {
    display: flex;
    align-items: center;
    padding: 10px;
  }

  .coupon__item > * {
    flex: none;
    width: 33.33%;
    text-align: center;
  }

  .coupon__item:nth-child(even) {
    background-color: #f7f7f7;
  }
</style>
