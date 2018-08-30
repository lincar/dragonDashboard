<template>
  <section class="plr-sm">
    <header class="y-center ptb-md sticky">
      <span class="size-md bolder">广告列表</span>
      <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="success">
        <span>添加广告</span>
        <i class="el-icon-plus"></i>
      </el-button>
    </header>
    <my-table :data="adList" :config="tableConfig">
      <div slot="operating" slot-scope="ad">
        <el-button @click="prevShowEditModal(ad.item)" icon="el-icon-edit" circle type="primary"></el-button>
        <el-button @click="deleteADItem(ad.item,ad.index)" icon="el-icon-delete" circle type="danger"></el-button>
      </div>
    </my-table>

    <!--编辑套餐-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div>
        <div class="edit-modal-item">
          <el-upload class="uploader"
                     action="/api/upload"
                     :show-file-list="false"
                     :on-success="uploadBanner">
            <img v-if="adItem.imgUrl" :src="adItem.imgUrl" class="banner">
            <i v-else class="el-icon-plus uploader-icon"></i>
          </el-upload>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">排序</span>
          <el-input type="number" v-model="adItem.seq" class="w-5"></el-input>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="commitADItem()" type="success">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import AD from '@/tool/classFactory/AD.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "ad-list",
    data() {
      return {
        showEditModal: false,
        adItem: {},
        adList: [],
        tableConfig: [
          {
            label: '图片',
            property: '',
            img: 'imgUrl'
          },
          {
            label: '排序',
            property: 'seq',
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
      this.getADList();
    },

    methods: {
      uploadBanner(res) {
        this.adItem.imgUrl = res.data;
        this.$forceUpdate();
      },

      deleteADItem(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let ad = new AD(obj);
            ad.delete().then(() => {
              that.adList.splice(index, 1);
            });
          }
        });
      },

      commitADItem() {
        const that = this;
        let ad = new AD(that.adItem);
        let ajax = 'add';
        ad.id && (ajax = 'edit');
        ad[ajax]().then(() => {
          that.showEditModal = false;
          that.getADList();
        });
      },

      prevShowEditModal(obj) {
        this.adItem = obj ? {...obj} : {seq: 1};
        this.showEditModal = true;
      },

      filterADList(list) {
        list.sort((x, y) => {
          return x.seq - y.seq;
        });
      },

      getADList() {
        const that = this;
        AD.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.filterADList(list);
          that.adList.splice(0, that.adList.length, ...list);
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

  .uploader {
    width: 150px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
  }

  .uploader:hover {
    border-color: #409EFF;
  }

  .uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    line-height: 150px;
    text-align: center;
  }

  .uploader-icon.sub {
    width: 65px;
    line-height: 65px;
  }

  .banner {
    width: 150px;
    height: 150px;
    vertical-align: middle;
  }
</style>
