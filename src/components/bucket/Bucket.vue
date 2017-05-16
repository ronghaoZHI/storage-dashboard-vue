<template>
    <div>
        <div class="layout-bsc-toolbar">
            <div>
                <Button class="button-bsc-add-bucket" type="primary" @click="createBucketModal = true">Add bucket</Button>
                <Button class="button-bsc-add-bucket" type="primary" v-if="adminMode" @click="createUserModal = true">Add user</Button>
                <Tooltip content="Click the checkbox on the folder" :disabled="!!selectedBucket.Name" placement="top">
                    <Button class="button-bsc-add-bucket" :disabled="!selectedBucket.Name" type="primary" v-if="adminMode" @click="redirectBucketModal = true">Authorization</Button>
                </Tooltip>
                <Tooltip content="Click the checkbox on the folder" :disabled="!!selectedBucket.Name" placement="top">
                    <Button class="button-bsc-add-bucket" :disabled="!selectedBucket.Name" type="primary" @click="goBucketSettings()">Bucket settings</Button>
                </Tooltip>
                <Tooltip content="Click the checkbox on the folder" :disabled="!!selectedBucket.Name" placement="top">
                    <Button class="button-bsc-add-bucket" :disabled="!selectedBucket.Name" @click="deleteBucketConfirm()">Delete bucket</Button>
                </Tooltip>
            </div>
        </div>
        <div class="section-iconmode">
            <div class="bucket" v-cbutton v-for="bucket in bucketList" @click="rowClick(bucket)" v-on:dblclick="dbClick(bucket)">
                <Icon class="icon-check" type="checkmark-circled"></Icon>
                <span class="span-filename">{{bucket.Name}}</span>
            </div>
        </div>
        <Modal v-model="createBucketModal" title="Add bucket" ok-text="OK" @on-ok="addBucket" @on-cancel="createBucketValue = ''" cancel-text="Cancel">
            <Input v-model="createBucketValue" @on-change="check" placeholder="Requires bucket name">
            </Input>
            <span class="info-input-error">{{inputCheck ? 'Requires 3 characters' : ''}}</span>
        </Modal>
        <Modal v-model="createUserModal" title="Add user" @on-ok="createUser" @on-cancel="createBucketValue = ''">
            <Form ref="createUserForm" :model="createUserForm" :rules="userRuleValidate" :label-width="90">
                <Form-item label="User name" prop="username">
                    <Input v-model="createUserForm.username" placeholder="User name"></Input>
                </Form-item>
                <Form-item label="Email" prop="email">
                    <Input v-model="createUserForm.email" placeholder="Email"></Input>
                </Form-item>
                <Form-item label="Password" prop="password">
                    <Input v-model="createUserForm.password" placeholder="Password"></Input>
                </Form-item>
            </Form>
        </Modal>
        <Modal v-model="redirectBucketModal" title="Add a redirect bucket and authorize it to the user" @on-ok="createRedirectBucket" @on-cancel="redirectBucketModal = ''">
            <Form ref="redirectBucketForm" :model="redirectBucketForm" :rules="redirectBucketRuleValidate" :label-width="90">
                <Form-item label="Bucket alias" prop="redirect">
                    <Input v-model="redirectBucketForm.redirect" placeholder="Bucket alias"></Input>
                </Form-item>
                <Form-item label="User email" prop="email">
                    <Input v-model="redirectBucketForm.email" placeholder="User email"></Input>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { handler } from '../service/Aws'
