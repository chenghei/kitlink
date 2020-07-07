<template>
  <div id="noticeMap1" v-bind="$attrs">

    <!-- 信息弹出框 -->
    <div id="infoWindow" ref="infoWindow" v-if="show_type == 'I'" style="width: auto !important;">
      <slot name="infoWindow">
      </slot>
    </div>

    <!-- 自定义覆盖物 -->
    <div id="myOverlay" ref="myOverlay" v-if="show_type == 'O'">
      <span style="position: absolute; top:0; right: 10px; color: white;font-size: 18px; cursor: pointer;" @click="over_close">×</span>
      <slot name="overlay">
      </slot>
    </div>

  </div>
</template>

<script>
import BMap from 'BMap'
import styleJson from '../../assets/js/styleJson'
export default {
  name: 'b-map-component',
  data () {
    return {
      // 百度地图
      wemap: {},
      // marker 点
      marker: {},
      // 点聚合
      markerClusterer: null,
      // infowindow
      infoWindow: null,
      // 点
      point: null,
      // 显示类型 N-不显示  I--infoWindow O--overlay
      show_type: 'N',
      // 是否已弹出
      alarm_modal_showed: false,
      // 地图样式
      styles: {
        defaults: styleJson,
        high_ash: [{
          'featureType': 'all',
          'elementType': 'all',
          'stylers': {
            'lightness': 10,
            'saturation': -100
          }
        }]
      },
      /** 分页显示 */
      page: {
        current: 0,
        size: 1000
      }

      // -- TODO
    }
  },
  /**
     * 通道
     */
  props: {
    // 标记的点
    center: {
      type: Object,
      default: function () {
        return { lng: 0, lat: 0 }
      }
    },
    // 地图级别
    zoom: { type: Number, default: 5 },
    // marker 集合
    markers: {
      type: Array,
      default: function () {
        return []
      }
    },
    // marker类型  normal：普通打点   alarm：报警打点
    type: { type: String, default: 'O' },
    // 是否自动缩放
    autoZoom: { type: Boolean, default: false },
    // 显示类型 N--都不显示  I--infoWindow  O--overlay
    showType: { type: String, default: 'N' },
    init: { type: Boolean, default: false },
    /** 滚动缩放 */
    isScroll: { type: Boolean, default: true },
    /** 是否聚合 */
    isClusterer: { type: Boolean, default: true }
  },
  /**
     * 监控
     */
  watch: {
    /**
       * 根据类型改变地图背景
       */
    type (_val) {
      if (_val == 'alarm') {
        this.wemap.setMapStyleV2({
          // styleJson: this.styles.high_ash
          styleJson: this.styles.defaults
        })
      } else {
        this.wemap.setMapStyleV2({
          styleJson: this.styles.defaults
        })
      }
    },
    /**
       * 监听 type，用于地图打点
       */
    markers (newVal, oldVal) {
      if (newVal && JSON.stringify(newVal) != JSON.stringify(oldVal)) {
        this.page.current = 0
        this.cluster_markers()
      }
    },
    /**
       * 监听infoWindow是否显示
       */
    showType (val) {
      // 显示
      if (val == 'N') {
        this.closeInfoWindow()
      } else {
        let _this = this
        setTimeout(function () {
          if (_this.type != 'alarm') {
            _this.openInfoWindow()
          }
        })
      }

      // 设置显示的内容
      this.show_type = val
    },
    /**
       * 监听点击marker时的经纬度点
       */
    point (_old, _now) {
      if (this.type == 'alarm') {
        this.closeInfoWindow()
        // this.openInfoWindow();
        let _this = this
        setTimeout(function () {
          _this.openInfoWindow()
        })
      } else {
        if (!_now || (_old && _now && _old.lng != _now.lng && _old.lat != _now.lat)) {
          this.closeInfoWindow()
          // this.openInfoWindow();
          let _this = this
          setTimeout(function () {
            _this.openInfoWindow()
          })
        }
      }
    } // -- TODO
  },
  created () {
    // -- TODO
  },
  /**
     * 方法
     */
  methods: {
    /**
       * 生成海量点
       */
    create_markers () {
      if (this.markers && this.markers.length > 0) {
        this.clearAll()
        this.markers.map(_mk => {
          if (_mk && _mk.lng && _mk.lat) {
            let _point = new BMap.Point(_mk.lng, _mk.lat)
            this.add_marker(_point, _mk.icon, _mk.isAnimation)
          }
        })
      }
    },
    /**
       * 打点
       * point: 点坐标
       * icon: 自定义图标
       * animation: 是否动画
       */
    add_marker (point, icon, isAnimation) {
      let marker = null
      if (icon) {
        new BMap.Marker(_pt, { icon: icon })
      } else {
        marker = new BMap.Marker(point)
      }
      this.wemap.addOverlay(marker)
    },
    /**
       * 点聚合
       */
    cluster_markers () {
      // 清除所有聚合点
      this.clearAll()
      // 最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
      let _markers = this.markers
      if (_markers && _markers.length > 0) {
        if (this.page.current < Math.ceil(_markers.length / this.page.size)) {
          this.create_marker(_markers.slice(this.page.current * this.page.size, (this.page.current + 1) * this.page.size))
        }

        // 是否自动缩放
        if (this.autoZoom) {
          let _cm = this.map_auto_zoom()
          let _lng =
              _cm && _cm.center && _cm.center.lng ? parseFloat(_cm.center.lng) : 108.93
          let _lat =
              _cm && _cm.center && _cm.center.lat ? parseFloat(_cm.center.lat) : 34.27
          let _zoom = _cm && _cm.zoom ? _cm.zoom : 5
          // 初始化时候判断所有marker点的经纬度都一样,同时返回zoom
          _zoom = this.change_zoom(_zoom)
          this.wemap.centerAndZoom(new BMap.Point(_lng, _lat), _zoom)
        } else {
          let _this = this
          setTimeout(function () {
            _this.wemap.centerAndZoom(new BMap.Point(_this.center.lng, _this.center.lat), _this.zoom)
          }, 200)
        }
      } else {
        this.wemap.centerAndZoom(new BMap.Point(108.93, 34.27), 5)
      }
    },
    /**
       * 生成点
       */
    create_marker (_markers) {
      let _list = []
      let _pt = null
      _markers.map(_mk => {
        if (_mk && _mk.lng && _mk.lat) {
          // 生成点
          _pt = new BMap.Point(_mk.lng, _mk.lat)
          let _icon = null
          if (_mk.icon) {
            _icon = new BMap.Icon(_mk.icon, new BMap.Size(62, 78), { anchor: new BMap.Size(18, 54) })
          }
          // 生成marker
          let _mark = _icon
            ? new BMap.Marker(_pt, { icon: _icon }) : new BMap.Marker(_pt)

            // 是否开始动画
          if (_mk.isAnimation) {
            this.$nextTick(() => {
              _mark.setAnimation(BMAP_ANIMATION_BOUNCE) // 跳动的动画
            })
          }
          // 将标注置于其他标注之上
          if (_mk._istop) {
            _mark.setTop(_mk._istop)
          }

          // marker 的点击事件
          let _this = this
          _mark.addEventListener('click', function (e) {
            // 点击事件
            _this.marker_click(_mk)
          })

          // 生成海量点
          if (!this.isClusterer) {
            this.wemap.addOverlay(_mark)
          }

          // 点聚合
          if (this.isClusterer) {
            // 禁止覆盖物在map.clearOverlays方法中被清除
            _mark.disableMassClear()
            // 添加到集合中
            _list.push(_mark)
          }
        }
      })

      // 点聚合
      if (this.isClusterer) {
        this.markerClusterer = new BMapLib.MarkerClusterer(this.wemap, { markers: _list })
      }

      let _this = this
      _this.page.current++
      setTimeout(function () {
        if (_this.page.current <= Math.ceil(_this.markers.length / _this.page.size)) {
          _this.create_marker(_this.markers.slice(_this.page.current * _this.page.size, (_this.page.current + 1) * _this.page.size))
        }
      }, 3000)
    },
    // 一键清除
    clearAll () {
      // 清除覆盖物
      this.wemap.clearOverlays()
      // 清除聚合点
      if (this.markerClusterer) {
        this.markerClusterer.clearMarkers()
      }
    },
    /**
       * 根据markers获取地图中心点和级别
       */
    map_auto_zoom () {
      let markers = this.markers
      let viewPort = {}
      let _lng = 0
      let _lat = 0
      let _zoom = 5
      if (markers && markers.length > 0) {
        let _l = markers.length
        if (_l > 1) {
          // 定义最左、最上、最下、最右4个点
          // 西经
          let _left_point = { lng: 0, lat: 0 }
          // 北纬
          let _top_point = { lng: 0, lat: 0 }
          // 南纬
          let _bottom_point = { lng: 0, lat: 0 }
          // 东经
          let _right_point = { lng: 0, lat: 0 }
          for (let i = 0; i < _l; i++) {
            let obj = markers[i]
            if (i == 0) {
              _left_point = { lng: parseFloat(obj.lng), lat: parseFloat(obj.lat) }
              _top_point = { lng: parseFloat(obj.lng), lat: parseFloat(obj.lat) }
              _bottom_point = { lng: parseFloat(obj.lng), lat: parseFloat(obj.lat) }
              _right_point = { lng: parseFloat(obj.lng), lat: parseFloat(obj.lat) }
            } else {
              // 东西经、南北纬
              if (obj.lat < _left_point.lat) {
                _left_point = { lng: parseFloat(obj.lng), lat: parseFloat(obj.lat) }
              } else if (obj.lat > _right_point.lat) {
                _right_point = { lng: parseFloat(obj.lng), lat: parseFloat(obj.lat) }
              }
              if (obj.lng < _bottom_point.lng) {
                _bottom_point = { lng: parseFloat(obj.lng), lat: parseFloat(obj.lat) }
              } else if (obj.lng > _top_point.lng) {
                _top_point = { lng: parseFloat(obj.lng), lat: parseFloat(obj.lat) }
              }
            }
          }

          // 根据4个点，计算最长距离
          let _points = []
          _points.push(_left_point)
          _points.push(_right_point)
          _points.push(_top_point)
          _points.push(_bottom_point)

          let _max_distance = 0
          for (let i = 0; i < _points.length - 1; i++) {
            for (let j = i + 1; j < _points.length; j++) {
              let _ds = this.getDistance(_points[i].lng, _points[i].lat, _points[j].lng, _points[j].lat).toFixed(2)
              _max_distance = _max_distance > parseFloat(_ds) ? _max_distance : parseFloat(_ds)
            }
          }
          // 获取级别
          _zoom = this.getZoomLevel(_max_distance)
          // 计算中间点
          _lat = (_left_point.lat + _right_point.lat) / 2
          _lng = (_top_point.lng + _bottom_point.lng) / 2
        } else {
          _lng = markers[0].lng
          _lat = markers[0].lat
          if (_lng && _lat) {
            _zoom = 15
          } else {
            _lng = 108.93
            _lat = 34.27
            _zoom = 5
          }
        }
      }
      return (viewPort = {
        center: { lng: parseFloat(_lng), lat: parseFloat(_lat) },
        zoom: _zoom
      })
    },
    /**
       * 获取2点的距离
       */
    getDistance (lng1, lat1, lng2, lat2) {
      // 地球半径
      const earch_radius = 6378.137
      let radLat1 = this.rad(lat1)
      let radLat2 = this.rad(lat2)
      let _lat = radLat1 - radLat2
      let _lng = this.rad(lng1) - this.rad(lng2)

      let _s =
          2 *
          Math.asin(
            Math.sqrt(
              Math.pow(Math.sin(_lat / 2), 2) +
              Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(_lng / 2), 2)
            )
          )
      _s = _s * earch_radius
      return (_s * 1000) / 9
    },
    /**
       * @param {Object} d
       */
    rad (d) {
      return (d * Math.PI) / 180.0
    },
    /**
       * 根据距离算地图级别
       * @param {Object} distance
       */
    getZoomLevel (distance) {
      // 地图级别
      let zoomLevel = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5]
      // 级别对应的距离 单位m
      let zoomLevelStr = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 25000, 50000, 100000, 200000, 500000]
      for (let i = 0; i < zoomLevelStr.length; i++) {
        if (i < zoomLevelStr.length - 1) {
          let left = zoomLevelStr[i]
          let right = zoomLevelStr[i + 1]
          if (distance < left) {
            return zoomLevel[i]
          } else if (distance > left && distance < right) {
            return zoomLevel[i + 1]
          }
        } else {
          return 5
        }
      }
      return 19
    },
    /**
       * marker 点击事件
       */
    marker_click (_mk) {
      this.marker = _mk
      this.point = new BMap.Point(_mk.lng, _mk.lat)

      this.$emit('marker-click', _mk)
    },
    /**
       * info window 开启
       */
    openInfoWindow () {
      if (this.type === 'normal') {
        if (this.show_type == 'O') {
          // 自定义覆盖物
          this.$nextTick(() => {
            var myCompOverlay = new ComplexCustomOverlay(
              new BMap.Point(this.point.lng, this.point.lat),
              this.$refs.myOverlay
            )
            this.wemap.addOverlay(myCompOverlay)
          })
        } else if (this.show_type == 'I') {
          // infoWindow
          // 开启信息窗口
          let _infowindow = (this.infoWindow = new BMap.InfoWindow(
            this.$refs.infoWindow
          )) // 创建信息窗口对象
          // info window关闭事件
          let _this = this
          _infowindow.addEventListener('close', function () {
            _this.$emit('info-close')
          })
          this.wemap.openInfoWindow(this.infoWindow, this.point)
        }

        // 设置未弹出告警处理框
        this.alarm_modal_showed = false
      } else {
        // 弹出告警框
        this.alarm_show()
      }
    },
    /**
       * info window 关闭
       */
    closeInfoWindow () {
      // 关闭信息窗口
      if (this.show_type == 'O') {
        // 清除覆盖物
        this.wemap.clearOverlays()
      } else if (this.show_type == 'I') {
        this.wemap.closeInfoWindow(this.infoWindow)
      }
    },
    /**
       * 关闭覆盖物
       */
    over_close () {
      this.wemap.clearOverlays()

      this.$emit('info-close')
    },
    /**
       * 地图初始化时，判断所有marker点的经纬度是否一致，并返回zoom
       * 若一致，则zoom - 2
       * 否则zoom不变
       */
    change_zoom (_zoom) {
      if (!this.init) {
        return _zoom
      } else {
        let _mks = this.markers
        let _n = 0
        let _info = null
        if (_mks && _mks.length > 1) {
          for (let i = 0; i < _mks.length; i++) {
            let obj = _mks[i]
            if (_info) {
              if (_info.lng != obj.lng || _info.lat != obj.lat) {
                _n = 1
                break
              }
            } else {
              _info = { lng: obj.lng, lat: obj.lat }
            }
          }

          if (_n == 0 && _zoom == 19) {
            _zoom = _zoom - 2
          }
        }
      }
      return _zoom
    },
    /** *-------------------------------------------------- 告警列表部分 ------------------------------------------------------------------------***/
    /**
       * 弹出告警列表
       */
    alarm_show () {
      if (this.marker && this.marker.alarms && this.marker.alarms.length > 0) {
        // 弹出告警处理框
        window.parent.Alarm.alarm_process(this.marker.alarms[0].sequence)
        // 设置已经弹出
        this.alarm_modal_showed = true
        /*
          if(this.marker.alarms.length > 1) { // 同一设备多条报警
            let _list = [];
            this.marker.alarms.map(obj => {
              if(obj && obj.sequence) {
                if(this.sequences && this.sequences.indexOf(obj.sequence) != -1) {
                  obj._checked = true;
                } else {
                  obj._checked = false;
                }
                _list.push(obj);
              }
            });
            this.alarm_prop.show_data = _list;
            this.alarm_prop.show = true;

          } else if(this.marker.alarms.length == 1) { // 同一设备1条报警
            let _am = this.marker.alarms[0];
            this.alarm_modal.show = true;
          }
          */
      } else {
        this.alarm_modal_showed = false
      }
    }

    // -- TODO
  },
  /**
     * 挂载
     */
  mounted () {
    // 构造底图时，关闭底图可点功能
    let _wemap = new BMap.Map('noticeMap1', { enableMapClick: false })
    _wemap.centerAndZoom(new BMap.Point(this.center.lng, this.center.lat), this.zoom)
    _wemap.enableScrollWheelZoom()
    // 设置地图样式
    
    if(this.type == 'alarm') {
        _wemap.setMapStyleV2({
            styleJson: this.styles.defaults
        });
    } else {
        _wemap.setMapStyleV2({
            styleJson: this.styles.defaults
        });
    }

    // 监听地图点击事件
    let _this = this
    _wemap.addEventListener('click', function (e) {
      _this.$emit('click', e)
    })

    // 是否支持滚动缩放
    if (this.isScroll) {
      _wemap.enableScrollWheelZoom()
    } else { // 禁用滚轮放大缩小
      _wemap.disableScrollWheelZoom()
    }

    // 地图加载完成后
    _this.$emit('ready', { BMap: BMap, map: _wemap })

    this.wemap = _wemap
  }
}

// 复杂的自定义覆盖物
function ComplexCustomOverlay (point, text) {
  this._point = point
  this._text = text
}
ComplexCustomOverlay.prototype = new BMap.Overlay()
ComplexCustomOverlay.prototype.initialize = function (map) {
  this._map = map
  var div = (this._div = document.createElement('div'))
  div.style.position = 'absolute'
  div.appendChild(this._text)

  map.getPanes().markerPane.appendChild(div)
  return div
}
ComplexCustomOverlay.prototype.draw = function () {
  var map = this._map
  var pixel = map.pointToOverlayPixel(this._point)
  this._div.style.left = pixel.x - 30 + 'px'
  this._div.style.bottom = -pixel.y + 32 + 'px'
}
</script>

<style>

</style>
