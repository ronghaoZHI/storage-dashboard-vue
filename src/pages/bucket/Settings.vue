<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/">{{$t("STORAGE.TITLE")}}</Breadcrumb-item>
                <Breadcrumb-item>{{$t("STORAGE.BUCKET_SETTING")}} ({{bucket}})</Breadcrumb-item>
            </Breadcrumb>
            <div></div>
        </div>
    
        <Tabs size="small" v-model="tabName">
            <Tab-pane :label='$t("PUBLIC.ACL")' name="permission">
                <div class="section-separator">
                    <div class="separator-body">
                        <span class="separator-icon"></span>
                        <span class="separator-info">{{$t("STORAGE.ACL_USER_GROUP")}}</span>
                    </div>
                </div>
                <table class="table-permission">
                    <thead>
                        <tr>
                            <th class="percent20">{{$t("STORAGE.ACL_GROUP")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.ACL_GROUP_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th class="percent30">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.BUCKET_OBJECT_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th class="percent30">{{$t("STORAGE.ACL_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.BUCKET_ACL_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th class="percent20"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in GroupACLList">
                            <td>
                                {{item.Grantee | userType}}
                            </td>
                            <td>
                                <Checkbox v-model="item.Permission.READ">{{$t("STORAGE.READ")}}</Checkbox>
                                <Checkbox v-model="item.Permission.WRITE">{{$t("STORAGE.WRITE")}}</Checkbox>
                            </td>
                            <td>
                                <Checkbox v-model="item.Permission.READ_ACP">{{$t("STORAGE.READ")}}</Checkbox>
                                <Checkbox v-model="item.Permission.WRITE_ACP">{{$t("STORAGE.WRITE")}}</Checkbox>
                            </td>
                            <td>
                                <Button style="margin: 0 6px;visibility:hidden;" size="small">
                                    <Icon type="ios-plus" :size="iconSize"></Icon>
                                </Button>
                                <Button style="margin: 0 6px;visibility:hidden;" size="small">
                                    <Icon type="ios-minus" :size="iconSize"></Icon>
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="section-separator">
                    <div class="separator-body">
                        <span class="separator-icon"></span>
                        <span class="separator-info">{{$t("STORAGE.ACL_USER")}}</span>
                    </div>
                </div>
                <table class="table-permission">
                    <thead>
                        <tr>
                            <th class="percent20"> {{$t("STORAGE.USER")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.ACL_USER_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th class="percent30">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.BUCKET_OBJECT_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th class="percent30">{{$t("STORAGE.ACL_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.BUCKET_ACL_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isAdd">
                            <td>
                                <input class="new-user-input" v-model="newUserItem.name">
                                <Button class="new-user-button" @click="isAdd = false" size="small">{{$t("PUBLIC.CANCLE")}}</Button>
                            </td>
                            <td>
                                <Checkbox v-model="newUserItem.Permission.READ">{{$t("STORAGE.READ")}}</Checkbox>
                                <Checkbox v-model="newUserItem.Permission.WRITE">{{$t("STORAGE.WRITE")}}</Checkbox>
                            </td>
                            <td>
                                <Checkbox v-model="newUserItem.Permission.READ_ACP">{{$t("STORAGE.READ")}}</Checkbox>
                                <Checkbox v-model="newUserItem.Permission.WRITE_ACP">{{$t("STORAGE.WRITE")}}</Checkbox>
                            </td>
                            <td></td>
                        </tr>
                        <tr v-for="(item,index) in UserACLList">
                            <td>
                                {{item.Grantee | userType}}
                            </td>
                            <td>
                                <Checkbox :disabled="owner == item.Grantee.ID" v-model="item.Permission.READ">{{$t("STORAGE.READ")}}</Checkbox>
                                <Checkbox :disabled="owner == item.Grantee.ID" v-model="item.Permission.WRITE">{{$t("STORAGE.WRITE")}}</Checkbox>
                            </td>
                            <td>
                                <Checkbox :disabled="owner == item.Grantee.ID" v-model="item.Permission.READ_ACP">{{$t("STORAGE.READ")}}</Checkbox>
                                <Checkbox :disabled="owner == item.Grantee.ID" v-model="item.Permission.WRITE_ACP">{{$t("STORAGE.WRITE")}}</Checkbox>
                            </td>
                            <td>
                                <Tooltip placement="bottom">
                                    <Button v-if="index == 0" style="margin: 0 6px;" size="small" @click="newUserItemInit();isAdd = true">
                                        <Icon type="ios-plus" :size="iconSize"></Icon>
                                    </Button>
                                    <Button v-else style="margin: 0 6px;visibility:hidden;" size="small">
                                        <Icon type="ios-plus" :size="iconSize"></Icon>
                                    </Button>
                                    <div slot="content">
                                        <p>{{$t("STORAGE.ADD_USER")}}</p>
                                    </div>
                                </Tooltip>
                                <Tooltip placement="bottom">
                                    <Button :disabled="owner == item.Grantee.ID" style="margin: 0 6px;" size="small" @click="deleteUser(item)">
                                        <Icon type="ios-minus" :size="iconSize"></Icon>
                                    </Button>
                                    <div slot="content">
                                        <p>{{$t("STORAGE.DELETE_USER")}}</p>
                                    </div>
                                </Tooltip>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Button type="primary" v-if="!isAdd || isAdd && isAddVerified" @click="ACLsubmitForm()">{{$t("STORAGE.SAVE_PERMISSIONS")}}</Button>
                <Button type="primary" v-else disabled :title='$t("STORAGE.INVALID_NEW_USER")'>{{$t("STORAGE.SAVE_PERMISSIONS")}}</Button>
            </Tab-pane>
            <Tab-pane :label='$t("STORAGE.PIC_IDEN")' name="pic">
                We've got somethings special for you
            </Tab-pane>
            <Tab-pane :label='$t("STORAGE.CORS_CONFIG")' name="cors">
                <Button class="button-bsc-add-rule" type="primary" @click="addCorsRule">{{$t('STORAGE.ADD_RULE')}}</Button>
                <Table border :context="self" :stripe="true" :highlight-row="true" :columns="listHeader" :data="corsRulesList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
            </Tab-pane>
        </Tabs>
        <Modal v-model="showCorsModal" :title='$t("STORAGE.CORS_CONFIG")' width="700" class="edit-modal">
            <div class="form-item">
                <span class="form-label required-item">{{$t('STORAGE.ALLOWED_ORIGINS')}} : </span>
                <Input v-model="input_allowed_origin" placeholder="http://www.baishancloud.com" class="line-width" @on-enter="addAllowedOrigin"></Input>
                <p class="info">{{$t('STORAGE.ENTER_KEY')}}</p>
                <div class="tag-margin-left">
                    <Tag type="border" color="blue" v-for="item in corsModal.AllowedOrigins" :key="item" :name="item" closable @on-close="tagCloseAllowedOrigin">{{item}}</Tag>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label required-item">{{$t('STORAGE.ALLOWED_METHODS')}} : </span>
                <Checkbox-group style="display:inline" v-model="corsModal.AllowedMethods">
                    <Checkbox class="modal-checkbox" label="GET" >GET</Checkbox>
                    <Checkbox class="modal-checkbox" label="PUT">PUT</Checkbox>
                    <Checkbox class="modal-checkbox" label="HEAD">HEAD</Checkbox>
                    <Checkbox class="modal-checkbox" label="POST">POST</Checkbox>
                    <Checkbox class="modal-checkbox" label="DELETE">DELETE</Checkbox>
                </Checkbox-group>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('STORAGE.ALLOWED_HEADERS')}} : </span>
                <Input v-model="input_allowed_header" class="line-width" @on-enter="addAllowedHeader"></Input>
                <p class="info">{{$t('STORAGE.ENTER_KEY')}}</p>
                <div class="tag-margin-left">
                    <Tag type="border" color="blue" v-for="item in corsModal.AllowedHeaders" :key="item" :name="item" closable @on-close="tagCloseAllowedHeader">{{item}}</Tag>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('STORAGE.EXPOSE_HEADERS')}} : </span>
                <Input v-model="input_expose_header" class="line-width" @on-enter="addExposeHeader"></Input>
                <p class="info">{{$t('STORAGE.ENTER_KEY')}}</p>
                <div class="tag-margin-left">
                    <Tag type="border" color="blue" v-for="item in corsModal.ExposeHeaders" :key="item" :name="item" closable @on-close="tagCloseExposeHeader">{{item}}</Tag>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('STORAGE.CACHE_TIME')}} : </span>
                <Input style="width:100px" v-model="corsModal.MaxAgeSeconds" class="line-width"></Input>
                <span>s</span>
            </div>
            <div slot="footer">
                <Button type="primary" @click="putBucketCors">{{$t('VIDEO.OK')}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { handler } from '@/service/Aws'
import picDetection from './picDetection'
export default {
    data () {
        return {
            self: this,
            GroupACLList: this.GroupACLList,
            UserACLList: this.UserACLList,
            isAdd: false,
            owner: this.owner,
            newUserItem: {
                name: '',
                Permission: {
                    READ: false,
                    WRITE: false,
                    READ_ACP: false,
                    WRITE_ACP: false
                }
            },
            index_to_edit_cors_rule: '',
            input_allowed_origin: '',
            input_allowed_header: '',
            input_expose_header: '',
            corsModal: {
                AllowedOrigins: [],
                AllowedMethods: ['GET'],
                AllowedHeaders: [],
                ExposeHeaders: [],
                MaxAgeSeconds: ''
            },
            putBucketCorsParams: {
                Bucket: '',
                CORSConfiguration: {
                    CORSRules: []
                }
            },
            corsRulesList: [],
            showCorsModal: false,
            listHeader: [{
                title: this.$t('STORAGE.ALLOWED_ORIGINS'),
                width: 200,
                render: (h, params) => {
                    return h('div', params.row.allowed_origins_front.map(item => h('p', item)))
                }
            }, {
                title: this.$t('STORAGE.ALLOWED_METHODS'),
                width: 150,
                render: (h, params) => {
                    return h('div', params.row.allowed_methods_front.map(item => h('p', item)))
                }
            }, {
                title: this.$t('STORAGE.ALLOWED_HEADERS'),
                width: 150,
                render: (h, params) => {
                    return h('div', params.row.allowed_headers_front.map(item => h('p', item)))
                }
            }, {
                title: this.$t('STORAGE.EXPOSE_HEADERS'),
                width: 150,
                render: (h, params) => {
                    return h('div', params.row.expose_headers_front.map(item => h('p', item)))
                }
            }, {
                title: this.$t('STORAGE.CACHE_TIME'),
                key: 'cache_time',
                width: 150
            }, {
                title: this.$t('STORAGE.TABLE_ACTION'),
                key: 'actions',
                width: 100,
                align: 'right',
                render: (h, params) => {
                    return h('div', [h('Tooltip', {
                        props: {
                            content: this.$t('PUBLIC.EDIT'),
                            delay: 500,
                            placement: 'top'
                        },
                        'class': {
                            'mar-r-5': true
                        }
                    }, [h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.addCorsRule(params.row._index)
                            }
                        }
                    }, [h('Icon', {
                        props: {
                            type: 'compose',
                            size: this.iconSize
                        }
                    })])]), h('Tooltip', {
                        props: {
                            content: this.$t('PUBLIC.DELETE'),
                            delay: 500,
                            placement: 'top'
                        }
                    }, [h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.deleteCorsRuleConfirm(params.row._index)
                            }
                        }
                    }, [h('Icon', {
                        props: {
                            type: 'ios-trash',
                            size: this.iconSize
                        }
                    })])])])
                }
            }],
            iconSize: 16,
            deleteList: [],
            tabName: 'permission'
        }
    },
    components: {picDetection},
    computed: {
        bucket () {
            return this.$route.params.bucket
        },
        isAddVerified () {
            let name = this.newUserItem.name
            let { READ, WRITE, READ_ACP, WRITE_ACP } = this.newUserItem.Permission
            return name && (READ || WRITE || READ_ACP || WRITE_ACP)
        }
    },
    created () {
        this.getACLList()
        this.listCorsRules()
    },
    methods: {
        async getACLList () {
            this.$Loading.start()
            try {
                let res = await handler('getBucketAcl', {
                    Bucket: this.bucket
                })
                this.GroupACLList = convertGrants(res.Grants)[0]
                this.UserACLList = convertGrants(res.Grants)[1]
                this.Data = {
                    bucket: this.bucket,
                    grants: res.Grants,
                    owner: res.Owner
                }
                this.owner = res.Owner.ID
            } catch (error) {
                this.$Message.error(this.$t('STORAGE.GET_PERMISSION_FAILED'))
            }
            this.$Loading.finish()
        },
        async ACLsubmitForm () {
            this.$Loading.start()
            let originItems = [...this.GroupACLList, ...this.UserACLList, ...this.deleteList]
            let items = _.cloneDeep(originItems)
            if (this.isAdd) {
                this.newUserItemPut = convertNewUserItem(this.newUserItem)
                items = items.concat(this.newUserItemPut)
            }
            items = _.filter(items, value => {
                value.Permission = convertObject2String(value.Permission)
                return value.Permission.length > 0
            })
            if (items.length === 0) {
                this.$Message.error(this.$t('STORAGE.PERMISSION_EMPTY'))
                return false
            }
            let params = {
                Bucket: this.Data.bucket,
                AccessControlPolicy: {
                    Grants: items,
                    Owner: this.Data.owner
                }
            }
            try {
                await handler('putBucketAcl', params)
                this.$Message.success(this.$t('STORAGE.PERMISSION_SUCCESS'))
                this.deleteList = []
                if (this.isAdd) {
                    this.UserACLList = this.UserACLList.concat(convertNewUserItem(this.newUserItem))
                    this.isAdd = false
                }
            } catch (error) {
            }
            this.$Loading.finish()
        },
        addAllowedOrigin () {
            this.corsModal.AllowedOrigins.push(this.input_allowed_origin)
            this.input_allowed_origin = ''
        },
        addAllowedHeader () {
            this.corsModal.AllowedHeaders.push(this.input_allowed_header)
            this.input_allowed_header = ''
        },
        addExposeHeader () {
            this.corsModal.ExposeHeaders.push(this.input_expose_header)
            this.input_expose_header = ''
        },
        tagCloseAllowedOrigin (event, name) {
            const index = this.corsModal.AllowedOrigins.indexOf(name)
            this.corsModal.AllowedOrigins.splice(index, 1)
        },
        tagCloseAllowedHeader (event, name) {
            const index = this.corsModal.AllowedHeaders.indexOf(name)
            this.corsModal.AllowedHeaders.splice(index, 1)
        },
        tagCloseExposeHeader (event, name) {
            const index = this.corsModal.ExposeHeaders.indexOf(name)
            this.corsModal.ExposeHeaders.splice(index, 1)
        },
        async putBucketCors () {
            if (this.corsModal.AllowedOrigins.length === 0) {
                this.$Message.error(this.$t('STORAGE.ALLOWED_ORIGINS_CANNOT_EMPTY'))
                return
            }
            if (this.corsModal.AllowedMethods.length === 0) {
                this.$Message.error(this.$t('STORAGE.ALLOWED_METHODS_CANNOT_EMPTY'))
                return
            }
            if (this.corsModal.MaxAgeSeconds && isNaN(this.corsModal.MaxAgeSeconds)) {
                this.$Message.error(this.$t('STORAGE.CACHE_TIME_BE_NUMBER'))
                return
            }
            let putCorsModal = {}
            _.forEach(this.corsModal, (value, key) => {
                if (value) {
                    putCorsModal[key] = value
                }
            })
            try {
                this.$Loading.start()
                this.putBucketCorsParams.Bucket = this.bucket
                if (typeof this.index_to_edit_cors_rule === 'number') {
                    this.putBucketCorsParams.CORSConfiguration.CORSRules[this.index_to_edit_cors_rule] = putCorsModal
                    this.index_to_edit_cors_rule = ''
                } else {
                    this.putBucketCorsParams.CORSConfiguration.CORSRules.push(putCorsModal)
                }
                await handler('putBucketCors', this.putBucketCorsParams)
                this.$Loading.finish()
                this.showCorsModal = false
                this.$Message.success(this.$t('STORAGE.SET_SUCCESS'))
                this.listCorsRules()
            } catch (error) {
                this.$Loading.error()
            }
        },
        async listCorsRules () {
            try {
                this.$Loading.start()
                let res = await handler('getBucketCors', { Bucket: this.bucket })
                this.corsRulesList = await this.convert2FrontCorsRules(res.CORSRules)
                this.putBucketCorsParams.Bucket = this.bucket
                this.putBucketCorsParams.CORSConfiguration.CORSRules = res.CORSRules
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
            }
        },
        convert2FrontCorsRules (data) {
            let frontList = []
            data.forEach(item => {
                const frontItem = {
                    allowed_origins_front: item.AllowedOrigins,
                    allowed_methods_front: item.AllowedMethods,
                    allowed_headers_front: item.AllowedHeaders,
                    expose_headers_front: item.ExposeHeaders,
                    cache_time: item.MaxAgeSeconds
                }
                frontList.push(frontItem)
            })
            return frontList
        },
        async addCorsRule (index) {
            this.showCorsModal = true
            if (typeof index === 'number') {
                let res = await handler('getBucketCors', { Bucket: this.bucket })
                let currentCorsRule = res.CORSRules[index]
                this.corsModal.AllowedOrigins = currentCorsRule.AllowedOrigins
                this.corsModal.AllowedMethods = currentCorsRule.AllowedMethods
                this.corsModal.AllowedHeaders = currentCorsRule.AllowedHeaders
                this.corsModal.ExposeHeaders = currentCorsRule.ExposeHeaders
                this.corsModal.MaxAgeSeconds = currentCorsRule.MaxAgeSeconds
                this.index_to_edit_cors_rule = index
            } else {
                this.corsModal.AllowedOrigins = []
                this.corsModal.AllowedMethods = ['GET']
                this.corsModal.AllowedHeaders = []
                this.corsModal.ExposeHeaders = []
                this.corsModal.MaxAgeSeconds = ''
                this.index_to_edit_cors_rule = ''
            }
        },
        deleteCorsRuleConfirm (index) {
            this.$Modal.confirm({
                content: this.$t('STORAGE.DELETE_CORS_CONFIRMED'),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                onOk: () => this.deleteCorsRule(index)
            })
        },
        async deleteCorsRule (index) {
            try {
                this.$Loading.start()
                this.putBucketCorsParams.Bucket = this.bucket
                this.putBucketCorsParams.CORSConfiguration.CORSRules.splice(index, 1)
                this.putBucketCorsParams.CORSConfiguration.CORSRules.length !== 0 ? await handler('putBucketCors', this.putBucketCorsParams) : await handler('deleteBucketCors', { Bucket: this.bucket })
                this.$Loading.finish()
                this.$Message.success(this.$t('STORAGE.DELETE_SUCCESS'))
                this.corsRulesList.splice(index, 1)
            } catch (error) {
                this.$Loading.error()
            }
        },
        deleteUser (item) {
            item.Permission = {
                READ: false,
                WRITE: false,
                READ_ACP: false,
                WRITE_ACP: false
            }
            this.deleteList.push(item)
            this.UserACLList = this.UserACLList.filter(val => val !== item)
        },
        newUserItemInit () {
            this.newUserItem = {
                Permission: { ...permissionFalse },
                name: ''
            }
        }
    },
    watch: {
        // the contents array need refresh when the $route value changed
        '$route' (to, from) {
            to.path !== from.path && this.getData()
        }
    }
}

