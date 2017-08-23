<template >
    <div>
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
    </div>
</template>

<script>
export default {
    data () {
        return {
            iconSize: 16
        }
    },
    props: {
        aclData: {
            type: Array,
            default () {
                return groupACLListDefult
            }
        }
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
