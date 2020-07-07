<style lang="less" scoped src='./engineering.less'></style>
<template>
    <div class="content-body">
        <div class="content boxShadow">
            <div class="header">
                <span>{{$t('node_list')}}</span>
                <div>
                    <div style="margin-right:40px" @click="addNode" v-if="$route.meta.access.includes('1000.01.001')">
                        <img src="../../../assets/images/add18.svg">
                        {{$t('create_node')}}
                    </div>
                    <div style="margin-right:40px" @click="importNode($t('import_node'))" v-if="$route.meta.access.includes('1000.01.001')">
                        <img src="../../../assets/images/daoru.svg" alt="add18">
                        {{$t('import_node')}}
                    </div>
                    <div style="margin-right:40px" @click="importNode($t('update_node'))" v-if="$route.meta.access.includes('1000.01.001')">
                        <img src="../../../assets/images/daoru.svg" alt="add18">
                        {{$t('update_import')}}
                    </div>
                    <div style="margin-right:40px" @click="migrate" v-if="$route.meta.access.includes('1000.01.003')">
                        <img src="../../../assets/images/qianyi.svg" alt="add18">
                        {{$t('node_metastasis')}}
                    </div>
                    <div @click="exportExcel">
                        <img src="../../../assets/images/daochu1.svg" alt="add18">
                        {{$t('import_list')}}
                    </div>
                </div>
            </div>
            <Row type="flex" class="content_select" style="padding-right:130px;">
                <div class="content_select_input">
                    <p>{{$t('node_type')}}：</p> 
                    <Row>
                        <i-col span="12" style="width:200px">
                            <i-select v-model="nodeList.typeId" filterable clearable>
                                <i-option v-for="item in nodeType" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                            </i-select>
                        </i-col>
                    </Row>
                </div>
                <div class="content_select_input">
                    <p>{{$t('device_code')}}：</p>
                    <Input type="text" v-model="nodeList.devEui" style="width:200px"/>
                </div>
                <div class="content_select_input">
                    <p>{{$t('name')}}：</p>
                    <Input type="text" v-model="nodeList.name" style="width:200px"/>
                </div>
                <div class="select_button" @click="init">{{$t('query')}}</div>
                <transition name="slide-fade">
                    <div v-if="!haveSelect" style="position: absolute;right:25px;" class="select_button_eng gray">{{$t('bulk_operation')}}</div>
                </transition>
                <transition name="slide-fade">
                    <Dropdown trigger="click" v-if="haveSelect" @on-click="action"  placement="bottom-start" style="margin-left:30px;position: absolute;right:25px">
                        <div class="select_button_eng">{{$t('bulk_operation')}}</div>
                        <DropdownMenu style="display:flex" slot="list" >
                            <DropdownItem name='notice'>
                                <img src="../../../assets/images/tongzhi.svg">
                                {{$t('notify1')}}
                            </DropdownItem>
                            <DropdownItem name="rule">
                                <img  src="../../../assets/images/guize.svg">
                                {{$t('rule')}}
                            </DropdownItem>
                            <DropdownItem name="model">
                                <img  src="../../../assets/images/node/right2.svg">
                                {{$t('model')}}
                            </DropdownItem>
                            <DropdownItem name='delete' v-if="$route.meta.access.includes('1000.01.002')">
                                <img  src="../../../assets/images/node/right3.svg">
                                {{$t('delete')}}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </transition>
            </Row>
            <Table ref="table" :height="tableHeight" :loading="nodeList.loading" :columns="nodeList.columns" :data="nodeList.data" @on-selection-change="isSelected" ></Table>
            <div class="list_bottom">
            <Page :total="nodeList.total" :page-size="nodeList.pageSize" @on-change="nextPage" show-elevator show-total></Page>
        </div>
        </div>
        <transition name="slide-fade">
            <div class="bg" v-if="ejectList.mask" @click="close"></div>
        </transition>
        <!-- 添加/编辑节点 -->
        <transition name="detail-fade">
            <div class="add_warpper" v-if="ejectList.modify" v-show="ejectList.showModify">
                <div id="addNodeMap" class="boxShadow" >
                    <l-map ref="leaflet_maps" v-if="language === 'en-US'" :options="glmapOptions" :bounds="gbounds" style="width:100%;height:100%;" :zoom="18" :center="gmap.center" :minZoom="4" @click="mapClick">
                        <l-tile-layer :url="glmapOptions.url"></l-tile-layer>
                        <l-marker v-for="item in gmap.markers" :icon="item.lm_icon" :lat-lng="item" :key="item.index" :zIndexOffset="item.zIndexOffset">
                        </l-marker>
                    </l-map>
                    <g-map-component 
                        v-if="language === 'zh-CN'"
                        :center="gmap.center"
                        :init="gmap.init"
                        :zoom="gmap.zoom"
                        :markers="gmap.markers"
                        :show_type="gmap.show_type"
                        :type="gmap.type"
                        :auto-zoom="gmap.autoZoom"
                        :isClusterer="false"
                        @mapClick="mapClick"
                        style="width:100%;height:100%;"
                    >
                    </g-map-component>
                </div>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140" style="width:42vw;min-width:800px">
                <div class="add_detail">
                    <div class="add_title">
                    <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
                    <span>{{title}}</span>
                    </div>
                    <Row class="add_scroll" style="width:100%">
                        <FormItem :label="$t('source')+'：'" prop="source" style="margin-top:20px">
                            <i-col style="width:200px;">
                                <i-select v-model="formValidate.source" filterable>
                                <i-option value="WE">{{$t('we')}}</i-option>
                                <i-option value="AL">{{$t('al')}}</i-option>
                                <i-option value="TE">{{$t('te')}}</i-option>
                                </i-select>
                            </i-col>
                        </FormItem>
                        <div v-if="formValidate.source === 'WE'">
                            <FormItem :label="$t('middleware')+'：'" prop="middle.id" >
                            <Row type="flex">
                            <i-col span="12" style="width:200px;">
                                <i-select v-model="formValidate.middle.id" filterable>
                                    <i-option v-for="item in middleWare" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                                </i-select>
                            </i-col>
                            <i-col span="12" class="tip"> {{$t('no_sure_no_modify')}}</i-col>
                            </Row>
                            </FormItem>
                        </div>
                        <FormItem :label="$t('type')+'：'" prop="type.id" >
                            <Row>
                                <i-col span="8" style="width:200px;">
                                <i-select v-model="formValidate.type.id" filterable @on-change="changeNodeType">
                                    <i-option v-for="item in nodeType" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                                </i-select>
                                </i-col>
                            </Row>
                        </FormItem>
                        <FormItem :label="$t('model')+'：'" prop="vendor.id" >
                            <Row>
                            <i-col span="8" style="width:200px;">
                                <i-select v-model="formValidate.vendor.id" filterable>
                                <i-option v-for="item in nodeVendors" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                                </i-select>
                            </i-col>
                            <i-col span="8" class="tip"> {{$t('model_tips')}}</i-col>
                            </Row>
                        </FormItem>
                        <FormItem :label="$t('name')+'：'" prop="name">
                            <Row>
                            <i-col span="7">
                                <Input type="text" v-model="formValidate.name" style="width:200px" />
                            </i-col>
                            <i-col span="14" class="tip" style="margin-left:31px;">
                                {{$t('register_failure_prompt')}}
                            </i-col>
                            </Row>
                        </FormItem>
                        <FormItem :label="$t('device_code')+'：'" prop="devEui" >
                            <Input type="text" v-model="formValidate.devEui" :disabled="title === $t('node_edit')" style="width:400px" />
                        </FormItem>
                        <div v-if="formValidate.source === 'WE'">
                            <FormItem :label="$t('license')+'：'" prop="authCode" >
                                <Input type="text" v-model="formValidate.authCode" :disabled="title === $t('node_edit')" style="width:400px" />
                            </FormItem>
                        </div>
                        <!-- 第二组 -->
                        <FormItem :label="$t('device_status')+'：'" prop="status" >
                            <Row>
                            <i-col span="12" style="width:200px">
                                <i-select v-model="formValidate.status" filterable>
                                    <i-option value="0">{{$t('activated')}}</i-option>
                                    <i-option value="1">{{$t('inactive')}}</i-option>
                                </i-select>
                            </i-col>
                            </Row>
                        </FormItem>
                        <div v-if="formValidate.source === 'WE'">
                            <!-- 第三组 -->
                            <FormItem label="AppEUI：" prop="appEui" v-if="formValidate.source === 'WE'">
                                <Input type="text" v-model="formValidate.appEui" :disabled="title === $t('node_edit')" style="width:400px"/>
                            </FormItem>
                            <FormItem label="AppKEY：" prop="appKey" v-if="formValidate.source === 'WE'">
                                <Input type="text" v-model="formValidate.appKey" :disabled="title === $t('node_edit')" style="width:400px"/>
                            </FormItem>
                            <!-- 第四组 -->
                            <Row>
                                <i-col span="7">
                                    <FormItem label="Is_Class_C：" prop="isClassC" >
                                    <i-col style="width:100px;">
                                        <i-select v-model="formValidate.isClassC"  :disabled="title === $t('node_edit')" filterable>
                                            <i-option value="1">{{$t('yes')}}</i-option>
                                            <i-option value="2">{{$t('no')}}</i-option>
                                        </i-select>
                                    </i-col>
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                <FormItem :label="$t('ignore_dup')+'：'" prop="relaxFCnt">
                                    <i-col style="width:100px;">
                                        <i-select v-model="formValidate.relaxFCnt"  :disabled="title === $t('node_edit')" filterable>
                                            <i-option value="1">{{$t('yes')}}</i-option>
                                            <i-option value="2">{{$t('no')}}</i-option>
                                        </i-select>
                                    </i-col>
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                <FormItem label="installationMargin：" prop="">
                                    <Input type="number" v-model="formValidate.installationMargin" :disabled="title === $t('node_edit')" style="width:100px" />
                                </FormItem>
                                </i-col>
                            </Row>
                            <!-- 第五组 -->
                            <Row>
                                <i-col span="7">
                                    <FormItem label="ADR Interval：" prop="">
                                    <Input type="number"  v-model="formValidate.adrInterval" :disabled="title === $t('node_edit')" style="width:100px" />
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                <FormItem label="rx1DROffset：" prop="">
                                    <Input type="number" v-model="formValidate.rx1DrOffset" :disabled="title === $t('node_edit')" style="width:100px" />
                                </FormItem>
                                </i-col>
                                <i-col span="8">
                                <FormItem label="rxWindow：" prop="rxWindow">
                                    <i-col style="padding-right:10px;width:100px;">
                                    <i-select v-model="formValidate.rxWindow" filterable>
                                        <i-option value="RX1">RX1</i-option>
                                        <i-option value="RX2">RX2</i-option>
                                    </i-select>
                                    </i-col>
                                </FormItem>
                                </i-col>
                            </Row>
                            <!-- 第六组 -->
                            <Row>
                                <i-col span="7">
                                <FormItem label="rxDelay：" prop="" >
                                    <Input type="number"  v-model="formValidate.rxDelay" style="width:100px" />
                                </FormItem>
                                </i-col>
                                <i-col span="7">
                                <FormItem label="rx2DR：" prop="" >
                                    <Input type="number"  v-model="formValidate.rx2Dr" style="width:100px" />
                                </FormItem>
                                </i-col>
                            </Row>
                        </div>
                        <Row>
                            <i-col span="7">
                                <FormItem :label="$t('principal_name')+'：'" prop="operator" >
                                    <Input type="text" v-model="formValidate.operator"  style="width:100px" />
                                </FormItem>
                            </i-col>
                            <i-col span="10">
                                <FormItem :label="$t('principal_mobile')+'：'" prop="operatorMobile" >
                                    <Input type="text" v-model="formValidate.operatorMobile"  style="width:200px" />
                                </FormItem>
                            </i-col>
                            <i-col span="4" class="tip"> {{$t('operator_remark')}}</i-col>
                        </Row>
                        <Row>
                            <i-col span="7">
                                <FormItem :label="$t('principal_name')+'1：'" prop="operator2" >
                                    <Input type="text" v-model="formValidate.operator2" style="width:100px" />
                                </FormItem>
                            </i-col>
                            <i-col span="10">
                                <FormItem :label="$t('principal_mobile')+'1：'" prop="operatorMobile2" >
                                    <Input type="text" v-model="formValidate.operatorMobile2" style="width:200px" />
                                </FormItem>
                            </i-col>
                            <i-col span="4" class="tip"> {{$t('operator_remark')}}</i-col>
                        </Row>
                        <Row>
                            <i-col span="7">
                                <FormItem :label="$t('principal_name')+'2：'" prop="operator3" >
                                    <Input type="text" v-model="formValidate.operator3" style="width:100px" />
                                </FormItem>
                            </i-col>
                            <i-col span="10">
                                <FormItem :label="$t('principal_mobile')+'2：'" prop="operatorMobile3" >
                                    <Input type="text" v-model="formValidate.operatorMobile3" style="width:200px" />
                                </FormItem>
                            </i-col>
                            <i-col span="4" class="tip"> {{$t('operator_remark')}}</i-col>
                        </Row>
                        <FormItem :label="$t('grid_manage')+'：'" prop="groupParentIdsVo">
                            <Row style="margin-top:4px">
                            <i-col span="12" >
                                <Cascader change-on-select :data="groups" v-model="formValidate.groupParentIdsVo" style="width:200px"></Cascader>
                            </i-col>
                            </Row>
                        </FormItem>
                        <FormItem :label="$t('related_code')+'：'" prop="positionCode">
                            <Row>
                            <i-col span="7">
                                <Input type="text" v-model="formValidate.positionCode" style="width:200px" />
                            </i-col>
                            <i-col span="14" class="tip">
                                {{$t('related_code_remark')}}
                            </i-col>
                            </Row>
                        </FormItem>
                        <FormItem :label="$t('address')+'：'" prop="address">
                            <i-col>
                                <Input type="text" v-model="formValidate.address"  style="width:400px" />
                            </i-col>
                        </FormItem>
                        <Row>
                            <i-col span="7">
                                <FormItem :label="$t('lng')+'：'" prop="longitude" >
                                    <Input type="text"  v-model="formValidate.longitude"  style="width:130px" />
                                </FormItem>
                            </i-col>
                            <i-col span="8">
                                <FormItem :label="$t('lat')+'：'" prop="latitude" >
                                    <Input type="text"  v-model="formValidate.latitude"  style="width:130px" />
                                </FormItem>
                            </i-col>
                            <i-col span="7" class="tip">{{$t('click_map_prompt')}}</i-col>
                        </Row>
                        <FormItem label="备注：" prop="remarks">
                            <i-col>
                                <Input type="textarea" v-model="formValidate.remarks"   style="width:400px" />
                            </i-col>
                        </FormItem>
                    </Row>
                    <div class="add_bottom" style="width: 42vw;min-width: 800px;">
                        <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
                    </div>
                    <Spin size="large" fix v-if="spinShow"></Spin>
                </div>
                </Form>
            </div>
        </transition>
        <!-- 导入节点 -->
        <transition name="width800-fade">
            <div class="width_800" v-if="ejectList.importNode">
                <div class="add_title">
                    <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
                    <span>{{title}}</span>
                </div>
                <div class="add_scroll">
                    <div style="padding:20px 30px;display:flex">
                        <div style="font-size: 16px;font-weight: bold;margin:0 33px">{{$t('source')}}:</div>
                        <i-select  v-model="uploadSource.source" filterable style="width:200px">
                            <i-option value="WE">{{$t('we')}}</i-option>
                            <i-option value="AL">{{$t('al')}}</i-option>
                    </i-select>
                    </div>
                    <div class="uploadTitle" >
                        <div>
                            {{$t('import_file')}}：
                            <span v-if="uploadFile != null">{{uploadFile.name}}</span> 
                        </div>
                        <div v-if="title === $t('import_node')">
                            <span v-if="uploadSource.source === 'WE'"> 
                                <a :href="`${path}/p/static/node/import_tpl.xls`">{{$t('we_import_template')}}</a> 
                            </span>
                            <span v-if="uploadSource.source === 'AL'"> 
                                <a :href="`${path}/p/static/node/import_tpl_ali.xls`">{{$t('al_import_template')}}</a> 
                            </span>
                            <span>（{{$t('provide_import_format')}}）</span>
                        </div>
                        <div v-if="title === $t('update_node')">
                            <span> 
                                <a :href="`${path}/p/static/node/import_position_tpl.xls`">{{$t('update_import_template')}}</a> 
                            </span>
                            <span>（{{$t('provide_import_format')}}）</span>
                        </div>
                    </div>
                    <Upload
                    v-if="title === $t('update_node')"
                    type="drag"
                    ref="upload"
                    :headers="fileDate"
                    action="/p/a/rest-api/node/updateImp"
                    :before-upload="beforeUpload"
                    :on-error="errorUpload"
                    :data="uploadSource"
                    :show-upload-list="false">
                        <div class="content1">
                            <p class="selectFile">{{$t('select_file')}}</p>
                            <p>{{$t('drag_file')}}</p>
                        </div>
                    </Upload>
                    <Upload
                    v-if="title === $t('import_node')"
                    type="drag"
                    ref="upload"
                    :headers="fileDate"
                    action="/p/a/rest-api/node/import"
                    :before-upload="beforeUpload"
                    :on-error="errorUpload"
                    :data="uploadSource"
                    :show-upload-list="false">
                        <div class="content1">
                            <p class="selectFile">{{$t('select_file')}}</p>
                            <p>{{$t('drag_file')}}</p>
                        </div>
                    </Upload>
                    <div style="padding:20px 30px;" v-if="uploadStatus.status">
                        <div style="font-size: 16px;font-weight: bold;margin-bottom:20px">{{$t('import_result')}}：</div>
                        <Table v-if="title === $t('import_node')" :columns="uploadList.columns" :data="uploadList.data"></Table>
                        <Table v-if="title === $t('update_node')" :columns="uploadList1.columns" :data="uploadList1.data"></Table>
                    </div>
                    
                </div>
                <div class="add_bottom" v-if="title === $t('update_node')">
                    <div class="add_button" @click="saveUpload">{{$t('save')}}</div>
                </div>
                <div class="add_bottom" v-if="title === $t('import_node')">
                    <div class="add_button" @click="saveUpload1">{{$t('save')}}</div>
                </div>
                <Spin size="large" fix v-if="uploadStatus.uploadSpin"></Spin>
            </div>
        </transition>
        <!-- 节点迁移 -->
        <transition name="width800-fade">
            <div class="width_800" v-if="ejectList.migrate">
                <Form ref="migrateInfo" :model="migrateInfo" :rules="migrateValidate"  label-position="top" >
                    <div class="add_title">
                        <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
                        <span>{{$t('migrate_node')}}</span>
                    </div>
                    <Row class="add_scroll labelBlod">
                        <FormItem :label="$t('target_user')+'：'"  prop="name" style="margin-top:20px">
                            <Row>
                            <i-col span="12" style="width:730px;">
                                <Input type="text" search  :placeholder="$t('target_user')"  style="width:730px" v-model="migrateInfo.name" @on-focus="ejectList.selectUser = true" readonly/>
                            </i-col>
                            </Row>
                        </FormItem>
                        <FormItem :label="$t('selected_node')+'：'"  prop="" >
                            <Row>
                            <Tag v-for="(item,i) in transferFile" :key="i" :name="item" closable @on-close="delTransferFile">{{item}}</Tag>
                            </Row>
                        </FormItem>
                        <FormItem :label="$t('search_node')+'：'" prop="" >
                            <Row type="flex" style="flex-wrap: nowrap;white-space: nowrap;">
                                <span>{{$t('device_type')}}：</span>
                                <i-select style="width:100px;margin-right:20px" v-model="transferList.typeId" filterable clearable>
                                    <i-option v-for="item in nodeType" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                                </i-select>
                                <span>{{$t('device_code')}}：</span>
                                <Input type="text" v-model="transferList.devEui"  :placeholder="$t('ple_fill_device_code')" style="width:150px;margin-right:20px" />
                                <span>{{$t('name')}}：</span>
                                <Input type="text" v-model="transferList.name"  :placeholder="$t('enter_name_prompt')" style="width:150px" />
                                <div class="select_button" style="margin-left:33px;margin-top:0;margin-bottom:0" @click="tranfserInit">{{$t('query')}}</div>
                            </Row>
                        </FormItem>
                        <Table :loading="transferList.loading" highlight-row :columns="transferList.columns" :data="transferList.data" :height="500" @on-row-click="selectTransfer"></Table>
                        <div class="list_bottom">
                            <Page :total="transferList.total" show-total :page-size="transferList.pageSize"  show-elevator @on-change="transferNextPage"></Page>
                        </div>
                    </Row>
                    <div class="add_bottom">
                        <div class="add_button" @click="transferNode('migrateInfo')">{{$t('trans')}}</div>
                    </div>
                </Form>
                <Spin size="large" fix v-if="migrateSpin"></Spin>
            </div>
        </transition>
        <!-- 选择用户 -->
        <transition name="width400-fade">
            <div class="inner_400" v-if="ejectList.selectUser">
                <div class="add_title" >
                    <img src="../../../assets/images/node/close.svg" alt="close" @click="ejectList.selectUser = false">
                    {{$t('select_user')}}
                </div>
                <Row class="add_scroll inner" style="padding:0 30px;">
                    <Input search type="text"  style="width:340px;margin-top:20px" :placeholder="$t('input_key')" @on-search="searchOranization"/>
                    <Tree :data="organ.data" @on-select-change="getOrganRole" style="margin-top:40px;height:50vh;overflow:auto"></Tree>
                    <Row style="margin-top:20px;flex-direction: column;height:25vh;overflow:auto" type="flex"> 
                    <span style="margin-bottom:10px">{{$t('optional_users')}}：</span>
                    <div class="tags" :class="organ.selectUser == index ? 'active tags' : 'tags'" v-for="(item,index) in organ.userList" :key="index" @click="handleUser(item,index)">
                        <span>{{$t('name')}}：{{item.name}}</span>
                        <span>{{$t('dept')}}：{{item.office.name}}</span>
                    </div>
                    </Row>
                </Row>
                <div class="add_bottom" style="width:410px;">
                    <div class="add_button" @click="confirm">{{$t('confirm')}}</div>
                </div>
                <Spin size="large" fix v-if="organ.treeSpin"></Spin>
            </div>
        </transition>
        <!-- 规则 -->
        <transition name="width400-fade">
            <div class="width_400" v-if="ejectList.rule">
                <div class="add_title">
                    <img src="../../../assets/images/node/close.svg" @click="close">
                    {{$t('alert_rule_conf')}}
                </div>
                <Row class="add_scroll rule">
                    <Row type="flex" style="align-items: center;" v-for="(item,index) in ruleList" :key="index">
                        <div v-if="item.expType === 'V'">
                            <div style="font-size:16px;margin:10px 0;"> <b>{{item.name}}</b> </div>
                            <div style="display:flex;align-items: center;">
                                <span style="margin-left:20px">{{item.field.name}}{{item.operator}}：</span>
                                <Input v-model="ruleNum[index].param" style="width:50px" :value="item.parameter"/>
                            </div>
                            <span class="tip">{{item.description}}</span>
                        </div>
                        <div v-if="item.expType === 'S'" style="width:100%">
                            <Row type="flex" style="align-items:center;justify-content: space-between;">
                                    <Checkbox v-model="ruleNum[index].param"> <b style="margin-left:10px">{{item.name}}</b> </Checkbox>
                                <span class="tip">{{item.description}}</span>
                            </Row>
                        </div>
                    </Row>
                </Row>
                <div class="add_bottom" style="width:410px">
                    <div class="add_button" @click="saveRule">{{$t('save')}}</div>
                </div>
                <Spin size="large" fix v-if="ruleSpin"></Spin>
            </div>
        </transition>
        <!-- 通知 -->
        <transition name="width800-fade">
            <div class="width_800" v-if="ejectList.notice">
                <Form ref="noticeInfo" :model="noticeInfo" :rules="noticeValidate" :label-width="140">
                <div class="add_title">
                    <img src="../../../assets/images/node/close.svg" @click="close">
                    {{$t('set_person')}}
                </div>
                <Row class="add_scroll">
                    <Row style="margin-top:20px">
                        <i-col span="7">
                            <FormItem :label="$t('name')+'1：'" prop="operator" >
                                <Input type="text" v-model="noticeInfo.operator" style="width:150px" />
                            </FormItem>
                        </i-col>
                        <i-col span="7">
                            <FormItem :label="$t('mobile')+'1：'" prop="operatorMobile" >
                                <Input type="text" v-model="noticeInfo.operatorMobile" style="width:200px" />
                            </FormItem>
                        </i-col>
                    </Row>
                    <Row>
                        <i-col span="7">
                            <FormItem :label="$t('name')+'2：'" prop="operator2" >
                                <Input type="text" v-model="noticeInfo.operator2" style="width:150px" />
                            </FormItem>
                        </i-col>
                        <i-col span="7">
                            <FormItem :label="$t('mobile')+'2：'" prop="operatorMobile2" >
                                <Input type="text" v-model="noticeInfo.operatorMobile2" style="width:200px" />
                            </FormItem>
                        </i-col>
                    </Row>
                    <Row>
                        <i-col span="7">
                            <FormItem :label="$t('name')+'3：'" prop="operator3">
                                <Input type="text" v-model="noticeInfo.operator3" style="width:150px" />
                            </FormItem>
                        </i-col>
                        <i-col span="7">
                            <FormItem :label="$t('mobile')+'3：'" prop="operatorMobile3" >
                                <Input type="text" v-model="noticeInfo.operatorMobile3" style="width:200px" />
                            </FormItem>
                        </i-col>
                    </Row>
                    <FormItem :label="$t('grid_manage')+'：'" prop="griderGroup">
                        <Row style="margin-top:4px">
                            <i-col span="12" style="width:200px">
                                <Cascader change-on-select :data="groups" v-model="noticeInfo.groupParentIdsVo" ></Cascader>
                            </i-col>
                        </Row>
                    </FormItem>
                </Row>

                <div class="add_bottom" >
                    <div class="add_button" @click="saveNotice('noticeInfo')">{{$t('save')}}</div>
                </div>
                </Form>
                <Spin size="large" fix v-if="noticeSpin"></Spin>
            </div>
        </transition>
        <!-- 型号 -->
        <transition name="width400-fade">
            <div class="width_400" v-if="ejectList.model">
                <Form ref="modelValidate" :model="modelValidate" :rules="modelRule"  :label-width="100">
                <div class="add_title">
                    <img src="../../../assets/images/node/close.svg" @click="close">
                    {{$t('node_model_setting')}}
                </div>
                <Row class="add_scroll">
                    <FormItem :label="$t('type')+'：'" prop="" style="margin-top:40px">
                        <Row>
                            <i-col span="8" style="width:200px;">
                            <i-select v-model="modelValidate.type.id" filterable @on-change="changeNodeType" clearable>
                                <i-option v-for="item in nodeType" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                            </i-select>
                            </i-col>
                        </Row>
                    </FormItem>
                    <FormItem :label="$t('model')+'：'" prop="" >
                        <Row>
                        <i-col span="8" style="width:200px;">
                            <i-select v-model="modelValidate.vendor.id" filterable>
                            <i-option v-for="item in nodeVendors" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                            </i-select>
                        </i-col>
                        </Row>
                    </FormItem>
                </Row>
                <div class="add_bottom" style="width:410px">
                    <div class="add_button" @click="saveModel('modelValidate')">{{$t('save')}}</div>
                </div>
                </Form>
                <Spin size="large" fix v-if="modelSpin"></Spin>
            </div>
        </transition>
        <!-- 确认删除 -->
        <Modal v-model="deleteModel.status">
            <p slot="header" style="color:#f60;text-align:center"></p>
            <div style="text-align:center">
                <p>
                <Icon type="ios-alert-outline" size="22"/>
                {{$t('del_confirm')}} {{deleteNodesName}}?
                </p>
                <p>{{$t('cant_restore_delete')}}</p>
            </div>
            <div slot="footer">
                <Button type="success" :loading="deleteModel.loading" @click="deleteNodes">{{$t('confirm')}}</Button>
                <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import GMapComponent from '_c/BMap/gatewayMap'
