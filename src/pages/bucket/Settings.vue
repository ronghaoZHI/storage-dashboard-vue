<template>
    <div class="bsc-settings">
        <div class="layout-bsc-toolbar">
            <a class="btn-back" @click="back()"><Icon type="chevron-left"></Icon></a>
            <bsc-breadcrumb>
                <bsc-breadcrumb-item :href="bucketPath">{{$t("STORAGE.TITLE")}}</bsc-breadcrumb-item>
                <bsc-breadcrumb-item>{{$t("STORAGE.BUCKET_SETTING")}} ({{bucket}})</bsc-breadcrumb-item>
            </bsc-breadcrumb>
        </div>
        <Tabs size="small" v-model="tabName" @on-click="tabChange" :animated="false">
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
                                    <span><Icon type="ios-help-outline"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.ACL_GROUP_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th class="percent30">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help-outline"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.BUCKET_OBJECT_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th class="percent30">{{$t("STORAGE.ACL_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help-outline"></Icon></span>
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
                                    <span><Icon type="ios-help-outline"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.ACL_USER_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th class="percent30">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help-outline"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.BUCKET_OBJECT_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th class="percent30">{{$t("STORAGE.ACL_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help-outline"></Icon></span>
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
                                    <Button v-if="index == 0"
                                        style="margin: 0 6px;"
                                        size="small"
                                        @click="newUserItemInit();isAdd = true"
                                        icon="plus-round"></Button>
                                    <Button v-else
                                        style="margin: 0 6px;visibility:hidden;"
                                        size="small"
                                        icon="plus-round"></Button>
                                    <div slot="content">
                                        <p>{{$t("STORAGE.ADD_USER")}}</p>
                                    </div>
                                </Tooltip>
                                <Tooltip placement="bottom">
                                    <Button :disabled="owner == item.Grantee.ID"
                                        style="margin: 0 6px;"
                                        size="small"
                                        @click="deleteUser(item)"
                                        icon="minus-round"></Button>
                                    <div slot="content">
                                        <p>{{$t("STORAGE.DELETE_USER")}}</p>
                                    </div>
                                </Tooltip>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Button class="settings-btn" type="primary" v-if="!isAdd || isAdd && isAddVerified" @click="ACLsubmitForm()">{{$t("STORAGE.SAVE_PERMISSIONS")}}</Button>
                <Button class="settings-btn" type="primary" v-else disabled :title='$t("STORAGE.INVALID_NEW_USER")'>{{$t("STORAGE.SAVE_PERMISSIONS")}}</Button>
            </Tab-pane>
            <Tab-pane :label='$t("STORAGE.CORS_CONFIG")' name="cors">
                <Button :disabled="rulesNumber===100" class="button-add-rule" type="primary" @click="addCorsRule">{{$t('STORAGE.ADD_RULE')}}</Button>
                <span class="rules-number" v-model="rulesNumber">{{$t('STORAGE.RULES_AT_MOST', { rulesNumber: rulesNumber })}}</span>
                <legend-list class="legend-list" :data="legendList"></legend-list>
                <Table border :context="self" :stripe="true" :columns="listCorsHeader" :data="corsRulesList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
            </Tab-pane>
            <Tab-pane :label='$t("STORAGE.BACK_SOURCE")' name="backSource">
                <back-source v-if="tabName === 'backSource'"></back-source>
            </Tab-pane>
            <Tab-pane :label='$t("SETTINGS.SECURITY_CHAIN")' name="whiteList">
                <white-list v-if="tabName === 'whiteList'"></white-list>
            </Tab-pane>
        </Tabs>
        <Modal v-model="showCorsModal" :title='$t("STORAGE.CORS_CONFIG")' width="700" class="edit-modal">
            <div class="form-item">
                <span class="form-label required-item">Allowed Origins : </span>
                <Input v-model="AllowedOrigins" placeholder="http://www.example.com" class="line-width" @on-enter="addCorsModalTag('AllowedOrigins')"></Input>
                <p class="style-error-info redFont" v-if="originsEmptyError">{{$t('STORAGE.FILL_IN_ONE_AT_LEAST')}}</p>
                <p class="style-error-info redFont" v-if="AllowedOrigins">{{$t('STORAGE.PRESS_ENTER_KEY')}}</p>
                <p class="info">{{$t('STORAGE.ENTER_KEY')}}</p>
                <div class="tag-margin-left">
                    <Tag type="border" color="blue" v-for="item in corsModal.AllowedOrigins" :key="item" :name="item" closable @on-close="deleteCorsModalTag('AllowedOrigins',item)">{{item}}</Tag>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label required-item">Allowed Methods : </span>
                <Checkbox-group style="display:inline" v-model="corsModal.AllowedMethods">
                    <Checkbox class="modal-checkbox" label="GET" >GET</Checkbox>
                    <Checkbox class="modal-checkbox" label="PUT">PUT</Checkbox>
                    <Checkbox class="modal-checkbox" label="HEAD">HEAD</Checkbox>
                    <Checkbox class="modal-checkbox" label="POST">POST</Checkbox>
                    <Checkbox class="modal-checkbox" label="DELETE">DELETE</Checkbox>
                </Checkbox-group>
                <p class="style-error-info redFont" v-if="methodsError">{{$t('STORAGE.SELECT_ONE_AT_LEAST')}}</p>
            </div>
            <div class="form-item">
                <span class="form-label">Allowed Headers : </span>
                <Input v-model="AllowedHeaders" class="line-width" @on-enter="addCorsModalTag('AllowedHeaders')"></Input>
                <p class="style-error-info redFont" v-if="AllowedHeaders">{{$t('STORAGE.PRESS_ENTER_KEY')}}</p>
                <p class="info">{{$t('STORAGE.ENTER_KEY')}}</p>
                <div class="tag-margin-left">
                    <Tag type="border" color="blue" v-for="item in corsModal.AllowedHeaders" :key="item" :name="item" closable @on-close="deleteCorsModalTag('AllowedHeaders',item)">{{item}}</Tag>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label">Expose Headers : </span>
                <Input v-model="ExposeHeaders" class="line-width" @on-enter="addCorsModalTag('ExposeHeaders')"></Input>
                <p class="style-error-info redFont" v-if="ExposeHeaders">{{$t('STORAGE.PRESS_ENTER_KEY')}}</p>
                <p class="info">{{$t('STORAGE.ENTER_KEY')}}</p>
                <div class="tag-margin-left">
                    <Tag type="border" color="blue" v-for="item in corsModal.ExposeHeaders" :key="item" :name="item" closable @on-close="deleteCorsModalTag('ExposeHeaders',item)">{{item}}</Tag>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label">Max Age Seconds : </span>
                <Input style="width:100px" v-model="corsModal.MaxAgeSeconds" class="line-width"></Input>
                <span>s</span>
                <p class="style-error-info redFont" v-if="secondsError">{{$t('STORAGE.CACHE_TIME_BE_NUMBER')}}</p>
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
import legendList from '@/components/legend/legend'
import backSource from './backSource'
import whiteList from './whiteList'
import bscBreadcrumb from '@/components/breadcrumb'
export default {
    data () {
        return {
            self: this,
            legendList: [{
                icon: 'compose',
                text: 'PUBLIC.EDIT'
            }, {
                icon: 'ios-trash',
                text: 'PUBLIC.DELETE'
            }],
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
            rulesNumber: 0,
            indexToEditCorsRule: '',
            AllowedOrigins: '',
            AllowedHeaders: '',
            ExposeHeaders: '',
            corsModal: {
                AllowedOrigins: [],
                AllowedMethods: ['GET'],
                AllowedHeaders: [],
                ExposeHeaders: [],
                MaxAgeSeconds: ''
            },
            corsRulesList: [],
            showCorsModal: false,
            listCorsHeader: [{
                title: 'Allowed Origins',
                width: 160,
                render: (h, params) => {
                    return h('div', params.row.AllowedOrigins.map(item => h('p', item)))
                }
            }, {
                title: 'Allowed Methods',
                width: 255,
                render: (h, params) => {
                    return h('div', {style: {padding: '6px 0'}}, params.row.AllowedMethods.map(item => h('Tag', item)))
                }
            }, {
                title: 'Allowed Headers',
                width: 170,
                render: (h, params) => {
                    return h('div', {style: {padding: '6px 0'}}, params.row.AllowedHeaders.map(item => h('Tag', item)))
                }
            }, {
                title: 'Expose Headers',
                width: 170,
                render: (h, params) => {
                    return h('div', {style: {padding: '6px 0'}}, params.row.ExposeHeaders.map(item => h('Tag', item)))
                }
            }, {
                title: 'Max Age Seconds',
                key: 'MaxAgeSeconds',
                width: 120
            }, {
                title: this.$t('STORAGE.TABLE_ACTION'),
                key: 'actions',
                width: 85,
                render: (h, params) => {
                    return h('div', [h('Tooltip', {
                        props: {
                            content: this.$t('PUBLIC.EDIT'),
                            delay: 500,
                            placement: 'top'
                        },
                        'class': {
                            'mar-r-8': true
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
            deleteList: []
        }
    },
    components: {picDetection, legendList, backSource, whiteList, bscBreadcrumb, bscBreadcrumbItem: bscBreadcrumb.Item},
    computed: {
        bucket () {
            return this.$route.params.bucket
        },
        tabName: {
            get () {
                return this.$route.params.tabName || 'permission'
            },
            set () {
            }
        },
        originsEmptyError () {
            return this.corsModal.AllowedOrigins.length === 0 && !this.AllowedOrigins
        },
        methodsError () {
            return this.corsModal.AllowedMethods.length === 0
        },
        secondsError () {
            return this.corsModal.MaxAgeSeconds && isNaN(this.corsModal.MaxAgeSeconds)
        },
        isAddVerified () {
            let name = this.newUserItem.name
            let { READ, WRITE, READ_ACP, WRITE_ACP } = this.newUserItem.Permission
            return name && (READ || WRITE || READ_ACP || WRITE_ACP)
        },
        bucketPath () {
            return `/bucket/${this.$route.params.bucket}`
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
        addCorsModalTag (arg) {
            if (this[arg].length > 0) {
                this.corsModal[arg].push(this[arg])
                this[arg] = ''
            }
        },
        deleteCorsModalTag (arg, name) {
            const index = this.corsModal[arg].indexOf(name)
            this.corsModal[arg].splice(index, 1)
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
            if (typeof this.indexToEditCorsRule === 'number') {
                this.corsRulesList[this.indexToEditCorsRule] = putCorsModal
                this.indexToEditCorsRule = ''
                this.corsRulesList = _.cloneDeep(this.corsRulesList)
            } else {
                this.corsRulesList.push(putCorsModal)
                this.rulesNumber = this.rulesNumber + 1
            }
            let putParams = {
                Bucket: this.bucket,
                CORSConfiguration: {
                    CORSRules: this.corsRulesList
                }
            }
            try {
                this.$Loading.start()
                await handler('putBucketCors', putParams)
                this.$Loading.finish()
                this.showCorsModal = false
                this.$Message.success(this.$t('STORAGE.SET_SUCCESS'))
            } catch (error) {
                this.$Loading.error()
                this.listCorsRules()
            }
        },
        async listCorsRules () {
            try {
                this.$Loading.start()
                let res = await handler('getBucketCors', { Bucket: this.bucket })
                this.corsRulesList = res.CORSRules
                this.rulesNumber = res.CORSRules.length
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
            }
        },
        async addCorsRule (index) {
            this.AllowedOrigins = ''
            this.AllowedHeaders = ''
            this.ExposeHeaders = ''
            this.showCorsModal = true
            if (typeof index === 'number') {
                let res = await handler('getBucketCors', { Bucket: this.bucket })
                this.corsModal = {...res.CORSRules[index]}
                this.indexToEditCorsRule = index
            } else {
                this.corsModal.AllowedOrigins = []
                this.corsModal.AllowedMethods = ['GET']
                this.corsModal.AllowedHeaders = []
                this.corsModal.ExposeHeaders = []
                this.corsModal.MaxAgeSeconds = ''
                this.indexToEditCorsRule = ''
            }
        },
        deleteCorsRuleConfirm (index) {
            this.$Modal.confirm({
                content: this.$t('STORAGE.DELETE_CORS_CONFIRMED'),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                title: this.$t('PUBLIC.DELETE'),
                onOk: () => this.deleteCorsRule(index)
            })
        },
        async deleteCorsRule (index) {
            this.corsRulesList.splice(index, 1)
            let putParams = {
                Bucket: this.bucket,
                CORSConfiguration: {
                    CORSRules: this.corsRulesList
                }
            }
            try {
                this.$Loading.start()
                this.corsRulesList.length !== 0 ? await handler('putBucketCors', putParams) : await handler('deleteBucketCors', { Bucket: this.bucket })
                this.rulesNumber = this.rulesNumber - 1
                this.$Loading.finish()
                this.$Message.success(this.$t('STORAGE.DELETE_SUCCESS'))
            } catch (error) {
                this.$Loading.error()
                this.listCorsRules()
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
        },
        back () {
            this.$router.back()
        },
        tabChange (name) {
            this.$router.push({ name: 'bucketSettings', params: { bucket: this.bucket, tabName: name } })
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

.dark .@{css-prefix}settings {
    .@{css-prefix}layout-toolbar {
        border-bottom: @common-border-dark
    }
}

.@{css-prefix}settings {
    .@{css-prefix}layout-toolbar {
        padding-bottom: 8px;
        border-bottom: 1px solid #f2f1f6;
    }
    .rules-number {
        margin-left: 10px;
    }
    .legend-list {
        float: right;
    }
    .table-permission {
        .new-user-input {
            width:70%;
            max-width:150px;
            margin-right:5%;
        }
        .new-user-button{
            width:25%;
            max-width:50px;
        }
        th.percent20 {
            width:200px;
        }
        th.percent30 {
            width:30%;
        }
    }
    .@{css-prefix}table-wrapper {
        margin-top: 10px;
    }
}
.edit-modal {
    .form-item {
        .form-label {
            width: 130px
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
        .style-error-info {
            padding-left: 134px
        }
    }
}
.settings-btn{
    display: block;
    margin: 0 auto;
}
.page-info{
    width: 100%;
    font-size: 12px;
    color: #d3dce6;
    padding-bottom: 10px;
    padding-left: 10px;
}
.dark{
    .page-info{
        color: #8492a6;
    }
}

</style>
