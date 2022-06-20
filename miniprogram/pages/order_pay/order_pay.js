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
    /*车牌号*/
    carNum: '车牌号',
    /*订单编号*/
    code: '20211231235959',
    /*停车时间*/
    time: '1h',
    /*停车费*/
    consume: 10,
    /*入库时间*/
    enterTime: '2021-6-1 12:00:00',
    /*出库时间*/
    outTime: '2021-6-1 13:00:00',
    /*出入库状态 */
    state: false,
    /*缴费状态 */
    PaymentStatus: false,
    /*账户余额*/
    balance: 0,
    /*会员天数*/
    monthCard: 0,
    /*会员判定*/
    member: false,
    /*支付账号*/
    payId: '',
  },

  // 支付按钮
  pay_btn() {
    if (app.globalData.hasUserInfo==false) {
      console.log('未登录，无法支付！')
      toast({
        message: '未登录，无法支付！',
        position: 'bottom',
        duration: 800,
        context: this,
      })
    } else {
      // 检查账户余额是否足够
      if(this.data.balance < this.data.consume) {
        toast({
          message: '账户余额不足，支付失败！',
          position: 'bottom',
          duration: 1200,
          context: this,
        })
      }else{
        // 账户余额足够支付
        // 更新数据库-车辆支付信息
        db.collection('car').where({
          c_code: this.data.code,
        }).update({
          data: {
            c_paymentStatus: true,
            c_payOpenid: app.globalData.openid,
          },
          success: res => {
            console.log('支付成功')
            this.setData({
              PaymentStatus: true
            })
            console.log('PaymentStatus:' + this.data.PaymentStatus)
            toast({
              message: '支付成功',
              position: 'bottom',
              duration: 1200,
              context: this,
            })
          }
        });

        // 更新用户余额
        if(this.data.monthCard>0){
          db.collection('user').where({
            _openid: app.globalData.openid,
          }).update({
            data: {
              u_balance: this.data.balance - this.data.consume*0.8
            },
            success: res=> {
              console.log('用户余额更新成功')
            }
          })
        }else{
          db.collection('user').where({
            _openid: app.globalData.openid,
          }).update({
            data: {
              u_balance: this.data.balance - this.data.consume
            },
            success: res=> {
              console.log('用户余额更新成功')
            }
          })
        }

      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.c_parkname + ' , ' + options.c_number)
    this.setData({
      parkName: options.c_parkname,
      carNum: options.c_number
    })
    
    // 查询停车订单
    db.collection('car').where({
      c_number: options.c_number,
      c_parkname: options.c_parkname,
      c_paymentStatus: false
    }).get({
      success: res => {
        console.log(res.data[0])
        this.setData({
          code: res.data[0].c_code,
          enterTime: res.data[0].c_enterTime,
          outTime: res.data[0].c_outTime,
          time: res.data[0].c_time,
          consume: res.data[0].c_consume,
          PaymentStatus: res.data[0].c_paymentStatus,
        })
      }
    })

    // 查询当前用户
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        if(res.data.length == 0) {
          console.log('未登录状态')
        }else{
          console.log(res.data)
          console.log('当前用户的openid是' + res.data[0]._openid)
          this.setData({
            monthCard: res.data[0].u_monthCard,
            balance: res.data[0].u_balance,
          })
          if(this.data.monthCard > 0) {
            this.setData({
              member: true
            })
          }
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