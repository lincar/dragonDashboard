<template>
  <div>
    <Row class="address-wrapper">
      <i-col class="edit-wrapper" span="12">
        <Button v-if="isEdit" @click="showEditModal()">添加指定地区</Button>
      </i-col>
      <i-col class="address" v-if="addressList.length" span="24">
        <span class="address-item" v-for="(item,index) in addressList" :key="index">
          <span v-if="!item.city">{{item.province}}</span>
          <span v-if="item.city">{{item.city}}</span>
        </span>
      </i-col>
    </Row>

    <!--//弹框-->
    <Modal id="modal" v-model="isShowModel" width="80%" title="选择区域">
      <Row>
        <i-col span="8" class="slider-wrapper">
          <Card class="slider-wrapper">
            <div class="slider-content" :class="{active:currentProvince.proCode===province.proCode}"
                 v-for="(province, index) in address" :key="index">
              <Checkbox @on-change="provinceChange(index)" :indeterminate="province.indeterminate" :value="province.isChoose">{{''}}</Checkbox>
              <span @click="setCurrentProvince(index)">
                {{province.name}}
                <Icon type="chevron-right" :class="{'tansf90':currentProvince.proCode===province.proCode}"></Icon>
              </span>
            </div>
          </Card>
        </i-col>
        <i-col span="16">
          <Card class="content-wrapper">
            <Row>
              <CheckboxGroup @on-change="cityChange" v-model="checkList">
                <i-col class="content" span="12" v-for="(city,index) in currentProvince.cities" :key="index">
                  <Checkbox :label="city.cityCode" v-model="city.isChoose">{{city.name}}</Checkbox>
                </i-col>
              </CheckboxGroup>
            </Row>
          </Card>
        </i-col>
      </Row>
    </Modal>
  </div>
</template>

<script>
  /**
   * 省市地址选择组件
   *@module selectAddress
   */

  import {address} from './address.js';

  export default {
    data() {
      return {
        address,
        checkList: [],
        isInit: false,
        isShowModel: false,
        currentProvince: null,
      };
    },

    props: {
      addressList: {
        type: Array,
        required: true
      },
      isEdit: {
        type: Boolean,
        default: true,
      }
    },

    created() {
      this.setCurrentProvince(0);
      this.address.forEach(province => {
        province.isChoose = false;
        province.indeterminate = false;
        province.cities.forEach(city => {
          city.isChoose = false;
        });
      });
    },

    methods: {
      /**
       * 显示编辑框
       * @method showEditModal
       */
      showEditModal() {
        this.initAddress();
        this.isShowModel = true;
      },

      /**
       * 初始化address数据中的数据元素
       * @method initAddress
       */
      initAddress() {
        const that = this;
        if (!that.isInit) {
          that.isInit = true;
          for (let i = 0; i < that.addressList.length; i++) {
            let item = that.addressList[i];
            for (let j = 0; j < that.address.length; j++) {
              let province = that.address[j];
              //是否找到相应的城市
              let flag = false;
              if (item.proCode === province.proCode) {
                province.isChoose = !item.cityCode;
                province.indeterminate = !!item.cityCode;
                if (i === 0) {
                  //设置第一个省份为当前省份
                  that.setCurrentProvince(j);
                }
              }

              if (item.proCode !== province.proCode) {
                continue;
              }

              for (let k = 0; k < province.cities.length; k++) {
                let city = province.cities[k];
                if (!item.cityCode || item.cityCode === city.cityCode) {
                  city.isChoose = true;
                  that.checkList.push(city.cityCode);
                  flag = true;
                  //如果不是全部城市，找到后立即跳出循环
                  if (item.cityCode) {
                    break;
                  }
                }
              }

              //找到相应的城市后，跳出循环
              if (flag) {
                break;
              }
            }
          }
        }
      },

      /**
       * 标记当前操作的省份
       * @method setCurrentProvince
       * @param {number} index data.address数组索引号
       */
      setCurrentProvince(index) {
        this.currentProvince = this.address[index];
      },

      /**
       * 处理城市全选标志事件
       * @method provinceChange
       * @param {number} index data.address数组索引号
       */
      provinceChange(index) {
        const that = this;
        that.setCurrentProvince(index);
        that.currentProvince.isChoose = !that.currentProvince.isChoose;
        let flag = that.currentProvince.isChoose;
        let province = that.currentProvince;
        province.cities.forEach(city => {
          city.isChoose = flag;
          flag && that.checkList.push(city.cityCode);
          if (!flag) {
            for (let i = 0; i < that.checkList.length; i++) {
              if (that.checkList[i].toString().startsWith(`${city.cityCode}`)) {
                that.checkList.splice(i, 1);
                i--;
              }
            }
          }
        });
        province.indeterminate = false;
        that.checkList.splice(0, that.checkList.length, ...(new Set(that.checkList)));
        that.showAddress();
      },

      /**
       * 处理城市选择事件
       * @method cityChange
       * @param {Array} list 已选城市列表
       */
      cityChange(list) {
        const that = this;
        let length = 0;
        let province = that.currentProvince;

        that.checkList.forEach(item => {
          if (item.toString().startsWith(`${province.proCode / 10000}`)) {
            length++;
          }
        });

        province.isChoose = (length === province.cities.length);
        province.indeterminate = (length > 0 && length < province.cities.length);
        that.showAddress();
      },

      /**
       * 转换已选择的省市列表为需要显示的结构
       * @method showAddress
       */
      showAddress() {
        const that = this;
        that.addressList.splice(0, that.addressList.length);
        that.address.forEach(province => {
          if (province.isChoose) {
            that.addressList.push({
              province: `${province.name}`,
              proCode: province.proCode,
              city: null,
              cityCode: null,
            });
          }

          if (!province.isChoose) {
            province.cities.forEach(city => {
              if (city.isChoose) {
                that.addressList.push({
                  province: `${province.name}`,
                  proCode: province.proCode,
                  city: `${city.name}`,
                  cityCode: city.cityCode,
                });
              }
            });
          }
        });
      }
    }
  };
</script>

<style scoped>
  .active {
    color: #2d8cf0;
  }

  .tansf90 {
    transform: rotate(90deg);
    -webkit-transition: all 1s linear;
    -moz-transition: all 1s linear;
    -ms-transition: all 1s linear;
    -o-transition: all 1s linear;
    transition: all 0.3s linear;
  }

  .address-wrapper {
    padding-top: 10px;
  }

  .edit-wrapper {
    padding: 4px 10px 10px;
  }

  .address {
    padding: 10px;
    font-size: 14px;
  }

  .address-item {
    word-break: keep-all;
    letter-spacing: 1px;
    color: var(--text-success);
  }

  .address-item:not(:last-child):after {
    content: '、';
  }

  .slider-wrapper {
    font-size: 14px;
    cursor: pointer;
    height: 500px;
    overflow: auto;
  }

  .slider-content {
    margin: 10px 0px;
    padding: 10px 0px;
  }

  .content-wrapper {
    height: 500px;
    overflow: auto;
    padding-left: 20px;
  }

  .content {
    margin: 5px 0px;
    padding: 5px 0px;
  }
</style>
