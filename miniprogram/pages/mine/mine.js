// pages/mine/mine.js

const {
  default: toast
} = require("../../miniprogram_npm/@vant/weapp/toast/toast")

const app = getApp()
const db = wx.cloud.database()
// const _ = db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    openid: '',
  },

  // 授权获取用户信息
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.hasUserInfo = true
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
        wx.login({
          success: res => {
            if (res.code) {
              console.log('code:' + res.code)
              // 发起网络请求,，通过code值获取用户在微信开放平台帐号下的唯一标识UnionID和会话密钥session_key
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                data: {
                  appid: 'wx2cb627f815c97399',
                  // 密钥
                  secret: '8980b8d903a528273532215e6b9c31eb',
                  js_code: res.code,
                  grant_type: 'authorization_code',
                },
                method: 'GET',
                // 成功时返回的函数
                success: res => {
                  console.log('返回的用户Object:')
                  console.log(res.data)
                  // var openid = res.data.openid
                  this.setData({
                    openid: res.data.openid
                  })
                  // 把用户唯一表示openid存到app.js的全局变量中
                  app.globalData.openid = res.data.openid
                  app.globalData.session_key = res.data.session_key
                  // 登录之后返回的openid
                  console.log('用户的openid:' + this.data.openid)
                  // 判断openid是否为空值
                  if (this.data.openid != null & this.data.openid != undefined) {
                    wx.getUserInfo({
                      success: function (res) {
                        console.log('用户授权成功')
                      },
                      fail: function (res) {
                        console.log('用户拒绝授权')
                      }
                    })
                  } else {
                    console.log('获取用户openid失败')
                  }
                  // 判断用户是否在数据库中注册
                  db.collection('user').where({
                    _openid: this.data.u_id
                  }).get({
                    success: res=> {
                      // 不存在时，调用用户注册函数
                      if(res.data.length ==0) {
                        db.collection('user').add({
                          data: {
                            u_name: this.data.userInfo.nickName,
                            u_monthCard: 0,
                            u_balance: 0,
                            u_carNumber: '',
                            u_phoneNumber: '',
                            u_power: false,
                          },
                          success: res=>{
                            // 初始化数据
                            console.log('用户注册成功--正在用户初始化数据')
                            app.globalData.monthcard = 0
                            app.globalData.balance = 0
                          }
                        })
                      }
                    }
                  })
                },
                // 失败时返回的函数
                fail: function (res) {
                  console.log('获取用户openid失败')
                  console.log(error)
                }
              })
              toast({
                message: '登录成功',
                position: 'bottom',
                duration: 1200,
                context: this
              })
              console.log('登录成功')
            } 
            else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })
  },

  // 授权获取用户信息
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 会员功能
  menber_url() {
    if (this.data.hasUserInfo == false) {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: (res) => {
          wx.navigateBack({
            url: '../mine/mine',
          })
          toast({
            message: '请先登录再操作',
            position: 'bottom',
            duration: 1200,
            context: this,
          })
        }
      })
    }
  },

  // 优惠券功能
  coupon_url() {
    toast({
      message: '正在努力开发中！！',
      position: 'bottom',
      duration: 1200,
      context: this,
    })
  },

  // 绑定车牌号功能
  bangdingLicense_url() {
    if (this.data.hasUserInfo == false) {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: (res) => {
          console.log(res.data)
          wx.navigateBack({
            url: '../mine/mine',
          })
          toast({
            message: '请先登录再操作',
            position: 'bottom',
            duration: 1200,
            context: this,
          })
        }
      })
    }
  },

  // 意见反馈功能
  feedback_url() {
    if(!this.data.hasUserInfo){
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: (res) => {
          wx.navigateBack({
            url: '../mine/mine',
          })
          toast({
            message: '请先登录再操作',
            position: 'bottom',
            duration: 1200,
            context: this,
          })
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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