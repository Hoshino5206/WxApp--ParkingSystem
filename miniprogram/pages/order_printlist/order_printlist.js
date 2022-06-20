// pages/order_printlist/order_printlist.js
// pages/transval/transval.js

const {
  default: toast
} = require("../../miniprogram_npm/@vant/weapp/toast/toast")

// 获取应用实例
const app = getApp()
const db = wx.cloud.database()
// const _ = db.command

Page({
  /**
   * 页面的初始数据
   */
  data: {
    /* 停车场名*/
    parkName: '停车场名',
    /*车牌号 */
    carNum: '车牌号',
    /*订单编号 */
    code: '20211231235959',
    /*停车时间 */
    time: '1h',
    /* 停车费*/
    consume: 10,
    /*入库时间*/
    enterTime: '2021-6-1 12:00:00',
    /*出库时间*/
    outTime: '2021-6-1 13:00:00',
    /*缴费状态 */
    PaymentStatus: false,
    /*账户余额*/
    balance: 0,
    /*会员天数*/
    monthCard: 0,
    /*会员判定 */
    member: false,
    /* 支付账号 */
    payId: '',
  },

  // 打印发票
  print_btn() {
    toast({
      message: '发票打印成功',
      position: 'bottom',
      duration: 1200,
      context: this
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      parkName: options.parkName,
      carNum: options.carNum,
      code: options.code,
      time: options.time,
      consume: options.consume,
      enterTime: options.enterTime,
      outTime: options.outTime,
    })
    if(options.PaymentStatus=='true'){
      this.setData({
        PaymentStatus: true,
      })
    }
    // 查询用户是否会员
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res=>{
        if(res.data[0].u_balance>0){
          this.setData({
            member: true
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