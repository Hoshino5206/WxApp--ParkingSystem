// pages/index/index.js

const { default: toast } = require("../../miniprogram_npm/@vant/weapp/toast/toast")

// 获取应用实例
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({
  /**
   * 页面的初始数据
   */
  data: {
    parkingArray: [],
    parkName: '路边停车场',
    index: 0,
    imgUrls: [
      '/images/parking1.jpg',
      '/images/parking2.jpg',
      '/images/parking3.jpg'
    ],
    // 滑块视图：indicatorDots显示小圆点，autoplay自动播放，interval自动切换时间间隔，duration滑动动画时长
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    // 省份输入
    provinces: [
      ['京', '沪', '粤', '津', '冀', '晋', '蒙', '辽', '吉', '黑'],
      ['苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘'],
      ['桂', '琼', '渝', '川', '贵', '云', '藏'],
      ['陕', '甘', '青', '宁', '新'],
    ],
    // 车牌输入
    numbers: [
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L", "港"],
      ["Z", "X", "C", "V", "B", "N", "M", "澳"]
    ],
    carnum: [],
    carNum: '',
    carType: ['切换新能源汽车', '切换普通汽车'],
    showNewPower: false,
    KeyboardState: false,
    showOneButtonDialog: false,
    oneButton: [{
      text: '确定'
    }]
  },

  // 停车场选项列表
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      parkName: this.data.parkingArray[e.detail.value].p_name
    })
  },

  // 扫码功能
  saoma() {
    // 允许从相机和相册扫码
    wx.scanCode({
      success(res) {
        console.log(res)
      }
    })
  },

  // 打开虚拟键盘
  openKeyboard() {
    this.setData({
      KeyboardState: true
    })
  },

  // 关闭虚拟键盘
  closeKeyboard() {
    this.setData({
      KeyboardState: false
    })
  },

  // 绑定输入号码
  bindChoose(e) {
    if (!this.data.carnum[6] || this.data.showNewPower) {
      var arr = [];
      arr[0] = e.target.dataset.val;
      this.data.carnum = this.data.carnum.concat(arr)
      this.setData({
        carnum: this.data.carnum
      })
    }
  },

  // 清除按钮
  bindDelChoose() {
    if (this.data.carnum.length != 0) {
      this.data.carnum.splice(this.data.carnum.length - 1, 1);
      this.setData({
        carnum: this.data.carnum
      })
    }
  },

  // 新能源切换按钮-添加输入框
  showPowerBtn() {
    if (this.data.showNewPower == true) {
      this.setData({
        showNewPower: false
      })
      return
    }
    if (this.data.showNewPower == false) {
      this.setData({
        showNewPower: true
      })
    }
  },

  // 查询错误时-显示对话提示框
  tapDialogButton(e) {
    this.setData({
      showOneButtonDialog: false
    })
  },

  // 查询按钮
  submitNumber() {
    this.setData({
      carNum: this.data.carnum.join('')
    })
    if (this.data.carnum.length >= 7) {
      toast.loading({
        message: '正在努力查询~~~',
        forbidClick: true,
        duration: 1000,
      })
      // setTimeout(() => {
      // }, 1100);
      db.collection('car').where({
        c_number: this.data.carNum,
        c_parkname: this.data.parkName,
        c_paymentStatus: false
      }).get({
        // promise风格
        success: res => {
          console.log(res.data)
          if (res.data.length >= 1) {
            console.log('查询成功')
            wx.navigateTo({
              url: '../order_pay/order_pay?c_number=' + this.data.carNum + '&c_parkname=' + this.data.parkName,
            })
          } else {
            console.log('查询失败')
            setTimeout(() => {
              this.setData({
                showOneButtonDialog: true,
              })
            }, 600);
          }
        },
      })
    } else {
      this.setData({
        showOneButtonDialog: true
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 下拉列表：加载数据库
    db.collection('parking').get().then(res => {
      this.setData({
        parkingArray: res.data
      })
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})