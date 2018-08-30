<template>
  <section class="plr-sm">
    <header class="y-center ptb-md sticky">
      <span class="size-md bolder">分类列表</span>
      <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="success">
        <span>新增分类</span>
        <i class="el-icon-plus"></i>
      </el-button>
    </header>
    <my-table :hideLabel="true" :data="classifyList" :config="tableConfig">
      <div slot="operating" slot-scope="classify">
        <el-button @click="prevShowEditModal(classify.item)" icon="el-icon-edit" circle type="primary"></el-button>
        <el-button @click="deleteClassifyItem(classify.item,classify.index)" icon="el-icon-delete" circle type="danger"></el-button>
      </div>
    </my-table>

    <!--编辑套餐-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div>
        <div class="edit-modal-item">
          <span class="plr-sm">名称</span>
          <el-input v-model="classifyItem.name" class="w-5"></el-input>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="commitClassifyItem()" type="success">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import Classify from '@/tool/classFactory/Classify.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "classify-list",
    data() {
      return {
        showEditModal: false,
        classifyItem: {},
        classifyList: [],
        tableConfig: [
          {
            label: '名称',
            property: 'name'
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
      this.getClassifyList();
    },

    methods: {
      deleteClassifyItem(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let classify = new Classify(obj);
            classify.delete().then(() => {
              that.classifyList.splice(index, 1);
            });
          }
        });
      },

      commitClassifyItem() {
        const that = this;
        let classify = new Classify(that.classifyItem);
        let ajax = 'add';
        classify.id && (ajax = 'edit');
        classify[ajax]().then(() => {
          that.showEditModal = false;
          that.getClassifyList();
        });
      },

      prevShowEditModal(obj) {
        this.classifyItem = {...obj} || {};
        this.showEditModal = true;
      },


      getClassifyList() {
        const that = this;
        Classify.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.classifyList.splice(0, that.classifyList.length, ...list);
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
