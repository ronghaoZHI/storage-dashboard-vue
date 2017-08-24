<template >
    <div>
        <file-acl :aclData='groupACLList' :userAcl='userACLList'>
            <div class="section-separator" slot="groupTitle">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info">{{$t("STORAGE.ACL_USER_GROUP")}}</span>
                </div>
            </div>
            <div class="section-separator" slot="userTitle">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info">User</span>
                </div>
            </div>
        </file-acl>
        <Button class="pull-right button-reset"
                type="primary"
                @click="ACLsubmitForm()">{{$t("STORAGE.SAVE_PERMISSIONS")}}</Button>
    </div>
</template> 
<script>
import { handler } from '@/service/Aws'
import { convertPrefix2Router } from '@/service/bucketService'
import fileAcl from '@/components/ACL/fileAcl.vue'
export default {
    data () {
        return {
            self: this,
            groupACLList: [],
            userACLList: [],
            owner: this.owner,
            iconSize: 16
        }
    },
    components: { fileAcl },
    props: ['bucket', 'filePrefix', 'itemKey'],
    computed: {
        prefix () {
            return this.filePrefix + this.itemKey
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
                this.groupACLList = convertGrants(res.Grants)[0]
                this.userACLList = convertGrants(res.Grants)[1]
                this.Data = {
                    bucket: this.bucket,
                    grants: res.Grants,
                    owner: res.Owner
                }
                this.owner = res.Owner.ID
            } catch (error) {
                console.log(error)
                this.$Message.error(this.$t('STORAGE.GET_PERMISSION_FAILED'))
            }
            this.$Loading.finish()
        },
        async ACLsubmitForm () {
            this.$Loading.start()
            let originItems = [...this.groupACLList, ...this.userACLList]
            let items = _.cloneDeep(originItems)
            let saved = items.map(item => {
                return acl2save(item)
            })
            saved = _.filter(saved, value => {
                value.Permission = convertObject2String(value.Permission)
                return value.Permission.length > 0
            })
            if (saved.length === 0) {
                this.$Message.error(this.$t('STORAGE.PERMISSION_EMPTY'))
                return false
            }
            let params = {
                Bucket: this.bucket,
                Key: this.prefix,
                AccessControlPolicy: {
                    Grants: saved,
                    Owner: this.Data.owner
                }
            }
            try {
                await handler('putObjectAcl', params)
                this.$Message.success(this.$t('STORAGE.PERMISSION_SUCCESS'))
                this.$emit('permissionSuccess')
            } catch (error) {
                this.$Message.error(this.$t('STORAGE.PERMISSION_FAILED'))
            }
            this.$Loading.finish()
        },
        getUrl (prefix) {
            return `/bucket/${this.bucket}/prefix/${prefix.replace('/', '%2F')}`
        }
    }
}
const acl2save = item => {
    let savedItem = {}
    if (item.GranteeOrigin) {
        savedItem = {
            Grantee: item.GranteeOrigin,
            Permission: item.Access
        }
    } else {
        savedItem.Grantee = item.Grantee.includes('@') ? { Type: 'AmazonCustomerByEmail', EmailAddress: item.Grantee } : { Type: 'CanonicalUser', ID: item.Grantee }
        savedItem.Permission = item.Access
    }
    return savedItem
}

const convertGrants = grants => {
    let userACLItems = []
    if (grants.length) {
        let IDArry = []
        var gropItemsDefault = _.cloneDeep(groupACLListDefult)
        _.each(grants, grant => {
            if (grant.Grantee.URI && grant.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers') {
                convertPermission(gropItemsDefault[0], grant.Permission)
                gropItemsDefault[0].GranteeOrigin = grant.Grantee
            } else if (grant.Grantee.URI && grant.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers') {
                convertPermission(gropItemsDefault[1], grant.Permission)
                gropItemsDefault[1].GranteeOrigin = grant.Grantee
            } else if (grant.Grantee.ID) {
                let id = grant.Grantee.ID
                let ObjIndex = IDArry.findIndex(val => val === id)
                if (IDArry.includes(id)) {
                    convertPermission(userACLItems[ObjIndex], grant.Permission)
                } else {
                    let userItemsDefault = user2front(grant)
                    convertPermission(userItemsDefault, grant.Permission)
                    userACLItems.push(userItemsDefault)
                    IDArry.push(id)
                }
            }
        })
    }
    return [gropItemsDefault, userACLItems]
}
const user2front = (grant) => {
    return {
        GranteeType: grant.Grantee.Type,
        GranteeOrigin: grant.Grantee,
        Grantee: grant.Grantee.ID || grant.Grantee.EmailAddress,
        Access: {
            Read: false,
            ReadAcp: false,
            WriteAcp: false
        }
    }
}
const convertPermission = (grant, permission) => {
    if (permission === 'FULL_CONTROL') {
        grant.Access = {
            Read: true,
            ReadAcp: true,
            WriteAcp: true
        }
    } else {
        grant.Access[per2acc[permission]] = true
    }
}
const convertObject2String = (object) => {
    let truePermission = []
    _.each(object, function (value, key) {
        if (value) { truePermission.push(acc2per[key]) }
    })
    return truePermission.join(',')
}

const per2acc = {READ: 'Read', READ_ACP: 'ReadAcp', WRITE_ACP: 'WriteAcp'}
const acc2per = {Read: 'READ', ReadAcp: 'READ_ACP', WriteAcp: 'WRITE_ACP'}
const groupACLListDefult = [{
    GranteeType: 'Group',
    Grantee: 'AllUsers',
    Access: {
        Read: false,
        ReadAcp: false,
        WriteAcp: false
    },
    GranteeOrigin: {
        Type: 'Group',
        URI: 'http://acs.amazonaws.com/groups/global/AllUsers'
    }
}, {
    GranteeType: 'Group',
    Grantee: 'AuthenticatedUsers',
    Access: {
        Read: false,
        ReadAcp: false,
        WriteAcp: false
    },
    GranteeOrigin: {
        Type: 'Group',
        URI: 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers'
    }
}]

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
