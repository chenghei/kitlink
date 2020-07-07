<style lang="less" scoped src="../index.less"></style>
<template>
  <div class="content-body">
    <div class="content boxShadow" style="overflow:hidden">
      <div class="header">
        <span>{{$t('prison_setting')}}</span>
      </div>
      <Row type="flex"  class="content_select" style="border-bottom:1px solid #ddd">
        <div class="content_select_input">
        <p>{{$t('type')}}：</p> 
        <i-col span="12" style="width:200px">
            <i-select v-model="sensor_types" read-only>
                <i-option :value="$t('lamp_ctl')">{{$t('lamp_ctl')}}</i-option>
            </i-select>
        </i-col>
        </div>
        <div class="select_button" @click="setting">{{$t('confirm')}}</div>
      </Row>
      <div ref="img_div" class="prison_out" id="prisonSetting">
        <div id="toolbar" >
          <Upload action="/p/a/rest-api/dataApi/autoUpdate/upload" :show-upload-list="false" :on-success="upload_success" :data="img_upload.data" :before-upload="before_upload" class="upload_button"
          :headers="fileDate">
            <Button icon="ios-cloud-upload-outline" style="background-color: #00A0E9;color: white;">{{ $t('plan') }}{{ $t('imp') }}</Button>
          </Upload>
        </div>
        <div class="prison_setting" v-drag ref="show_img"  @mousedown="hide_context_menu">
          <img ref="img_show" :src="img_upload.img ? path+'/p/a/rest-api/files/download?filePath='+img_upload.img : ''"/>

          <!-- 显示已有的图标 -->
          <img-drag v-for="icon in show_icons" :key="icon.sequence" :icon="icon" @mousedown="show_icon_mousedown(icon, $event)"  @mouseup="show_icon_move_end(icon, $event)" @renderKeydown="renderKeydown($event)" />
        </div>
        
      </div>
      <!-- 编辑属性 -->
      <div class="prison_info" ref="attrbute_div">
        <Card >
          <p slot="title">
            {{$t('node_attr')}}
          </p>
          <div slot="extra">
            <Button type="primary" v-show="false">{{ $t('save_all')}}</Button>
            <Button type="info" @click="d_attr_form_submit('d_attr_form')">{{$t('save')}}</Button>
          </div>
          <Form :model="d_attr_form" ref='d_attr_form' label-position="right" :rules="d_attr_rule">
            <FormItem :label="$t('devices')+'ID：'" prop="sensor_name">
              <Input v-model="d_attr_form.sensor_name" :placeholder="$t('enter_name_prompt')"/>
            </FormItem>
            <FormItem :label="$t('device_name')+'：'" prop="dev_eui">
              <Input v-model="d_attr_form.dev_eui" :placeholder="$t('enter_dev_id')"/>
            </FormItem>
            <FormItem :label="$t('padding_left')+'：'" prop="_left">
              <Input v-model="d_attr_form._left" :placeholder="$t('input_left')"/>
            </FormItem>
            <FormItem :label="$t('padding_top')+'：'" prop="_top">
              <Input v-model="d_attr_form._top" :placeholder="$t('ico_top')"/>
            </FormItem>
            <FormItem :label="$t('remark')+'：'" prop="remarks">
              <Input type="textarea" v-model="d_attr_form.remarks" :autosize="{minRows: 4,maxRows: 5}" :placeholder="$t('enter_remark_prompt')"/>
            </FormItem>
          </Form>
          <Spin size="large" fix v-if="spinShow"></Spin>
        </Card>
      </div>
      <!-- 右键菜单 -->
      <div class="tag" v-show="contextmenu.show" :style="{'top': contextmenu._top - 25 +'px', 'left': contextmenu._left + 25 +'px'}" ref="type_list" id="deleteCard">
        <div class="arrow">
          <em>◆</em><span>◆</span>
        </div>
        <!-- 内容 -->
        <div>
          <CellGroup>
            <Cell title="删除(delete)" @mousedown.stop.native=""  @mouseup.stop.native="delete_node"/>
          </CellGroup>
        </div>
      </div>
    </div>
    <Modal v-model="deleteModel.status">
      <p slot="header" style="color:#f60;text-align:center"></p>
      <div style="text-align:center">
        <p>
          <Icon type="ios-alert-outline" size="22"/>
          {{$t('del_confirm')}} {{delTitle}}？
        </p>
        <p>{{$t('cant_restore_delete')}}</p>
      </div>
      <div slot="footer">
        <Button type="success" :loading="deleteModel.loading" @click="removeIcon">{{$t('confirm')}}</Button>
        <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import imgDrag from '@/components/imgDrag/imgDrag.vue';
