<template>
  <section class="plr-sm">
    <header class="y-center ptb-md sticky">
      <span class="size-md bolder">民宿列表</span>
      <router-link to="/product/edit?classifyId=2">
        <el-button class="mlr-sm" size="small" type="success">
          <span>新增民宿</span>
          <i class="el-icon-plus"></i>
        </el-button>
      </router-link>
    </header>
    <my-table :showCheckbox="true" :data="productList" :config="tableConfig">
      <div slot="operating" slot-scope="product">
        <el-button icon="el-icon-share" @click="PrevshowQRCode(product.item)" circle type="info"></el-button>
        <router-link class="mlr-xs" :to="'/product/edit?classifyId=2&productId=' + product.item.id">
          <el-button icon="el-icon-edit" circle type="primary"></el-button>
        </router-link>
        <el-button @click="deletePackgeItem(product.item,product.index)" icon="el-icon-delete" circle type="danger"></el-button>
      </div>
    </my-table>
    <div v-if="productList.length">
      <ul class="batch__wrapper">
        <li @click="prevUpOrDown('up')">批量上架</li>
        <li @click="prevUpOrDown('down')">批量下架</li>
      </ul>
      <div class="text-center p-sm">
        <el-pagination
          @current-change="getProductList"
          :current-page.sync="search.page"
          :page-size="search.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="productSum">
        </el-pagination>
      </div>
    </div>

    <!--二维码-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showQRcode">
      <div>
        <div class="edit-modal-item">
          <img :src="productItem.imgUrl">
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="showQRcode = false">关闭</el-button>
        <a class="ml-md" :href="productItem.imgUrl" :download="productItem.imgName">
          <el-button type="success">下载</el-button>
        </a>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import Product from '@/tool/classFactory/Product.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "product-list-2",
    data() {
      return {
        search: {
          page: 1,
          pageSize: 20,
          classifyId: 2
        },
        showQRcode: false,
        productItem: {},
        productList: [],
        productSum: 0,
        tableConfig: [
          {
            label: '封面',
            property: '',
            img: 'images.0.url'
          },
          {
            label: '名称',
            property: 'name'
          },
          {
            label: '默认价格￥',
            property: 'basePrice',
          },
          {
            label: '最大优惠券数',
            property: 'maxCouponCount'
          },
          {
            label: '状态',
            property: 'statusObj',
            color: true
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
      this.getProductList();
    },

    methods: {
      PrevshowQRCode(obj = {}) {
        const that = this;
        let product = new Product(obj);
        product.getQRCode().then(res => {
          that.productItem = {...obj};
          that.productItem.imgUrl = res.data.data.imgUrl;
          that.productItem.imgName = `${obj.id}-${obj.name}.png`;
          that.showQRcode = true;
        });
      },

      deletePackgeItem(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let product = new Product(obj);
            product.delete().then(() => {
              that.productList.splice(index, 1);
            });
          }
        });
      },

      prevUpOrDown(type) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否执行，请确认',
          onOk: () => {
            that.upOrDown(type);
          }
        });
      },

      async upOrDown(type) {
        const that = this;
        let productList = that.productList;
        for (let i = 0; i < productList.length; i++) {
          let item = productList[i];
          if (item.isChoose) {
            let product = new Product(item);
            await product.upOrDown(type);
          }
        }
        that.$Notice.success({
          duration: 2,
          title: '通知',
          desc: '已完成'
        });
        that.getProductList();
      },

      filterProductList(list) {
        list.forEach(item => {
          item.basePrice = (item.basePrice / 100).toFixed(2);
          item.statusObj = {};
          item.statusObj.value = item.status === 1 ? '已上架' : '已下架';
          item.statusObj.color = item.status === 1 ? '#19be6b' : '#ffad33';
        });
      },

      getProductList() {
        const that = this;
        let search = that.search;
        Product.prototype.getList(search).then(res => {
          let list = res.data.data || [];
          that.filterProductList(list);
          that.productList.splice(0, that.productList.length, ...list);
          that.productSum = res.data.extra.count || list.length;
        });
      }
    }
  }
</script>

<style scoped>
  .edit-modal-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--sm);
  }

  .edit-modal-item span {
    display: inline-block;
    min-width: 6em;
    text-align: right;
  }

  .edit-modal-item > img {
    width: 200px;
    object-fit: cover;
  }

  .batch__wrapper {
    font-size: 12px;
    color: var(--text-info);
    padding: 8px 0 0;
    cursor: default;
  }

  .batch__wrapper li {
    display: inline-block;
    padding-right: 5px;
  }
</style>