import { mapGetters, mapActions } from 'vuex'
import { getToken, getHid, getUid, getSid  } from '@/libs/util'
import { deal, checkedArr } from '@/libs/tools'
import config from '@/config'
import { latLngBounds } from "leaflet"
import {LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'

export default {
    components:{
        GMapComponent,
        'l-map': LMap,
        'l-tile-layer': LTileLayer,
        'l-marker': LMarker,
        'l-popup': LPopup,
    },
    data () {
        return {
            language: this.$i18n.locale,
            glmapOptions: {
                url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                zoomControl: false,
                attributionControl: false,
            },
            gbounds: null,
            resetMap1: '',
            //点击地图的坐标
            resetMap: '',
            path: config.assetsPatch,
            tableHeight:'',
            title: '',
            ejectList:{
                mask: false,
                notice: false,
                rule: false,
                modify: false,
                showModify: false,
                importNode: false,
                migrate: false,
                selectUser: false,
                model: false,
            },
            gmap: {
                init: true,
                center: {
                lng: 114.02597366,
                lat: 22.54605355
                },
                zoom: 14,
                // marker类型  normal-正常  alarm-告警
                type: 'normal',
                // 自动缩放
                autoZoom: false,
                // marker集合
                markers: [],
                // 是否显示infoWindow, 开始必须为false
                show_type: 'N'
            },
            formValidate: {
                source: 'WE',
                appEui: '0000000000000001',
                appKey: '98929b92f09e2daf676d646d0f61d250',
                isClassC: "2",
                relaxFCnt: "1",
                installationMargin: 0,
                adrInterval: 0,
                rx1DrOffset: 0,
                rxWindow: 'RX1',
                rxDelay: 0,
                rx2Dr: 0,
                status: "0",
                middle: {id: 'cfceaa44157f4afd902cbbeccf1bfe99'},
                type: {id: ''},
                vendor: {id: ''}
            },
            ruleValidate: {
                devEui: [
                { required: true, message: this.$t('ple_fill_device_code'), trigger: 'blur' }
                ],
                authCode: [
                { required: true, message: this.$t('ple_fill_authorization_code'), trigger: 'blur' }
                ],
                appEui: [
                { required: true, message: this.$t('ple_fill_appeui'), trigger: 'blur' }
                ],
                appKey: [
                { required: true, message: this.$t('ple_fill_appkey'), trigger: 'blur' }
                ],
                source:[
                { required: true, message: this.$t('ple_select_source'), trigger:'change' }
                ],
                'middle.id':[
                { required: true, message: this.$t('ple_select_middleware'), trigger:'change' }
                ],
                'type.id':[
                { required: true, message: this.$t('ple_select_type'), trigger:'change' }
                ],
                name:[
                { required: true, message: this.$t('enter_name_prompt'), trigger:'blur' }
                ],
            },
            nodeVendors: [],
            // 通知
            noticeInfo: {},
            noticeValidate:{},
            noticeSpin: false,
            haveSelect: false,
            // 导出
            exportInfo:{
                name:'',
                devEui:'',
                typeId:''
            },
            // 导入文件
            uploadStatus: {
                uploadSpin:false,
                status: false,
            },
            uploadSource: {
                source: 'WE'
            },
            fileDate:{
                uid:getUid(),
                authorization:getToken(),
                h:getHid(),
                sid:getSid(),
            },
            currentTs:[],
            uploadList: {
                columns:[
                    {
                        title: this.$t('serial_number'),
                        type: 'index',
                        key: 'name',
                        width:100
                    },
                    {
                        title: 'devEui',
                        key: 'devEui'
                    },
                    {
                        title: 'authCode',
                        key: 'authCode'
                    },
                ],
                data:[]
            },
            uploadList1: {
                columns:[
                    {
                        title: this.$t('serial_number'),
                        type: 'index',
                        key: 'name',
                        width:100
                    },
                    {
                        title: 'devEui',
                        key: 'devEui'
                    },
                    {
                        title: 'lat',
                        key: 'latitude',
                    },
                    {
                        title: 'lng',
                        key: 'longitude',
                    },
                    {
                        title: 'address',
                        key: 'address',
                    },

                ],
                data:[]
            },
            uploadFile: null,
            // 节点列表
            nodeList:{
                columns: [
                    {
                        type: 'selection',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: this.$t('device_code'),
                        key: 'devEui',
                        minWidth:100,
                        render: (h, params) => {
                            return h('a',{
                                on: {
                                    click: () => {
                                        let name = ''
                                        if(this.$route.name === 'node_engineering'){
                                            name = 'node_detail'
                                        }else {
                                            name = 'lamp_node_detail'
                                        }
                                        this.$router.push({
                                            name: name,
                                            params: {
                                                devEui:params.row.devEui
                                            }
                                        })
                                    }
                                },
                                style: {
                                    color:"#01C1AE"
                                }
                            }, params.row.devEui)
                        }
                    },
                    {
                        title: this.$t('name'),
                        key: 'name'
                    },
                    {
                        title: this.$t('type'),
                        render: (h, params) => {
                            return h('span', params.row.type.name)
                        }
                    },
                    {
                        title: this.$t('upd_time'),
                        render: (h, params) => {
                            let ts = ''
                            this.currentTs.map(e => {
                                if(e.payload.dev_eui == params.row.devEui){
                                    ts = e.payload.ts
                                }
                            })
                            if(ts){
                                let test = moment(new Date()).valueOf() - ts
                                if(test < 60000) {
                                    ts = `${Math.floor(test*0.001)}${this.$t('seconds_ago')}`
                                    return h('span', ts)
                                }else {
                                    ts = moment(ts).fromNow()
                                    if(ts === 'Invalid date'){
                                        return h('span', '-')
                                    }else{
                                        return h('span', ts)
                                    }
                                }
                            }else{
                                return h('span', '-')
                            }
                        }
                    },
                    {
                        title: this.$t('owner'),
                        key: 'creatorName'
                    },
                    {
                        title: this.$t('middleware'),
                        render: (h, params) => {
                            return h('span', params.row.middle.name)
                        }
                    },
                    {
                        title: this.$t('source'),
                        width: 100,
                        render: (h, params) => {
                            return h('span', params.row.source === "WE" ? this.$t('we') : (params.row.source === "AL" ? this.$t('al') : this.$t('te')))
                        }
                    },
                    {
                        title: this.$t('device_status'),
                        render: (h, params) => {
                            return h('span', params.row.status === '0' ? this.$t('activated') : this.$t('inactive'))
                        }
                    },
                    {
                        title: this.$t('status'),
                        render: (h, params) => {
                            let online = params.row.isoffline
                            // this.currentTs.map(e => {
                            //     if(e.payload.dev_eui == params.row.devEui && e.payload.online === 1){
                            //         online = true
                            //     }
                            // })
                            return h('span', online ? this.$t('offline') : this.$t('online'))
                        }
                    },
                    {
                        title: this.$t('op'),
                        key: 'action',
                        width:250,
                        render: (h, params) => {
                            let btn = []
                            if(this.$route.meta.access.includes('1000.01.001')){
                                btn.push(
                                    h('Tooltip',{
                                        props:{
                                            content: this.$t('modify'),
                                            placement:'top',
                                        },
                                        style: {
                                            marginRight: '40px'
                                        }
                                    }, [
                                        h('img',{
                                        attrs: {
                                            src: require("../../../assets/images/node/right1.svg"),
                                        },
                                        style: {
                                            width:'16px',
                                            cursor:'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                    this.title = this.$t('node_edit')
                                                    this.ejectList.mask = true
                                                    this.ejectList.modify = true
                                                    this.ejectList.showModify = true
                                                    this.editNode(JSON.parse(JSON.stringify(params.row)))
                                                }
                                            }
                                        })
                                    ])
                                )
                            }

                            btn.push(
                                h('Tooltip',{
                                    props:{
                                        content: this.$t('notify1'),
                                        placement:'top',
                                    },
                                    style: {
                                        marginRight: '40px'
                                    }
                                }, [
                                    h('img',{
                                    attrs: {
                                        src: require("../../../assets/images/tongzhi.svg"),
                                    },
                                    style: {
                                        width:'16px',
                                        cursor:'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            this.ejectList.notice = true
                                            this.ejectList.mask = true
                                            this.nodes = JSON.parse(JSON.stringify(params.row.id))
                                            this.noticeInfo = JSON.parse(JSON.stringify(params.row))
                                            this.actionName = ''
                                        }
                                    }
                                    })
                                ]),
                                h('Tooltip',{
                                    props:{
                                        content: this.$t('rule'),
                                        placement:'top',
                                    },
                                    style: {
                                        marginRight: '40px'
                                    }
                                }, [
                                    h('img',{
                                    attrs: {
                                        src: require("../../../assets/images/guize.svg"),
                                    },
                                    style: {
                                        width:'16px',
                                        cursor:'pointer',
                                    },
                                    on: {
                                        click: () => {
                                            this.ejectList.mask = true
                                            this.ejectList.rule = true
                                            this.ruleList = []
                                            this.ruleNum = []
                                            this.actionName = ''
                                            this.nodes = params.row.id
                                            this.getNodeRule({nodeId:params.row.id}).then(res => {
                                                this.ruleSpin = false
                                                res.data.rs.data.map(v => {
                                                    v.description = v.description.replace(/@param@/, this.$t('the_value'))
                                                    switch (v.operator) {
                                                        case '$L$': 
                                                        v.operator = this.$t('lt')
                                                        break;
                                                        case '$E$': 
                                                        v.operator = this.$t('et')
                                                        break;
                                                        case '$B$': 
                                                        v.operator = this.$t('gt')
                                                        break;
                                                        case '$LE$': 
                                                        v.operator = this.$t('let')
                                                        break;
                                                        case '$BE$': 
                                                        v.operator = this.$t('get')
                                                        break;
                                                    }
                                                    this.ruleList.push(v)
                                                })
                                                // this.ruleNums = this.ruleList.filter(v => v.parameter).map(k => k.id)
                                                // this.changeRule(this.ruleNums)
                                                this.ruleList.map(e => {
                                                    let rule ={
                                                        id: e.id,
                                                        param: e.parameter ? (e.parameter == 'true' ? true : e.parameter) : ''
                                                    }
                                                    this.ruleNum.push(rule)
                                                })
                                            }).catch(err => this.ruleSpin = false)
                                        }
                                    }
                                    })
                                ])
                            )

                            if(this.$route.meta.access.includes('1000.01.002')){
                                btn.push(
                                h('Tooltip',{
                                    props:{
                                        content: this.$t('delete'),
                                        placement:'top',
                                    },
                                }, [
                                    h('img',{
                                    attrs: {
                                        src: require("../../../assets/images/node/right3.svg"),
                                    },
                                    style: {
                                        width:'16px',
                                        cursor:'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            this.actionName = ''
                                            this.deleteModel.status = true
                                            this.deleteNodesName = params.row.name
                                            this.nodes = params.row.id
                                        }
                                    }
                                    })
                                ])
                                )
                            }
                            return h('div', btn)
                        }
                    }
                ],
                data: [
                ],
                pageSize: 10,
                pageNo: 1,
                name: '',
                total: 0,
                typeId: '',
                devEui: '',
                loading: false
            },
            // 迁移
            transferList: {
                columns:[
                    {
                        title: this.$t('owner'),
                        key: 'creatorName',
                        tooltip:true
                    },
                    {
                        title: this.$t('type'),
                        render: (h,params) => {
                            return h('span', params.row.type.name)
                        },
                        tooltip:true
                    },
                    {
                        title: this.$t('device_code'),
                        key: 'devEui',
                        tooltip:true
                    },
                    {
                        title: this.$t('name'),
                        key: 'name',
                        tooltip:true
                    },
                    {
                        title: this.$t('remark'),
                        key: '',
                        tooltip:true
                    },
                ],
                data:[],
                pageSize: 10,
                pageNo: 1,
                name: '',
                total: 0,
                typeId: '',
                devEui: '',
                loading: true
            },
            transferFile:[],
            ids:[],
            migrateSpin:false,
            // 规则
            ruleList:[],
            selectRule:[],
            ruleSpin: true,
            ruleNum:[],
            ruleNumber:[],
            actionName:'',
            nodes:'',
            // 选择用户
            organ:{
                list:[],
                data:[],
                userList:'',
                selectUser:-1,
                targetUser:'',
                treeSpin: false,
            },
            migrateInfo:{
                name:''
            },
            migrateValidate:{
                name: [
                    { required: true, message: this.$t('select_target_user'), trigger: 'change'}
                ]
            },
            // 型号
            modelValidate: {
                type: {id: ''},
                vendor: {id: ''}
            },
            modelRule: {},
            modelSpin: false,
            //删除
            deleteNodesName:'',
            spinShow: false,
            deleteModel: {
                status: false,
                loading: false,
                formValidate: {}
            },
        }
    },
    computed: {
        ...mapGetters([
            'groups',
            'nodeType',
            'middleWare',
            'organizationList'
        ])
    },
    methods: {
        ...mapActions([
            'getNodeList',
            'saveNode',
            'deleteNode',
            'getNodeVendors',
            'getOrganizationUsers',
            'migrateNode',
            'getNodeRule',
            'saveNodeRule',
            'saveNodeNotice',
            'getNodeCurrent',
            'setVendor',
            'batchDeleteNode',
            'toUploadNode',
            'saveUploadNode'
        ]),
        // 获取节点列表
        init () {
            // this.nodeList.loading = true
            this.haveSelect = false
            const data = {
                pageSize: this.nodeList.pageSize, 
                pageNo: this.nodeList.pageNo, 
                name: this.nodeList.name,
                devEui: this.nodeList.devEui,
                'type.id': this.nodeList.typeId,
                model:'factory'
            }
            
            this.getNodeList(data).then(res => {
                const data = res.data.rs
                
                this.exportInfo = {
                    name: this.nodeList.name,
                    devEui: this.nodeList.devEui,
                    typeId: this.nodeList.typeId
                }
                let devEui = []
                data.data.list.map(e => {
                    devEui.push(e.devEui)
                })
                this.getNodeCurrent({devEUIs:devEui.join(',')}).then(res => {
                    this.nodeList.loading = false
                    this.currentTs = res.data.rs.data
                    data.data.list.forEach(e => {
                        let state = this.currentTs.find(v => v.payload.dev_eui === e.devEui)
                        e.isoffline = true
                        if(state){  
                            if (state.payload.online === 1) e.isoffline = false
                        }
                    })
                    this.nodeList.data = data.data.list
                    this.nodeList.total = data.data.count
                })
            })
        },
        nextPage (page) {
            this.nodeList.pageNo = page
            this.init()
        },
        // 迁移列表
        tranfserInit () {
            this.transferList.loading = true
            const data = {
                pageSize: this.transferList.pageSize, 
                pageNo: this.transferList.pageNo, 
                name: this.transferList.name,
                devEui: this.transferList.devEui,
                'type.id': this.transferList.typeId,
                model:'factory'
            }
            this.getNodeList(data).then(res => {
                const data = res.data.rs
                this.transferList.data = data.data.list
                this.transferList.total = data.data.count
                this.transferList.loading = false
            })
        },
        transferNextPage (page) {
            this.transferList.pageNo = page
            this.tranfserInit()
        },
        // 导出节点
        exportExcel () {
            window.location.href=`${this.path}/p/a/rest-api/node/export?name=${this.exportInfo.name}&devEui=${this.exportInfo.devEui}&type.id=${this.exportInfo.typeId}&token=${getToken()}&h=${getHid()}&uid=${getUid()}&sid=${getSid()}`
        },
        // 导入节点
        beforeUpload (file) {
            this.uploadFile = file
            return false
        },
        saveUpload () {
            if(!this.uploadFile) {
                return this.$Message.error(this.$t('ple_select_file'))
            }
            this.uploadStatus.uploadSpin = true
            let file = new FormData()
            file.append('file',this.uploadFile)
            file.append('source',this.uploadSource.source)
            this.toUploadNode(file).then(res => {
                this.uploadStatus.uploadSpin = false
                this.uploadStatus.status = true
                this.uploadList1.data = res.data.rs.data
                if(res.data.code !== 0) return
                this.$store.dispatch('getNodes', { update: 1})
                this.$Message.success(this.$t('import_success'))
            }).catch(err => this.uploadStatus.uploadSpin = false)
        },
        //导入节点
        saveUpload1 () {
            if(!this.uploadFile) {
                return this.$Message.error(this.$t('ple_select_file'))
            }
            this.uploadStatus.uploadSpin = true
            let file = new FormData()
            file.append('file',this.uploadFile)
            file.append('source',this.uploadSource.source)
            this.saveUploadNode(file).then(res => {
                this.uploadStatus.uploadSpin = false
                this.uploadStatus.status = true
                this.uploadList.data = res.data.rs.data
                if(res.data.code !== 0) return
                this.$store.dispatch('getNodes', { update: 1})
                this.$Message.success(this.$t('import_success'))
            }).catch(err => this.uploadStatus.uploadSpin = false)
        },
        errorUpload (error, file, fileList) {
            this.uploadStatus.uploadSpin = false
            this.$Message.error(this.$t('import_error'))
        },
        // 迁移文件选择
        selectTransfer (row) {
            let select = this.transferFile.find(e => e == row.name)
            if (!select) {
                this.transferFile.push(row.name)
                this.ids.push(row.id)
            }
        },
        // 删除已选文件
        delTransferFile (event, name) {
            const index = this.transferFile.indexOf(name);
            this.transferFile.splice(index,1)
            this.ids.splice(index,1)
        },
        // 根据机构获取用户
        getOrganRole(row) {
            const id = row[0].id
            this.organ.treeSpin = true
            this.getOrganizationUsers({officeId: id}).then(res => {
                this.targetUser = ''
                this.selectUser  = -1
                this.organ.treeSpin = false
                const data = res.data.rs.data
                this.organ.userList = data
            }).catch(() => this.organ.treeSpin = false)
        },
        // 选择用户
        handleUser (item,index) {
            this.organ.selectUser = index
            this.organ.targetUser = item
        },
        // 确定
        confirm () {
            if (this.organ.targetUser) {
                this.migrateInfo.name = this.organ.targetUser.name
                this.ejectList.selectUser = false
            } else {
                this.$Message.error(this.$t('ple_select_user'))
            }
        },
        //搜索机构
        searchOranization(value) {
            let arrs = []
            arrs = JSON.parse(JSON.stringify(this.organ.list))
            if(value === '') {
                this.organ.data = arrs
                return
            }
            this.organ.data = deal(arrs, node => node.title.indexOf(value) > -1 )
        },
        // 迁移节点
        transferNode (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.ids.length == 0) return this.$Message.error(this.$t('ple_select_file'))
                    let data = {
                        userId:this.organ.targetUser.id,
                        ids:this.ids.join(',')
                    }
                    this.migrateSpin = true
                    this.migrateNode(data).then(res => {
                        this.migrateSpin = false
                        if(res.data.code !=0) return
                        this.organ.selectUser = -1
                        this.organ.targetUser = ''
                        this.transferFile = []
                        this.ids = []
                        this.tranfserInit()
                        this.$store.dispatch('getNodes', { update: 1})
                        this.$Message.success(this.$t('migrate_success'))
                        this.$refs[name].resetFields()
                    }).catch(err => this.migrateSpin = false)
                } else {
                    this.$Message.error(this.$t('unvalid_param'))
                }
            })
        },
        changeNodeType (value) {
            let a = this.nodeType.find(e => e.id == value)
            if(a){
                // 如果有点点击地图，则使用点击地图的坐标重新渲染icon
                if(this.resetMap){
                    this.gmap.center = this.resetMap
                    let icon = require('../../../assets/images/mapIcon/' + a.iconAddr )
                    this.gmap.markers = [
                        {
                        ...this.resetMap,
                        icon: icon,
                        'lm_icon':L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
                        },
                    ]
                } else {
                    this.gmap.center = this.resetMap1 || {
                        lng: 114.02597366,
                        lat: 22.54605355
                    }
                    let icon = require('../../../assets/images/mapIcon/' + a.iconAddr )
                    this.gmap.markers = [
                        {
                        ...this.resetMap1,
                        icon: icon,
                        'lm_icon':L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
                        },
                    ]
                }
                
                this.selectIcon = require('../../../assets/images/mapIcon/' + a.iconAddr )
            }
            this.formValidate.vendor.id = ''
            this.modelValidate.vendor.id = ''
            this.getNodeVendors({typeId: value}).then(res => {
                this.nodeVendors = res.data.rs.data
            })
        },
        // 编辑弹窗地图选点
        mapClick (e) {
            const icon = this.selectIcon || require('../../../assets/images/mapIcon/unknown.png')
            let point = ''
            let bounds = []
            if (this.language === 'zh-CN') {
                point = e.point
            }
            if (this.language === 'en-US') {
                point = e.latlng
            }
            this.resetMap = point
            point.icon = icon
            point.lm_icon = L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
            bounds.push({ lat: parseFloat(point.lat), lng: parseFloat(point.lng) })
            this.gbounds = latLngBounds(bounds)
            this.gmap.center = point
            this.gmap.markers = [point]
            this.formValidate.longitude = point.lng
            this.formValidate.latitude = point.lat
            this.formValidate.address = e.address
        },
        // 编辑， 保存
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // console.log(this.$refs[name].model);
                    this.spinShow = true
                    const data = {
                        griderGroup: this.$refs[name].model.groupParentIdsVo ? this.$refs[name].model.groupParentIdsVo[this.$refs[name].model.groupParentIdsVo.length - 1] : '',
                        ...this.$refs[name].model
                    }
                    this.saveNode(data).then(res => {
                        this.spinShow = false
                        if (res.data.code !== 0) return
                        this.$store.dispatch('getNodes', { update: 1})
                        this.init()
                        this.$refs['formValidate'].resetFields();
                        this.close()
                        this.$Message.success(this.$t('save_ok'))
                    }).catch(err => this.spinShow = false)
                } else {
                    this.$Message.error(this.$t('unvalid_param'))
                }
            })
        },
        editNode (row) {
            this.resetMap = ''
            if(row.type) {
                this.changeNodeType(row.type.id)
            }else{
                row.type = {id: ''}
            }
            if(!row.middle) row.middle = {id: 'cfceaa44157f4afd902cbbeccf1bfe99'}
            if(!row.vendor) row.vendor = {id: ''}
            
            if (this.language === 'zh-CN') {
                setTimeout(() => {
                this.formValidate = JSON.parse(JSON.stringify(row))
                const point = {
                    lng: row.longitude ? parseFloat(row.longitude) : '',
                    lat: row.latitude ? parseFloat(row.latitude) : '',
                    icon: row.type.iconAddr ? require('../../../assets/images/mapIcon/' + row.type.iconAddr ) : require('../../../assets/images/mapIcon/unknown.png')
                }
                this.resetMap1 = {
                    lng: row.longitude ? parseFloat(row.longitude) : '',
                    lat: row.latitude ? parseFloat(row.latitude) : '',
                }
                this.gmap.center = point
                this.gmap.markers = [point]
                this.$set(this.gmap.markers, 0, point)
                },0)
            }
            if (this.language === 'en-US') {
                this.formValidate = JSON.parse(JSON.stringify(row))
                const icon = row.type.iconAddr ? require('../../../assets/images/mapIcon/' + row.type.iconAddr ) : require('../../../assets/images/mapIcon/unknown.png')
                const point = {
                lng: row.longitude ? parseFloat(row.longitude) : '',
                lat: row.latitude ? parseFloat(row.latitude) : '',
                icon: icon,
                'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
                }
                //编辑时改获取当前节点的坐标并保存到resetMap1中
                this.resetMap1 = {
                lng: row.longitude ? parseFloat(row.longitude) : '',
                lat: row.latitude ? parseFloat(row.latitude) : '',
                }
                this.gmap.center = point
                this.gmap.markers = [point]
                this.$set(this.gmap.markers, 0, point)
            }
        },
        // 删除节点
        deleteNodes () {
            let node = []
            if(this.actionName == this.$t('bulk_operation')){
                this.selectRule.map(e => {
                    node.push(e.id)
                })
            } else {
                node.push(this.nodes)
            }
            this.deleteModel.loading = true
            this.batchDeleteNode({nodeIds:node.join(',')}).then(res => {
                this.deleteModel.loading = false
                this.deleteModel.status = false
                this.init()
                if(res.data.code != 0) return
                this.$store.dispatch('getNodes', { update: 1})
                this.$Message.success(this.$t('delete_ok'))
            }).catch(err => this.deleteModel.loading = false)
        },
        // 保存型号
        saveModel (name) {
            let node = []
            this.selectRule.map(e => {
                node.push(e.id)
            })
            let data = {
                nodes:node,
                typeId: this.$refs[name].model.type.id,
                vendorId: this.$refs[name].model.vendor.id
            }
            this.modelSpin = true
            this.setVendor(data).then(res => {
                this.modelSpin = false
                if (res.data.code != 0) return
                this.$Message.success(this.$t('save_ok'))
                this.init()
                this.close()
            }).catch(err => this.modelSpin = false)
        },
        // 保存通知
        saveNotice (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.noticeSpin = true
                    let node = []
                    if(this.actionName == this.$t('bulk_operation')){
                        this.selectRule.map(e => {
                            node.push(e.id)
                        })
                    } else {
                        node.push(this.nodes)
                    }
                    const data = {
                        nodes:node,
                        griderGroup: this.$refs[name].model.groupParentIdsVo.length > 0 ? this.$refs[name].model.groupParentIdsVo[this.$refs[name].model.groupParentIdsVo.length - 1] : '',
                        groupParentIdsVo: this.$refs[name].model.groupParentIdsVo,
                        operator:this.$refs[name].model.operator,
                        operator2:this.$refs[name].model.operator2,
                        operator3:this.$refs[name].model.operator3,
                        operatorMobile: this.$refs[name].model.operatorMobile,
                        operatorMobile2: this.$refs[name].model.operatorMobile2,
                        operatorMobile3: this.$refs[name].model.operatorMobile3,
                    }
                    this.saveNodeNotice(data).then(res => {
                        this.noticeSpin = false
                        this.init()
                        this.close()
                        if (res.data.code != 0) return
                        this.$Message.success(this.$t('save_ok'))
                        
                    }).catch(err => this.noticeSpin = false)
                } else {
                    this.$Message.error(this.$t('unvalid_param'))
                }
            })
        },
        // 保存规则
        saveRule () {
            let node = []
            if(this.actionName == this.$t('bulk_operation')){
                this.selectRule.map(e => {
                    node.push(e.id)
                })
            } else {
                node.push(this.nodes)
            }
            let data = {
                nodes: node,
                rules: this.ruleNum
            }
            this.ruleSpin = true
            this.saveNodeRule(data).then(res => {
                this.ruleSpin = false
                this.close()
                if(res.data.code !=0) return
                this.$Message.success(this.$t('save_ok'))
            }).catch(err => this.ruleSpin = false)
        },
        isSelected (selection) {
            if (selection.length > 0) {
                this.haveSelect = true
            } else {
                this.haveSelect = false
            }
            this.selectRule = selection
        },
        action (name) {
            this.actionName = this.$t('bulk_operation')
            if (name === 'delete') {
                this.deleteModel.status = true
                this.deleteNodesName = this.$t('selected_node1')
            }
            if (name === 'rule') {
                this.ejectList.mask = true
                this.ejectList.rule = true
                this.ruleList = []
                this.ruleNum = []
                this.getNodeRule({nodeId:this.selectRule[0].id}).then(res => {
                    res.data.rs.data.map(v => {
                        this.ruleSpin = false
                        v.description = v.description.replace(/@param@/, this.$t('the_value'))
                        switch (v.operator) {
                            case '$L$': 
                            v.operator = this.$t('lt')
                            break;
                            case '$E$': 
                            v.operator = this.$t('et')
                            break;
                            case '$B$': 
                            v.operator = this.$t('gt')
                            break;
                            case '$LE$': 
                            v.operator = this.$t('let')
                            break;
                            case '$BE$': 
                            v.operator = this.$t('get')
                            break;
                        }
                        this.ruleList.push(v)
                    })
                    this.ruleList.map(e => {
                        let rule ={
                            id: e.id,
                            param: e.parameter ? (e.parameter == 'true' ? true : e.parameter) : ''
                        }
                        this.ruleNum.push(rule)
                    })
                }).catch(err => this.ruleSpin = false)
            }
            if (name === 'notice') {
                this.ejectList.mask = true
                this.ejectList.notice = true
                this.noticeInfo = {
                    groupParentIdsVo: [],
                    operator: '',
                    operator2: '',
                    operator3: '',
                    operatorMobile: '',
                    operatorMobile2: '',
                    operatorMobile3: '',
                    griderGroup: '',
                }
            }
            if (name === 'model' ) {
                this.ejectList.mask = true
                this.ejectList.model = true
                this.modelValidate = {
                    type: {id: ''},
                    vendor: {id: ''}
                }
            }
        },
        addNode () {
            this.title = this.$t('create_node')
            this.resetMap = ''
            this.resetMap1 = ''
            this.ejectList.mask = true
            this.ejectList.modify = true
            this.ejectList.showModify = true
            const icon = require('../../../assets/images/mapIcon/unknown.png')
            this.gmap.markers = [{
                lng: 114.02597366,
                lat: 22.54605355,
                icon: icon,
                'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
            }]
            this.gmap.center = {
                lng: 114.02597366,
                lat: 22.54605355,
            }
            this.formValidate = {
                source: 'WE',
                appEui: '0000000000000001',
                appKey: '98929b92f09e2daf676d646d0f61d250',
                isClassC: "2",
                relaxFCnt: "1",
                installationMargin: 0,
                adrInterval: 0,
                rx1DrOffset: 0,
                rxWindow: 'RX1',
                rxDelay: 0,
                rx2Dr: 0,
                status: "0",
                middle: {id: 'cfceaa44157f4afd902cbbeccf1bfe99'},
                type: {id: ''},
                vendor: {id: ''}
            }
        },
        importNode (name) {
            this.uploadFile = null 
            this.uploadStatus.status = false
            this.title = name
            this.ejectList.importNode = true
            this.ejectList.mask = true
        },
        migrate () {
            this.tranfserInit()
            this.ejectList.migrate = true
            this.ejectList.mask = true
        },
        close () {
            this.ejectList.mask = false
            this.ejectList.showModify = false
            this.ejectList.importNode = false
            this.ejectList.migrate = false
            this.ejectList.selectUser = false
            this.ejectList.rule = false
            this.ejectList.notice = false
            this.ejectList.model = false
            if(this.$refs['formValidate']){
                this.$refs['formValidate'].resetFields();
            }
        }
    },
    created () {
        this.$store.dispatch('getGroups')
        this.$store.dispatch('getNodeType')
        this.$store.dispatch('getMiddleWare')
        this.$store.dispatch('getOrganizationLists')
        this.organ.list = this.organizationList
        this.organ.data = this.organizationList
        this.init()
    },
    mounted () {
        this.$nextTick(()=>{
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
        })
        window.onresize = () => {
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
        }
        if(this.$i18n.locale === 'en-US') {
            moment.locale('en-us')
        }else{
            moment.locale('zh-cn')
        }
    },
    beforeDestroy(){
        
    }

}
</script>