import { mapGetters, mapActions } from 'vuex'
import { getToken, getHid, getUid, getSid  } from '@/libs/util'
import config from '@/config'

export default {
  components: {
    imgDrag,
  },
  data () {
    //flood_id
    const getUrlKey = (name) => {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }
    /** 名称验证 */
    const rule_v_name = (rule, value, callback) => {
      if(value === '') {
        callback(new Error(this.$t('name_not_empty')));
      } else {
        callback();
      }
    };
    /** dev_eui验证 */
    const rule_dev_eui = (rule, value, callback) => {
      if(value === '') {
        callback(new Error(this.$t('id_not_empty')));
      } else {
        callback();
      }
    };
    return {
      path: config.assetsPatch,
      fileDate:{
        uid:getUid(),
        authorization:getToken(),
        h:getHid(),
        sid:getSid(),
      },
      /** 上传 */
      img_upload: {
        // 图片上传时的附带参数
        data: {},
        // 图片上传成功返回的图片
        img: ''
      },
      floor_id: getUrlKey('floor_id'),
      /** 单灯控制 */
      lamp_floor: {
        id: '',
        img: '',
        euis: [],
        // 拥有的icon
        icons: [],
      },
      delTitle:"",
      /** 设备类型 */
      sensor_types: [this.$t('lamp_ctl')],
      d_attr_form: {
        id: '',
        sequence: '',
        sensor_name: '',
        dev_eui: '',
        _left: 30,
        _top: 40,
        fport: 200,
        remarks: '',
        floor_id: '',
      },
      // 清空表单
      clear_form: {},
      /** 选中的类型 */
      select_type: {},
      /** 生成的图标 */
      create_icons:[],
      /** 表单验证规则 */
      d_attr_rule: {
        sensor_name: [{
          required: true,
          validator: rule_v_name,
          trigger: 'blur'
        }],
        dev_eui: [{
          required: true,
          validator: rule_dev_eui,
          trigger: 'blur'
        }],
      },
      /** 显示已有的图标 */
      show_icons:[],
      /** 选中的 node */
        selected_node: {},
      /** 是否被拖拽 */
      isDrag: false,
      /** 定时任务 */
      timmerHandle: null,
      /** 右键菜单 */
      contextmenu: {
        // 是否显示
        show: false,
        // 左边距
        _left: 0,
        // 上边距
        _top: 0,
      },
      deleteModel: {
        status: false,
        loading: false,
        formValidate: {}
      },
      spinShow: false,
    }
  },
  computed: {
    ...mapGetters([
      'nodeType',
    ])
  },
  methods: {
    ...mapActions([
      'getPrisonMap',
      'getPrisonMapMark',
      'updateMapMark',
      'insertMapMark',
      'deleteMapMark'
    ]),
    init () {
      this.getPrisonMap().then(res => {
        if (res && res.data.result.length > 0) {
          let lamp = res.data.result[0];
          this.lamp_floor.img = lamp.img_addr;
          this.lamp_floor.id = lamp.id;
        }

        // 设置平面图
        this.img_upload.img = this.lamp_floor.img;
        this.floor_id = this.lamp_floor.id;
        
        // 根据 floor_id 查询平面图上的点
        this.q_mark_by_floor_id(this.lamp_floor.id)
      }).catch(err => console.log(err));
    },
    /**
      * 根据 floor id 获取平面图上的点
      */ 
    q_mark_by_floor_id (_floor_id) {
      if (_floor_id) {
        this.getPrisonMapMark({id:_floor_id}).then(res => {
          let _list = []
          if (res && res.data.code === 0) {
            res.data.result.map(obj => {
              _list.push({
                  id: obj.id,
                  sequence: obj.id,
                  sensor_name: obj.sensor_name,
                  dev_eui: obj.dev_eui,
                  _left: obj.sensor_left,
                  _top: obj.sensor_top,
                  fport: obj.fport,
                  remarks: obj.remarks,
                  floor_id: obj.floor_id,
                  icon: obj.icon_addr,
                  src: require('@/assets/images/mapIcon/'+obj.icon_addr),
                  type: 'S',
                  isUpdate: false,
                });
            })
          }
          this.show_icons = _list
        }).catch(err => console.log(err));
      }
    },
    setting () {
      this.selected_node = {};
      this.$nextTick(() => {
        
        let sequence = 'icon' + new Date().getTime()
        let _obj = {
          sequence: sequence,
          _left: 30 - this.$refs.show_img.offsetLeft,
          _top:  270 - this.$refs.img_div.offsetTop - this.$refs.show_img.offsetTop,
          fport: 200,
          type: 'S', // C-在create_icons中     S-在show_icons中
          isUpdate: true,
          floor_id: this.floor_id,
          isUpdate: true,
          src:require('@/assets/images/mapIcon/icon-n-light-control.png')
        };
        
        // 将类型添加到 create_icons 中
        this.show_icons.push(_obj);
      });
    },
    changeNodeType() {
    },
    /**
     * 图片上传之前 ，设置需要传递的参数
     */
    before_upload() {
      // 设置附加参数
      this.img_upload.data.id = this.floor_id;
      this.img_upload.data.type = 'lamp';
    },
    upload_success(res, file) {
      if(res && res.code == '000000') {
        let _rs = JSON.parse(res.value)
        this.img_upload.img = _rs.img_addr;
        this.floor_id = _rs.id;
      } else {
        this.$Message.error(res.msg);
      }
    },
    show_icon_mousedown(_icon, e) {
      this.isDrag = true;
      let _this = this;
      // this.timmerHandle = setTimeout(function() {
      //   _this.setDragTrue();
      // }, 200);
    },
    setDragTrue() {
      this.isDrag = true;
    },
    /**
     * 已有图标移动结束后 
     */
    show_icon_move_end(_icon, e) {
      e = e || event;
      switch(e.button) {
        case 1: // 鼠标滚轴
          break;
        case 2: // 鼠标右键
          this.right_mouse_button(_icon, e);
          break;
        default: // 鼠标左键
          this.left_mouse_button(_icon, e);
      }
    },
    /**
     * 鼠标左键 
     */
    left_mouse_button(_icon, e) {
      let _o_form = JSON.parse(JSON.stringify(this.d_attr_form));
      // 更新icon的值
      this.show_icons.map(_obj => {
        if(_obj && _obj.sequence && _obj.sequence == _o_form.sequence) {
          _obj.id = _o_form.id;
          _obj.sensor_name = _o_form.sensor_name;
          _obj.dev_eui = _o_form.dev_eui;
          _obj.remarks = _o_form.remarks;
        }
      });

      let _left = _icon._left;
      let _top = _icon._top;

      // 更新表单属性
      if(_icon.sequence != this.d_attr_form.sequence) {
        this.d_attr_form = {
          id: _icon.id,
          sequence: _icon.sequence,
          sensor_name: _icon.sensor_name,
          dev_eui: _icon.dev_eui,
          _left: _left,
          _top: _top,
          fport: _icon.fport,
          remarks: _icon.remarks,
          floor_id: this.floor_id,
        };
      }
      
      if(this.isDrag) {
        
        _left = e.clientX - 34 - this.$refs.img_div.offsetLeft - this.$refs.show_img.offsetLeft;
        _top = e.clientY - 42 - this.$refs.img_div.offsetTop - this.$refs.show_img.offsetTop;

        // 根据选中的节点，设置高亮图标
        this.show_icons.map(_obj => {
          if(_obj && _obj.sequence && _obj.sequence == _icon.sequence) {
            _obj._left = _left;
            _obj._top = _top;
            _obj.isUpdate = true;
          }
        });

      } else {
        this.isDrag = false;
      }
      
      // 根据选中的节点，设置高亮图标
      this.show_icons.map(_obj => {
        if(_obj && _obj.sequence && _obj.sequence == _icon.sequence) {
          _obj.src = require('@/assets/images/mapIcon/icon-n-light-control-selected.svg')
        } else {
          _obj.src = require('@/assets/images/mapIcon/icon-n-light-control.png')
        }
      });
      this.hide_context_menu()
      // 更新表单属性
      this.d_attr_form = {
        id: _icon.id,
        sequence: _icon.sequence,
        sensor_name: _icon.sensor_name,
        dev_eui: _icon.dev_eui,
        _left: _left,
        _top: _top,
        fport: _icon.fport,
        remarks: _icon.remarks,
        floor_id: this.floor_id,
      };
      // 赋值选中的节点
      _icon._left = _left;
      _icon._top = _top;
      this.selected_node = _icon;
    },
    /**
     * 节点鼠标右键 
     */
    right_mouse_button(_icon, e) {
      this.d_attr_form = {
        ..._icon
      };
      this.delTitle = _icon.sensor_name
      // 根据选中的节点，设置高亮图标
      this.show_icons.map(_obj => {
        if(_obj && _obj.sequence && _obj.sequence == _icon.sequence) {
          _obj.src = require('@/assets/images/mapIcon/icon-n-light-control-selected.svg')
        } else {
          _obj.src = require('@/assets/images/mapIcon/icon-n-light-control.png')
        }
      });

      // 阻止默认事件
      e.preventDefault();
      // 取消事件冒泡
      e.stopPropagation();
      // 设置选中的 节点
      this.selected_node = _icon;
      // 显示右键菜单
      this.contextmenu = {
        show: true,
        _left: _icon._left + this.$refs.img_div.offsetLeft + 17 + this.$refs.show_img.offsetLeft,
        _top: _icon._top + this.$refs.img_div.offsetTop + 13 + this.$refs.show_img.offsetTop,
      };
    },
    /**
     * 图片拖拽时 隐藏右键菜单 
     */
    hide_context_menu() {
      this.contextmenu.show = false;
    },
    /**
     * 节点删除 
     */
    delete_node() {
      let _node = this.selected_node;
      if(_node && _node.sequence) {
        this.deleteModel.status = true
        // 隐藏右键菜单
        this.contextmenu.show = false;
      }
    },
    removeIcon () {
      let _node = this.selected_node;
      // 从 show_icons 中删除
      this.deleteModel.loading = true
      if (_node.id) {
        this.deleteMapMark({id:_node.id}).then(res => {
          this.deleteModel.status = false
          this.deleteModel.loading = false
          if(res.data.code !== 0) return
          this.$Message.success('删除成功');
          this.remove_from_icons(1, _node);
          // 从 create_icons 中删除
          this.remove_from_icons(2, _node);
          this.d_attr_form = this.clear_form
        }).catch(err => this.deleteModel.loading = false)
      } else {
        this.deleteModel.loading = false
        this.deleteModel.status = false
        this.$Message.success('删除成功');
        this.remove_from_icons(1, _node);
        // 从 create_icons 中删除
        this.remove_from_icons(2, _node);
        this.d_attr_form = this.clear_form
      }
    },
    /**
     * 判断是否在数组中 
     */
    in_array(_datas, _val, _column) {
      let _rs = -1;
      if(_datas && _datas.length > 0 && _val) {
        let _obj = null;
        for(let i = 0; i < _datas.length; i++) {
          _obj = _datas[i];
          if(_column && _obj.hasOwnProperty(_column) && _obj[_column] === _val) {
            _rs = i;
          } else if(_obj === _val) {
            _rs = i;
          }
        }
      }
      return _rs;
    },
    /**
     * 从数组中删除  1-show_icons   2-create_icons 
     */
    remove_from_icons(_type, _icon) {
      switch(_type) {
        case 1:
          { // 从 show_icons 中删除
            let _i = this.in_array(this.show_icons, _icon.sequence, 'sequence');
            if(_i != -1) {
              this.show_icons.splice(_i, 1);
            }
            break;
          }
        case 2:
          { // 从 create_icons 中删除
            let _i = this.in_array(this.create_icons, _icon.sequence, 'sequence');
            if(_i != -1) {
              this.create_icons.splice(_i, 1);
            }
            break;
          }
      }
    },
    /**
     * 键盘事件
     */
    renderKeydown(e) {
      switch(e.keyCode) {
        case 46: // delete
          {
            // 删除节点
            this.delete_node();
            break;
          }

        case 37: // left arrow
          {
            // 左键头  键盘事件
            this.key_left_arrow();
            break;
          }
        case 38: // up arrow
          {
            this.key_up_arrow();
            break;
          }
        case 39: // right arrow
          {
            this.key_right_arrow();
            break;
          }
        case 40: // down arrow
          {
            this.key_down_arrow();
            break;
          }
      }
    },
    /**
      * 表单提交 
      */
    d_attr_form_submit(name) {
      this.$refs[name].validate((valid) => {
        if(valid) {
          this.spinShow = true
          let _form = this.d_attr_form;
          _form.sensor_left = _form._left;
          _form.sensor_top = _form._top;
          _form.floor_id = this.floor_id;
          _form.remarks = _form.remarks || '无';

          // 判断id是否存在，存在则修改，否则则新增
          let id = this.d_attr_form.id;
          if(id) { // 修改
            this.updateMapMark(_form).then(res => {
              this.spinShow = false
              if(res.data.code !== 0) return
                // 更新 show_icons
                this.update_show_icons(this.d_attr_form);
                this.$Message.success(this.$t('save_ok'));
            }).catch(err => this.spinShow = false);
          } else {
            this.insertMapMark(_form).then(res => {
              this.spinShow = false
              if(res.data.code !== 0) return
              this.d_attr_form.id = res.data.value.id;
              this.update_show_icons(this.d_attr_form);
              this.$Message.success(this.$t('save_ok'));
            }).catch(err => this.spinShow = false);
          }
        } else {
          this.$Message.error(this.$t('unvalid_param'))
        }
      });
    },
    /**
     * 新增成功后，更新 show_icons 
     */
    update_show_icons(_info) {
      let _src = null;
      this.show_icons.map(obj => {
        if(obj.sequence == _info.sequence) {
          obj.id = _info.id;
          obj.sensor_name = _info.sensor_name;
          obj.dev_eui = _info.dev_eui;
          obj.fport = _info.fport;
          obj.remarks = _info.remarks;
          obj._left = _info.sensor_left;
          obj._top = _info.sensor_top;
          obj.isUpdate = false;
        }
      });

      // 清空表单数据
      this.d_attr_form = this.clear_form;
    },
    /**
     * 左箭头 
     */
    key_left_arrow() {
      let _node = this.selected_node;
      if(_node && _node.sequence && _node.type == 'S') {
        _node._left = _node._left - 1;
        // 更新节点的位置
        this.update_node_lef_top(_node);
      }
    },
    /**
     * 上箭头 
     */
    key_up_arrow() {
      let _node = this.selected_node;
      if(_node && _node.sequence && _node.type == 'S') {
        _node._top = _node._top - 1;
        // 更新节点的位置
        this.update_node_lef_top(_node);
      }
    },
    /**
     * 右箭头 
     */
    key_right_arrow() {
      let _node = this.selected_node;
      if(_node && _node.sequence && _node.type == 'S') {
        _node._left = _node._left + 1;
        // 更新节点的位置
        this.update_node_lef_top(_node);
      }
    },
    /**
     * 下箭头 
     */
    key_down_arrow() {
      let _node = this.selected_node;
      if(_node && _node.sequence && _node.type == 'S') {
        _node._top = _node._top + 1;
        // 更新节点的位置
        this.update_node_lef_top(_node);
      }
    },
    /**
     * 更新 show_icons  
     */
    update_node_lef_top(_node) {
      // 更新 show_icons
      this.show_icons.map(obj => {
        if(obj && _node && obj.sequence == _node.sequence) {
          obj._left = _node._left;
          obj._top = _node._top;
        }
      });

      // 更新表单属性
      this.d_attr_form._left = _node._left;
      this.d_attr_form._top = _node._top;
    },
    
  },
  created () {
    this.init()
    this.$store.dispatch('getNodeType')
    
  },
  mounted () {
    this.clear_form = JSON.parse(JSON.stringify(this.d_attr_form));
    this.$nextTick(() => {
      
      // 清除右键行为
      document.getElementById("prisonSetting").oncontextmenu = function(e){
        return false;
      }
      document.getElementById("deleteCard").oncontextmenu = function(e){
        return false;
      }
    })
    
  },
  /**
   * 自定义方法 
   */
  directives: {
    drag: {
      // 指令的定义
      inserted: function(el, binding) {
        el.onmousedown = function(e) {

          // 鼠标左键
          if(event.button === 0) {
            // 阻止默认事件
            e.preventDefault();
            // 取消事件冒泡
            e.stopPropagation()
            var disx = e.pageX - el.offsetLeft;
            var disy = e.pageY - el.offsetTop;
            document.onmousemove = function(e) {
              el.style.left = e.pageX - disx + 'px';
              el.style.top = e.pageY - disy + 'px';
            };
            document.onmouseup = function() {
              document.onmousemove = document.onmouseup = null;
            };
          }
        };
      },
    }
  }
}
</script>

