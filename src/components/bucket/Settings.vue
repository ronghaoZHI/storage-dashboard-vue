<template>
    <div>
        <div class="layout-bsc-toolbar">
            <div></div>
            <Breadcrumb>
                <Breadcrumb-item href="#">Bucket list</Breadcrumb-item>
                <Breadcrumb-item>Bucket Settings</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <Card dis-hover>
            <p slot="title">Permissions</p>
            <table class="my-table-view">
                <thead>
                    <tr>
                        <th> Group 111111
                            <Tooltip placement="right">
                                <span><Icon type="ios-help"></Icon></span>
                                <div slot="content">
                                    <p style="white-space: normal !important;">Top Left 文字提示 balabalabadfvdgdv sdvcsd sfds scfdf sfcfsdvc sfdfs sd fsflalba</p>
                                </div>
                            </Tooltip>
                        </th>
                        <th>Object Permissions
                            <Tooltip style="white-space: normal !important;" content="Top Left 文字提示 balabal balabalabadfvdgdv sdvcsd sfds scfdf abalalba" placement="top">
                                <span><Icon type="ios-help"></Icon></span>
                            </Tooltip>
                        </th>
                        <th>ACL Permissions
                            <span></span>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in GroupACLList">
                        <td>
                            {{item.Grantee | userType}}
                        </td>
                        <td>
                            <Checkbox v-model="item.Permission.READ">Read{{item.Permission.READ}}</Checkbox>
                            <Checkbox v-model="item.Permission.WRITE">Write{{item.Permission.WRITE}}</Checkbox>
                        </td>
                        <td>
                            <Checkbox v-model="item.Permission.READ_ACP">Read{{item.Permission.READ_ACP}}</Checkbox>
                            <Checkbox v-model="item.Permission.WRITE_ACP">Write{{item.Permission.WRITE_ACP}}</Checkbox>
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
            <table class="my-table-view">
                <thead>
                    <tr>
                        <th> User
                            <span></span>
                        </th>
                        <th>Object Permissions
                            <span></span>
                        </th>
                        <th>ACL Permissions
                            <span></span>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isAdd">
                        <td>
                            <input v-model="newUserItem.name">
                            <Button @click="ACLsubmitForm(true)" v-if="isAddVerified" size="small">Submit</Button>
                            <Button v-else disabled size="small">Submit</Button>
                            <Button @click="isAdd = false" size="small">Cancle</Button>
                        </td>
                        <td>
                            <Checkbox v-model="newUserItem.Permission.READ">Read{{newUserItem.Permission.READ}}</Checkbox>
                            <Checkbox v-model="newUserItem.Permission.WRITE">Write{{newUserItem.Permission.WRITE}}</Checkbox>
                        </td>
                        <td>
                            <Checkbox v-model="newUserItem.Permission.READ_ACP">Read{{newUserItem.Permission.READ_ACP}}</Checkbox>
                            <Checkbox v-model="newUserItem.Permission.WRITE_ACP">Write{{newUserItem.Permission.WRITE_ACP}}</Checkbox>
                        </td>
                        <td></td>
                    </tr>
                    <tr v-for="(item,index) in UserACLList">
                        <td>
                            {{item.Grantee | userType}}
                        </td>
                        <td>
                            <Checkbox v-if="owner != item.Grantee.ID" v-model="item.Permission.READ">Read{{item.Permission.READ}}</Checkbox>
                            <Checkbox v-else disabled v-model="item.Permission.READ">Read{{item.Permission.READ}}</Checkbox>
                            <Checkbox v-if="owner != item.Grantee.ID" v-model="item.Permission.WRITE">Write{{item.Permission.WRITE}}</Checkbox>
                            <Checkbox v-else disabled v-model="item.Permission.WRITE">Write{{item.Permission.WRITE}}</Checkbox>
                        </td>
                        <td>
                            <Checkbox v-if="owner != item.Grantee.ID" v-model="item.Permission.READ_ACP">Read{{item.Permission.READ_ACP}}</Checkbox>
                            <Checkbox v-else disabled v-model="item.Permission.READ_ACP">Read{{item.Permission.READ_ACP}}</Checkbox>
                            <Checkbox v-if="owner != item.Grantee.ID" v-model="item.Permission.WRITE_ACP">Write{{item.Permission.WRITE_ACP}}</Checkbox>
                            <Checkbox v-else disabled v-model="item.Permission.WRITE_ACP">Write{{item.Permission.WRITE_ACP}}</Checkbox>
                        </td>
                        <td>
                            <Button v-if="index == 0" title="Add User" style="margin: 0 6px;" size="small" @click="newUserItemInit();isAdd = true">
                                <Icon type="ios-plus" :size="iconSize"></Icon>
                            </Button>
                            <Button v-else style="margin: 0 6px;visibility:hidden;" size="small">
                                <Icon type="ios-plus" :size="iconSize"></Icon>
                            </Button>
                            <Button v-if="owner != item.Grantee.ID" title="Delete User" style="margin: 0 6px;" size="small" @click="deleteUserConfirm(item)">
                                <Icon type="ios-minus" :size="iconSize"></Icon>
                            </Button>
                            <Button v-else disabled style="margin: 0 6px;" size="small">
                                <Icon type="ios-minus" :size="iconSize"></Icon>
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="card-footer">
                <Button v-if="isAdd" @click="ACLsubmitForm()" disabled>Submit</Button>
                <Button v-else @click="ACLsubmitForm()">Submit</Button>
            </div>
        </Card>
    </div>
