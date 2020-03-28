
 function  wordsWrap(ctx, name, nameWidth, maxWidth, startX, srartY, wordsHight) {
    let lineWidth = 0;
    let lastSubStrIndex = 0;
    for (let i = 0; i < name.length; i++) {
      lineWidth += ctx.measureText(name[i]).width;
      if (lineWidth > maxWidth) {
        ctx.fillText(name.substring(lastSubStrIndex, i), startX, srartY);
        srartY += wordsHight;
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == name.length - 1) {
        ctx.fillText(name.substring(lastSubStrIndex, i + 1), startX, srartY);
      }
    }
  }


Page({

  /**
   * 页面的初始数据
   */
  data: {
    w:0,
    h:0
  },
  lv(imgPx,sheWidth=540){

    var lv = (imgPx * this.data.w) /sheWidth;
    return lv
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        var that=this;
        wx.getSystemInfo({
          success: function(res) {
              that.setData({
                w: res.screenWidth,
                h: res.screenHeight
              })

          },
        });
    

    const canvasCtx = wx.createCanvasContext('canvas_');

    // 绘制背景
    canvasCtx.setFillStyle('red');
    canvasCtx.fillRect(0, 0, this.data.sysWidth, this.data.sysHeight);


    canvasCtx.setFontSize(18);//字体大小
    canvasCtx.setFillStyle('black');//字体颜色
    canvasCtx.setTextAlign('left');//字体对齐方式
    canvasCtx.fillText('这是商品标题', 0, 30);//20是 x 轴的坐标，30 是 y 轴的坐标，以此确定字的位置

    //绘制图片
    canvasCtx.drawImage('./a.jpg', (this.data.w / 2) - (this.lv(362) / 2), 100, this.lv(362), this.lv(225));


    //文字换行
    // wordsWrap(ctx, name, nameWidth, maxWidth, startX, srartY, wordsHight)
    // this.wordsWrap(ctx, name, nameWidth, 252, 16, 252, 16);  
    wordsWrap(canvasCtx, 'namenamenamenamenamenamennnnnnnn', 30, this.data.w, 16, 252, 16)

//绘制一个圆型头像
    canvasCtx.save()
    canvasCtx.beginPath();
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'red';
    canvasCtx.arc(60, 400, 50, 0, Math.PI * 2)
    canvasCtx.stroke()
    canvasCtx.clip()
    canvasCtx.drawImage('./a.jpg', 60-50, 400-50, 100, 100);
    canvasCtx.restore();
    canvasCtx.draw();
    
    setTimeout(() => {
      // 将生成的canvas图片，转为真实图片
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'canvas_',
        success: function (res) {

          console.log(res.tempFilePath)
          wx.navigateTo({
            url: '../logs/logs?img=' + res.tempFilePath,
          })
                        },
        fail: function (res) {
        }
      })
    }, 500)
    

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