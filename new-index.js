//自定义监听函数
var EventCenter = {
	on: function(type, handler) {
		$(document).on(type, handler)
	},
	fire: function(type, data) {
		$(document).trigger(type, data)
	}
}

var footer = {
  init: function() {
		this.$container = $('footer')
		this.$pannel = this.$container.find('.list')
		this.$ul = this.$container.find('ul')
		this.$leftBtn = this.$container.find('.fa-chevron-left')
		this.$rightBtn = this.$container.find('.fa-chevron-right')
		this.isEnd = false
		this.isStart = true
		this.isAnimate = false

		this.$mobileContain = $('.mobile')
    this.bind()
  },
  bind: function() {	
		var _this = this
		this.getData(function() {
			this.render()
		})
		//菜单向左滚动
		this.$leftBtn.on('click',function() {
			if(_this.isAnimate) return
			var item = _this.$ul.find('li').outerWidth(true)
			var count = Math.floor(_this.$pannel.width()/item)
			if(!_this.isStart) {
				_this.isAnimate = true
				_this.$ul.animate({
					left: '+=' + count*item
				},400,function() {
					_this.isAnimate = false 
					_this.isEnd = false
					if(parseFloat(_this.$ul.css('left')) >= 0) {
						_this.isStart = true
					}
				})
			}
		})
		//菜单向右滚动
		this.$rightBtn.on('click',function() {
			if(_this.isAnimate) return
			var item = _this.$ul.find('li').outerWidth(true)
			var count = Math.floor(_this.$pannel.width()/item)
			if(!_this.isEnd) {
				_this.isAnimate = true
				_this.$ul.animate({
					left: '-=' + count*item
				},400,function() {
					_this.isAnimate = false
					_this.isStart = false
					if(parseFloat(_this.$pannel.width()) - parseFloat(_this.$ul.css('left')) >= parseFloat(_this.$ul.width())) {
						_this.isEnd = true
					}
				})
			}
			
		})
		//点击菜单
		this.$ul.on('click','li',function() {
			$('.list-name').text($(this).text())
			EventCenter.fire('select-albumn',{
				channelId: $(this).attr('channel-id'),
				channelName: $(this).attr('channel-name')
			})
		})
		//菜单特效
		this.$container.on('mouseenter',function() {
			_this.$leftBtn.css('opacity','0.3')
			_this.$rightBtn.css('opacity','0.3')
		})
		this.$container.on('mouseleave',function() {
			_this.$leftBtn.css('opacity','0')
			_this.$rightBtn.css('opacity','0')
		})
		//mobile
		this.$mobileContain.find('.menu ul').on('click','li',function() {
			EventCenter.fire('select-albumn',{
				channelId: $(this).attr('channel-id'),
				channelName: $(this).attr('channel-name')
			})
		})
	}, //获取列表
	getData: function() {
		var _this = this
		$.ajax({
			url: '//jirenguapi.applinzi.com/fm/getChannels.php',
			method: 'GET',
			dataType: 'JSONP'
		}).done(function(callback) {
			console.log(callback)
			_this.render(callback.channels)
		}).fail(function() {
			console.log('Error ...')
		})
	}, //渲染列表
	render: function(channels) {
		//pc
		var html = ''
		channels.forEach(function(channel) {
			html += '<li channel-id='+channel.channel_id+' channel-name='+channel.name+'>'
			+' <div class="item" style="background-image:url('+channel.cover_small+')"></div> '
			+channel.name
		+' </li>'
		})
		this.$ul.html(html)
		//mobile
		var mobileHtml = ''
		console.log(mobileHtml)
		channels.forEach(function(channel) {
			mobileHtml += '<li channel-id='+channel.channel_id+' channel-name='+channel.name+'>'
			+channel.name
		+' </li>'
		})
		console.log(mobileHtml)
		this.$mobileContain.find('.menu ul').html(mobileHtml)

		this.setStyle()
	}, //设置列表样式
	setStyle: function() {
		var length = this.$ul.find('li').length
		var outWidht = this.$ul.find('li').outerWidth(true)
		this.$ul.css({
			width: length * outWidht + 'px'
		})
	}
}

