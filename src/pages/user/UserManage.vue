<template>
  <div class="bsc-user">
    <Button type="primary"
            style="marginRight:5px"
            v-show="canCreateSub"
            @click="openCreateSubUserModal">{{$t("USER.CREATE_SUB_USER")}}</Button>
    <Button type="primary"
            v-show="canCreateUser"
            style="marginRight:5px"
            @click="openCreateUserModal">{{$t("USER.CREATE_USER")}}</Button>
    <Button type="primary"
            v-show="canBindUser"
            style="marginRight:5px"
            @click="openBindUserModal">{{$t("USER.BIND_USER")}}</Button>
    <Input v-if="userList.length"
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
           ok-text="确定(请勿多次尝试)"
           @on-ok="createSubUser">
      <div class="section-separator"
           v-show="!isEditSubUser">
        <div class="separator-body">
          <span class="separator-icon"></span>
          <span class="separator-info">{{$t("USER.BASE_INFO")}}</span>
        </div>
      </div>
      <Form ref="createSubUserForm"
            :model="createSubUserForm"
            :rules="subUserRuleValidate"
            :label-width="110" 
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
} from 'api/user'
import { checkRole } from 'helper'

export default {
  data() {
    return {
      self: this,
      userList: [],
      searchUserInput: '',
      customer: '',
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
      createUserForm: {
        // default test_data
        username: `test_${parseInt(Math.random() * 1000)}`,
        email: `test_${parseInt(Math.random() * 1000)}@qq.com`,
        password: '123456',
        company: 'test',
        perms: [],
        perm_rule: 'rule1',
        sso_type: '1',
      },
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
      createSubUserForm: {
        // default test_data
        username: `test_${parseInt(Math.random() * 1000)}`,
        email: `test_${parseInt(Math.random() * 1000)}@qq.com`,
        password: '123456',
        company: 'test',
        acl: [],
      },
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
      userHeader: checkRole('WRITE_USER')
        ? [
            {
              title: 'User name',
              width: 150,
              align: 'left',
              key: 'username',
            },
            {
              title: 'Company',
              width: 200,
              align: 'left',
              key: 'company',
            },
            {
              title: 'Email',
              width: 250,
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
              width: 150,
              align: 'center',
              render: (h, params) => {
                return [
                  h(
                    'i-button',
                    {
                      props: {
                        size: 'small',
                      },
                      style: {
                        marginRight: '5px',
                      },
                      on: {
                        click: () => {
                          this.unbindUserConfirm(params.row, params.index)
                        },
                      },
                    },
                    'Unbind',
                  ),
                  h(
                    'i-button',
                    {
                      props: {
                        size: 'small',
                      },
                      on: {
                        click: () => {
                          this.removeUserConfirm(params.row, params.index)
                        },
                      },
                    },
                    'Remove',
                  ),
                ]
              },
            },
          ]
        : checkRole('LIST_USERS')
          ? [
              {
                title: 'User name',
                width: 150,
                align: 'left',
                key: 'username',
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
          : checkRole('SUB') && checkRole('WRITE_USER', true)
            ? [
                {
                  title: 'User name',
                  width: 150,
                  align: 'left',
                  key: 'username',
                },
                {
                  title: 'Email',
                  width: 200,
                  align: 'left',
                  key: 'email',
                },
                {
                  title: 'Acl',
                  width: 350,
                  align: 'left',
                  key: 'acl',
                  render: (h, params) => {
                    return params.row.acl.length > 0
                      ? params.row.acl.map((acl) => {
                          return h(
                            'Tag',
                            { props: { type: 'border' } },
                            `${acl.bucket} - bucket: ${
                              acl.bucket_acl
                            } - file: ${acl.file_acl}`,
                          )
                        })
                      : h('Tag', 'No acl')
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
              ]
            : [
                {
                  title: 'User name',
                  width: 150,
                  align: 'left',
                  key: 'username',
                },
                {
                  title: 'Email',
                  width: 200,
                  align: 'left',
                  key: 'email',
                },
                {
                  title: 'Acl',
                  width: 350,
                  align: 'left',
                  key: 'acl',
                  render: (h, params) => {
                    return params.row.acl.length > 0
                      ? params.row.acl.map((acl) => {
                          return h(
                            'Tag',
                            { props: { type: 'border' } },
                            `${acl.bucket} - bucket: ${
                              acl.bucket_acl
                            } - file: ${acl.file_acl}`,
                          )
                        })
                      : h('Tag', 'No acl')
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
              ],
    }
  },
  watched: {},
  computed: {
    canCreateUser() {
      return this.$store.state.manager.length
        ? checkRole('WRITE_USER', true) && checkRole('CREATE_USER')
        : checkRole('CREATE_USER')
    },
    canCreateSub() {
      return this.$store.state.manager.length
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
      return checkRole('BIND_USER')
    },
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      this.$Loading.start()
      this.spinShow = true
      this.customer = this.$store.state.manager.length
        ? this.$store.state.current.username
        : ''
      try {
        if (checkRole('LIST_USERS')) {
          await getListBoundUser(this.customer).then((res) => {
            this.userList = res
          })
          this.$Loading.finish()
          this.$store.dispatch('setBaseInfo', {
            users: this.userList,
          })
          this.$Loading.finish()
        } else if (checkRole('SUB')) {
          const [users, bucket] = [
            await getListSubUser(this.customer),
            (await this.$store.getters.buckets) || [],
          ]
          this.bucketList = bucket
          let buckets = await Promise.all(
            bucket.map((bucket) => {
              return getListSubAcl(this.customer, bucket.Name).then((res) => {
                return { bucket: bucket.Name, acl: res }
              })
            }),
          )
          this.userList = _.each(users, (user) => {
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
          this.$store.dispatch('setBaseInfo', {
            users: users,
          })
          this.$Loading.finish()
        }
        this.searchedUserList = this.userList
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
          getListBoundUser(),
        ])
        let boundUserEmailList = []
        _.each(boundUser, (user) => {
          boundUserEmailList.push(user.username)
        })
        _.each(allUser, (user) => {
          user.selected = false
          if (boundUserEmailList.indexOf(user.username) >= 0) {
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
          this.boundUserList.map((userinfo) => {
            if (userinfo.selected) {
              postBindUser({ username: userinfo.username }).then((res) => {
                this.$Message.success('bind succssed!')
                this.searchedUserList = [res, ...this.searchedUserList]
              })
            }
          }),
        ).then()
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
          this.getUserList()
        },
      )
    },
    /******    *****/
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
      postUnbindUser({ username: userinfo.username }, this.customer).then(
        () => {
          this.searchBindUserInput = ''
          this.boundUserList = []
          this.searchUserInput = ''
          this.getUserList()
        },
      )
    },
    createUser() {
      this.$refs['createUserForm'].validate(async (valid) => {
        if (valid) {
          this.$Loading.start()
          this.createUserForm.sso_type = parseInt(this.createUserForm.sso_type)
          try {
            await postCreateUser({ ...this.createUserForm }, this.customer)
            checkRole('BIND_USER')
              ? await postBindUser(
                  { username: this.createUserForm.username },
                  this.customer,
                )
              : ''
            this.createUserForm = {
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
          } catch (e) {
            this.createUserForm.sso_type = `${this.createUserForm.sso_type}`
            this.$Message.error(e.msg)
            this.$Loading.error()
          }
        } else {
          this.$Message.error(this.$t('USER.CREATE_INFO'))
        }
      })
    },
    openCreateSubUserModal() {
      _.extend(this, {
        isEditSubUser: false,
        createSubUserModal: true,
        createSubUserForm: initSubUser(
          this.bucketList.map((bucket) => {
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
          let user = await postCreateSub(
            { ...this.createSubUserForm },
            this.customer,
          )
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
          this.createSubUserForm = {
            username: '',
            email: '',
            password: '',
            company: '',
          }
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
                acl: this.bucketList.map((bucket) => {
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
          this.createSubUserForm.acl.map((acl) => {
            return acl.redirect
              ? postUpdateSubAcl(
                  {
                    username: this.createSubUserForm.username,
                    bucket: acl.bucket,
                    bucket_acl: convertObject2Array(acl.bucket_acl_obj),
                    file_acl: convertObject2Array(acl.file_acl_obj),
                  },
                  this.customer,
                )
              : postRedirectBucket(
                  {
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
                  },
                  this.customer,
                )
          }),
        )
        this.searchUserInput = ''
        await this.getUserList()
        this.$Message.success(this.$t('USER.UPDATE_SUB_SUCCESS'))
      } catch (error) {
        this.$Message.error(this.$t('USER.UPDATE_SUB_ERROR'))
        this.$Loading.error()
      }
      this.isEditSubUser = false
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
