<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">{{product.classify.name}}编辑</span>
    </header>
    <el-row class="bg-gray plr-sm">
      <el-col :span="18">
        <el-card class="mtb-sm">
          <div class="text-old ptb-xs required">产品标题</div>
          <el-input v-model="product.name"></el-input>
        </el-card>
        <el-card class="mtb-sm">
          <div class="text-old ptb-xs">产品地区</div>
          <address-select :addressList="product.areas"></address-select>
          <div class="ptb-xs required">选择商品可以地区后，该商品只能显示给所属地区的客户浏览</div>
        </el-card>
        <el-card v-if="productType===2" class="mtb-sm">
          <div class="text-old ptb-xs">产品价格</div>
          <div class="p-sm y-center x-between border">
            <span>默认全部日期价格</span>
            <div>
              <el-input type="number" v-model="product.basePrice" class="w-8"></el-input>
              <span>元</span>
            </div>
          </div>
          <div class="p-md text-center">
            <el-button @click="addDatePrice" type="success">
              <i class="el-icon-plus"></i>
              <span>其他日期价格</span>
            </el-button>
          </div>
          <div class="table__wrapper">
            <div class="table__label">
              <span style="flex:1 0 20%;">开始时间</span>
              <span style="flex:1 0 20%;">结束时间</span>
              <span>天数</span>
              <span>售卖价</span>
              <span>操作</span>
            </div>
            <div v-for="(item,index) in product.datePrices" class="table__item">
              <el-date-picker
                style="flex:1 0 20%;"
                v-model="item.startDate"
                type="date"
                value-format="yyyy-M-dd"
                placeholder="选择日期">
              </el-date-picker>
              <el-date-picker
                style="flex:1 0 20%;"
                v-model="item.endDate"
                type="date"
                value-format="yyyy-M-dd"
                placeholder="选择日期">
              </el-date-picker>
              <span>{{calcDelay(item.startDate,item.endDate)}}天</span>
              <el-input type="number" v-model="item.price"></el-input>
              <div>
                <el-button @click="deleteDatePrice(index)" icon="el-icon-delete" circle type="danger"></el-button>
              </div>
            </div>
          </div>
        </el-card>
        <el-card v-if="productType===1" class="mtb-sm">
          <div class="text-old ptb-xs">产品规格</div>
          <div v-for="(item,index) in product.formatList" class="border p-sm">
            <div class="y-center x-between">
              <span>主规格：{{item.mainSpec}}</span>
              <div>
                <el-button @click="prevShowSubProduct(item,index)" type="text">
                  <span class="text-info">编辑</span>
                </el-button>
                <el-button @click="deleteFormat(index)" type="text">
                  <span class="text-danger">删除</span>
                </el-button>
              </div>
            </div>
            <div class="size-xs">
              <span class="text-old">子规格：</span>
              <el-checkbox @change="calcRealLength" v-for="(sub,subIndex) in item.subSpecList" v-model="sub.isSelect">{{sub.subSpec}}</el-checkbox>
            </div>
          </div>
          <div class="p-md text-center">
            <el-button @click="prevShowSubProduct()" type="success">
              <i class="el-icon-plus"></i>
              <span>新增规格</span>
            </el-button>
          </div>
          <div class="table__wrapper">
            <div class="table__label">
              <span>主规格</span>
              <div class="table__label" style="display:flex;padding:0;flex:4 0 60%;">
                <span>子规格</span>
                <span>图片</span>
                <span>售价</span>
                <span>操作</span>
              </div>
            </div>
            <div v-if="item.realLength" v-for="(item,index) in product.formatList" class="table__item">
              <span>{{item.mainSpec}}</span>
              <div class="table__sub-item" style="display:flex;padding:0;flex:4 0 60%;">
                <div v-if="sub.isSelect" v-for="(sub, subIndex) in item.subSpecList" class="table__sub-item" style="display:flex;padding:0;flex:4 0 60%;">
                  <span>{{sub.subSpec}}</span>
                  <div @click="setImgIndex('sub', index, subIndex)">
                    <el-upload class="uploader sub"
                               action="/api/upload"
                               :show-file-list="false"
                               :on-success="uploadSubImg">
                      <img v-if="sub.imgUrl" :src="sub.imgUrl" class="subImg">
                      <i v-else class="el-icon-plus uploader-icon sub"></i>
                    </el-upload>
                  </div>
                  <el-input type="number" v-model="sub.price"></el-input>
                  <div>
                    <el-button @click="deleteSubFormat(index,subIndex)" icon="el-icon-delete" circle type="danger"></el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="mtb-sm">
          <div class="text-old ptb-xs">产品图片</div>
          <div @click="setImgIndex('banner',index)" class="inline mr-sm" v-for="(item,index) in product.images">
            <el-upload class="uploader"
                       action="/api/upload"
                       :show-file-list="false"
                       :on-success="uploadBanner">
              <img v-if="item.url" :src="item.url" class="banner">
              <i v-else class="el-icon-plus uploader-icon"></i>
            </el-upload>
            <div class="text-center">
              <el-button @click="deletImg(index)" type="text">
                <span class="text-danger">删除</span>
              </el-button>
            </div>
          </div>
          <div class="ptb-xs required">产品图片比例为1:1，主图将作为产品的封面图使用。</div>
        </el-card>
        <el-card class="mtb-sm">
          <div class="text-old ptb-xs">产品详情</div>
          <editor v-model="product.content.content"></editor>
        </el-card>
      </el-col>
      <el-col class="slider sticky" :span="6">
        <el-card class="ml-sm mtb-sm">
          <div>
            <div class="mb-xs">当前分类</div>
            <el-input :disabled="true" v-model="product.classify.name"></el-input>
          </div>
        </el-card>
        <el-card class="ml-sm mtb-sm">
          <div>
            <div class="mb-xs">最大优惠券数</div>
            <el-input type="number" v-model="product.maxCouponCount"></el-input>
          </div>
        </el-card>
        <el-card class="ml-sm mtb-sm">
          <div class="p-sm x-center border">
            <el-button @click="commitProduct" type="success">提交</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--规格弹框-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showSubProductModal">
      <div v-if="format.subSpecList">
        <div class="p-sm border">
          例子：如衣服有“大、中、小”三个码，颜色为“红、蓝”，则创建三个规格，规格1为：主规格：大，子规格红色、蓝色。规格2、3以此类推。
        </div>
        <div style="border-top:none;" class="mb-md p-sm border">
          <div class="ptb-sm bolder xy-center">
            <div style="letter-spacing: 2px;" class="plr-sm">主规格</div>
            <el-input class="w-4" v-model="format.mainSpec"></el-input>
          </div>
          <div v-for="(item,index) in format.subSpecList" class="ptb-sm xy-center">
            <div class="plr-sm text-old">子规格{{index+1}}</div>
            <el-input class="w-4" v-model="item.subSpec"></el-input>
          </div>
          <div class="ptb-sm x-center">
            <el-button @click="addSubFormat" type="success">
              <i class="el-icon-plus"></i>
              <span>添加</span>
            </el-button>
          </div>
        </div>
      </div>
      <div slot="footer" class="text-right">
        <el-button @click="showSubProductModal = false;">取消</el-button>
        <el-button @click="editMainFormat" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import addressSelect from '@/common/address/select.vue';
  import editor from '@/common/editor.vue';
  import Product from '@/tool/classFactory/Product.js';
  import {dateFormat} from '@/tool/transform.js';

  export default {
    name: 'product-edit',
    data() {
      return {
        showSubProductModal: false,
        productId: null,
        productType: 2,
        classifyId: 1,
        bannerImgIndex: 0,
        subImgIndex: [0, 0],
        formatIndex: null,
        format: {},
        product: {
          name: '',
          maxCouponCount: 0,
          classify: {id: 1, name: '房车'},
          images: [{}],
          formatList: [{
            realLength: 1,
            mainSpec: '默认',
            subSpecList: [{
              subSpec: '默认',
              imgUrl: '',
              price: 0,
              isSelect: true
            }]
          }],
          subProducts: [],
          areas: [],
          datePrices: [],
          basePrice: 0,
          content: {
            content: ''
          }
        }
      }
    },
    components: {
      addressSelect,
      editor
    },

    activated() {
      this.init();
      this.productId = +this.$route.query.productId || null;
      this.classifyId = +this.$route.query.classifyId || 1;
      this.setProductType(this.classifyId);
      if (this.productId) {
        this.getProduct();
      }
    },
    methods: {
      init() {
        if (this.productId) {
          this.product = {
            name: '',
            maxCouponCount: 0,
            classify: {id: 1, name: '房车'},
            images: [{}],
            formatList: [{
              realLength: 1,
              mainSpec: '默认',
              subSpecList: [{
                subSpec: '默认',
                imgUrl: '',
                price: 0,
                isSelect: true
              }]
            }],
            subProducts: [],
            areas: [],
            datePrices: [],
            basePrice: '',
            content: {
              content: ''
            }
          }
        }
      },

      setProductType(classifyId) {
        this.product.classify.id = classifyId;
        switch (classifyId) {
          case 1 :
            this.product.classify.name = '房车';
            this.productType = 2;
            break;
          case 2 :
            this.product.classify.name = '民宿';
            this.productType = 2;
            break;
          case 3 :
            this.product.classify.name = '路线';
            this.productType = 1;
            break;
        }
      },

      uploadBanner(res) {
        let index = this.bannerImgIndex;
        let list = this.product.images;
        list[index].url = res.data;
        if (list.length - 1 === index) {
          list.push({});
        }
        this.$forceUpdate();
      },

      uploadSubImg(res) {
        let index = this.subImgIndex[0];
        let subIndex = this.subImgIndex[1];
        let list = this.product.formatList;
        list[index].subSpecList[subIndex].imgUrl = res.data;
        this.$forceUpdate();
      },

      setImgIndex(type, index, subIndex) {
        if (type === 'banner') {
          this.bannerImgIndex = index;
        }

        if (type === 'sub') {
          this.subImgIndex = [index, subIndex];
        }
      },

      calcRealLength() {
        const that = this;
        let formatList = that.product.formatList;
        formatList && formatList.map(format => {
          format.realLength = 0;
          format.subSpecList.map(item => {
            if (item.isSelect) {
              format.realLength++;
            }
          });
        });
      },

      newFormat() {
        const that = this;
        let subSpecList = [];
        let format = {
          mainSpec: '默认',
          price: 0,
          subSpecList: []
        };
        let formatList = that.product.formatList;
        formatList.map(item => {
          item.subSpecList.map(sub => {
            subSpecList.push(sub.subSpec);
          });
        });
        subSpecList = [...new Set(subSpecList)];
        subSpecList.map(item => {
          format.subSpecList.push({
            subSpec: item,
            isSelect: true
          });
        });

        format.realLength = subSpecList.length;
        that.prevShowSubProduct(format, formatList.length);
      },

      prevShowSubProduct(obj, index) {
        if (obj) {
          this.formatIndex = index;
          this.format = {...obj};
          this.format.subSpecList = [];
          obj.subSpecList.map(item => {
            let temp = {...item};
            this.format.subSpecList.push(temp);
          });
          this.showSubProductModal = true;
        } else {
          this.newFormat();
        }
      },

      addSubFormat() {
        let item = {
          subSpec: '默认',
          imgUrl: '',
          price: 0,
          isSelect: true
        };
        this.format.subSpecList.push(item);
      },

      deleteSubFormat(index, subIndex) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let list = that.product.formatList;
            let subSpecList = list[index].subSpecList;
            if (list.length <= 1 && subSpecList.length <= 1) {
              that.$notify({
                title: '警告',
                message: '至少保留一个规格',
                type: 'warning'
              });
            } else {
              subSpecList.splice(subIndex, 1);
              if (!subSpecList.length) {
                list.splice(index, 1);
              }
            }
          }
        });
      },

      editMainFormat() {
        const that = this;
        let format = that.format;
        let index = that.formatIndex;
        let isRepeat = false;
        loop:
          for (let i = 0; i < format.subSpecList.length; i++) {
            let x = format.subSpecList[i];
            for (let j = i + 1; j < format.subSpecList.length; j++) {
              let y = format.subSpecList[j];
              if (x.subSpec === y.subSpec) {
                that.$notify({
                  title: '警告',
                  message: '子规格重复',
                  type: 'warning'
                });
                isRepeat = true;
                break loop;
              }
            }
          }
        if (!isRepeat) {
          that.product.formatList.splice(index, 1, format);
          this.showSubProductModal = false;
        }
      },

      deleteFormat(index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let list = that.product.formatList;
            if (list.length >= 2) {
              list.splice(index, 1);
            } else {
              that.$notify({
                title: '警告',
                message: '至少保留一个规格',
                type: 'warning'
              });
            }
          }
        });
      },

      filterProduct(product) {
        let type = this.productType;
        let data = {...product};
        data.type = type;
        data.images = [];
        data.datePrices = [];
        data.subProducts = [];
        data.basePrice = data.basePrice * 100;
        product.images.map(item => {
          if (item.url) {
            data.images.push(item);
          }
        });
        product.datePrices && product.datePrices.map(item => {
          item.price = item.price || 0;
          if (item.startDate && item.endDate) {
            let obj = {...item};
            obj.price = obj.price * 100;
            data.datePrices.push(obj);

          }
        });
        product.formatList && product.formatList.map(format => {
          format.subSpecList.map(sub => {
            let item = {
              mainSpec: format.mainSpec,
              ...sub
            };
            item.price = item.price * 100;
            data.subProducts.push(item);
          });
        });
        if (type === 1) {
          delete data.datePrices;
        } else {
          delete data.formatList;
          delete data.subProducts;
        }
        return data;
      },

      validProduct(product) {
        let isValid = true;

        if (!product.images.length) {
          isValid = false;
        }

        if (product.subProducts) {
          product.subProducts.map(item => {
            if (!item.imgUrl) {
              isValid = false;
            }
          });
        }

        if (!isValid) {
          this.$notify({
            title: '警告',
            message: '数据不完整',
            type: 'warning'
          });
        }

        return isValid;
      },

      commitProduct() {
        const that = this;
        let product = that.product;
        let classifyId = that.classifyId;
        let ajax = 'add';
        let data = that.filterProduct(product);
        let isValid = that.validProduct(data);
        if (isValid) {
          product = new Product(product);
          if (product.id) {
            ajax = 'edit';
          }
          product[ajax](data).then(() => {
            that.$router.push(`/product/list/${classifyId}`);
          });
        }
      },

      calcDelay(startDate, endDate) {
        if (startDate && endDate) {
          startDate = new Date(startDate);
          endDate = new Date(endDate);
          let delay = endDate - startDate;
          return delay / (24 * 60 * 60 * 1000);
        } else {
          return '';
        }
      },

      deletImg(index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let list = that.product.images;
            list.splice(index, 1);
            if (!list.length) {
              list.push({});
            }
          }
        });
      },

      addDatePrice() {
        this.product.datePrices.push({});
      },

      deleteDatePrice(index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let list = that.product.datePrices;
            list.splice(index, 1);
          }
        });
      },

      initProduct(product) {
        product.basePrice = (product.basePrice / 100).toFixed(2);
        product.images.push({});
        product.datePrices.map(item => {
          item.price = (item.price / 100).toFixed(2);
          item.startDate = dateFormat(item.startDate);
          item.endDate = dateFormat(item.endDate);
        });
        if (product.subProducts.length) {
          product.formatList = [];
          product.subProducts.map(item => {
            let index = -1;
            for (let i = 0; i < product.formatList.length; i++) {
              let format = product.formatList[i];
              if (format.mainSpec === item.mainSpec) {
                index = i;
                break;
              }
            }
            if (index === -1) {
              product.formatList.push({
                mainSpec: item.mainSpec,
                realLength: 1,
                subSpecList: [{
                  subSpec: item.subSpec,
                  imgUrl: item.imgUrl,
                  price: item.price / 100,
                  isSelect: item.isSelect
                }]
              });
            } else {
              product.formatList[index].realLength++;
              product.formatList[index].subSpecList.push({
                subSpec: item.subSpec,
                imgUrl: item.imgUrl,
                price: item.price / 100,
                isSelect: item.isSelect
              });
            }
          });
        }
      },

      getProduct() {
        const that = this;
        let productId = that.productId;
        let product = new Product({id: productId});
        product.getOne().then(res => {
          let item = res.data.data || {};
          that.initProduct(item);
          that.setProductType(item.classify.id);
          that.product = item;
          that.calcRealLength();
        });
      }
    }
  }
</script>

<style scoped>
  .table__wrapper {
    border: 1px solid var(--text-info);
  }

  .table__label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    background-color: var(--text-info);
    color: white;
  }

  .table__label > * {
    display: inline-block;
    flex: 1 0 15%;
    text-align: center;
    margin: 0 5px;
  }

  .table__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }

  .table__item:not(:last-of-type) {
    border-bottom: 1px solid var(--border-color);
  }

  .table__item > * {
    display: inline-block;
    flex: 1 0 15%;
    text-align: center;
    padding: 10px 0;
    margin: 10px 5px;
  }

  .table__sub-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin: 4px 0;
  }

  .table__sub-item:not(:last-of-type) {
    border-bottom: 1px solid var(--border-color);
  }

  .table__sub-item > * {
    display: inline-block;
    flex: 1 0 15%;
    text-align: center;
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

  .uploader.sub {
    width: 65px;
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

  .subImg {
    width: 65px;
    height: 65px;
    vertical-align: middle;
  }
</style>
