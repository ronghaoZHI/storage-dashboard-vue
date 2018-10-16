<template>
  <div class="bsc-user">
    <Button type="primary"
            style="marginRight:2px"
            v-show="canCreateSub"
            @click="openCreateSubUserModal">{{$t("USER.CREATE_SUB_USER")}}</Button>
    <Button type="primary"
            v-show="canCreateUser"
            style="marginRight:2px"
            @click="openCreateUserModal">{{$t("USER.CREATE_USER")}}</Button>
    <Button type="primary"
            v-show="canBindUser"
            style="marginRight:2px"
            @click="openBindUserModal">{{$t("USER.BIND_USER")}}</Button>
    <Input v-if="userList.length || subUserList.length"
           v-model="searchUserInput"
           @on-change="handleSearchUser"
           placeholder="search here"
           style="width:300px" />
    <Table class="table"
           v-if="!canShowTab"
           :show-header="true"
           :stripe="true"
           :context="self"
           :columns="userHeader"
           :data="searchedUserList"
           :no-data-text="$t('USER.NO_USER')"></Table>
    <Tabs size="small"
          v-model="tabName"
          v-if="canShowTab"
          @on-click="tabChange"
          style="marginTop:10px"
          :animated="false">
      <Tab-pane :label="$t('USER.USER_MANAGE')"
                name="user">
        <Table class="table"
               :show-header="true"
               :stripe="true"
               :context="self"
               :columns="userHeader"
               :data="searchedUserList"
               :no-data-text="$t('USER.NO_USER')"></Table>
      </Tab-pane>
      <Tab-pane :label="$t('USER.SUB_USER_MANAGE')"
                name="subUser">
        <Table class="table"
               :show-header="true"
               :stripe="true"
               :context="self"
               :columns="subUserHeader"
               :data="searchedSubUserList"
               :no-data-text="$t('USER.NO_USER')"></Table>
      </Tab-pane>
    </Tabs>
    <Modal v-model="createUserModal"
           :title="$t('USER.CREATE_USER')"
           @on-ok="createUserCheck"
           @on-cancel="createBucketValue = ''">
      <Form ref="createUserForm"
            :model="createUserForm"
            :rules="userRuleValidate"
            :label-width="100">
        <Form-item :label="$t('USER.USER_NAME')"
                   prop="username">
          <Input v-model="createUserForm.username"
                 placeholder="User name" />
        </Form-item>
        <Form-item :label="$t('USER.EMAILL')"
                   prop="email">
          <Input v-model="createUserForm.email"
                 placeholder="Email" />
        </Form-item>
        <Form-item :label="$t('USER.PASSWORD')"
                   prop="password">
          <Input v-model="createUserForm.password"
                 placeholder="Password" />
        </Form-item>
        <Form-item :label="$t('USER.COMPANY')"
                   prop="company">
          <Input v-model="createUserForm.company"
                 placeholder="Company" />
          <span style="position: absolute;right: 10px;">*{{$t("USER.BUSNISS_LICENSE")}}</span>
        </Form-item>
        <Form-item :label="$t('USER.PERMISSON_CONFIG')"
                   prop="perms"
                   v-if="canCreatePerms.length">
          <CheckboxGroup v-model="createUserForm.perms">
            <Checkbox v-for="perm in canCreatePerms"
                      :label="perm"
                      :disabled="perm === 'BASE'"
                      :key="perm"></Checkbox>
          </CheckboxGroup>
        </Form-item>
        <Form-item :label="$t('USER.USER_TYPE')"
                   prop="sso_type"
                   v-show="canUseSSOType">
          <Radio-group v-model="createUserForm.sso_type">
            <Radio label="2">Customer</Radio>
            <Radio label="1">Staff</Radio>
          </Radio-group>
        </Form-item>
      </Form>
    </Modal>
    <Modal v-model="bindUserModal"
           :title="$t('USER.BIND_USER')"
           width="880"
           @on-ok="bindUser">
      <div class="bind-modal-wrap">
        <Spin size="large"
              fix
              v-if="spinShow"></Spin>
        <Input size="small"
               v-model="searchBindUserInput"
               @on-change="handleSearchBindUser"
               placeholder="search here"
               style="width:300px" />
        <div class="bsc-user-box">
          <div class="user-card"
               v-show="user.show"
               :class="{'user-card-selected': user.selected}"
               @click="user.selected = !user.selected"
               v-for="user in searchBindUserList"
               :key="user.username">
            {{user.username}}
          </div>
        </div>
      </div>
    </Modal>
    <Modal v-model="createSubUserModal"
           :title="$t('USER.CREATE_SUB_USER')"
           ok-text="确定(请勿多次尝试)"
           @on-ok="createSubUser">
      <div class="section-separator">
        <div class="separator-body">
          <span class="separator-icon"></span>
          <span class="separator-info">{{$t("USER.BASE_INFO")}}</span>
        </div>
      </div>
      <Form ref="createSubUserForm"
            :model="createSubUserForm"
            :rules="subUserRuleValidate"
            :label-width="110">
        <Form-item :label="$t('USER.USER_NAME')"
                   prop="username">
          <Input v-model="createSubUserForm.username"
                 :placeholder="$t('USER.REQUIRE_USER_NAME')" />
        </Form-item>
        <Form-item :label="$t('USER.EMAILL')"
                   prop="email">
          <Input v-model="createSubUserForm.email"
                 :placeholder="$t('LOGIN.EMAILL_ALERT')" />
        </Form-item>
        <Form-item :label="$t('USER.PASSWORD')"
                   prop="password">
          <Input v-model="createSubUserForm.password"
                 :placeholder="$t('LOGIN.KEY_ALERT')" />
        </Form-item>
        <Form-item :label="$t('USER.COMPANY')"
                   prop="company">
          <Input v-model="createSubUserForm.company"
                 :placeholder="$t('USER.REQUIRE_COMPANY')" />
        </Form-item>
      </Form>
      <Acls :aclsData=subUserAclForm />
    </Modal>
    <Modal v-model="openEditSubUserModal"
           title="编辑子账号"
           ok-text="确定(请勿多次尝试)"
           @on-ok="editSubUser">
      <Acls :aclsData=subUserAclForm />
    </Modal>
    <Spin size="bigger"
          fix
          v-if="spinShow"></Spin>
  </div>
