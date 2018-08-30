<template>
  <section class="plr-sm">
    <header class="y-center ptb-md sticky">
      <span class="size-md bolder">优惠券列表</span>
      <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="success">
        <span>新增优惠券</span>
        <i class="el-icon-plus"></i>
      </el-button>
    </header>
    <my-table :data="couponList" :config="tableConfig">
      <div slot="operating" slot-scope="coupon">
        <el-button @click="prevShowEditModal(coupon.item)" icon="el-icon-edit" circle type="primary"></el-button>
        <el-button @click="deleteCouponItem(coupon.item,coupon.index)" icon="el-icon-delete" circle type="danger"></el-button>
      </div>
    </my-table>

    <!--编辑套餐-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div>
        <div class="edit-modal-item">
          <span class="plr-sm">名称</span>
          <el-input v-model="couponItem.name" class="w-5"></el-input>
        </div>
      </div>
      <div>
        <div class="edit-modal-item">
          <span class="plr-sm">金额(￥)</span>
          <el-input type="number" v-model="couponItem.discount" class="w-5"></el-input>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="commitCouponItem()" type="success">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import Coupon from '@/tool/classFactory/Coupon.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "coupon-list",
    data() {
      return {
        showEditModal: false,
        couponItem: {},
        couponList: [],
        tableConfig: [
          {
            label: '名称',
            property: 'name'
          },
          {
            label: '金额(￥)',
            property: 'discount'
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
      this.getCouponList();
    },

    methods: {
      deleteCouponItem(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let coupon = new Coupon(obj);
            coupon.delete().then(() => {
              that.couponList.splice(index, 1);
            });
          }
        });
      },

      commitCouponItem() {
        const that = this;
        let coupon = new Coupon(that.couponItem);
        let ajax = 'add';
        coupon.id && (ajax = 'edit');
        coupon[ajax]().then(() => {
          that.showEditModal = false;
          that.getCouponList();
        });
      },

      prevShowEditModal(obj) {
        this.couponItem = {...obj} || {};
        this.showEditModal = true;
      },

      initCouponList(list) {
        list.map(item => {
          item.discount = item.discount / 100;
        });
      },

      getCouponList() {
        const that = this;
        Coupon.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.initCouponList(list);
          that.couponList.splice(0, that.couponList.length, ...list);
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
</style>
