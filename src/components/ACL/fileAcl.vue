<template >
    <div>
        <slot name="groupTitle"></slot>
        <table class="table-permission" style="display:inline-block;width:475px">
            <thead>
                <tr>
                    <th style="width:170px;"> {{$t("STORAGE.ACL_GROUP")}}
                        <Tooltip placement="right">
                            <span><Icon type="ios-help"></Icon></span>
                            <div slot="content">
                                <p style="white-space: normal !important;">{{$t("STORAGE.ACL_GROUP_INFO")}}</p>
                            </div>
                        </Tooltip>
                    </th>
                    <th style="width:135px;">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                        <Tooltip placement="right">
                            <span><Icon type="ios-help"></Icon></span>
                            <div slot="content">
                                <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_OBJECT_PERMISSIONS_INFO")}}</p>
                            </div>
                        </Tooltip>
                    </th>
                    <th style="width:170px;">{{$t("STORAGE.ACL_PERMISSIONS")}}
                        <Tooltip placement="right">
                            <span><Icon type="ios-help"></Icon></span>
                            <div slot="content">
                                <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_ACL_PERMISSIONS_INFO")}}</p>
                            </div>
                        </Tooltip>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in aclData">
                    <td>
                        {{item.Grantee}}
                    </td>
                    <td>
                        <Checkbox v-model="item.Access.Read">{{$t("STORAGE.READ")}}</Checkbox>
                    </td>
                    <td>
                        <Checkbox v-model="item.Access.ReadAcp">{{$t("STORAGE.READ")}}</Checkbox>
                        <Checkbox v-model="item.Access.WriteAcp">{{$t("STORAGE.WRITE")}}</Checkbox>
                    </td>
                </tr>
            </tbody>
        </table>
        <br>
        <slot name="userTitle"></slot>
        <table class="table-permission" style="display:inline-block;width:475px">
            <thead>
                <tr>
                    <th style="width:200px;"> {{$t("STORAGE.USER")}}
                        <Tooltip placement="right">
                            <span><Icon type="ios-help"></Icon></span>
                            <div slot="content">
                                <p style="white-space: normal !important;">{{$t("STORAGE.ACL_USER_INFO")}}</p>
                            </div>
                        </Tooltip>
                    </th>
                    <th style="width:135px;">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                        <Tooltip placement="right">
                            <span><Icon type="ios-help"></Icon></span>
                            <div slot="content">
                                <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_OBJECT_PERMISSIONS_INFO")}}</p>
                            </div>
                        </Tooltip>
                    </th>
                    <th style="width:170px;">{{$t("STORAGE.ACL_PERMISSIONS")}}
                        <Tooltip placement="right">
                            <span><Icon type="ios-help"></Icon></span>
                            <div slot="content">
                                <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_ACL_PERMISSIONS_INFO")}}</p>
                            </div>
                        </Tooltip>
                    </th>
                    <th style="width:135px;"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="isAddUser">
                    <td>
                        <input class="new-user-input" v-model="newUserItem.Grantee">
                    </td>
                    <td>
                        <Checkbox v-model="newUserItem.Access.Read">{{$t("STORAGE.READ")}}</Checkbox>
                    </td>
                    <td>
                        <Checkbox v-model="newUserItem.Access.ReadAcp">{{$t("STORAGE.READ")}}</Checkbox>
                        <Checkbox v-model="newUserItem.Access.WriteAcp">{{$t("STORAGE.WRITE")}}</Checkbox>
                    </td>
                    <td>
                        <Tooltip placement="bottom" :delay="1000">
                            <Button style="margin: 0 6px;" size="small" :disabled="newUserDisabled" @click="addUserOK">
                                <Icon type="ios-checkmark" :size="iconSize"></Icon>
                            </Button>
                            <div slot="content">
                                <p>{{$t('VIDEO.ADD')}}</p>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" :delay="1000">
                            <Button style="margin: 0 6px;" size="small" @click="isAddUser = false">
                                <Icon type="ios-close" :size="iconSize"></Icon>
                            </Button>
                            <div slot="content">
                                <p>{{$t('VIDEO.CANCEL')}}</p>
                            </div>
                        </Tooltip>
                    </td>
                </tr>
                <tr v-for="(item,index) in userAcl">
                    <td>
                        {{item.Grantee}}
                    </td>
                    <td>
                        <Checkbox :disabled="username == item.Grantee"
                                v-model="item.Access.Read">{{$t("STORAGE.READ")}}</Checkbox>
                    </td>
                    <td>
                        <Checkbox :disabled="username == item.Grantee"
                                v-model="item.Access.ReadAcp">{{$t("STORAGE.READ")}}</Checkbox>
                        <Checkbox :disabled="username == item.Grantee"
                                v-model="item.Access.WriteAcp">{{$t("STORAGE.WRITE")}}</Checkbox>
                    </td>
                    <td>
                        <Tooltip placement="bottom" :delay="1000">
                            <Button v-if="index == 0"
                                style="margin: 0 6px;"
                                size="small"
                                @click="addUser">
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
                        <Tooltip placement="bottom" :delay="1000">
                            <Button :disabled="username == item.Grantee"
                                style="margin: 0 6px;"
                                size="small"
                                @click="deleteUser(index)">
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
    </div>
</template>

<script>
import user from '@/store/modules/user'
export default {
    data () {
        return {
            iconSize: 16,
            isAddUser: false,
            newUserItem: _.cloneDeep(newUserItemDefult),
            userACLList: _.cloneDeep(this.userAcl)
        }
    },
    computed: {
        newUserDisabled () {
            const name = this.newUserItem.Grantee
            const { Read, ReadAcp, WriteAcp } = this.newUserItem.Access
            return name === '' || !(Read || ReadAcp || WriteAcp)
        },
        username () {
            return user.state.username
        }
    },
    props: {
        aclData: {
            type: Array,
            default () {
                return groupACLListDefult
            }
        },
        userAcl: {
            type: Array,
            default () {
                return this.owerACL
            }
        }
    },
    methods: {
        addUser () {
            this.isAddUser = true
            this.newUserItem = _.cloneDeep(newUserItemDefult)
        },
        addUserOK () {
            this.userAcl.push(this.newUserItem)
            this.isAddUser = false
        },
        deleteUser (index) {
            this.userAcl.splice(index, 1)
        }
    }
}

const newUserItemDefult = {
    Grantee: '',
    Access: {
        Read: false,
        ReadAcp: false,
        WriteAcp: false
    }
}

const groupACLListDefult = [{
    GranteeType: 'Group',
    Grantee: 'AllUsers',
    Access: {
        Read: true,
        ReadAcp: false,
        WriteAcp: false
    }
}, {
    GranteeType: 'Group',
    Grantee: 'AuthenticatedUsers',
    Access: {
        Read: false,
        ReadAcp: false,
        WriteAcp: false
    }
}]
</script>