</template>
<script>
import Acls from './Acls.vue'
import createAlert from '@/service/createAlert'
import moment from 'moment'
import {
  postUnbindUser,
  getListBoundUser,
  postBindUser,
  postCreateSub,
  postCreateUser,
  postRedirectBucket,
  postUpdateSubAcl,
  getListAllUser,
  getListSubUser,
  getListSubAcl,
  postRemoveUser,
} from 'api'
import { checkRole } from 'helper'

export default {
  data() {
    return {
      self: this,
      subUserList: [],
      userList: [],
      tabName: 'user',
      activeName: '',
      passiveNames: [],
      searchUserInput: '',
      customer: '',
      searchedSubUserList: [],
      searchedUserList: [],
      boundUserList: [],
      bucketList: [],
      createSubUserModal: false,
      createUserModal: false,
      bindUserModal: false,
      searchBindUserInput: '',
      searchBindUserList: [],
      spinShow: true,
      openEditSubUserModal: false,
      subUserAclForm: {
        acl: [],
      },
      iconSize: 18,
      createUserForm: initUserInfo(),
      userRuleValidate: {
        username: [
          { required: true, message: 'Requires username', trigger: 'blur' },
        ],
        email: [
          { required: true, message: 'Requires email', trigger: 'blur' },
          {
            type: 'email',
            message: 'Email format is incorrect',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: 'Requires password', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: 'Requires 6 characters',
            trigger: 'blur',
          },
        ],
        company: [
          { required: true, message: 'Requires company', trigger: 'blur' },
          {
            type: 'string',
            message: 'Company format is incorrect',
            trigger: 'blur',
          },
        ],
        perms: [
          {
            required: true,
            type: 'array',
            min: 1,
            message: 'Requires config permssion',
            trigger: 'change',
          },
        ],
      },
      createSubUserForm: initSubUserInfo(),
      subUserRuleValidate: {
        username: [
          { required: true, message: 'Requires user name', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                callback(
                  new Error(
                    'Username can only contain letters , numbers and underlines',
                  ),
                )
              } else {
                callback()
              }
            },
            trigger: 'change',
          },
        ],
        email: [
          { required: true, message: 'Requires email', trigger: 'blur' },
          {
            type: 'email',
            message: 'Email format is incorrect',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: 'Requires password', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: 'Requires 6 characters',
            trigger: 'blur',
          },
        ],
        company: [
          { required: true, message: 'Requires company', trigger: 'blur' },
          {
            type: 'string',
            message: 'Company format is incorrect',
            trigger: 'blur',
          },
        ],
      },
      username: {
        title: 'User name',
        width: 150,
        align: 'left',
        key: 'username',
      },
      company: {
        title: 'Company',
        width: 200,
        align: 'left',
        key: 'company',
      },
      email: {
        title: 'Email',
        width: 200,
        align: 'left',
        key: 'email',
      },
      creation: {
        title: 'Creation time',
        width: 200,
        align: 'left',
        sortable: true,
        key: 'ts',
        render: (h, params) => {
          let creationTime = new Date(
            parseInt(params.row.ts.toString().substr(0, 13)),
          )
          const formatTime = moment(creationTime).format('YYYY-MM-DD hh:mm:ss')
          return h('div', [formatTime])
        },
      },
      acl: {
        title: 'Acl',
        width: 350,
        align: 'left',
        key: 'acl',
        render: (h, params) => {
          return params.row.acl && params.row.acl.length > 0
            ? params.row.acl.map((acl) => createAclTags(acl, h))
            : h('Tag', 'No acl')
        },
      },
      unbind: {
        title: 'Actions',
        key: 'actions',
        width: 100,
        align: 'left',
        render: (h, params) => {
          return h(
            'i-button',
            {
              props: {
                size: 'small',
              },
              on: {
                click: () => {
                  this.unbindUserConfirm(params.row, params.index)
                },
              },
            },
            'Unbind',
          )
        },
      },
      edit: {
        title: 'Actions',
        key: 'actions',
        width: 100,
        align: 'left',
        render: (h, params) => {
          return h('div', [
            h(
              'i-button',
              {
                props: {
                  size: 'small',
                },
                class: {
                  'mar-r-5': true,
                },
                on: {
                  click: () => {
                    this.editSubUserModal(params.row, params.index)
                  },
                },
              },
              [
                h('Icon', {
                  props: {
                    type: 'compose',
                    size: this.iconSize,
                  },
                }),
              ],
            ),
          ])
        },
      },
    }
  },
  computed: {
    canShowTab() {
      return checkRole('SUB') && checkRole('READ_USER')
    },
    canCreateUser() {
      return isSubCount(this)
        ? checkRole('WRITE_USER', true) && checkRole('CREATE_USER')
        : checkRole('CREATE_USER')
    },
    canCreateSub() {
      return isSubCount(this)
        ? checkRole('WRITE_USER', true) && checkRole('SUB')
        : checkRole('SUB')
    },
    canCreatePerms() {
      return this.$store.state
        ? this.$store.state.current.can_create_perms || []
        : []
    },
    canUseSSOType() {
      return checkRole('BIND_USER') || checkRole('LIST_USERS')
    },
    canBindUser() {
      return isSubCount(this)
        ? checkRole('BIND_USER', true) && checkRole('READ_USER')
        : checkRole('BIND_USER')
    },
    userHeader() {
      let headers = [this.username, this.email, this.creation]
      if (
        checkRole('WRITE_USER', 'BIND_USER') ||
        (checkRole('READ_USER') && checkRole('BIND_USER', true))
      ) {
        headers = headers.concat([this.company, this.unbind])
      } else if (
        checkRole('LIST_USERS') ||
        (checkRole('READ_USER') && checkRole('SUB'))
      ) {
        headers = headers.concat([this.company])
      } else if (checkRole('SUB')) {
        headers = headers.concat([this.acl, this.edit])
      } else {
        headers = headers.concat([this.acl])
      }
      return headers
    },
    subUserHeader() {
      let headers = [this.username, this.email, this.acl, this.creation]
      if (
        (checkRole('WRITE_USER', true) && checkRole('SUB')) ||
        (checkRole('SUB') && !isSubCount(this))
      ) {
        headers.push(this.edit)
      }
      return headers
    },
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getSubUsersList(userList = [], sameuser = false) {
      await this.$store.dispatch('getBuckets')
      const users = sameuser ? userList : await getListSubUser(this.customer)
      const bucket = (await this.$store.getters.buckets) || []
      this.bucketList = bucket
      let buckets = await Promise.all(
        bucket.map((bucket) => {
          return getListSubAcl(this.customer, bucket.Name).then((res) => {
            return { bucket: bucket.Name, acl: res }
          })
        }),
      )
      return _.each(users, (user) => {
        user.acl = []
        _.each(buckets, (bucket) => {
          _.each(bucket.acl, (acl) => {
            if (
              user.username === acl.username &&
              (acl.bucket_acl.length !== 0 || acl.file_acl.length !== 0)
            ) {
              user.acl.push({
                bucket: bucket.bucket,
                bucket_acl: acl.bucket_acl,
                bucket_acl_obj: convertArray2Object(acl.bucket_acl),
                file_acl: acl.file_acl,
                file_acl_obj: convertArray2Object(acl.file_acl),
                redirect: true,
              })
            }
          })
        })
      })
    },
    async getUserList(update = false) {
      this.$Loading.start()
      this.spinShow = true
      this.customer = isSubCount(this) ? this.$store.state.current.username : ''
      const isSameUser = this.$store.getters.isSameUser
      if (isSameUser) {
        await this.$store.dispatch('getUsers', update)
      }
      const users = this.$store.getters.users
      try {
        if (checkRole(['LIST_USERS', 'BIND_USER'])) {
          isSameUser
            ? (this.searchedUserList = this.userList = users)
            : (this.searchedUserList = this.userList = checkRole('LIST_USERS')
                ? await getListAllUser()
                : await getListBoundUser(this.customer))
          this.$Loading.finish()
        } else if (checkRole('SUB') && checkRole('READ_USER')) {
          if (isSameUser) {
            this.searchedUserList = this.userList = users.filter(
              (user) => user.type === 1,
            )
            this.searchedSubUserList = this.subUserList = await this.getSubUsersList(
              users.filter((user) => user.type === 0),
              isSameUser,
            )
          } else {
            this.searchedSubUserList = this.subUserList = await this.getSubUsersList()
            this.searchedUserList = this.userList = await getListBoundUser(
              this.customer,
            )
          }
          this.$Loading.finish()
        } else if (checkRole('SUB')) {
          this.searchedUserList = this.userList = await this.getSubUsersList(
            users,
            isSameUser,
          )
          this.$Loading.finish()
        }
        this.spinShow = false
      } catch (error) {
        this.$Loading.error()
        this.spinShow = false
      }
    },
    openCreateUserModal() {
      this.createUserModal = true
    },
    async openBindUserModal() {
      this.bindUserModal = true
      if (this.boundUserList.length === 0) {
        this.spinShow = true
        let [allUser, boundUser] = await Promise.all([
          getListAllUser(),
          getListBoundUser(this.customer),
        ])
        let boundUserLists = []
        _.each(boundUser, (user) => {
          boundUserLists.push(user.username)
        })
        _.each(allUser, (user) => {
          user.selected = false
          if (boundUserLists.indexOf(user.username) >= 0) {
            user.show = false
          } else {
            user.show = true
          }
        })
        this.searchBindUserList = this.boundUserList = allUser
        this.spinShow = false
      }
    },
    handleSearchUser() {
      if (!this.searchUserInput) {
        this.searchedUserList = this.userList
        this.searchedSubUserList = this.subUserList
        return
      }
      this.searchedSubUserList = this.filterUser(
        this.searchUserInput,
        this.subUserList,
      )
      this.searchedUserList = this.filterUser(
        this.searchUserInput,
        this.userList,
      )
    },
    filterUser(searchUserInput = [], list = []) {
      let searchArr = searchUserInput.split('')
      let reg = new RegExp(searchArr.join('.*'))
      return list.filter(
        (item) =>
          reg.test(item.email) ||
          reg.test(item.username) ||
          reg.test(item.company),
      )
    },
    handleSearchBindUser() {
      if (!this.searchBindUserInput) {
        this.searchBindUserList = this.boundUserList
        return
      }
      this.searchBindUserList = this.filterUser(
        this.searchBindUserInput,
        this.boundUserList,
      )
    },
    async bindUser() {
      this.$Loading.start()
      try {
        this.passiveNames = []
        this.activeName = this.$store.state.current.username
        this.boundUserList.map((userinfo) => {
          if (userinfo.selected) {
            this.passiveNames = [...this.passiveNames, userinfo.username]
          }
        })
        await postBindUser({
          active_name: this.activeName,
          passive_names: this.passiveNames,
        }).then(() => {
          this.$Message.success('bind succssed!')
        })
        this.getUserList(true)
        this.searchBindUserInput = ''
        this.boundUserList = []
        this.searchUserInput = ''
        this.$Loading.finish()
      } catch (error) {
        this.$Loading.error()
      }
    },
    /*** just for test ***/
    removeUserConfirm(user, index) {
      this.$Modal.confirm({
        content: `确定要删除 ${user.username} 账号吗？`,
        okText: this.$t('PUBLIC.CONFIRMED'),
        cancelText: this.$t('PUBLIC.CANCLE'),
        title: 'Remove',
        onOk: () => this.removeBindUser(user, index),
      })
    },
    removeBindUser(userinfo) {
      postRemoveUser({ username: userinfo.username }, this.customer).then(
        () => {
          this.searchBindUserInput = ''
          this.boundUserList = []
          this.searchUserInput = ''
          this.getUserList(true)
        },
      )
    },
    unbindUserConfirm(user, index) {
      this.$Modal.confirm({
        content: this.$t('STORAGE.UNBIND_CONFIRMED', {
          fileName: user.username,
        }),
        okText: this.$t('PUBLIC.CONFIRMED'),
        cancelText: this.$t('PUBLIC.CANCLE'),
        title: 'Unbind',
        onOk: () => this.unbindUser(user, index),
      })
    },
    unbindUser(userinfo) {
      try {
        this.spinShow = true
        this.activeName = this.$store.state.current.username
        this.passiveNames = [userinfo.username]
        postUnbindUser({
          active_name: this.activeName,
          passive_names: this.passiveNames,
        }).then(() => {
          this.spinShow = false
          this.searchBindUserInput = ''
          this.boundUserList = []
          this.searchUserInput = ''
          this.getUserList(true)
        })
      } catch (e) {
        this.spinShow = false
        createAlert(`unBindUser ${userinfo.username} error`)
      }
    },
    createUserCheck() {
      this.$refs['createUserForm'].validate((valid) => {
        if (valid) {
          this.createUser()
        } else {
          this.$Message.error(this.$t('USER.CREATE_INFO'))
          setTimeout(() => (this.createUserModal = true), 5)
        }
      })
    },
    async createUser() {
      this.$Loading.start()
      this.createUserForm.sso_type = parseInt(this.createUserForm.sso_type)
      try {
        this.activeName = this.$store.state.current.username
        this.passiveNames = [this.createUserForm.username]
        await postCreateUser({ ...this.createUserForm }, this.customer)
        checkRole('BIND_USER')
          ? await postBindUser({
              active_name: this.activeName,
              passive_names: this.passiveNames,
            })
          : ''
        this.createUserForm = initUserInfo()
        this.getUserList(true)
        this.searchUserInput = ''
        this.$Message.success(this.$t('USER.CREATE_SUCCESS'))
        this.$Loading.finish()
      } catch (e) {
        this.createUserForm.sso_type = `${this.createUserForm.sso_type}`
        this.$Message.error(e.msg)
        this.$Loading.error()
      }
    },
    openCreateSubUserModal() {
      this.createSubUserModal = true
      this.subUserAclForm = initSubUserAcls(this.bucketList)
      this.createSubUserForm = {
        ...this.createSubUserForm,
        ...this.subUserAclForm,
      }
    },
    async createSubUser() {
      try {
        this.$Loading.start()
        let user = (this.createSubUserForm = {
          ...this.createSubUserForm,
          ...(await postCreateSub(this.createSubUserForm, this.customer)),
        })
        await Promise.all(
          this.createSubUserForm.acl.map((bucket) => {
            if (
              convertObject2Array(bucket.bucket_acl_obj).length > 0 ||
              convertObject2Array(bucket.file_acl_obj).length > 0
            ) {
              return postRedirectBucket(
                {
                  original: bucket.bucket,
                  username: user.username,
                  redirect:
                    bucket.bucket +
                    '-' +
                    user.username.replace(/\W|_/g, '').toLowerCase(),
                  bucket_acl: convertObject2Array(bucket.bucket_acl_obj),
                  file_acl: convertObject2Array(bucket.file_acl_obj),
                },
                this.customer,
              )
            }
          }),
        )
        this.createSubUserForm = initSubUserInfo()
        this.getUserList(true)
        this.searchUserInput = ''
        this.$Message.success(this.$t('USER.CREATE_SUB_SUCCESS'))
      } catch (error) {
        this.$Message.error(this.$t('USER.CREATE_SUB_ERROR'))
        this.$Loading.error()
      }
    },
    editSubUserModal(user) {
      this.subUserAclForm = { ...initSubUserAcls(this.bucketList) }
      this.openEditSubUserModal = true
      user.acl.length > 0
        ? (this.subUserAclForm = convertBucketList(user, this.bucketList))
        : (this.subUserAclForm = {
            ...user,
            acl: this.bucketList.map((bucket) => {
              return {
                bucket: bucket.Name,
                bucket_acl_obj: { READ: false, WRITE: false },
                file_acl_obj: { READ: false },
                redirect: false,
              }
            }),
          })
    },
    async editSubUser() {
      try {
        this.$Loading.start()
        await Promise.all(
          this.subUserAclForm.acl.map((acl) => {
            return acl.redirect
              ? postUpdateSubAcl(
                  {
                    username: this.subUserAclForm.username,
                    bucket: acl.bucket,
                    bucket_acl: convertObject2Array(acl.bucket_acl_obj),
                    file_acl: convertObject2Array(acl.file_acl_obj),
                  },
                  this.customer,
                )
              : postRedirectBucket(
                  {
                    username: this.subUserAclForm.username,
                    original: acl.bucket,
                    redirect:
                      acl.bucket +
                      '-' +
                      this.subUserAclForm.username
                        .replace(/\W|_/g, '')
                        .toLowerCase(),
                    bucket_acl: convertObject2Array(acl.bucket_acl_obj),
                    file_acl: convertObject2Array(acl.file_acl_obj),
                  },
                  this.customer,
                )
          }),
        )
        this.searchUserInput = ''
        await this.getUserList(true)
        this.$Message.success(this.$t('USER.UPDATE_SUB_SUCCESS'))
      } catch (error) {
        this.$Message.error(this.$t('USER.UPDATE_SUB_ERROR'))
        this.$Loading.error()
      }
    },
    tabChange() {
      return ''
    },
  },
  components: {
    Acls,
  },
}
const isSubCount = (that) => {
  return (
    that.$store.state.manager.length &&
    that.$store.state.manager[0].username !== that.$store.state.current.username
  )
}
const initSubUserAcls = (bucketList = []) => {
  const acls = bucketList.map((bucket) => {
    return {
      bucket: bucket.Name,
      bucket_acl_obj: { READ: false, WRITE: false },
      file_acl_obj: { READ: false },
    }
  })
  return {
    acl: acls || [
      {
        bucket: '',
        bucket_acl_obj: { READ: false, WRITE: false },
        file_acl_obj: { READ: false },
      },
    ],
  }
}

