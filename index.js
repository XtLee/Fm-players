function $(selector) {
	return document.querySelector(selector)
}
var audio = new Audio()
var musicList = []
var titleText = document.querySelectorAll('.title');
var singerText = document.querySelectorAll('.singer');
var songInfo = []
audio.autoplay = true

function getMusicList(callback) {
	var xml = new XMLHttpRequest();
	xml.open('GET','https://jirenguapi.applinzi.com/fm/getChannels.php',true);
	xml.onload = function() {
		if((xml.status >= 200 && xml.status < 300) || xml.status === 304) {
			callback(JSON.parse(this.responseText))
		}else {
			console.log('List access failed ...')
		}
	}
	xml.onerror = function() {
		console.log('网络异常')
	}
	xml.send()
}
getMusicList(function(list) {
	musicList = list
	var container = document.createDocumentFragment()
	for(var i in musicList.channels) {
		var node = document.createElement('li')
		node.innerText = (musicList.channels)[i].name
		node.id = (musicList.channels)[i].channel_id
		container.appendChild(node)
	}
	$('.list > ul').appendChild(container)
})
window.onload = function() {
	function getSong(song) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET','https://jirenguapi.applinzi.com/fm/getSong.php',true)
		xhr.onload = function() {
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
				song(JSON.parse(this.responseText))
			}else {
				console.log('Song access failed ...')
			}
		}
		xhr.onerror = function() {
			console.log('网络异常')
	  	}
		xhr.send('public_tuijian_spring')
	}
	getSong(function(info) {
		songInfo = info
		titleText[0].innerText = (songInfo.song)[0].title
		singerText[0].innerText = (songInfo.song)[0].artist
		$('.bg').style.backgroundImage = 'url('+(songInfo.song)[0].picture+')'
		$('.music-img').style.backgroundImage = 'url('+(songInfo.song)[0].picture+')'
		$('.img').style.backgroundImage = 'url('+(songInfo.song)[0].picture+')'
		audio.src = (songInfo.song)[0].url
	})

}
$('.list > ul').addEventListener('click',function(e) {
	function getSong(song) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET','https://jirenguapi.applinzi.com/fm/getSong.php',true)
		xhr.onload = function() {
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
				song(JSON.parse(this.responseText))
			}else {
				console.log('Song access failed ...')
			}
		}
		xhr.onerror = function() {
			console.log('网络异常')
		}
		xhr.send(e.target.id)
		$('.list-name').innerText = e.target.innerText
		$('.list-name').id = e.target.id
	}
	getSong(function(info) {
		songInfo = info
			for(var i=0; i < titleText.length; i++ ) {
				titleText[i].innerText = (songInfo.song)[0].title
			}
			for(var i=0; i < titleText.length; i++ ) {
				singerText[i].innerText = (songInfo.song)[0].artist
			}

		$('.bg').style.backgroundImage = 'url('+(songInfo.song)[0].picture+')'
		$('.music-img').style.backgroundImage = 'url('+(songInfo.song)[0].picture+')'
		$('.img').style.backgroundImage = 'url('+(songInfo.song)[0].picture+')'
		audio.src = (songInfo.song)[0].url
	})
})
audio.ontimeupdate = function() {
	$('.progress-bar .PB-now').style.width = (this.currentTime/this.duration)*100 + '%'
	$('.bar .bar-now').style.width = (this.currentTime/this.duration)*100 + '%'
}
audio.onended = function(e) {
	function getSong(song) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET','https://jirenguapi.applinzi.com/fm/getSong.php',true)
		xhr.onload = function() {
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
				song(JSON.parse(this.responseText))
			}else {
				console.log('Song access failed ...')
			}
		}
		xhr.onerror = function() {
			console.log('网络异常')
		}
		xhr.send(e.target.id)
	}
	getSong(function(info) {
		songInfo = info
			for(var i=0; i < titleText.length; i++ ) {
				titleText[i].innerText = (songInfo.song)[0].title
			}
			for(var i=0; i < titleText.length; i++ ) {
				singerText[i].innerText = (songInfo.song)[0].artist
			}

		$('.bg').style.backgroundImage = 'url('+(songInfo.song)[0].picture+')'
		$('.music-img').style.backgroundImage = 'url('+(songInfo.song)[0].picture+')'
		$('.img').style.backgroundImage = 'url('+(songInfo.song)[0].picture+')'
		audio.src = (songInfo.song)[0].url
	})
}
$('.progress-bar').onclick = function(e) {
	var percent = e.offsetX / parseInt(getComputedStyle(this).width)
	audio.currentTime = audio.duration * percent
}
$('.next-song').onclick = function() {
	function getSong(song) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET','https://jirenguapi.applinzi.com/fm/getSong.php',true)
		xhr.onload = function() {
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
				song(JSON.parse(this.responseText))
			}else {
				console.log('Song access failed ...')
			}
		}
		xhr.onerror = function() {
			console.log('网络异常')
		}
		xhr.send($('.list-name').id)
	}
	getSong(function(info) {
		songInfo = info
			for(var i=0; i < titleText.length; i++ ) {
				titleText[i].innerText = (songInfo.song)[0].title
			}
			for(var i=0; i < titleText.length; i++ ) {
				singerText[i].innerText = (songInfo.song)[0].artist
			}

		$('.bg').style.backgroundImage = 'url('+(songInfo.song)[0].picture+')'
		$('.music-img').style.backgroundImage = 'url('+(songInfo.song)[0].picture+')'
		$('.img').style.backgroundImage = 'url('+(songInfo.song)[0].picture+')'
		audio.src = (songInfo.song)[0].url
	})
}
$('.bar').onclick = function(e) {
	var percent = e.offsetX / parseInt(getComputedStyle(this).width)
	audio.currentTime = audio.duration * percent
}
$('.stop').onload = function() {
	if(audio.play) {
		this.querySelector('.fa').classList.add('fa-play')
		this.querySelector('.fa').classList.remove('fa-pause')
	}else {
		this.querySelector('.fa').classList.remove('fa-play')
		this.querySelector('.fa').classList.add('fa-pause')
	}
}
$('.stop').onclick = function() {
	if(audio.paused) {
		audio.play()
		this.querySelector('.fa').classList.remove('fa-play')
		this.querySelector('.fa').classList.add('fa-pause')
	}else {
		audio.pause()
		this.querySelector('.fa').classList.add('fa-play')
		this.querySelector('.fa').classList.remove('fa-pause')
	}
}
$('.like-it').onclick = function() {
	this.querySelector('.fa').style.color = '#ea180e'
}

//无动作超过十秒后页面变化

setInterval(function() {
	$('.active-state').classList.add('active')
	$('.stationary-state').classList.remove('active')
},10000)
$('body').onmousemove = function() {
	clearInterval()
	$('.active-state').classList.remove('active')
	$('.stationary-state').classList.add('active')
}


