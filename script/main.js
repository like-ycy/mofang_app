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
		this.print("系统初始化");
    	this.rem();
		this.init_config();
		this.init_axios();
	}
	init_config(){
		// 初始化配置
		this.config = {
			"server_api": "http://192.168.19.251:5000/api", // api服务端的网关地址
			"app_id": "2071340228",  // 防水墙验证码的应用ID
		}
	}
	init_axios(){
		// 初始化axios http请求工具包
        if(window.axios && window.Vue){
			this.print("初始化axios");
			axios.defaults.baseURL = this.config.server_api    // 服务端api接口网关地址
			axios.defaults.withCredentials = false; // 跨域请求资源的情况下,忽略cookie的发送
			Vue.prototype.axios = axios;            // 给vue对象增加一个全局的属性，this.axios
		}
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

	uuid(){
		// UUID
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=>{
			var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;
			return v.toString(16);
		})
	}
	
	tips(msg, location='middle'){
		// 消息提示
		api.toast({
			msg: msg,
			duration: 3000,
			location: location
		});
	}

	setfs(data){
		// 保存一个或多个键值对数据到本地文件系统中
		for(let key in data){
			api.setPrefs({ // 储存
				 key: key,
				 value: data[key]
			});
		}
	}

	getfs(key){ // keys="access_token"    keys = ["access_token","refresh_token"]
		// 根据key值来获取本地文件系统中存储的数据
		let keys = key;
		if(!(key instanceof Array)){ // 如果不是数组，改造成数组，统一操作
			keys = [key];
		}

		let data = {}
		for(let item of keys){
			data[item] = api.getPrefs({
				key: item,
				sync: true,
			});
		}

		if(key instanceof Array){
			return data;
		}

		return data[key];
	}

	delfs(key){
		// 根据key值来删除本地文本系统中存储的数据
		let keys = key;
		if(!(key instanceof Array)){ // 如果不是数组，改造成数组，统一操作
			keys = [key];
		}

		for(let item of keys){
			api.removePrefs({
				key: item,
			});
		}

	}

	setdata(data){
		// 保存数据到内存中
		for(let key in data){
			api.setGlobalData({ // 储存
				key: key,
				value: data[key]
			});
		}
	}

	getdata(key){
		// 根据key值来获取内存中存储的数据
		let keys = key;
		if(!(key instanceof Array)){ // 如果不是数组，改造成数组，统一操作
			keys = [key];
		}

		let data = {}
		for(let item of keys){
			data[item] = api.getGlobalData({
				key: item
			});
		}

		if(key instanceof Array){
			return data;
		}

		return data[key];
	}

	deldata(key){
		// 根据key值来删除内存中存储的数据
		let keys = key;
		if(!(key instanceof Array)){ // 如果不是数组，改造成数组，统一操作
			keys = [key];
		}

		for(let item of keys){
			api.setGlobalData({
				key: item,
				value: "",
			});
		}
	}

	token(){
		// 获取token
		let token = {}
		let data = this.getdata("access_token");
		let fs   = this.getfs("access_token");
		if(data){
			token["access_token"] = data
			token["remember"] = false
		}else if (fs){
			token["access_token"] = fs
			token["remember"] = true
		}else{
			token["access_token"] = ""
			token["remember"] = false
		}
		return token;
	}

	payload(){
		let token = this.token().access_token
		// 获取载荷数据
		let arr = token.split(".")
		if(!arr[0]){
			return {}
		}
		let payload = JSON.parse( window.atob(arr[1]) )
		// 判断token是否已经过期了
		let current_time = parseInt((new Date()-0)) / 1000;
		if( current_time > payload.exp){
			this.delfs("access_token");
			this.deldata("access_token");
			return {}
		}
		return payload
	}
	user_info(){
		// 获取载荷中的用户信息
		return this.payload().sub
	}

	check_token(vm){
		// 使用本地token到服务端验证token，检查用户登陆状态
		let token = this.token().access_token;
		return vm.axios.post("", {
			"jsonrpc": "2.0",
			"id": this.uuid(),
			"method": "Users.verify",
			"params": {}
		},{
			headers:{
				Authorization: `jwt ${token}`
			}
		});
	}

	refresh_access_token(vm){
		// 使用本地refresh_token到服务端生成新的access_token
		let refresh_token  = this.getdata("refresh_token") || this.getfs("refresh_token");
		return vm.axios.post("",{
			"jsonrpc": "2.0",
			"id": this.uuid(),
			"method": "Users.refresh",
			"params": {}
		},{
			headers:{
				Authorization: `jwt ${refresh_token}`
			}
		});
	}

	goto(vm, name, url){
		// 鉴权以后，打开新窗口
		let remember = this.token().remember;
		this.check_token(vm).then(response=>{
			if(response.data.result.errno === 0){
				this.delfs(["access_token"]);
				this.deldata(["access_token"]);
				if(remember){
					this.setfs({
						'access_token': response.data.result.access_token,
					});
				}else{
					this.setdata({
						'access_token': response.data.result.access_token,
					});
				}
				this.goWin(name,url);
			}else if(response.data.result.errno === 1012){
				// access_token已经过期了。
				api.confirm({
					title: '登陆已超时！',
					msg: '是否请求服务端提取新的访问令牌继续登录操作？',
					buttons: ['继续', '取消']
				}, (ret, err)=>{
					if(ret.buttonIndex === 1){
						// 如果用户点击"继续"，则使用refresh_token到服务端生成新access_token
						this.refresh_access_token(vm).then(response=>{
							if(response.data.result.errno === 0){
								this.delfs(["access_token"]);
								this.deldata(["access_token"]);
								if(remember){
									this.setfs({
										'access_token': response.data.result.access_token,
									});
								}else{
									this.setdata({
										'access_token': response.data.result.access_token,
									});
								}
							}else{
								// 无法使用refresh_token生成access_token
								this.goWin("login", "login.html");
							}
						})
					}
				})
			}else{
				this.goWin("login", "login.html");
			}
		})
	}

	money(num){
		// 货币格式化
		let data_int = parseInt(num).toLocaleString();
		let data_float = parseFloat(num).toFixed(2).split(".")[1];
		return `${data_int}.${data_float}`
	}
}
