// pages/bindingLicense/bindingLicense.js

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
    showNewPower: false,
    KeyboardState: false,
    hasbinding: false,
    bindNumber: '',
    disabled_btn: false,
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

  // 新能源按钮-弹出虚拟键盘
  showPowerBtn() {
    this.setData({
      showNewPower: true,
      KeyboardState: true
    })
  },

  // 提交数据
  bindNumber() {
    this.setData({
      carNum: this.data.carnum.join('')
    })
    if(this.data.carnum.length <= 7) {
      db.collection('user').where({
        _openid: app.globalData.openid,
      }).update({
        data: {
          u_carNumber: this.data.carNum,
        },
        success: res=> {
          console.log('绑定车辆成功')
          toast.success({
            message: '绑定成功！',
            forbidClick: true,
            duration: 1000,
          })
          this.setData({
            disabled_btn: true,
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('user').where({
      _openid: app.globalData.openid,
    }).get({
      success: res=> {
        if(res.data[0].u_carNumber==''|| res.data[0].u_carNumber== 'undefined'){
          console.log('当前用户没有绑定车牌号' + res.data[0].u_carNumber)
          this.setData({
            hasbinding: false
          })
        }else{
          console.log('当前用户绑定的车牌号是：' + res.data[0].u_carNumber)
          this.setData({
            hasbinding: true,
            bindNumber: res.data[0].u_carNumber,
            disabled_btn: true,
          })
        }
      }
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