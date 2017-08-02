<template >
    <div>
        <div class="section-separator">
            <div class="separator-body">
                <span class="separator-icon"></span>
                <span class="separator-info">{{$t("STORAGE.ACL_USER_GROUP")}}</span>
            </div>
        </div>
        <table class="table-permission">
            <thead>
                <tr>
                    <th class="percent30"> {{$t("STORAGE.ACL_GROUP")}}
                        <Tooltip placement="right">
                            <span><Icon type="ios-help"></Icon></span>
                            <div slot="content">
                                <p style="white-space: normal !important;">{{$t("STORAGE.ACL_GROUP_INFO")}}</p>
                            </div>
                        </Tooltip>
                    </th>
                    <th class="percent25">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                        <Tooltip placement="right">
                            <span><Icon type="ios-help"></Icon></span>
                            <div slot="content">
                                <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_OBJECT_PERMISSIONS_INFO")}}</p>
                            </div>
                        </Tooltip>
                    </th>
                    <th class="percent30">{{$t("STORAGE.ACL_PERMISSIONS")}}
                        <Tooltip placement="right">
                            <span><Icon type="ios-help"></Icon></span>
                            <div slot="content">
                                <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_ACL_PERMISSIONS_INFO")}}</p>
                            </div>
                        </Tooltip>
                    </th>
                    <th class="percent25"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in GroupACLList">
                    <td>
                        {{item.Grantee | userType}}
                    </td>
                    <td>
                        <Checkbox v-model="item.Permission.READ">{{$t("STORAGE.READ")}}</Checkbox>
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
                <span class="separator-info">User</span>
            </div>
        </div>
        <table class="table-permission">
            <thead>
                <tr>
                    <th class="percent30"> {{$t("STORAGE.USER")}}
                        <Tooltip placement="right">
                            <span><Icon type="ios-help"></Icon></span>
                            <div slot="content">
                                <p style="white-space: normal !important;">{{$t("STORAGE.ACL_USER_INFO")}}</p>
                            </div>
                        </Tooltip>
                    </th>
                    <th class="percent25">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                        <Tooltip placement="right">
                            <span><Icon type="ios-help"></Icon></span>
                            <div slot="content">
                                <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_OBJECT_PERMISSIONS_INFO")}}</p>
                            </div>
                        </Tooltip>
                    </th>
                    <th class="percent30">{{$t("STORAGE.ACL_PERMISSIONS")}}
                        <Tooltip placement="right">
                            <span><Icon type="ios-help"></Icon></span>
                            <div slot="content">
                                <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_ACL_PERMISSIONS_INFO")}}</p>
                            </div>
                        </Tooltip>
                    </th>
                    <th class="percent25"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="isAdd">
                    <td>
                        <input class="new-user-input" v-model="newUserItem.name">
                        <Button class="new-user-button" @click="isAdd = false"
                                size="small">Cancle</Button>
                    </td>
                    <td>
                        <Checkbox v-model="newUserItem.Permission.READ">{{$t("STORAGE.READ")}}</Checkbox>
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
                        <Checkbox :disabled="owner == item.Grantee.ID"
                                  v-model="item.Permission.READ">{{$t("STORAGE.READ")}}</Checkbox>
                    </td>
                    <td>
                        <Checkbox :disabled="owner == item.Grantee.ID"
                                  v-model="item.Permission.READ_ACP">{{$t("STORAGE.READ")}}</Checkbox>
                        <Checkbox :disabled="owner == item.Grantee.ID"
                                  v-model="item.Permission.WRITE_ACP">{{$t("STORAGE.WRITE")}}</Checkbox>
                    </td>
                    <td>
                        <Tooltip placement="bottom">
                            <Button v-if="index == 0"
                                style="margin: 0 6px;"
                                size="small"
                                @click="newUserItemInit();isAdd = true">
                            <Icon type="ios-plus"
                                  :size="iconSize"></Icon>
                            </Button>
                            <Button v-else
                                    style="margin: 0 6px;visibility:hidden;"
                                    size="small">
                                <Icon type="ios-plus"
                                    :size="iconSize"></Icon>
                            </Button>
                            <div slot="content">
                                <p>{{$t("STORAGE.ADD_USER")}}</p>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom">
                            <Button :disabled="owner == item.Grantee.ID"
                                style="margin: 0 6px;"
                                size="small"
                                @click="deleteUser(item)">
                                <Icon type="ios-minus"
                                    :size="iconSize"></Icon>
                            </Button>
                            <div slot="content">
                                <p>{{$t("STORAGE.DELETE_USER")}}</p>
                            </div>
                        </Tooltip>
                    </td>
                </tr>
            </tbody>
        </table>
        <Tooltip content="Invalid new user" :disabled="isAdd && !!isAddVerified" placement="top" class="pull-right">
            <Button class="pull-right button-reset"
                    type="primary"
                    :disabled="isAdd && !isAddVerified"
                    @click="ACLsubmitForm()">{{$t("STORAGE.SAVE_PERMISSIONS")}}</Button>
        </Tooltip>
    </div>
</template> 
<script>
import { handler } from '@/service/Aws'
import { convertPrefix2Router } from '@/service/bucketService'
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
                    READ_ACP: false,
                    WRITE_ACP: false
                }
            },
            iconSize: 16,
            deleteList: []
        }
    },
    props: ['bucket', 'filePrefix', 'itemKey'],
    computed: {
        prefix () {
            return this.filePrefix + this.itemKey
        },
        isAddVerified () {
            let name = this.newUserItem.name
            let { READ, READ_ACP, WRITE_ACP } = this.newUserItem.Permission
            return name && (READ || READ_ACP || WRITE_ACP)
        },
        breadcrumb () {
            return convertPrefix2Router(this.prefix)
        }
    },
    created () {
        this.getACLList()
    },
    methods: {
        async getACLList () {
            this.$Loading.start()
            try {
                let res = await handler('getObjectAcl', {
                    Bucket: this.bucket,
                    Key: this.prefix
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
                Bucket: this.bucket,
                Key: this.prefix,
                AccessControlPolicy: {
                    Grants: items,
                    Owner: this.Data.owner
                }
            }
            try {
                await handler('putObjectAcl', params)
                this.$Message.success(this.$t('STORAGE.PERMISSION_SUCCESS'))
                this.deleteList = []
                if (this.isAdd) {
                    this.UserACLList = this.UserACLList.concat(convertNewUserItem(this.newUserItem))
                    this.isAdd = false
                }
                this.$emit('permissionSuccess')
            } catch (error) {
                this.$Message.error(this.$t('STORAGE.PERMISSION_FAILED'))
            }
            this.$Loading.finish()
        },
        deleteUser (item) {
            item.Permission = {
                READ: false,
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
        getUrl (prefix) {
            return `/bucket/${this.bucket}/prefix/${prefix.replace('/', '%2F')}`
        }
    }
}

const permissionFalse = {
    READ: false,
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
<style type="less">
.pull-right {
    float:right;
}
.button-reset {
    margin-top: 14px;
    padding: 4px 15px !important;
}
.new-user-input {
    width:60%;
    margin-right:5%;
}
.new-user-button {
    width:30%;
}
.table-permission th.percent25 {
    width:25%;
}
.table-permission th.percent30 {
    width:30%;
}
</style>
