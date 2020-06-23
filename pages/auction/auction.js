import util from '../../utils/util.js';
var page = 1;
<<<<<<< HEAD
var limit = 50;
=======
var limit = 8;
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
var hasMore = true;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    KeyWord: "",
    selData: {},
    ppData: [],
    pmhData: [],
    stateList: [],
    companyList: [],
    endYear: '',
    type1Data: {
      pai_city: "", //地区
      au_company: '', //公司
      years: "", //年份 
      is_pass: "", //状态 
      sort: "",
    },
    auctionType: 0,
    showScreen: false, //筛选的显示隐藏,
    showCity: false, //地区显示隐藏
    indicator: 0,
    yearData: [],
    bannerList: []
  },
  changeKeyWord(e) {
    this.setData({
      KeyWord: e.detail.value
    });
  },
  errorImg(e) {
    console.log('dddd');
    var target_ = e.currentTarget.dataset;
    var obj = this.data.pmhData;
    obj[target_.i1].bean[target_.i2].zhuanchang[target_.i3].logo = '/images/showGood.png';
    this.setData({
      pmhData: obj
    });


  },
  enterInp(e) {
    var keyWordTxt = e.detail.value;
    if (keyWordTxt.trim() == '') {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none'
      });
      return false;
    }
    var that = this;
    wx.navigateTo({
      url: '../auctionSearch/auctionSearch?keyword=' + keyWordTxt
    });
    this.setData({
      KeyWord: ''
    });

  },
  imgErro(e) {
    console.log(e)
    var index_ = e.currentTarget.dataset.index;
    var data_ = this.data[e.currentTarget.dataset.form];
    data_[index_].logo = '/images/showGood.png';
    this.setData({
      [e.currentTarget.dataset.form]: data_
    });
  },
  togAuction(e) {
    this.setData({
      auctionType: e.currentTarget.dataset.type,
      type1Data: {
        pai_city: "", //地区
        au_company: '', //公司
        years: "", //年份 
        is_pass: "", //状态 
        sort: "",
      },
    });
    this.togInitData();
  },
  togInitData() {
    if (this.data.auctionType == 0) {
      this.initPmhData();
    } else {
      this.initPpData();
    }

  },

  showCity() {
    this.setData({
      showCity: true
    });
  },
  cloaseCity() {
    this.setData({
      showCity: false
    });
  },
  closeRange() {
    this.setData({
      showScreen: false
    });
  },

  screenBtn() {
    this.setData({
      showScreen: true
    });
  },
  swiperChange(e) {
    this.setData({
      indicator: e.detail.current
    });
  },
  getCompany() {
    var that = this;
    
    util.request('/goods/v2.home/HuiCompany').then(res => {
      console.log(res);
      if (res.code == 0) {
<<<<<<< HEAD
        res.data.list.unshift({
          id:'',
          name:'全部'
        });
=======
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
        that.setData({
          companyList: res.data.list
        });
      }
    });
  },
  getSelData() {
    var that = this;
    util.request('/goods/v1.pages/newSearchData').then(res => {
      console.log(res.data);
      res.data.company.unshift({
        label: '全部',
        value: ""
      });
      res.data.is_pass.unshift({
        label: '全部',
        value: ""
      });
      res.data.paipin_addr.unshift({
        name: '全部',
      });
      console.log(res.data);
      if (res.code == 0) {
        that.setData({
          selData: res.data
        });
      }
    });
  },
  pickerChange(e) {
    console.log(e)
    var obj = this.data.type1Data;
    var key_ = e.currentTarget.dataset.key;
    if (key_ == 'years') {
      obj[key_] = this.data.yearData[e.detail.value];
    } else if (key_ == 'pai_city') {
      obj[key_] = this.data.selData.paipin_addr[e.detail.value].name;
    } else if (key_ == 'au_company') {
      obj[key_] = this.data.companyList[e.detail.value].id;
    } else if (key_ == 'is_pass') {
      obj[key_] = this.data.selData.is_pass[e.detail.value].value;
    }
    console.log(obj);


    this.setData({
      type1Data: obj
    });
    this.togInitData();
  },
  yearSort() {
    var obj = this.data.type1Data;
    if (obj.sort == '') {
      obj.sort = 'desc';
    } else if (obj.sort == 'desc') {
      obj.sort = 'asc';
    } else if (obj.sort == 'asc') {
      obj.sort = 'desc';
    }

    this.setData({
      type1Data: obj
    });
    this.togInitData();

  },
  initPmhData() {
    wx.showLoading({
      title: '加载中',
    });
    var data = this.data.type1Data;
    page = 1;
    var that = this;

    if (data.pai_city == '全部') {
      data.pai_city = ''
    }
    if (data.years == '全部') {
      data.years = ''

    }
    data.page = page;
    data.limit = limit;

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });

