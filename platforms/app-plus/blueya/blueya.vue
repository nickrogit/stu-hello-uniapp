<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<!-- 居中 -->
			<uni-popup :show="showPopupMiddle" :type="popType" v-on:hidePopup="hidePopup">
				<view class="uni-common-mt uni-helllo-text uni-center">
					{{msg}}
				</view>
			</uni-popup>
			
			<view class="uni-btn-v">
				<button type="primary" @tap="initBlue">初始化蓝牙</button>
			</view>
			<view>错误码：</view>
			<view class="uni-textarea">
				<textarea :value="value3" />
			</view>
			<view>蓝牙信息：</view>
			<view class="uni-textarea">
				<textarea :value="value" />
			</view>
			<view>蓝牙状态：</view>
			<view class="uni-textarea">
				<textarea :value="value2" />
			</view>
			<view>设备列表：</view>
			<view>
				<view v-for="(item, index) in devices" :key="index">
					<text>{{item.name}} : {{item.advertisData}}</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import uniPopup from '../../../components/uni-popup.vue';
	var id = null
	export default {
		data() {
			return {
				popType: 'middle',
				title: 'popup',
				showPopupMiddle: false,
				showPopupTop: false,
				showPopupBottom: false,
				msg: '',
				title: 'blueya',
				value: '',
				value2: '',
				value3: '',
				devices: [] // 蓝牙设备列表
			}
		},
		methods: {
			onLoad: function() {
				console.log('App Load')
			},
			onShow: function() {
				console.log('App Show')
			},
			// 初始化蓝牙
			initBlue: function () {
				var that = this;
				uni.openBluetoothAdapter({
				  success(res) {
						that.isBlueOpen() // 初始化成功后，监控蓝牙状态
						that.startSearchBlue() // 开始搜索设备
						console.log(res)
				  },
				  fail(res) {
					  that.value3 = '初始错误码：'+ res.errCode
						that.errShow(res.errCode)
				  },
				  complete(res) {
					
				  }
				})
			},
			// 关闭蓝牙
			closeBlue: function () {
				uni.closeBluetoothAdapter({
					success(res) {
						console.log(res)
					}
				})
			},
			// 搜索蓝牙设备
			startSearchBlue: function () {
				var that = this;
				uni.startBluetoothDevicesDiscovery({
				  success(res) {
					  that.findBlue()
						console.log(res)
				  },
				  fail(res) {
					  that.value3 = '搜索错误码：'+ res.errCode
					  that.errShow(res.errCode)
				  },
				  complete(res) {
				  					
				  }
				})
			},
			// 停止搜索蓝牙设备
			stopSearchBule: function () {
				var that = this;
				uni.stopBluetoothDevicesDiscovery({
				  success(res) {
					console.log(res)
				  }
				})
			},
			// 监听寻找到新设备的事件
			findBlue: function () {
				var that = this;
				uni.onBluetoothDeviceFound(function (devices) {
					// that.devices = devices
					that.stopSearchBule() //发现设备后停止搜索
					that.getBlue() // 若在 uni.onBluetoothDeviceFound 回调了某个设备，则此设备会添加到 uni.getBluetoothDevices 接口获取到的数组中。
				  /* console.log('new device list has founded')
					if (devices[0]) {
						console.log(that.ab2hex(devices[0].advertisData))
					} */
				})
			},
			// 获取已发现的设备列表
			getBlue: function () {
				var that = this;
				uni.getBluetoothDevices({
					success(res) {
						// that.devices = res.devices
						var devicesArr = []
						for(var i=0;i<res.devices.length;i++) {
							var obj = {
								name : res.devices[i].name,
								advertisData: that.ab2hex(res.devices[i].advertisData) 
							}
							devicesArr.push(obj)
						}
						that.devices = devicesArr
						/* that.devices.map((index, item) => {
							console.log("-----------------------------")
							console.log(item.advertisData)
							item.advertisData = that.ab2hex(item.advertisData) 
						})
						if (res.devices[0]) {
							console.log(that.ab2hex(res.devices[0].advertisData))
						} */
					},
					fail(res) {
					  that.value3 = '获取设备列表-错误码：'+ res.errCode
					  that.errShow(res.errCode)
					},
					complete(res) {
										
					}
				})
			},
			// 根据 uuid 获取处于已连接状态的设备。
			getConnectedBlue: function () {
				var that = this;
				uni.getConnectedBluetoothDevices({
					success(res) {
						console.log(res.devices)
						that.closeBlue()
					}
				})
			},
			// 监听蓝牙适配器状态变化事件
			isBlueOpen: function () {
				var that = this;
				// 判断蓝牙是否打开
				uni.onBluetoothAdapterStateChange(function (res) {
				  console.log('adapterState changed, now is', res)
				  that.value2 = "可用：" + res.available + ";搜索状态" + res.discovering
				})
			},
			// ArrayBuffer转16进度字符串示例
			ab2hex: function(buffer) {
			  const hexArr = Array.prototype.map.call(
				new Uint8Array(buffer),
				function (bit) {
				  return ('00' + bit.toString(16)).slice(-2)
				}
			  )
			  return hexArr.join('')
			},
			errShow: function (errCode) {
				var msg = '正常'
				switch(errCode) {
				case 0:
					msg = "正常"
					break;
				case 10000:
					msg = "未初始化蓝牙适配器"
					break;
				case 10001:
					msg = "当前蓝牙适配器不可用"
					break;
				case 10002:
					msg = "没有找到指定设备"
					break;
				case 10003:
					msg = "连接失败"
					break;
				case 10004:
					msg = "没有找到指定服务"
					break;
				case 10005:
					msg = "没有找到指定特征值"
					break;
				case 10006:
					msg = "当前连接已断开"
					break;
				case 10007:
					msg = "当前特征值不支持此操作"
					break;
				case 10008:
					msg = "其余所有系统上报的异常"
					break;
				case 10009:
					msg = "系统版本低于 4.3 不支持 BLE"
					break;
				default:
					msg = "正常"
				}
				this.hidePopup();
				this.popType = 'middle';
				this.showPopupMiddle = true;
				this.msg = msg
				/* uni.showToast({
					title: msg,
					duration: 2000
				}); */
			}
		}
	}
</script>

<style>
	
</style>