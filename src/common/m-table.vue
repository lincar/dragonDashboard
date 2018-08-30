<template>
  <section>
    <div v-if="!hideLabel" class="table-tr hide-mobile">
      <el-checkbox @change="allCheckbox" :indeterminate="isIndeterminate" v-if="showCheckbox" v-model="isAllChoose"></el-checkbox>
      <div class="table-th" v-for="item in config">{{item.label}}</div>
    </div>
    <div class="table-tr" v-for="(row,rowIndex) in data">
      <el-checkbox @change="singleCheckbox" v-if="showCheckbox" v-model="row.isChoose"></el-checkbox>
      <div class="table-td" v-for="item in pureLabel">
        <span class="hide-pc table-td_label">{{item.label}}</span>
        <img v-if="item.img" :src="getRealValue(row,item.img)"/>
        <span v-if="!item.color">{{getRealValue(row,item.property)}}</span>
        <span v-else :style="{color:row[item.property].color}">{{getRealValue(row,item.property).value}}</span>
      </div>
      <div v-if="pureLabel.length !== config.length" class="table-td">
        <span class="hide-pc table-td_label">操作</span>
        <slot name="operating" :index="rowIndex" :item="row"></slot>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        isAllChoose: false,
        isIndeterminate: false
      }
    },
    props: {
      data: {
        type: Array,
        required: true
      },
      config: {
        type: Array,
        required: true
      },
      hideLabel: false,
      showCheckbox: false
    },
    computed: {
      pureLabel: function () {
        let list = [];
        this.config.forEach(item => {
          if (!item.type) {
            list.push(item);
          }
        });
        return list;
      }
    },
    methods: {
      allCheckbox(isAllChoose) {
        const that = this;
        that.isIndeterminate = false;
        that.data.map(item => {
          item.isChoose = isAllChoose;
        });
      },

      singleCheckbox() {
        const that = this;
        let len = that.data.length;
        let sum = 0;
        that.data.map(item => {
          if (item.isChoose) {
            sum++;
          }
        });
        that.isAllChoose = (len === sum);
        that.isIndeterminate = !!(sum && len !== sum);
      },

      getRealValue(obj, property) {
        let value = obj;
        let propertyList = property.split('.');
        propertyList.forEach(name => {
          if (value) {
            value = value[name];
          }
        });
        return value;
      }
    }
  }
</script>

<style scoped>
  .table-tr {
    display: flex;
    background-color: white;
    padding: 12px 10px;
    font-size: 14px;
    flex-wrap: nowrap;
    overflow-x: auto;
    align-items: center;
    border: 1px solid var(--border-color);
    border-bottom: none;
  }

  .table-tr:last-of-type {
    border-bottom: 1px solid var(--border-color);
    border-radius: 0 0 5px 5px;
  }

  .table-tr:first-of-type {
    border-radius: 5px 5px 0 0;
  }

  .table-tr:nth-child(even) {
    /*background-color: #f9f9f9;*/
  }

  .table-tr:nth-child(odd) {
    background-color: #f9f9f9;
  }

  .table-th {
    flex: 1 1 15%;
    font-weight: bolder;
    text-align: center;
  }

  .table-td {
    flex: 1 1 15%;
    text-align: center;
    margin-right: 10px;
    max-height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
  }

  .table-td img {
    width: 60px;
    display: block;
    margin: 0 auto;
  }

  @media screen and (min-width: 768px) {
    .hide-pc {
      display: none;
    }
  }

  @media screen and (max-width: 768px) {
    .hide-mobile {
      display: none;
    }

    .table-tr {
      border: 1px solid rgba(187, 187, 187, .5);
      padding: 0 20px;
      border-radius: 4px;
      margin: 15px 0;
      flex-wrap: wrap;
    }

    .table-td {
      text-align: right;
      padding: 15px;
      flex: 1 0 100%;
    }

    .table-td_label {
      float: left;
      font-weight: bolder;
    }

  }

</style>