<<<<<<< HEAD
    util.request('/goods/v2.home/upgradePai', data, 'POST').then(res => {
=======
    util.request('/goods/v2.home/newPaiMaiHui', data, 'POST').then(res => {
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
      wx.hideLoading({});
      hasMore = true;

      if (res.code == 0) {
        res.data.list.map((item, index) => {
<<<<<<< HEAD
          item.pass_time = util.formatTime6(new Date(item.pass_time.replace(/-/g, '/')).getTime());
          item.bean.map((item2) => {
            item2.pass_time = util.formatTime6(new Date(item2.pass_time.replace(/-/g, '/')).getTime(), '/');
=======
          item.pass_time = util.formatTime2(new Date(item.pass_time.replace(/-/g, '/')).getTime());
          item.bean.map((item2) => {
            item2.pass_time = util.formatTime2(new Date(item2.pass_time.replace(/-/g, '/')).getTime(), '/');
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
            item2.zhuanchang.map((item3, index3) => {
              item3.logo = item3.logo.replace(/\s/g, '%20');
              item3.logo = item3.logo.replace(/'/g, '%27');
            });
          });
        });
<<<<<<< HEAD
        if (res.data.list.length ==0) {
=======
        if (res.data.list.length != limit) {
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
          hasMore = false;
        }
        that.setData({
          pmhData: res.data.list
        });
      }
    });
  },
  morePmhData() {
    wx.showLoading({
      title: '加载更多',
    });
    var data = this.data.type1Data;
    if (data.pai_city == '全部') {
      data.pai_city = ''
    }
    if (data.years == '全部') {
      data.years = ''

    }
    var that = this;
    page++;
    data.page = page;
    data.limit = limit;
<<<<<<< HEAD
    util.request('/goods/v2.home/upgradePai', data, 'POST').then(res => {
      wx.hideLoading({});
      if (res.code == 0) {
        res.data.list.map((item, index) => {
          item.pass_time = util.formatTime6(new Date(item.pass_time.replace(/-/g, '/')).getTime());
          item.bean.map((item2) => {
            item2.pass_time = util.formatTime6(new Date(item2.pass_time.replace(/-/g, '/')).getTime(), '/');
=======
    util.request('/goods/v2.home/newPaiMaiHui', data, 'POST').then(res => {
      wx.hideLoading({});
      if (res.code == 0) {
        res.data.list.map((item, index) => {
          item.pass_time = util.formatTime2(new Date(item.pass_time.replace(/-/g, '/')).getTime());
          item.bean.map((item2) => {
            item2.pass_time = util.formatTime2(new Date(item2.pass_time.replace(/-/g, '/')).getTime(), '/');
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
            item2.zhuanchang.map((item3, index3) => {
              item3.logo = item3.logo.replace(/\s/g, '%20');
              item3.logo = item3.logo.replace(/'/g, '%27');
            });
          });
        });
<<<<<<< HEAD
        if (res.data.list.length ==0) {
=======
        if (res.data.list.length != limit) {
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
          hasMore = false;
        }
        that.setData({
          pmhData: that.data.pmhData.concat(res.data.list)
        });
      }
    });
  },
  initPpData() {
    wx.showLoading({
      title: '加载中',
    });
    var data = this.data.type1Data;
    hasMore = true;
    page = 1;
    var that = this;
    data.page = page;
    data.limit = limit;

    util.request('/doc/v1.pages/getGoodsList', data, 'POST').then(res => {
      console.log(res)
      wx.hideLoading();
      if (res.code == 0) {
        res.data.list.map((item, index) => {
          item.auction_time = util.formatTime2(new Date(item.auction_time.replace(/-/g, '/')).getTime(), '/');
          var price_ = item.transaction_price;
          if (!/[0-9]/.test(price_)) {
            item.transaction_price = '流拍'
          }
        });
        if (res.data.list.length != limit) {
          hasMore = false;
        }
        that.setData({
          ppData: res.data.list
        });
      }
    });
  },
  morePpData() {
    wx.showLoading({
      title: '加载中',
    });
    var data = this.data.type1Data;
    var that = this;
    page++;
    data.page = page;
    data.limit = limit;


    util.request('/doc/v1.pages/getGoodsList', data, 'POST').then(res => {
      console.log(res)
      wx.hideLoading();
      if (res.code == 0) {
        res.data.list.map((item, index) => {
          item.auction_time = util.formatTime2(new Date(item.auction_time.replace(/-/g, '/')).getTime(), '/');
          var price_ = item.transaction_price;
          if (!/[0-9]/.test(price_)) {
            item.transaction_price = '流拍'
          }
        });


        if (res.data.list.length != limit) {
          hasMore = false;
        }
        that.setData({
          ppData: that.data.ppData.concat(res.data.list)
        });
      }
    });
  },
  getBanner() {
    var that = this;
    util.request('/setting/v1.Set/goodsBanner', {}, 'POST').then(res => {
      console.log(res);
      if (res.code == 0) {

        res.data.list.map((item, index) => {
          var wpUrl = '';
          if (item.goods_url_type == 1) {
            wpUrl = '/auction/pages/auctionDetail/auctionDetail?id=' + item.path_id
          } else {
            wpUrl = '/auction/pages/lotDetail/lotDetail?id=' + item.path_id
          }
          item.wpUrl = wpUrl;
        });
        that.setData({
          bannerList: res.data.list
        });
      }
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showTabBar();
    page = 1;
<<<<<<< HEAD
    limit = 50;
=======
    limit = 8;
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe
    hasMore = true;
    this.setData({
      endYear: new Date().getFullYear()
    });
    // 获取拍卖公司
    this.getCompany();
    //获取拍卖会数据
    this.initPmhData();
    // 筛选条件
    this.getSelData();
    // 初始化 年分
    var nowYear = new Date().getFullYear();
    var yearArr = []
    for (var i = 1950; i <= nowYear; i++) {
      yearArr.push(i);
    };
    yearArr = yearArr.sort(function (a, b) {
      return b - a
    });
    yearArr.unshift('全部');
    this.setData({
      yearData: yearArr
    });

    this.getBanner();


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
<<<<<<< HEAD
    wx.showTabBar();
=======
>>>>>>> ea5a64c463e44ebad106991aa9c0ec0b860225fe

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (hasMore) {
      if (that.data.auctionType == 0) {
        that.morePmhData();
      } else {
        that.morePpData();
      }
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})