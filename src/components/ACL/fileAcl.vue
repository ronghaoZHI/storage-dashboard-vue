<template >
  <div>
    <slot name="groupTitle"></slot>
    <table class="table-permission"
           :class="{ 'dis-in-b': isInline}"
           :style="tableStyle">
      <thead>
        <tr>
          <th class="percent27"
              :style="td30Style"> {{$t("STORAGE.ACL_GROUP")}}
            <Tooltip placement="right">
              <span>
                <Icon type="ios-help-outline"></Icon>
              </span>
              <div slot="content">
                <p style="white-space: normal !important;">{{$t("STORAGE.ACL_GROUP_INFO")}}</p>
              </div>
            </Tooltip>
          </th>
          <th class="percent23"
              :style="td25Style">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
            <Tooltip placement="right">
              <span>
                <Icon type="ios-help-outline"></Icon>
              </span>
              <div slot="content">
                <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_OBJECT_PERMISSIONS_INFO")}}</p>
              </div>
            </Tooltip>
          </th>
          <th class="percent25"
              :style="td25Style">{{$t("STORAGE.ACL_PERMISSIONS")}}
            <Tooltip placement="right">
              <span>
                <Icon type="ios-help-outline"></Icon>
              </span>
              <div slot="content">
                <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_ACL_PERMISSIONS_INFO")}}</p>
              </div>
            </Tooltip>
          </th>
          <th class="percent25"
              :style="td20Style"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in aclData"
            :key="item.Grantee">
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
          <td></td>
        </tr>
      </tbody>
    </table>
    <br>
    <slot name="userTitle"></slot>
    <table class="table-permission"
           :class="{ 'dis-in-b': isInline}"
           :style="tableStyle">
      <thead>
        <tr>
          <th class="percent27"
              :style="td30Style"> {{$t("STORAGE.USER")}}
            <Tooltip placement="right">
              <span>
                <Icon type="ios-help-outline"></Icon>
              </span>
              <div slot="content">
                <p style="white-space: normal !important;">{{$t("STORAGE.ACL_USER_INFO")}}</p>
              </div>
            </Tooltip>
          </th>
          <th class="percent23"
              :style="td25Style">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
            <Tooltip placement="right">
              <span>
                <Icon type="ios-help-outline"></Icon>
              </span>
              <div slot="content">
                <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_OBJECT_PERMISSIONS_INFO")}}</p>
              </div>
            </Tooltip>
          </th>
          <th class="percent25"
              :style="td25Style">{{$t("STORAGE.ACL_PERMISSIONS")}}
            <Tooltip placement="right">
              <span>
                <Icon type="ios-help-outline"></Icon>
              </span>
              <div slot="content">
                <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_ACL_PERMISSIONS_INFO")}}</p>
              </div>
            </Tooltip>
          </th>
          <th class="percent25"
              :style="td20Style"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isAddUser">
          <td>
            <input class="new-user-input"
                   v-model="newUserItem.Grantee">
          </td>
          <td>
            <Checkbox v-model="newUserItem.Access.Read">{{$t("STORAGE.READ")}}</Checkbox>
          </td>
          <td>
            <Checkbox v-model="newUserItem.Access.ReadAcp">{{$t("STORAGE.READ")}}</Checkbox>
            <Checkbox v-model="newUserItem.Access.WriteAcp">{{$t("STORAGE.WRITE")}}</Checkbox>
          </td>
          <td>
            <Tooltip placement="bottom"
                     :delay="1000">
              <Button :disabled="newUserDisabled"
                      @click="addUserOK"
                      style="margin: 0 6px;"
                      size="small"
                      icon="checkmark-round"></Button>
              <div slot="content">
                <p>{{$t('PUBLIC.ADD')}}</p>
              </div>
            </Tooltip>
            <Tooltip placement="bottom"
                     :delay="1000">
              <Button @click="isAddUser = false"
                      style="margin: 0 6px;"
                      size="small"
                      icon="close-round"></Button>
              <div slot="content">
                <p>{{$t('VIDEO.CANCEL')}}</p>
              </div>
            </Tooltip>
          </td>
        </tr>
        <tr v-for="(item,index) in userAcl"
            :key="item.Grantee">
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
            <Tooltip placement="bottom"
                     :delay="1000">
              <Button v-if="index == 0"
                      style="margin: 0 6px;"
                      size="small"
                      @click="addUser"
                      icon="plus-round"></Button>
              <Button v-else
                      style="margin: 0 6px;visibility:hidden;"
                      size="small"
                      icon="plus-round"></Button>
              <div slot="content">
                <p>{{$t("STORAGE.ADD_USER")}}</p>
              </div>
            </Tooltip>
            <Tooltip placement="bottom"
                     :delay="1000">
              <Button :disabled="username == item.Grantee"
                      style="margin: 0 6px;"
                      size="small"
                      @click="deleteUser(index)"
                      icon="minus-round"></Button>
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
export default {
  props: {
    aclData: {
      type: Array,
      required: true,
      default() {
        return groupACLListDefult
      },
    },
    userAcl: {
      type: Array,
      required: true,
      default() {
        return this.owerACL
      },
    },
    isInline: {
      type: Boolean,
      default() {
        return false
      },
    },
    width: {
      type: Number,
    },
  },
  data() {
    return {
      iconSize: 16,
      isAddUser: false,
      newUserItem: _.cloneDeep(newUserItemDefult),
      userACLList: _.cloneDeep(this.userAcl),
    }
  },
  computed: {
    newUserDisabled() {
      const name = this.newUserItem.Grantee
      const { Read, ReadAcp, WriteAcp } = this.newUserItem.Access
      return name === '' || !(Read || ReadAcp || WriteAcp)
    },
    username() {
      return this.$store.state.current.username
    },
    tableStyle() {
      return this.width ? { width: `${this.width}px` } : {}
    },
    td30Style() {
      return this.width
        ? {
            width: `${this.width -
              parseInt(this.width * 0.2) -
              parseInt(this.width * 0.25 * 2)}px`,
          }
        : {}
    },
    td20Style() {
      return this.width ? { width: `${parseInt(this.width * 0.2)}px` } : {}
    },
    td25Style() {
      return this.width ? { width: `${parseInt(this.width * 0.25)}px` } : {}
    },
  },
  methods: {
    addUser() {
      this.isAddUser = true
      this.newUserItem = _.cloneDeep(newUserItemDefult)
    },
    addUserOK() {
      this.userAcl.push(this.newUserItem)
      this.isAddUser = false
    },
    deleteUser(index) {
      this.userAcl.splice(index, 1)
    },
  },
}

const newUserItemDefult = {
  Grantee: '',
  Access: {
    Read: false,
    ReadAcp: false,
    WriteAcp: false,
  },
}

const groupACLListDefult = [
  {
    GranteeType: 'Group',
    Grantee: 'AllUsers',
    Access: {
      Read: true,
      ReadAcp: false,
      WriteAcp: false,
    },
  },
  {
    GranteeType: 'Group',
    Grantee: 'AuthenticatedUsers',
    Access: {
      Read: false,
      ReadAcp: false,
      WriteAcp: false,
    },
  },
]
</script>
<style lang="less">
.table-permission th.percent23 {
  width: 23%;
}
.table-permission th.percent25 {
  width: 25%;
}
.table-permission th.percent27 {
  width: 27%;
}
.dis-in-b {
  display: inline-block !important;
}
</style>
