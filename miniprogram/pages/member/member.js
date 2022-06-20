// pages/member/member.js

const { default: toast } = require("../../miniprogram_npm/@vant/weapp/toast/toast")

const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 月卡数据
    monthcard: 0,
    balance: 500,
    //三个按钮
    buttons: [
      { id: -28, 
        name: '28元/月' ,
        checked: false,
      }, 
      { id: -68, 
        name: '68元/季',
        checked: false,
      },
      { id: -268, 
        name: '268元/年',
        checked: false,
      }],
    // 充值天数
    payDay: 0,
    // 充值余额
    payMoney: 0,
    showOneButtonDialog: false,
    oneButton: [{
      text: '确定'
    }]
  },

  // 充值单选按钮
  radioButtonTap: function (e) {
    let id = e.currentTarget.dataset.id
    console.log('当前选择的充值按钮id为：' + id)
    for (let i = 0; i < this.data.buttons.length; i++) {
      if (this.data.buttons[i].id == id) {
        // 当前点击的位置为true即选中
        this.data.buttons[i].checked = true;
      }
      else {
        // 其他的位置为false
        this.data.buttons[i].checked = false;
      }
    }
    this.setData({
      payMoney: id,
      buttons: this.data.buttons,
    })
    if(this.data.payMoney==-28){
      this.setData({
        payDay: 31
      })
    }
    if(this.data.payMoney==-68){
      this.setData({
        payDay: 92
      })
    }
    if(this.data.payMoney==-268){
      this.setData({
        payDay: 366
      })
    }
  },

  // 确认充值按钮
  submit_btn(){
    console.log(this.data.buttons)
    // 判断是否有充值套餐按钮被选择
    if(this.data.buttons[0].checked==false&&this.data.buttons[1].checked==false&&this.data.buttons[2].checked==false){
      this.setData({
        showOneButtonDialog: true
      })
    }else{
      // 余额大于充值套餐费用
      if(this.data.balance + this.data.payMoney >= 0){
        db.collection('user').where({
          _openid: app.globalData.openid
        }).update({
          data: {
            u_monthCard: _.inc(this.data.payDay),
            u_balance: _.inc(this.data.payMoney),
          },
          success: res => {
            this.setData({
              monthcard: this.data.monthcard + this.data.payDay,
              balance: this.data.balance + this.data.payMoney,
            })
            console.log('---月卡套餐购买成功---')
            toast({
              type: 'success',
              message: '月卡购买成功',
              mask: true,
              forbidClick: true,
              onClose: () => {
              },
            })
          }
        })
      }else{
        console.log('余额不足，请先充值')
        toast({
          type: 'fail',
          message: '余额不足，购买失败',
          mask: true,
          forbidClick: true,
          context: this,
          onClose: () => {
          },
        })
      }
    }
  },

  // 没有选择充值套餐-提示
  tapDialogButton(e) {
    this.setData({
      showOneButtonDialog: false
    })
  },

  // 返回按钮
  cancel_btn(){
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   this.data.buttons[0].checked = true
  //   this.setData({
  //     buttons: this.data.buttons,
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res=>{
        console.log('当前用户数据加载成功')
        console.log(res)
        this.setData({
          monthcard: res.data[0].u_monthCard,
          balance: res.data[0].u_balance,
        })
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