const permissionFalse = {
    READ: false,
    WRITE: false,
    READ_ACP: false,
    WRITE_ACP: false
}
const gropItemsDefaultInit = () => {
    const gropItemsDefault = [{
        Permission: { ...permissionFalse },
        Grantee: {
            URI: 'http://acs.amazonaws.com/groups/global/AllUsers',
            Type: 'Group'
        }
    }, {
        Permission: { ...permissionFalse },
        Grantee: {
            URI: 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers',
            Type: 'Group'
        }
    }]
    return gropItemsDefault
}

const userItemsDefaultInit = () => {
    let userACLItemsDefault = {
        Permission: { ...permissionFalse },
        Grantee: {}
    }
    return userACLItemsDefault
}
const convertGrants = grants => {
    let userACLItems = []
    if (grants.length) {
        let IDArry = []
        var gropItemsDefault = gropItemsDefaultInit()
        _.each(grants, grant => {
            if (grant.Grantee.URI && grant.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers') {
                convertPermission(gropItemsDefault[0], grant.Permission)
            } else if (grant.Grantee.URI && grant.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers') {
                convertPermission(gropItemsDefault[1], grant.Permission)
            } else if (grant.Grantee.ID) {
                let id = grant.Grantee.ID
                let ObjIndex = IDArry.findIndex(val => val === id)
                if (IDArry.includes(id)) {
                    convertPermission(userACLItems[ObjIndex], grant.Permission)
                } else {
                    let userItemsDefault = userItemsDefaultInit()
                    userItemsDefault.Grantee = grant.Grantee
                    convertPermission(userItemsDefault, grant.Permission)
                    userACLItems.push(userItemsDefault)
                    IDArry.push(id)
                }
            }
        })
    }
    return [gropItemsDefault, userACLItems]
}
const convertPermission = (grant, permission) => {
    if (permission === 'FULL_CONTROL') {
        grant.Permission = {
            READ: true,
            WRITE: true,
            READ_ACP: true,
            WRITE_ACP: true
        }
    } else {
        grant.Permission[permission] = true
    }
}
const convertObject2String = (object) => {
    let truePermission = {}
    _.each(object, function (value, key) {
        if (value) { truePermission[key] = true }
    })
    return _.keys(truePermission).toString()
}
const convertNewUserItem = item => {
    let newItem = { ...item }
    newItem.Grantee = item.name.includes('@') ? { Type: 'AmazonCustomerByEmail', EmailAddress: item.name } : { Type: 'CanonicalUser', ID: item.name }
    delete newItem.name
    return newItem
}
</script>

<style lang="less" scoped>
@import '../../styles/index.less';

.layout-bsc-toolbar {
    padding-bottom: 8px;
    border-bottom: 1px solid #f2f1f6;
}
.new-user-input{
    width:70%;
    max-width:150px;
    margin-right:5%;
}
.new-user-button{
    width:25%;
    max-width:50px;
}
.table-permission th.percent20 {
    width:20%;
}
.table-permission th.percent30 {
    width:30%;
}
.button-bsc-add-rule {
    margin-bottom: 10px
}
.info {
    margin: 5px 0 5px 133px
}
.tag-margin-left {
    margin-left: 133px
}
.modal-checkbox {
    width: 90px
}
.edit-modal .form-item .form-label {
    width: 130px
}
</style>