</template>

<script>
import { handler } from '../service/Aws'
export default {
    data() {
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
            iconSize: 16,
        }
    },
    computed: {
        bucket() {
            return this.$route.params.bucket
        },
        isAddVerified() {
            let name = this.newUserItem.name;
            let { READ, WRITE, READ_ACP, WRITE_ACP } = this.newUserItem.Permission;
            return name && (READ || WRITE || READ_ACP || WRITE_ACP);
        },
    },
    mounted() {
        this.getACLList()
    },
    methods: {
        async getACLList() {
            let res = await handler('getBucketAcl', {
                Bucket: this.bucket
            })
            this.GroupACLList = convertGrants(res.Grants)[0]
            this.UserACLList = convertGrants(res.Grants)[1]
            this.Data = {
                bucket: this.bucket,
                grants: res.Grants,
                owner: res.Owner
            };
            this.owner = res.Owner.ID;
        },
        async ACLsubmitForm(isAdd) {
            let items = [...this.GroupACLList, ...this.UserACLList];
            if (isAdd) {
                this.newUserItemPut = convertNewUserItem(this.newUserItem);
                items = items.concat(this.newUserItemPut)
            }
            items = _.filter(items, value => {
                value.Permission = convertObject2String(value.Permission);
                return value.Permission.length > 0;
            });
            if (items.length === 0) {
                this.$Message.error("Permission can not be empty!");
                return false;
            }
            let params = {
                Bucket: this.Data.bucket,
                AccessControlPolicy: {
                    Grants: items,
                    Owner: this.Data.owner
                }
            };
            try {
                await handler('putBucketAcl', params)
                this.$Message.success('Permission changes successfully');
                this.isAdd = false;
            } catch (error) {
                this.$Message.error("Save permission changes fail");
             }
            this.getACLList();
        },
        deleteUserConfirm(item) {
            this.$Modal.confirm({
                content: `Are you sure you want to delete [${item.Grantee.ID}]?`,
                okText: 'Submit',
                cancelText: 'Cancle',
                onOk: () => this.deleteUser(item)
            })
        },
        deleteUser(item) {
            item.Permission = {
                READ: false,
                WRITE: false,
                READ_ACP: false,
                WRITE_ACP: false
            },
            this.ACLsubmitForm();
        },
        newUserItemInit(){
            this.newUserItem =  {
                Permission: {...permissionFalse},
                name: '',
            }
        },
    },
    watch: {
        // the contents array need refresh when the $route value changed
        '$route'(to, from) {
            to.path !== from.path && this.getData()
        },
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
        Permission: {...permissionFalse},
        Grantee: {
            URI: 'http://acs.amazonaws.com/groups/global/AllUsers',
            Type: 'Group'
        },
    }, {
        Permission: {...permissionFalse},
        Grantee: {
            URI: 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers',
            Type: 'Group'
        },
    }];
    return gropItemsDefault;
}

const userItemsDefaultInit = () => {
    let userACLItemsDefault = {
        Permission: {...permissionFalse},
        Grantee: {},
    };
    return userACLItemsDefault;
}
const convertGrants = grants => {
    let [aclitems, userACLItems, IDArry] = [[], [], []]
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
    delete newItem.name;
    return newItem;
}
</script>

<style lang="less">
.my-table-view {
    width: 100%;
    margin-bottom: 20px;
    color: #657180;
    font-size: 12px;
    background-color: #fff;
    border: 1px solid #d7dde4;
    border-collapse: collapse;
}

.my-table-view th {
    white-space: nowrap;
    overflow: hidden;
    background-color: #f5f7f9;
}

.my-table-view tr {
    border-bottom: 1px solid #d7dde4;
}

.my-table-view tbody tr:nth-last-child(1) {
    border-bottom: none;
}

.my-table-view td,
.my-table-view th {
    min-width: 0;
    height: 48px;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
    padding-left: 18px;
    padding-right: 18px;
    overflow: hidden;
    white-space: normal;
    word-break: break-all;
    word-wrap: normal;
    border-bottom: none;
}

.card-footer {
    border-top: 1px solid #e3e8ee;
    line-height: 1;
    padding: 18px 18px 0;
    text-align: center;
    margin: 0 -18px;
}
</style>