import { CREATE_USER,REDIRECT_BUCKET } from '../service/API'
import { removeItemFromArray } from '../service/bucketService'
import moment from 'moment'
import user from '@/store/modules/user'
export default {
    data() {
        return {
            adminMode: false,
            createBucketValue: '',
            createBucketModal: false,
            redirectBucketModal: false,
            createUserModal: false,
            selectedBucket: {},
            inputCheck: false,
            self: this,
            iconSize: 18,
            header: headSetting,
            bucketList: this.bucketList,
            createUserForm: {
                username: '',
                email: '',
                password: ''
            },
            userRuleValidate: {
                username: [
                    { required: true, message: 'Requires user name', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: 'Requires email', trigger: 'blur' },
                    { type: 'email', message: 'Email format is incorrect', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Requires password', trigger: 'blur' },
                    { type: 'string', min: 6, message: 'Requires 6 characters', trigger: 'blur' }
                ]
            },
            redirectBucketForm: {
                redirect: '',
                email: ''
            },
            redirectBucketRuleValidate: {
                redirect: [
                    { required: true, message: 'Requires bucket alias', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: 'Requires user email', trigger: 'blur' },
                    { type: 'email', message: 'Email format is incorrect', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.getBucketList()
    },
    directives: {
        cbutton: {
            bind: function (el, binding) {
                el.onclick = (e) => {
                    el.classList.toggle("bucket-selected")
                    _.each(el.parentNode.childNodes, (node) => {
                        node !== el && node.classList.remove("bucket-selected")
                    })
                }
            }
        }
    },
    methods: {
        async getBucketList() {
            try {
                this.$Loading.start()
                let res = await handler('listBuckets')
                this.bucketList = _.forEach(res.Buckets, (item) => {
                    item.selected = false
                    return item.CreationDate = moment(item.CreationDate).format('YYYY-MM-DD HH:mm')
                })
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                console.log(error)
            }
        },
        deleteBucketConfirm() {
            const item = this.selectedBucket
            this.$Modal.confirm({
                content: `Are you sure you want to delete [${item.Name}]?`,
                okText: 'Submit',
                cancelText: 'Cancle',
                onOk: () => this.deleteBucket(item)
            })
        },
        async deleteBucket(bucket) {
            try {
                let buckets = await handler('listObjects', { Bucket: bucket.Name })
                let response = await buckets.Contents.length ? batchDeletion(buckets.Contents, bucket.Name) : Promise.resolve()
                // the bucket has cache when the objects just deleted
                response.then(res => {
                    setTimeout(() => { handler('deleteBucket', { Bucket: bucket.Name }) }, 1000)
                })
                // the bucket list also has cache ...
                removeItemFromArray(this.bucketList, bucket)

                this.selectedBucket = {}
                _.each(document.querySelector('.section-iconmode').childNodes, (node) => {
                    node.classList.remove("bucket-selected")
                })
            } catch (error) {
                console.log(error)
                this.$Message.error(error.message)
            }
        },
        createUser() {
            let self = this
            this.$refs['createUserForm'].validate((valid) => {
                if (valid) {
                    self.$http.post(CREATE_USER, {...self.createUserForm}).then(res => {
                        self.createUserForm = { username: '',email: '',password: '' }
                        this.$Message.success('Create user success')
                    },error => {
                        this.$Message.error(error)
                    })
                } else {
                    this.$Message.error('Input validate failed')
                }
            })
        },
        createRedirectBucket() {
            let self = this
            this.$refs['redirectBucketForm'].validate((valid) => {
                if (valid) {
                    self.$http.post(REDIRECT_BUCKET, {...self.redirectBucketForm,original: self.selectedBucket.Name}).then(res => {
                        self.redirectBucketForm = { redirect: '',email: '' }
                        this.$Message.success('Create bucket alias success')
                    },error => {
                        this.$Message.error(error)
                    })
                } else {
                    this.$Message.error('Input validate failed')
                }
            })
        },
        goBucketSettings() {
            const bucket = this.selectedBucket
            this.$store.dispatch('selectBucket', bucket)
            this.$router.push({ name: 'bucketSettings', params: { bucket: bucket.Name } })
        },
        rowClick(item) {
            this.selectedBucket = this.selectedBucket === item ? {} : item
        },
        addBucket() {
            // the 'this' in arrow function is not point to vue
            let self = this
            if (this.createBucketValue.length > 2) {
                handler('createBucket', { Bucket: this.createBucketValue }).then(() => {
                    self.$Message.success('Add bucket success')
                    self.getBucketList()
                    self.createBucketValue = ''
                }, error => {
                    self.$Message.error(error.message)
                })
            } else {
                this.$Message.warning('Requires 3 characters')
            }
        },
        check() {
            this.inputCheck = this.createBucketValue.length > 2 ? false : true
        },
        dbClick(item) {
            this.$router.push({ name: 'file', params: { bucket: item.Name, prefix: 'noprefix' } })
        }
    }
}

const batchDeletion = (list, bucket) => {
    return Promise.all(Array.map(list, function (item) {
        return handler('deleteObject', {
            Bucket: bucket,
            Key: item.Key || item.Prefix
        })
    }))
}

const headSetting = [
    {
        title: 'Bucket name',
        key: 'Name'
    }, {
        title: 'Create time',
        align: 'right',
        key: 'CreationDate'
    }, {
        title: 'Actions',
        key: 'actions',
        width: 200,
        align: 'center',
        render(row, column, index) {
            return `<Tooltip content="File list" :delay="1000" placement="top"><i-button style="margin: 0 6px;" size="small"><Icon type="ios-list" :size="iconSize"></Icon></i-button></Tooltip>
                        <Tooltip content="Bucket setting" :delay="1000" placement="top"><i-button style="margin: 0 6px;" size="small" @click.stop="goBucketSettings(${index})"><Icon type="gear-a" :size="iconSize"></Icon></i-button></Tooltip>
                        <Tooltip content="Delete bucket" :delay="1000" placement="top"><i-button style="margin: 0 6px;" size="small" @click.stop="deleteBucketConfirm(${index})"><Icon type="ios-trash" :size="iconSize"></Icon></i-button></Tooltip>`;
        }
    }
]

</script>
<style lang="less" scoped>
.section-iconmode {
    min-height: 100%;
    width: 100%;
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
}

.bucket {
    width: 120px;
    height: 120px;
    font-size: 14px;
    border-radius: 5px;
    margin: 4px;
    padding: 5px;
    background: url('../../assets/Bucket_folder.png') no-repeat center;
    background-size: 66px 66px;
    .icon-check {
        display: none;
        position: relative;
        top: 5px;
        left: 5px;
        font-size: 20px;
    }
    .span-filename {
        display: inline-block;
        position: relative;
        text-align: center;
        color: #657180;
        font-style: normal;
        font-weight: 400;
        top: 85px;
        left: 0;
        width: 110px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
    }
}

.layout-bsc-toolbar {
    padding-bottom: 14px;
    border-bottom: 1px solid #f2f1f6;
    margin-bottom: 0;
    button {
        margin-right: 1px;
    }
}

.bucket:hover {
    background-color: #f5f5f5;
    .icon-check {
        display: block;
    }
    .span-filename {
        top: 65px;
    }
}

.bucket-selected {
    background-color: #f5f5f5;
    .icon-check {
        display: block;
        color: #108EE9;
    }
    .span-filename {
        top: 65px;
    }
}

.info-input-error {
    display: block;
    margin-top: 6px;
    color: red;
}

.ivu-table-row:hover {
    cursor: pointer;
}
</style>