var main = {
	init: function() {
		this.$contain = $('.active-state .main')
		this.$title = this.$contain.find('.title')
		this.$singer = this.$contain.find('.singer')
		this.$bar = this.$contain.find('.PB-all')
		this.$lyricPannel = $('.stationary-state .lyric')
		this.$volumePannel = this.$contain.find('.volume')
		this.lyricPC = []
		this.lyricMobile = []
		this.$song = {}
		this.audio = new Audio()
		this.audio.autoplay = true

		this.$mobileContain = $('.mobile')
		this.bind()
	},
	bind: function() {
		var _this = this
		EventCenter.on('select-albumn',function(e, channelObj) {
			_this.channelId = channelObj.channelId
			_this.channelName = channelObj.channelName
			_this.getData()
		})
		//播放停止
		this.$contain.find('.stop').on('click',function() {
			var $btn = $(this).find('.fa')
			if($btn.hasClass('fa-pause')){
				$btn.removeClass('fa-pause').addClass('fa-play')
				_this.audio.pause()
			}else {
				$btn.removeClass('fa-play').addClass('fa-pause')
				_this.audio.play()
			}
			})
			//下一曲
			this.$contain.find('.next-song').on('click',function() {
				_this.getData()
		})
		//按钮切换以及移动端动画播放暂停
		this.audio.addEventListener('play',function() {
			_this.$mobileContain.find('.disc').css('animation-play-state','running')
			_this.$mobileContain.find('.play').find('.iconfont').addClass('icon-pause').removeClass('icon-play')
			_this.clock = setInterval(function() {
				_this.progress()
			},1000)
		})
		this.audio.addEventListener('pause',function() {
			_this.$mobileContain.find('.disc').css('animation-play-state','paused')
			_this.$mobileContain.find('.play').find('.iconfont').addClass('icon-play').removeClass('icon-pause')
			clearInterval(_this.clock)
		})
		//音乐结束
		this.audio.onended = function() {
			console.log('Ended ...')
			_this.getData()
		}
		//初始获取随机音乐
		$(document).ready(_this.getData())
		//点击进度条
		this.$bar.on('click',function(e) {
			var parent = e.offsetX / _this.$bar.width()
			_this.audio.currentTime = _this.audio.duration * parent
		})
		//音量特效
		this.$contain.find('.voice').on('mouseenter',function() {
			_this.$volumePannel.removeClass('active')
		})
		this.$contain.find('.voice').on('mouseleave',function() {
			_this.$volumePannel.addClass('active')
		})
		this.volume()
	}, //获取音乐数据
	getData: function(callback) {
		var _this = this
		$.ajax({
			url: '//jirenguapi.applinzi.com/fm/getSong.php',
			data: {channel: this.channelId},
			method: 'GET',
			dataType: 'JSONP'
		}).done(function(callback) {
			_this.$song = callback.song[0]
			console.log(_this.$song)
			_this.render(_this.$song)
			_this.getLyric()
		}).fail(function() {
			console.log('Error ...')
		})
	}, //获取歌词
	getLyric: function() {
		var _this = this
		$.getJSON('//jirenguapi.applinzi.com/fm/getLyric.php',{sid: _this.$song.sid})
		.done(function(ret) {
			console.log(ret)
			_this.$mobileContain.find('.lyrics').find('ul').empty()
			_this.lyrics(ret)
			mobile_lyric.init()
		})
	}, //渲染背景图、标题及歌手
	render: function(song) {
		//pc 
		$('.bg').css('background-image','url('+song.picture+')')
		this.$title.text(song.title)
		this.$contain.find('.music-img').css('background-image','url('+song.picture+')')
		$('.img').css('background-image','url('+song.picture+')')
		this.$singer.text(song.artist)
		this.audio.src = song.url
		$('.stop').find('.fa').removeClass('fa-play').addClass('fa-pause')
		//mobile 
		this.$mobileContain.find('.background').css('background-image','url('+song.picture+')')
		this.$mobileContain.find('.img-music').css('background-image','url('+song.picture+')')
		this.$mobileContain.find('.info-title').text(song.title)
		this.$mobileContain.find('.info-singer').text(song.artist)
	}, //解析歌词
	lyrics: function(ret) {
		var _this = this
		var lyric = ret.lyric
		this.lyricMobile = []
		this.lyricPC =[]
		lyric.split('\n').forEach(function(line) {
				var times = line.match(/\d{2}:\d{2}/g)
				var str = line.replace(/\[.+?\]/g,'')
				if(Array.isArray(times)) {
						times.forEach(function(time) {
								_this.lyricPC[time] = str
								_this.lyricMobile.push([time,str])
						})
				}
		})
		
		_this.progress()
	}, //进度条及歌词设置
	progress: function() {
		var _this = this
		//pc
		this.$contain.find('.PB-now').css('width',(this.audio.currentTime/this.audio.duration)*100 + '%')
		$('.bar-now').css('width',(this.audio.currentTime/this.audio.duration)*100 + '%')
		var second = Math.floor(this.audio.currentTime%60) + ''
		second = second.length ===2?second:'0'+second
		var min = Math.floor(this.audio.currentTime/60)
		var line = this.lyricPC['0'+ min +':'+second]
		if(line) {
			this.$lyricPannel.text(line)
		}
		//mobile
		this.$mobileContain.find('.now-bar').css('width',this.audio.currentTime/this.audio.duration*100 + '%')
		var html = ''
		this.lyricMobile.forEach(function(line) {	
			html += '<li data-time='+line[0]+'>'+line[1]+'</li>'
		})
		if(this.lyricMobile.length <= 2) {
			_this.$mobileContain.find('.lyrics').find('ul').html(html)
		} else {
			_this.$mobileContain.find('.lyrics').find('ul').append(html)
		}
		
		this.$mobileContain.find('.duration').text('0'+ Math.floor(this.audio.duration/60)+':'+ Math.floor(this.audio.duration%60))
		this.$mobileContain.find('.current').text( '0' + min +':'+ second)			
	}, //音量控制
	volume: function() {
		var _this = this
		var volumeBar = this.$volumePannel.find('.volume-bar')
		this.$volumePannel.on('click',function(e) {
			volumeBar.css({
				'width': e.offsetX + 'px'
			})
			_this.audio.volume = volumeBar.width() / 100
		})
	}
}


