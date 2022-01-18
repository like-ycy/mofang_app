class Game{
	// 主程序
	constructor(bg_music){
		// 构造函数，类似于python的 __init__()
		this.init();
    	this.play_music(bg_music);
		this.quit();
	}
	init(){
		// 初始化
		console.log("系统初始化");
    	this.rem();
	}
	quit(){
		// 监听设备中的keyback按钮是否被按了
		api.addEventListener({
			name: 'keyback'
		}, (ret, err) => {
			// 弹出一个确认框
			var windows = api.windows()
			if(windows.length>1){
				// 如果当前APP打开了多个窗口，则直接关闭窗口
				this.outWin();
			}else{
				// 如果当前APP只打开了一个窗口，则弹窗确认用户是否退出当前APP
				api.confirm({
					title: '系统提示',
					msg: '您确认退出魔方APP吗？',
					buttons: ['退出', '取消']
				}, (ret, err) => {
					var index = ret.buttonIndex;
					if(index === 1) {
						this.outWin();
					}
				});
			}
		});
	}
	print(data,show=false){
		// 打印数据
		if(show){
			// 以弹窗的方式打印数据
			api.alert({"msg": JSON.stringify(data)});
		}else{
			// 以终端的方式打印数据
			console.log(JSON.stringify(data));
		}
	}
	rem(){
		// 页面自适配方法
		if(window.innerWidth<1200){
			this.UIWidth = document.documentElement.clientWidth;
			this.UIHeight = document.documentElement.clientHeight;
			document.documentElement.style.fontSize = (0.01*this.UIWidth*3)+"px";
			document.querySelector("#app").style.height=this.UIHeight+"px"
		}
		window.onresize = ()=>{
			if(window.innerWidth<1200){
				this.UIWidth = document.documentElement.clientWidth;
				this.UIHeight = document.documentElement.clientHeight;
				document.documentElement.style.fontSize = (0.01*this.UIWidth*3)+"px";
			}
		}
	}
	stop_music(){
		this.print("停止音乐")
		try {
			document.body.removeChild(this.audio);
		} catch (error) {
			this.print(error)
		}
	}
	play_music(src){
		this.print("播放音乐")
		try {
			this.audio = document.createElement("audio");
			this.source = document.createElement("source");
			this.source.type = "audio/mp3";
			this.audio.autoplay = "autoplay";
			this.source.src=src;
			this.audio.appendChild(this.source);
			document.body.appendChild(this.audio);
			var t = setInterval(()=>{
				if(this.audio.readyState > 0){
					if(this.audio.ended){
						clearInterval(t);
						document.body.removeChild(this.audio);
					}
				}
			},100);
		} catch (error) {
			this.print(error);
		}
	}

	goWin(name, url, pageParam){
		// 打开窗口
		api.openWin({
		    name: name,            // 自定义窗口名称
		    bounces: false,        // 窗口是否上下拉动
		    reload: true,          // 如果页面已经在之前被打开了,是否要重新加载当前窗口中的页面
		    url: url,              // 窗口创建时展示的html页面的本地路径[相对于当前代码所在文件的路径]
		    animation:{            // 打开新建窗口时的过渡动画效果
		    	type: "push",                //动画类型（详见动画类型常量）
		    	subType: "from_right",       //动画子类型（详见动画子类型常量）
		    	duration:300                 //动画过渡时间，默认300毫秒
		    },
		    pageParam: pageParam   // 传递给下一个窗口使用的参数.将来可以在新窗口中通过 api.pageParam.name 获取
		});
	}
	outWin(name){
		// 关闭窗口
		api.closeWin({
			name: name
		});
	}

	goFrame(name, url, pageParam){
		// 打开帧页面
		api.openFrame({
				name: name,
				url: url,
				rect: {
						x: 0,
						y: 0,
						w: 'auto',
						h: 'auto'
				},
				useWKWebView: true,
				historyGestureEnabled: true,
				bounces: false,
				animation:{
							type:"push",
							subType: "from_right",
							duration:300
				},
				pageParam: pageParam
		});
	}

	outFrame(name){
		// 关闭帧页面
		api.closeFrame({
		    name: name,
		});
	}

}
