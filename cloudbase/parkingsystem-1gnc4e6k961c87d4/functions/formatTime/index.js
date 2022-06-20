// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }

}

  /** 工具2.1
   * 处理当前日期时间函数 获取主要是 new Date().getTime() 获取 云函数系统时间对应的时间戳 也可用Date.now()
   * 返回：相应时间戳对应的日期，并按照一定格式拼凑 2020-03-02 01:38:01
   */
  async function formatTime() {
    // var nowDate = new Date().getTime()
    //由于服务器时间直接转化无法变成我们中国时区想要的时间，还需要再增加8小时的毫秒数。小程序端可以不用增加
    //由 new Date()函数方法将时间戳对应的日期返还给变量 并将变量使用相应的方法获取各个日期单位的值
    var date =  new Date(Date.now() + 8 * 60 * 60 * 1000)  //Mon Mar 02 2020 02:58:10 GM +0000 (UTC)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  /**工具函数2.2
   * //将时分秒转化成二位数格式 2020
   */
  function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n   //第二位存在的时候，说明不用转化
  }