//无动作十秒后页面变化
setInterval(function() {
	$('.active-state').addClass('active')
	$('.stationary-state').removeClass('active')
},10000)
$('body').mousemove(function() {
	clearInterval()
	$('.active-state').removeClass('active')
	$('.stationary-state').addClass('active')
})





//mobile 按钮控制

var change = {
	init: function() {
		this.$mobileContain = $('.mobile')
		this.$ctrl = this.$mobileContain.find('.ctrl-pannel')
		this.bind()
	},
	bind: function() {
		var _this = this
		this.$mobileContain.find('.animation').on('click',function() {
			$(this).addClass('active').siblings().removeClass('active')
		})
		this.$mobileContain.find('.lyrics').on('click',function() {
			$(this).addClass('active').siblings().removeClass('active')
		})
		this.$ctrl.find('.menu-tab').on('click',function() {
			_this.$mobileContain.find('.menu').show()
		})
		this.$mobileContain.find('.menu').on('click',function() {
			$(this).hide()
		})
		this.$mobileContain.find('.menu ul').on('click','li', function() {
			$(this).addClass('text').siblings().removeClass('text')
		})
		this.$ctrl.find('.play').on('click',function() {
			var $btn = $(this).find('.iconfont')
			if($btn.hasClass('icon-play')) {
				$btn.removeClass('icon-play').addClass('icon-pause')
				main.audio.play()
			}else {
				$btn.removeClass('icon-pause').addClass('icon-play')
				main.audio.pause()
			}
		})
		this.$ctrl.find('.next').click(function() {
			main.getData()
		})
	}
}


footer.init()
main.init()
change.init()

//移动端歌词特效

var mobile_lyric = {
  init: function() {
    this.$pannel = $('.lyrics').find('ul')
    this.$line = this.$pannel.find('li')
		this.$timeText = $('.current')
		this.audio = main.audio
		console.log('lyric set ...')
		this.bind()	
  },
  bind: function(){
		var _this = this
    if(this.$line.length <= 2) {
			_this.$pannel.css({
				'transform': 'translateY(-25%)',
				'top': '0'
			})
		} 
		this.$pannel.css('transform','none')
		this.audio.addEventListener('timeupdate',function() {
			_this.$line.each(function(i) {	
				if(_this.$timeText.text() == _this.$line.eq(i).attr('data-time')) {
					_this.$line.eq(i).addClass('now').siblings().removeClass('now')
					_this.$pannel.css('top', 'calc(33vh - '+ ((_this.$line.eq(0).outerHeight(true))*i) + 'px )')
				}
			})
		}) 

  }
}



