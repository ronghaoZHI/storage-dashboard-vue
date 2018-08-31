<template>
  <div class="bsc-user">
    <Button type="primary"
            v-show="true"
            @click="openCreateSubUserModal">{{$t("USER.CREATE_SUB_USER")}}</Button>
    <Button type="primary"
            v-show="canCreateUser"
            @click="createUserModal = true">{{$t("USER.CREATE_USER")}}</Button>
    <Button type="primary"
            v-show="true"
            @click="openBindUserModal">{{$t("USER.BIND_USER")}}</Button>
    <Input v-if="userList.length > 0"
           v-model="searchUserInput"
           @on-change="handleSearchUser"
           placeholder="search here"
           style="width:300px" />
    <Table class="table"
           :show-header="true"
           :stripe="true"
           :context="self"
           :columns="userHeader"
           :data="searchedUserList"
           :no-data-text="$t('USER.NO_USER')"></Table>
    <Modal v-model="createUserModal"
           :title="$t('USER.CREATE_USER')"
           @on-ok="createUser"
           @on-cancel="createBucketValue = ''">
      <Form ref="createUserForm"
            :model="createUserForm"
            :rules="userRuleValidate"
            :label-width="125">
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
                   prop="perms">
          <CheckboxGroup v-model="createUserForm.perms">
            <Checkbox v-for="perm in canCreatePerms" :label="perm" :key="perm"></Checkbox>
          </CheckboxGroup>
        </Form-item>
        <Form-item :label="$t('USER.USER_TYPE')"
                   prop="sso_type"
                   v-show="canUseSSOType">
          <Radio-group v-model="createUserForm.sso_type">
            <Radio label="1">Customer</Radio>
            <Radio label="2">Staff</Radio>
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
           width="600"
           ok-text="确定(此请求耗时较长，请勿多次尝试)"
           @on-ok="createSubUser">
      <div class="section-separator"
           v-show="1">
        <div class="separator-body">
          <span class="separator-icon"></span>
          <span class="separator-info">{{$t("USER.BASE_INFO")}}</span>
        </div>
      </div>
      <Form ref="createSubUserForm"
            :model="createSubUserForm"
            :rules="subUserRuleValidate"
            :label-width="85"
            v-show="!isEditSubUser">
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
      <div class="section-separator">
        <div class="separator-body">
          <span class="separator-icon"></span>
          <span class="separator-info">{{$t("USER.BASE_INFO")}}</span>
        </div>
      </div>
      <table class="table-bucket-acl">
        <thead>
          <tr>
            <th>{{$t("USER.BUCKET_NAME")}}</th>
            <th>{{$t("USER.BUCKET_PERMISSON")}}</th>
            <th>{{$t("USER.FILE_PERMISSON")}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="createSubUserForm.acl.length === 0">
            <td>No Buckets</td>
            <td></td>
            <td></td>
          </tr>
          <tr v-else
              v-for="row in createSubUserForm.acl"
              :key="row.bucket">
            <td>{{row.bucket}}</td>
            <td>
              <Checkbox v-model="row.bucket_acl_obj.READ">{{$t("USER.READ")}}</Checkbox>
              <Checkbox v-model="row.bucket_acl_obj.WRITE">{{$t("USER.WRITE")}}</Checkbox>
            </td>
            <td>
              <Checkbox v-model="row.file_acl_obj.READ">{{$t("USER.READ")}}</Checkbox>
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>
    <Spin size="bigger"
          fix
          v-if="spinShow"></Spin>
  </div>
</template>
<script>
import user from '@/store/modules/user'
import moment from 'moment'
import {
  BOUND_USER,
  BOUND_USER_SUPERADMIN,
  ALL_USER,
  ALL_USER_SUPERADMIN,
  SUB_USER,
  BIND_USER,
  BIND_USER_SUPERADMIN,
  UNBIND_USER,
  UNBIND_USER_SUPERADMIN,
  getSuperSubUserUrl,
} from '@/service/API'
import { getListSubAcl, postCreateSub, postRedirectBucket, postUpdateSubAcl, postCreateUser } from 'api/user'
import { checkRole } from 'helper'
console.log(user.state)

export default {
  data() {
    return {
      self: this,
      userList: [],
      searchUserInput: '',
      searchedUserList: [],
      boundUserList: [],
      bucketList: [],
      createSubUserModal: false,
      createUserModal: false,
      bindUserModal: false,
      searchBindUserInput: '',
      searchBindUserList: [],
      spinShow: true,
      isEditSubUser: false,
      iconSize: 18,
      isAdmin:
        (user.state && user.state.type === 'admin' && !isSuper()) ||
        user.state.type === 'superadmin',
      isSuperHigh:
        user.state && user.state.type === 'super' && user.state.super_level === 'high',
      createUserForm: {
        // test_data default
        username: 'test_',
        email: 'test_@qq.com',
        password: '123456',
        company: 'test',
        perms: [],
        perm_rule: 'rule1',
        sso_type: '1',
      },
      userRuleValidate: {
        username: [
          { required: true, message: 'Requires user name', trigger: 'blur' },
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
          { required: true, type: 'array', min: 1, message: 'Requires config permssion', trigger: 'change' },
        ],
      },
      createSubUserForm: initSubUser(),
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
      userHeader:
        user.state && user.state.type === 'superadmin'
          ? [
              {
                title: 'User name',
                width: 150,
                align: 'left',
                key: 'username',
              },
              {
                title: 'Type',
                width: 120,
                align: 'left',
                key: 'type',
              },
              {
                title: 'Email',
                width: 200,
                align: 'left',
                key: 'email',
              },
              {
                title: 'Creation time',
                width: 200,
                align: 'left',
                render: (h, params) => {
                  let creationTime = new Date(
                    parseInt(params.row.ts.toString().substr(0, 13)),
                  )
                  const formatTime = moment(creationTime).format(
                    'YYYY-MM-DD hh:mm:ss',
                  )
                  return h('div', [formatTime])
                },
              },
              {
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
            ]
          : user.state && user.state.type === 'admin' && !isSuper()
            ? [
                {
                  title: 'User name',
                  width: 150,
                  align: 'left',
                  key: 'username',
                },
                {
                  title: 'Type',
                  width: 120,
                  align: 'left',
                  key: 'type',
                },
                {
                  title: 'Company',
                  width: 200,
                  align: 'left',
                  key: 'company',
                },
                {
                  title: 'Email',
                  width: 200,
                  align: 'left',
                  key: 'email',
                },
                {
                  title: 'Creation time',
                  width: 200,
                  align: 'left',
                  render: (h, params) => {
                    let creationTime = new Date(
                      parseInt(params.row.ts.toString().substr(0, 13)),
                    )
                    const formatTime = moment(creationTime).format(
                      'YYYY-MM-DD hh:mm:ss',
                    )
                    return h('div', [formatTime])
                  },
                },
                {
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
              ]
            : user.state && user.state.type === 'admin' && isSuper()
              ? [
                  {
                    title: 'User name',
                    width: 150,
                    align: 'left',
                    key: 'username',
                  },
                  {
                    title: 'Type',
                    width: 120,
                    align: 'left',
                    key: 'type',
                  },
                  {
                    title: 'Email',
                    width: 250,
                    align: 'left',
                    key: 'email',
                  },
                  {
                    title: 'Acl',
                    width: 380,
                    align: 'left',
                    key: 'acl',
                    render: (h, params) => {
                      return params.row.acl
                        ? Array.map(params.row.acl, (acl) => {
                            return h(
                              'Tag',
                              { props: { type: 'border' } },
                              `${acl.bucket} - bucket: ${
                                acl.bucket_acl
                              } - file: ${acl.file_acl}`,
                            )
                          })
                        : 'No acl'
                    },
                  },
                  {
                    title: 'Creation time',
                    width: 200,
                    align: 'left',
                    render: (h, params) => {
                      let creationTime = new Date(
                        parseInt(params.row.ts.toString().substr(0, 13)),
                      )
                      const formatTime = moment(creationTime).format(
                        'YYYY-MM-DD hh:mm:ss',
                      )
                      return h('div', [formatTime])
                    },
                  },
                ]
              : [
                  {
                    title: 'User name',
                    width: 150,
                    align: 'left',
                    key: 'username',
                  },
                  {
                    title: 'Type',
                    width: 120,
                    align: 'left',
                    key: 'type',
                  },
                  {
                    title: 'Email',
                    width: 200,
                    align: 'left',
                    key: 'email',
                  },
                  {
                    title: 'Acl',
                    width: 380,
                    align: 'left',
                    key: 'acl',
                    render: (h, params) => {
                      return params.row.acl
                        ? Array.map(params.row.acl, (acl) => {
                            return h(
                              'Tag',
                              { props: { type: 'border' } },
                              `${acl.bucket} - bucket: ${
                                acl.bucket_acl
                              } - file: ${acl.file_acl}`,
                            )
                          })
                        : 'No acl'
                    },
                  },
                  {
                    title: 'Creation time',
                    width: 200,
                    align: 'left',
                    render: (h, params) => {
                      let creationTime = new Date(
                        parseInt(params.row.ts.toString().substr(0, 13)),
                      )
                      const formatTime = moment(creationTime).format(
                        'YYYY-MM-DD hh:mm:ss',
                      )
                      return h('div', [formatTime])
                    },
                  },
                  {
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
                ],
    }
  },
  watched:{
  },
  computed: {
    canCreateUser() {
      return checkRole('CREATE_USER')
    },
    canCreateSub() {
      return checkRole('SUB')
    },
    canCreatePerms() {
      return user.state ? user.state.can_create_perms : []
    },
    canUseSSOType() {
      return checkRole('BIND_USER')
    },
  },
  created() {
    console.log(user.state)
    this.getUserList()
  },
  methods: {
    async getUserList() {
      this.$Loading.start()
      this.spinShow = true
      try {
        if (this.isAdmin) {
          this.userList = _.each(
            await this.$http.get(
              user.state.type === 'superadmin'
                ? BOUND_USER_SUPERADMIN
                : BOUND_USER,
            ),
            (user) => {
              user.type = this.userType(user)
            },
          )
          await this.$Loading.finish()
          await this.$store.dispatch('setUserInfo', {
            ...user.state,
            subUserList: this.userList,
          })
        } else {
          let getSubUserURL = isSuper()
            ? getSuperSubUserUrl(user.state.subUser.username)
            : SUB_USER
          let [res, users] = await Promise.all([
            this.$store.dispatch('getBuckets'),
            this.$http.get(getSubUserURL),
          ])
          let buckets = await Promise.all(
            Array.map(res.Buckets, (bucket) => {
              const params = isSuper()
                ? { bucket: bucket.Name, customer: user.state.subUser.username }
                : { bucket: bucket.Name }
              this.bucketList = res.Buckets
              return getListSubAcl({ params }).then((acl) => {
                return { bucket: bucket.Name, acl: acl }
              })
            }),
          )
          this.userList = _.each(users, (user) => {
            user.acl = []
            user.type = this.userType(user)
            _.each(buckets, (bucket) => {
              _.each(bucket.acl, (acl) => {
                if (
                  user.email === acl.email &&
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
          this.$Loading.finish()
        }
        this.searchedUserList = this.userList
        this.spinShow = false
      } catch (error) {
        this.$Loading.error()
        this.spinShow = false
        console.log(error)
      }
    },
    async openBindUserModal() {
      this.bindUserModal = true
      if (this.boundUserList.length === 0) {
        this.spinShow = true
        let [allUser, boundUser] = await Promise.all([
          this.$http.get(
            user.state.type === 'superadmin' ? ALL_USER_SUPERADMIN : ALL_USER,
          ),
          this.$http.get(
            user.state.type === 'superadmin'
              ? BOUND_USER_SUPERADMIN
              : BOUND_USER,
          ),
        ])
        let boundUserEmailList = []
        _.each(boundUser, (user) => {
          boundUserEmailList.push(user.email)
        })
        _.each(allUser, (user) => {
          if (boundUserEmailList.indexOf(user.email) >= 0) {
            user.show = false
          } else {
            user.show = true
            user.selected = false
          }
        })
        this.searchBindUserList = this.boundUserList = allUser
        this.spinShow = false
      }
    },
    handleSearchUser() {
      if (!this.searchUserInput) {
        this.searchedUserList = this.userList
        return
      }
      let searchArr = this.searchUserInput.split('')
      let reg = new RegExp(searchArr.join('.*'))
      this.searchedUserList = this.userList.filter(
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
      let searchArr = this.searchBindUserInput.split('')
      let reg = new RegExp(searchArr.join('.*'))
      this.searchBindUserList = this.boundUserList.filter(
        (item) => reg.test(item.email) || reg.test(item.username),
      )
    },
    async bindUser() {
      this.$Loading.start()
      try {
        await Promise.all(
          Array.map(this.boundUserList, (userinfo) => {
            if (userinfo.selected) {
              this.$http.post(
                user.state.type === 'superadmin'
                  ? BIND_USER_SUPERADMIN
                  : BIND_USER,
                { email: userinfo.email },
              )
              this.searchBindUserInput = ''
              this.boundUserList = []
              this.searchUserInput = ''
              this.getUserList()
            }
          }),
        ).then((res) => console.log(res), (err) => console.error(err))
        this.$Loading.finish()
      } catch (error) {
        this.$Loading.error()
      }
    },
    unbindUserConfirm(user, index) {
      this.$Modal.confirm({
        content: this.$t('STORAGE.UNBIND_CONFIRMED', { fileName: user.email }),
        okText: this.$t('PUBLIC.CONFIRMED'),
        cancelText: this.$t('PUBLIC.CANCLE'),
        title: 'Unbind',
        onOk: () => this.unbindUser(user, index),
      })
    },
    unbindUser(userinfo, index) {
      this.$http
        .post(
          user.state.type === 'superadmin'
            ? UNBIND_USER_SUPERADMIN
            : UNBIND_USER,
          { email: userinfo.email },
        )
        .then((res) => {
          this.searchBindUserInput = ''
          this.boundUserList = []
          this.searchUserInput = ''
          this.getUserList()
        })
    },
    createUser() {
      let self = this
      this.$refs['createUserForm'].validate((valid) => {
        if (valid) {
          this.$Loading.start()
          this.createUserForm.sso_type = parseInt(this.createUserForm.sso_type)
          postCreateUser(JSON.stringify(self.createUserForm))
            .then(
              (res) => {
                self.createUserForm = {
                  username: '',
                  email: '',
                  password: '',
                  company: '',
                  perm_rule: 'rule1',
                  perms: [],
                  sso_type: '1',
                }
                this.searchUserInput = ''
                this.getUserList()
                this.$Message.success(this.$t('USER.CREATE_SUCCESS'))
                this.$Loading.finish()
              },
              (e) => {
                this.createUserForm.sso_type = `${this.createUserForm.sso_type}`
                this.$Message.error(e.msg)
                this.$Loading.error()
              },
            )
        } else {
          console.log("err")
          this.$Message.error(this.$t('USER.CREATE_INFO'))
        }
      })
    },
    openCreateSubUserModal() {
      _.extend(this, {
        isEditSubUser: false,
        createSubUserModal: true,
        createSubUserForm: initSubUser(
          Array.map(this.bucketList, (bucket) => {
            return {
              bucket: bucket.Name,
              bucket_acl_obj: { READ: false, WRITE: false },
              file_acl_obj: { READ: false },
            }
          }),
        ),
      })
    },
    async createSubUser() {
      if (this.isEditSubUser) {
        this.editSubUser()
      } else {
        try {
          this.$Loading.start()
          let user = await postCreateSub({
            ...this.createSubUserForm,
          })
          await Promise.all(
            Array.map(this.createSubUserForm.acl, (bucket) => {
              if (
                convertObject2Array(bucket.bucket_acl_obj).length > 0 ||
                convertObject2Array(bucket.file_acl_obj).length > 0
              ) {
                return postRedirectBucket({
                  original: bucket.bucket,
                  email: user.email,
                  redirect:
                    bucket.bucket +
                    '-' +
                    user.username.replace(/\W|_/g, '').toLowerCase(),
                  bucket_acl: convertObject2Array(bucket.bucket_acl_obj),
                  file_acl: convertObject2Array(bucket.file_acl_obj),
                })
              }
            }),
          )
          this.searchUserInput = ''
          this.getUserList()
          this.$Message.success(this.$t('USER.CREATE_SUB_SUCCESS'))
        } catch (error) {
          this.$Message.error(this.$t('USER.CREATE_SUB_ERROR'))
          this.$Loading.error()
        }
      }
    },
    editSubUserModal(user) {
      _.extend(this, {
        isEditSubUser: true,
        createSubUserModal: true,
        createSubUserForm:
          user.acl.length > 0
            ? convertBucketList(user, this.bucketList)
            : _.extend(user, {
                acl: Array.map(this.bucketList, (bucket) => {
                  return {
                    bucket: bucket.Name,
                    bucket_acl_obj: { READ: false, WRITE: false },
                    file_acl_obj: { READ: false },
                    redirect: false,
                  }
                }),
              }),
      })
    },
    async editSubUser() {
      try {
        this.$Loading.start()
        await Promise.all(
          Array.map(this.createSubUserForm.acl, (acl) => {
            return acl.redirect
              ? postUpdateSubAcl({
                  username: this.createSubUserForm.username,
                  bucket: acl.bucket,
                  bucket_acl: convertObject2Array(acl.bucket_acl_obj),
                  file_acl: convertObject2Array(acl.file_acl_obj),
                })
              : postRedirectBucket({
                  username: this.createSubUserForm.username,
                  original: acl.bucket,
                  redirect:
                    acl.bucket +
                    '-' +
                    this.createSubUserForm.username
                      .replace(/\W|_/g, '')
                      .toLowerCase(),
                  bucket_acl: convertObject2Array(acl.bucket_acl_obj),
                  file_acl: convertObject2Array(acl.file_acl_obj),
                })
          }),
        )
        this.searchUserInput = ''
        this.getUserList()
        this.$Message.success(this.$t('USER.UPDATE_SUB_SUCCESS'))
      } catch (error) {
        this.$Message.error(this.$t('USER.UPDATE_SUB_ERROR'))
        this.$Loading.error()
      }
      this.isEditSubUser = false
    },
    userType(user) {
      let type = user.info.type
      return type === 'normal'
        ? this.$t('USER.GENERAL_USER')
        : type === 'sub'
          ? this.$t('USER.SUB_USER')
          : type === 'admin'
            ? this.$t('USER.ADMIN')
            : this.$t('USER.SUPER_USER')
    },
  },
}

const initSubUser = (acls) => {
  return {
    username: '',
    email: '',
    password: '',
    company: '',
    acl: acls || [
      {
        bucket: '',
        bucket_acl_obj: { READ: false, WRITE: false },
        file_acl_obj: { READ: false },
      },
    ],
  }
}

const isSuper = () => {
  const userInfo = user.state.subUser
    ? user.state.subUserList.filter(
        (item) => item.username === user.state.subUser.username,
      )
    : undefined
  return userInfo && userInfo[0].info.type === 'super'
}

const convertBucketList = (user, bucketList) => {
  if (user.acl.length !== bucketList.length) {
    let bucketNameArray = Array.map(user.acl, (bucket) => {
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
