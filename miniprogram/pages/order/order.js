// pages/order/order.js

// 获取应用实例
const app = getApp()
const db = wx.cloud.database()
// const _ = db.command

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    openid: '',
    array: [],
    order_list: [],
  },

  // 每个订单的详细信息
  order_list(item) {
    console.log(item.currentTarget.dataset.item)
    this.setData({
      order_list: item.currentTarget.dataset.item
    })
    var currentListParkName = item.currentTarget.dataset.item.c_parkname
    var currentListNumber = item.currentTarget.dataset.item.c_number
    var currentListCode = item.currentTarget.dataset.item.c_code
    var currentListEnterTime = item.currentTarget.dataset.item.c_enterTime
    var currentListOutime = item.currentTarget.dataset.item.c_outTime
    var currentListTime = item.currentTarget.dataset.item.c_time
    var currentListConsume = item.currentTarget.dataset.item.c_consume
    var currentListPaymentStatus = item.currentTarget.dataset.item.c_paymentStatus
    wx.navigateTo({
      url: '../order_printlist/order_printlist?parkName=' + currentListParkName + '&carNum=' + currentListNumber + '&code=' + currentListCode + '&time=' + currentListTime + '&enterTime=' + currentListEnterTime + '&outTime=' + currentListOutime + '&consume=' + currentListConsume + '&PaymentStatus=' + currentListPaymentStatus,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.setData({
      hasUserInfo: app.globalData.hasUserInfo,
      openid: app.globalData.openid,
    })
    if(this.data.hasUserInfo==true){
      db.collection('car').where({
        // 获取用户已经支付的的订单
        c_payOpenid: this.data.openid,
        c_paymentStatus: true,
      }).get({
        success: res=>{
          console.log(res.data)
          this.setData({
            array: res.data
          })
        }
      })
    }
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