const convertBucketList = (user, bucketList) => {
  if (user.acl.length !== bucketList.length) {
    let bucketNameArray = user.acl.map((bucket) => {
      return bucket.bucket
    })
    _.each(bucketList, (bucket) => {
      if (bucketNameArray.indexOf(bucket.Name) === -1) {
        user.acl.push({
          bucket: bucket.Name,
          bucket_acl_obj: { READ: false, WRITE: false },
          file_acl_obj: { READ: false },
          redirect: false,
        })
      }
    })
  }
  return user
}

const createAclTags = (acl, h) => {
  const bucketAcl =
    acl.bucket_acl.length === 0 ||
    (acl.bucket_acl.length === 1 && acl.bucket_acl[0] === 'READ_ACP')
      ? ''
      : ` - bucket: ${acl.bucket_acl.filter((ac) => ac !== 'READ_ACP')}`
  const fileAcl =
    acl.file_acl.length === 0 ||
    (acl.file_acl.length === 1 && acl.file_acl[0] === 'READ_ACP')
      ? ''
      : ` - file: ${acl.file_acl.filter((ac) => ac !== 'READ_ACP')}`
  return (
    bucketAcl + fileAcl !== '' &&
    h(
      'Tag',
      { props: { type: 'border' } },
      `${acl.bucket}${bucketAcl}${fileAcl}`,
    )
  )
}

