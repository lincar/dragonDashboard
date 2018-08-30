<template>
  <section class="plr-sm">
    <header class="y-center ptb-md sticky">
      <span class="size-md bolder">账号列表</span>
      <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="success">
        <span>新增账号</span>
        <i class="el-icon-plus"></i>
      </el-button>
    </header>
    <my-table :data="adminList" :config="tableConfig">
      <div slot="operating" slot-scope="admin">
        <el-button @click="prevShowEditModal(admin.item)" icon="el-icon-edit" circle type="primary"></el-button>
        <el-button @click="deleteAdminItem(admin.item,admin.index)" icon="el-icon-delete" circle type="danger"></el-button>
      </div>
    </my-table>

    <!--编辑套餐-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div>
        <div class="edit-modal-item">
          <span class="plr-sm">账号</span>
          <el-input v-model="adminItem.username" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">密码</span>
          <el-input type="password" v-model="adminItem.password" class="w-5"></el-input>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="commitAdminItem()" type="success">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import Admin from '@/tool/Admin.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "admin-list",
    data() {
      return {
        showEditModal: false,
        adminItem: {},
        adminList: [],
        tableConfig: [
          {
            label: '账号',
            property: 'username'
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
      this.getAdminList();
    },

    methods: {
      deleteAdminItem(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let admin = new Admin(obj);
            admin.delete().then(() => {
              that.adminList.splice(index, 1);
            });
          }
        });
      },

      commitAdminItem() {
        const that = this;
        let admin = new Admin(that.adminItem);
        let ajax = 'add';
        admin.id && (ajax = 'edit');
        admin[ajax]().then(() => {
          that.showEditModal = false;
          that.getAdminList();
        });
      },

      prevShowEditModal(obj) {
        this.adminItem = {...obj} || {};
        this.showEditModal = true;
      },

      getAdminList() {
        const that = this;
        Admin.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.adminList.splice(0, that.adminList.length, ...list);
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