const initUserInfo = () => ({
  username: '',
  email: '',
  password: '',
  company: '',
  perm_rule: 'rule1',
  perms: ['BASE'],
  sso_type: '2',
})
const initSubUserInfo = () => ({
  username: '',
  email: '',
  password: '',
  company: '',
  acl: [],
})

const convertObject2Array = (object) => {
  if (!object) {
    return
  }
  let truePermission = {}
  _.each(object, function(value, key) {
    if (value) {
      truePermission[key] = true
    }
  })
  let keys = _.keys(truePermission)
  keys.indexOf('READ_ACP') === -1 && keys.push('READ_ACP')
  return keys
}

const convertArray2Object = (array) => {
  let aclObj = {
    READ: false,
    WRITE: false,
  }
  if (array.length) {
    _.each(array, (item) => {
      aclObj[item] = true
    })
  }
  return aclObj
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
@user-card-width: 200px;
@user-card-height: 25px;
@user-card-text-color: #657180;
@user-card-border-color: #d7dde4;
@user-card-backgrand: #f5f7f9;
@user-card-backgrand-hover: #d9d9d9;

.@{css-prefix}user {
  & > div.table {
    margin-top: 16px;
  }
}

.bind-modal-wrap {
  min-height: 400px;
  position: relative;

  .@{css-prefix}user-box {
    min-height: 100%;
    max-height: 600px;
    overflow-y: auto;
    width: 100%;
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 8px;

    .user-card {
      width: @user-card-width;
      height: @user-card-height;
      color: @user-card-text-color;
      background-color: @user-card-backgrand;
      line-height: @user-card-height;
      text-align: center;
      border-radius: @common-radius;
      margin: 3px 3px 0 0;
      padding: 0 3px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      cursor: pointer;

      &:hover {
        background-color: @user-card-backgrand-hover;
      }
    }

    .user-card-selected {
      background-color: @user-card-backgrand-hover;
    }
  }
}

.dark .table-bucket-acl {
  border: @common-border-dark;
  border-collapse: collapse;

  th {
    background: @secondary-color-dark;
  }

  th,
  td {
    border-bottom: @common-border-dark;
  }
}

.table-bucket-acl {
  width: 100%;
  border: @common-border;
  border-collapse: collapse;

  th {
    background: #eff3f7;
  }

  th,
  td {
    width: 33%;
    height: 40px;
    line-height: 40px;
    text-align: left;
    padding-left: 12px;
    text-overflow: ellipsis;
    vertical-align: middle;
    border-bottom: 1px solid #e3e8ee;
  }
}
</style>
