<template>
  <div class="bsc-overview">
    <Row>
      <Col span="19"
           class="left-section">
        <div class="storage">
          <div class="section-separator">
            <div class="separator-body">
              <span class="separator-icon"></span>
              <span class="separator-info">{{$t('OVERVIEW.DASHBOARD_MONTH')}}</span>
            </div>
          </div>
          <div class="storage-card-wrap">
            <div class="storage-card">
              <div class="title">
                <div class="images"></div>
                <div class="texts">
                  <p class="label">
                    {{$t('OVERVIEW.CAPACITY_MONTH')}}
                  </p>
                  <p class="numbers">
                    {{originOverview.capacity[0]}}
                    <span>{{originOverview.capacity[1]}}</span>
                  </p>
                </div>
              </div>
              <div class="charts">
                <chart :options="capacityOptions"
                      auto-resize
                      ref="capacityLine"></chart>
              </div>
            </div>
            <div class="storage-card">
              <div class="title">
                <div class="images"></div>
                <div class="texts">
                  <p class="label">
                    {{$t('OVERVIEW.OUTER_NET_MONTH')}}
                  </p>
                  <p class="numbers">
                    {{originOverview.traffic[0]}}
                    <span>{{originOverview.traffic[1]}}</span>
                  </p>
                </div>
              </div>
              <div class="charts">
                <chart :options="trafficOptions"
                      auto-resize
                      ref="trafficLine"></chart>
              </div>
            </div>
            <div class="storage-card">
              <div class="title">
                <div class="images"></div>
                <div class="texts">
                  <p class="label">
                    {{$t('OVERVIEW.REQUEST_MONTH')}}
                  </p>
                  <p class="numbers">
                    {{originOverview.request[0]}}
                    <span>{{originOverview.request[1]}}</span>
                  </p>
                </div>
              </div>
              <div class="charts">
                <chart :options="requestOptions"
                      auto-resize
                      ref="requestLine"></chart>
              </div>
            </div>
          </div>
        </div>
        <div class="file-ruler">
          <div class="section-separator">
            <div class="separator-body">
              <span class="separator-icon"></span>
              <span class="separator-info">{{$t('OVERVIEW.FILE_RULES')}}</span>
            </div>
          </div>
          <div class="card-section">
            <div class="file-ruler-card">
              <p class="file-ruler-card-title">{{$t('STORAGE.FILE_PERMISSIONS')}}</p>
              <div class="file-ruler-card-body">
                <p>
                  <span>{{permissionsList.length}}</span>{{$t('OVERVIEW.BUCKET_SETED_NUM')}}</p>
              </div>
              <div class="file-ruler-card-hover">
                <Button v-if="permissionsList.length === 0"
                        type="primary"
                        @click="gotoBucket">{{$t('OVERVIEW.GO_SETTING')}}</Button>
                <Button v-else
                        type="primary"
                        @click="showPermissionModal = true">{{$t('OVERVIEW.MORE')}}</Button>
              </div>
            </div>
            <div class="file-ruler-card">
              <p class="file-ruler-card-title">{{$t('OVERVIEW.CUSTOM_DOMAIN')}}</p>
              <div class="file-ruler-card-body">
                <p>
                  <span>0</span>{{$t('OVERVIEW.BUCKET_SETED_NUM')}}</p>
              </div>
              <div class="file-ruler-card-hover waiting">
                <p class="waiting">{{$t('OVERVIEW.COMING_SOON')}}</p>
              </div>
            </div>
            <div class="file-ruler-card">
              <p class="file-ruler-card-title">{{$t('STORAGE.MIRROR')}}</p>
              <div class="file-ruler-card-body">
                <p>
                  <span>{{sourceList.length}}</span>{{$t('OVERVIEW.BUCKET_SETED_NUM')}}</p>
              </div>
              <div class="file-ruler-card-hover">
                <Button v-if="sourceList.length === 0"
                        type="primary"
                        @click="gotoBucket">{{$t('OVERVIEW.GO_SETTING')}}</Button>
                <Button v-else
                        type="primary"
                        @click="showSourceModal = true">{{$t('OVERVIEW.MORE')}}</Button>
              </div>
            </div>
            <div class="file-ruler-card">
              <p class="file-ruler-card-title">{{$t('SETTINGS.SECURITY_CHAIN')}}</p>
              <div class="file-ruler-card-body">
                <p>
                  <span>{{accessList.length}}</span>{{$t('OVERVIEW.BUCKET_SETED_NUM')}}</p>
              </div>
              <div class="file-ruler-card-hover">
                <Button v-if="accessList.length === 0"
                        type="primary"
                        @click="gotoBucket">{{$t('OVERVIEW.GO_SETTING')}}</Button>
                <Button v-else
                        type="primary"
                        @click="showAccessModal = true">{{$t('OVERVIEW.MORE')}}</Button>
              </div>
            </div>
          </div>
        </div>
        <div class="file-handle">
          <div class="section-separator">
            <div class="separator-body">
              <span class="separator-icon"></span>
              <span class="separator-info">{{$t('OVERVIEW.FILE_HANDLER')}}</span>
            </div>
          </div>
          <div class="card-section">
            <div class="file-ruler-card">
              <p class="file-ruler-card-title">{{$t('OVERVIEW.PIC_SERVICE')}}</p>
              <div class="file-ruler-card-body">
                <p>{{$t('OVERVIEW.PIC_SERVICE_INFO')}}</p>
              </div>
              <div class="file-ruler-card-hover">
                <Button type="primary"
                        @click="showPictureModal = true">{{$t('OVERVIEW.MORE')}}</Button>
              </div>
            </div>
            <div class="file-ruler-card">
              <p class="file-ruler-card-title">{{$t('STORAGE.PIC_IDEN')}}</p>
              <div class="file-ruler-card-body">
                <p>{{$t('OVERVIEW.PIC_ADULT_INFO')}}</p>
              </div>
              <div class="file-ruler-card-hover phone">
                <p class="waiting">{{$t('OVERVIEW.CONTACT_BUSINESS')}}</p>
              </div>
            </div>
            <div class="file-ruler-card">
              <p class="file-ruler-card-title">{{$t('OVERVIEW.VIDEO_SERICE')}}</p>
              <div class="file-ruler-card-body">
                <p>{{$t('OVERVIEW.VIDEO_SERICE_INFO')}}</p>
              </div>
              <div class="file-ruler-card-hover">
                <Button type="primary"
                        @click="gotoVideoTemplate">{{$t('OVERVIEW.MORE')}}</Button>
              </div>
            </div>
          </div>
        </div>
      </Col>
      <Col span="5"
           class="right-section">
        <div class="button-section">
          <a href="http://doc.bscstorage.com/faq-pub.html"
            target="_blank">
            <Button type="primary">FAQ</Button>
          </a>
          <a href="http://doc.bscstorage.com/doc/s2/demo/python.html"
            target="_blank">
            <Button type="primary">SDK</Button>
          </a>
          <a href="http://doc.bscstorage.com/console-use/console-use.html"
            target="_blank">
            <Button type="primary">{{$t('OVERVIEW.DOC')}}</Button>
          </a>
        </div>
        <div class="bucket-section">
          <div class="section-separator">
            <div class="separator-body">
              <span class="separator-icon"></span>
              <span class="separator-info">{{$t('SIDEBAR.BUCKET')}}</span>
            </div>
          </div>
          <div class="bucket"
              @click="gotoBucket">
            <p>{{bucketNum}}</p>
            <p>Bucket</p>
          </div>
          <div class="buttons">
            <Button size="small"
                    type="primary"
                    @click="createBucketModal = true">{{$t('STORAGE.ADD_BUCKET')}}</Button>
            <Button size="small"
                    type="ghost"
                    @click="gotoKeychain">{{$t('OVERVIEW.MY_KEYCHAIN')}}</Button>
          </div>
        </div>
        <div class="update-history">
          <div class="section-separator">
            <div class="separator-body">
              <span class="separator-icon"></span>
              <span class="separator-info">{{$t('OVERVIEW.PRODUCT_UPDATE')}}</span>
            </div>
          </div>
          <Timeline>
            <TimelineItem>
              <span slot="before">2017.12.20</span>
              <div slot="dot"
                  class="timeline-dot"></div>
              <span>全新概览页上线</span>
            </TimelineItem>
            <TimelineItem>
              <span slot="before">2017.11.20</span>
              <span>新版"统计分析"上线</span>
            </TimelineItem>
            <TimelineItem color="green">
              <span slot="before">2017.10.12</span>
              <span>{{$t('OVERVIEW.PRODUCT_UPDATE_1012')}}</span>
            </TimelineItem>
            <TimelineItem>
              <span slot="before">2017.09.11</span>
              <span>图片处理支持同步预处理</span>
            </TimelineItem>
            <TimelineItem>
              <span slot="before">2017.07.22</span>
              <span>{{$t('OVERVIEW.PRODUCT_UPDATE_0722')}}</span>
            </TimelineItem>
            <TimelineItem>
              <span slot="before">2017.05.08</span>
              <span>{{$t('OVERVIEW.PRODUCT_UPDATE_0508')}}</span>
            </TimelineItem>
            <TimelineItem>
              <span slot="before">2017.04.10</span>
              <span>主动转码上线</span>
            </TimelineItem>
            <TimelineItem>
              <span slot="before">2017.03.05</span>
              <span>{{$t('OVERVIEW.PRODUCT_UPDATE_0305')}}</span>
            </TimelineItem>
            <TimelineItem>
              <span slot="before">2017.01.11</span>
              <span>{{$t('OVERVIEW.PRODUCT_UPDATE_0111')}}</span>
            </TimelineItem>
            <TimelineItem style="padding-bottom:0;">
              <span slot="before">2016.12.10</span>
              <span>图片处理支持图片瘦身</span>
            </TimelineItem>
          </Timeline>
        </div>
      </Col>
    </Row>
    <Modal v-model="showPermissionModal"
           :title="$t('STORAGE.FILE_PERMISSIONS')"
           width="700"
           class="permission-modal">
      <Table :stripe="true"
             :columns="permissionHeader"
             :data="permissionsList"></Table>
    </Modal>
    <Modal v-model="showSourceModal"
           :title="$t('STORAGE.MIRROR')"
           width="700"
           class="permission-modal">
      <Table :stripe="true"
             :columns="sourceHeader"
             :data="sourceList"></Table>
    </Modal>
    <Modal v-model="showAccessModal"
           :title="$t('SETTINGS.SECURITY_CHAIN')"
           width="700"
           class="permission-modal">
      <Table :stripe="true"
             :columns="accessHeader"
             :data="accessList"></Table>
    </Modal>
    <Modal v-model="showPictureModal"
           :title="$t('STORAGE.PIC_STYLE')"
           width="500"
           class="permission-modal">
      <Table :stripe="true"
             :columns="pictureHeader"
             :data="bucketList"></Table>
    </Modal>
    <Modal v-model="createBucketModal"
           :title="$t('STORAGE.ADD_BUCKET')"
           @on-ok="addBucket"
           @on-cancel="inputCheck=false;createBucketValue = ''">
      <Input v-model="createBucketValue"
             autofocus
             @on-enter="addBucket"
             :placeholder="$t('STORAGE.ADD_BUCKET_PLACEHOLDER')"
             pattern="/^([a-z0-9][a-z0-9\-]*[.])*([a-z0-9][a-z0-9\-]*)*$/" />
      <span class="info-input-error">{{inputCheck ? $t("STORAGE.ADD_BUCKET_CHECK") : ''}}</span>
    </Modal>
  </div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import { getBillUrl, FETCH_404, ACCESS_LIST } from '@/service/API'
import { handler } from '@/service/Aws'
import user from '@/store/modules/user'
import {
  bytes,
  times,
  timesK,
  date,
  dateTime,
  dateTimeYear,
  bytesSpliteUnits,
  timesSpliteUnits
} from '@/service/bucketService'
export default {
  components: {
    chart: ECharts
  },
  data() {
    return {
      thisMonth: [new Date(new Date().setDate(1)), lastNDays(0)],
      originOverview: {
        capacity: [],
        traffic: [],
        request: []
      },
      capacityOptions: lineOptions,
      trafficOptions: lineOptions,
      requestOptions: lineOptions,
      permissionsList: [],
      bucketList: [],
      sourceList: [],
      accessList: [],
      showPermissionModal: false,
      showSourceModal: false,
      showAccessModal: false,
      showPictureModal: false,
      createBucketModal: false,
      createBucketValue: '',
      permissionHeader: [
        {
          title: 'Name',
          width: 120,
          key: 'name'
        },
        {
          title: this.$t('STORAGE.OBJECT_PERMISSIONS'),
          render: (h, params) => {
            let allUser = params.row.permissions.allUser
            let authUser = params.row.permissions.AuthUser
            return h('div', [
              `allUser:${
                allUser.length > 0 ? allUser.join(',') : '--'
              };AuthUser:${authUser.length > 0 ? authUser.join(',') : '--'}`
            ])
          }
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 80,
          align: 'right',
          render: (h, params) => {
            return h(
              'Tooltip',
              {
                props: {
                  content: this.$t('OVERVIEW.GO_SETTING'),
                  delay: 1000,
                  placement: 'top'
                },
                class: {
                  'mar-r-5': true
                }
              },
              [
                h(
                  'i-button',
                  {
                    props: {
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.gotoBucketPermissionsSetting(params.row)
                      }
                    }
                  },
                  [
                    h('Icon', {
                      props: {
                        type: 'ios-cog',
                        size: 18
                      }
                    })
                  ]
                )
              ]
            )
          }
        }
      ],
      sourceHeader: [
        {
          title: 'Name',
          width: 120,
          key: 'name'
        },
        {
          title: this.$t('STORAGE.SOURCE_DOMAIN'),
          render: (h, params) => {
            return h('div', [`${params.row.source.domain}`])
          }
        },
        {
          title: this.$t('STORAGE.SOURCE_MODE'),
          width: 200,
          render: (h, params) => {
            return h('div', [`${params.row.source.fetch_mode.split('_')[1]}`])
          }
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 80,
          align: 'right',
          render: (h, params) => {
            return h(
              'Tooltip',
              {
                props: {
                  content: this.$t('OVERVIEW.GO_SETTING'),
                  delay: 1000,
                  placement: 'top'
                },
                class: {
                  'mar-r-5': true
                }
              },
              [
                h(
                  'i-button',
                  {
                    props: {
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.gotoBucketSourceSetting(params.row)
                      }
                    }
                  },
                  [
                    h('Icon', {
                      props: {
                        type: 'ios-cog',
                        size: 18
                      }
                    })
                  ]
                )
              ]
            )
          }
        }
      ],
      accessHeader: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: this.$t('SETTINGS.IP_BLACK_LIST'),
          width: '33%',
          render: (h, params) => {
            return h(
              'div',
              params.row.blackList.map((item) =>
                h('div', [`${item.ip}:${item.access}`])
              )
            )
          }
        },
        {
          title: this.$t('SETTINGS.IP_WHITE_LIST'),
          width: '33%',
          render: (h, params) => {
            return h(
              'div',
              params.row.whiteList.map((item) =>
                h('div', [`${item.ip}:${item.access}`])
              )
            )
          }
        },
        {
          title: 'Actions',
          key: 'actions',
          width: '85px',
          align: 'right',
          render: (h, params) => {
            return h(
              'Tooltip',
              {
                props: {
                  content: this.$t('OVERVIEW.GO_SETTING'),
                  delay: 1000,
                  placement: 'top'
                },
                class: {
                  'mar-r-5': true
                }
              },
              [
                h(
                  'i-button',
                  {
                    props: {
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.gotoBucketAccessSetting(params.row)
                      }
                    }
                  },
                  [
                    h('Icon', {
                      props: {
                        type: 'ios-cog',
                        size: 18
                      }
                    })
                  ]
                )
              ]
            )
          }
        }
      ],
      pictureHeader: [
        {
          title: 'Name',
          width: 90,
          key: 'Name'
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 80,
          align: 'right',
          render: (h, params) => {
            return h(
              'Tooltip',
              {
                props: {
                  content: this.$t('OVERVIEW.GO_SETTING'),
                  delay: 1000,
                  placement: 'top'
                },
                class: {
                  'mar-r-5': true
                }
              },
              [
                h(
                  'i-button',
                  {
                    props: {
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.gotoBucketPictureStyle(params.row)
                      }
                    }
                  },
                  [
                    h('Icon', {
                      props: {
                        type: 'ios-cog',
                        size: 18
                      }
                    })
                  ]
                )
              ]
            )
          }
        }
      ]
    }
  },
  computed: {
    dateRange() {
      return formatDate(this.thisMonth[0]) + '-' + formatDate(this.thisMonth[1])
    },
    inputCheck() {
      return !(this.createBucketValue.length >= 3)
    },
    bucketNum() {
      return this.bucketList.length
    },
    theme() {
      return this.$store.state.theme
    }
  },
  watch: {
    theme(to, from) {
      this.$refs['capacityLine'].chart.resize()
      this.$refs['trafficLine'].chart.resize()
      this.$refs['requestLine'].chart.resize()
      this.setOptions()
    }
  },
  created() {
    this.convertBucketList()
    this.getOverviewsData()
  },
  methods: {
    async convertBucketList() {
      try {
        let res = await this.$store.dispatch('getBuckets')
        res.Buckets.forEach((item) => {
          this.getBucketAcl(item.Name).then((acl) => {
            acl.Grants.length > 0 &&
              this.permissionsList.push({
                name: item.Name,
                permissions: this.convertGrants(acl.Grants)
              })
          })
          this.getBucketSource(item.Name).then((source) => {
            source.length > 0 &&
              source.map((sourceItem) => {
                !!sourceItem.is_active &&
                  this.sourceList.push({
                    name: item.Name,
                    source: sourceItem
                  })
              })
          })
          this.getAccessList(item.Name).then((access) => {
            this.convertAccess(item.Name, access)
          })
        })
        this.bucketList = [...res.Buckets]
      } catch (error) {
        console.log(error)
        this.$Message.error(this.$t('DASHBOARD.GET_BUCKET_FAILED'))
      }
    },
    async getOverviewsData() {
      try {
        await this.$http.get(this.getApiURL()).then((res) => {
          this.originOverview = {
            capacity: this.convertData(
              {
                value: res.total.space_used,
                unit: 'byte'
              },
              true
            ),
            traffic: this.convertData(
              {
                value:
                  res.sum.flow_up_cdn +
                  res.sum.flow_up_pub +
                  res.sum.flow_down_cdn +
                  res.sum.flow_down_pub,
                unit: 'byte'
              },
              true
            ),
            request: this.convertData(
              {
                value:
                  res.sum.get_count +
                  res.sum.head_count +
                  res.sum.post_count +
                  res.sum.put_count +
                  res.sum.delete_count +
                  res.sum.list_count,
                unit: 'times'
              },
              true
            )
          }
          _.extend(this, res)
          this.setOptions()
        })
      } catch (error) {
        console.log(error)
        if (
          error.msg &&
          error.msg.message &&
          error.msg.message === 'Not found any data in custom_range'
        ) {
          this.$Modal.warning({
            title: this.$t('OVERVIEW.PROMPT'),
            content: this.$t('OVERVIEW.PROMPT_CONTENT')
          })
          return
        }
      }
    },
    setOptions() {
      let oneDayFlag =
        formatDate(this.thisMonth[0]) === formatDate(this.thisMonth[1])
      this.capacityOptions = initOptions({
        dataPart1: this.combineTimeDataUnitLabel(
          this.distributed.space_used,
          '容量'
        ),
        theme: this.theme,
        oneDayFlag
      })
      this.trafficOptions = initOptions({
        dataPart1: this.combineTimeDataUnitLabel(
          this.combineTwoArray(
            this.distributed.flow_up_cdn,
            this.distributed.flow_up_pub
          ),
          '流入'
        ),
        dataPart2: this.combineTimeDataUnitLabel(
          this.combineTwoArray(
            this.distributed.flow_down_cdn,
            this.distributed.flow_down_pub
          ),
          '流出'
        ),
        theme: this.theme,
        oneDayFlag
      })
      this.requestOptions = initOptions({
        dataPart1: this.combineTimeDataUnitLabel(
          this.combineTwoArray(
            this.distributed.post_count,
            this.distributed.put_count
          ),
          '写',
          'times'
        ),
        dataPart2: this.combineTimeDataUnitLabel(
          this.combineFourArray(
            this.distributed.get_count,
            this.distributed.head_count,
            this.distributed.delete_count,
            this.distributed.list_count
          ),
          '读',
          'times'
        ),
        theme: this.theme,
        oneDayFlag
      })
    },
    combineTwoArray(array1, array2) {
      let combinedData = []
      _.forEach(array1, (value, key) => {
        combinedData.push(value + array2[key])
      })
      return combinedData
    },
    combineFourArray(array1, array2, array3, array4) {
      let combinedData = []
      _.forEach(array1, (value, key) => {
        combinedData.push(value + array2[key] + array3[key] + array4[key])
      })
      return combinedData
    },
    combineTimeDataUnitLabel(
      data,
      label,
      unit = 'byte',
      time = this.time_nodes
    ) {
      let combinedData = []
      _.forEach(time, (value, key) => {
        combinedData.push([value * 1000, data[key]])
      })
      let object = {
        label: label,
        unit: unit,
        data: combinedData
      }
      return object
    },
    gotoBucketPermissionsSetting(data) {
      this.$router.push({
        name: 'bucketSettings',
        params: { bucket: data.name, tabName: 'permission' }
      })
    },
    gotoBucketSourceSetting(data) {
      this.$router.push({
        name: 'bucketSettings',
        params: { bucket: data.name, tabName: 'backSource' }
      })
    },
    gotoBucketAccessSetting(data) {
      this.$router.push({
        name: 'bucketSettings',
        params: { bucket: data.name, tabName: 'whiteList' }
      })
    },
    gotoBucketPictureStyle(data) {
      this.$router.push({
        name: 'pictureStyles',
        params: { bucket: data.Name }
      })
    },
    gotoVideoTemplate(data) {
      this.$router.push({ name: 'template' })
    },
    gotoBucket() {
      this.$router.push({ name: 'bucket' })
    },
    gotoKeychain() {
      this.$router.push({ name: 'keychain' })
    },
    convertGrants(grants) {
      let permissions = {
        allUser: [],
        AuthUser: []
      }
      _.each(grants, (grant) => {
        if (
          grant.Grantee.URI &&
          grant.Grantee.URI ===
            'http://acs.amazonaws.com/groups/global/AllUsers'
        ) {
          if (grant.Permission === 'READ') {
            permissions.allUser.push(this.$t('STORAGE.READ'))
          } else if (grant.Permission === 'WRITE') {
            permissions.allUser.push(this.$t('STORAGE.WRITE'))
          } else if (grant.Permission === 'FULL_CONTROL') {
            permissions.allUser.push(
              this.$t('STORAGE.READ'),
              this.$t('STORAGE.WRITE')
            )
          }
        } else if (
          grant.Grantee.URI &&
          grant.Grantee.URI ===
            'http://acs.amazonaws.com/groups/global/AuthenticatedUsers'
        ) {
          if (grant.Permission === 'READ') {
            permissions.AuthUser.push(this.$t('STORAGE.READ'))
          } else if (grant.Permission === 'WRITE') {
            permissions.AuthUser.push(this.$t('STORAGE.WRITE'))
          } else if (grant.Permission === 'FULL_CONTROL') {
            permissions.AuthUser.push(
              this.$t('STORAGE.READ'),
              this.$t('STORAGE.WRITE')
            )
          }
        }
      })
      return permissions
    },
    convertData(item, splite = false) {
      if (!item) return [0]
      return splite
        ? item.unit === 'byte'
          ? bytesSpliteUnits(item.value, 3)
          : timesSpliteUnits(item.value, 3)
        : item.unit === 'byte' ? bytes(item.value) : times(item.value)
    },
    getApiURL() {
      let path = '?custom_range=' + this.dateRange
      if (user.state.type === 'admin') {
        path += '&customer=' + user.state.subUser.username
      }
      return getBillUrl(path)
    },
    async getBucketAcl(name) {
      try {
        return await handler('getBucketAcl', {
          Bucket: name
        })
      } catch (error) {
        console.log(error)
      }
    },
    async getBucketSource(name) {
      let rule = {
        action: 'list',
        bucket: name
      }
      try {
        return await this.$http.post(FETCH_404, rule)
      } catch (error) {
        console.log(error)
      }
    },
    async getAccessList(name) {
      const params = {
        action: 'get',
        bucket: name
      }
      try {
        return await this.$http.post(ACCESS_LIST, params)
      } catch (error) {
        console.log(error)
      }
    },
    convertAccess(bucket, access) {
      let blackIPs = [
        ...access.delete_file.black_list,
        ...access.download_file.black_list,
        ...access.upload_file.black_list
      ]
      let whiteIPs = [
        ...access.delete_file.white_list,
        ...access.download_file.white_list,
        ...access.upload_file.white_list
      ]
      let blackList = []
      let whiteList = []
      blackIPs[0] &&
        blackList.push({
          ip: blackIPs[0],
          access: this.accessValue(blackIPs[0], access)
        })
      blackIPs[1] &&
        blackList.push({
          ip: blackIPs[1],
          access: this.accessValue(blackIPs[1], access)
        })
      whiteIPs[0] &&
        whiteList.push({
          ip: whiteIPs[0],
          access: this.accessValue(whiteIPs[0], access, 'white_list')
        })
      whiteIPs[1] &&
        whiteList.push({
          ip: whiteIPs[1],
          access: this.accessValue(whiteIPs[1], access, 'white_list')
        })
      if (blackList.length > 0 || whiteList.length > 0) {
        this.accessList.push({
          name: bucket,
          blackList,
          whiteList
        })
      }
    },
    accessValue(ip, access, listName = 'black_list') {
      let value = []
      access.upload_file[listName].includes(ip) &&
        value.push(this.$t('SETTINGS.UPLOAD'))
      access.download_file[listName].includes(ip) &&
        value.push(this.$t('SETTINGS.DOWNLOAD'))
      access.delete_file[listName].includes(ip) &&
        value.push(this.$t('SETTINGS.DELETE'))
      return value.join(',')
    },
    async addBucket() {
      this.createBucketModal = false
      if (this.createBucketValue.length > 2) {
        await handler('createBucket', { Bucket: this.createBucketValue })
        this.bucketList.push({ Name: this.createBucketValue })
        this.$Message.success(this.$t('STORAGE.ADD_BUCKET_SUCCESS'))
        this.createBucketValue = ''
      } else {
        this.$Message.warning(this.$t('STORAGE.ADD_BUCKET_CHECK'))
      }
    }
  }
}
const fixDate = (n) => (n < 10 ? '0' + n : String(n))
const lastNDays = (n) => new Date(new Date().getTime() - 3600 * 1000 * 24 * n)
const formatDate = (date) =>
  date &&
  date.getFullYear() + fixDate(date.getMonth() + 1) + fixDate(date.getDate())
const lineOptions = {
  tooltip: {
    trigger: 'axis',
    textStyle: {
      color: '#fff',
      fontSize: 12
    },
    axisPointer: {
      lineStyle: {
        color: '#1e9fff'
      },
      z: 0
    },
    backgroundColor: 'rgba(71, 86, 105, 0.8)',
    padding: 10
  },
  grid: {
    top: '25',
    left: '15',
    right: '20',
    bottom: '20',
    containLabel: true,
    show: true,
    borderColor: 'none'
  },
  color: ['#20a0ff', '#8ecfff'],
  legend: {
    textStyle: {
      color: '#475669'
    },
    icon: 'reac',
    right: 34
  },
  xAxis: {
    type: 'time',
    offset: 5,
    axisLine: {
      show: false
    },
    interval: 30 * 86400000,
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#475669',
        fontSize: 12
      }
    },
    splitLine: {
      lineStyle: {
        color: '#fff'
      }
    }
  },
  yAxis: {
    type: 'value',
    min: 0,
    minInterval: 1,
    offset: 5,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#475669',
        fontSize: 12
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.06)'
      }
    }
  }
}
const initOptions = ({ dataPart1, dataPart2, theme, oneDayFlag }) => {
  let themeLineOptions = _.defaultsDeep({}, lineOptions)
  if (theme === 'dark') {
    themeLineOptions.legend.textStyle.color = '#8492a6'
    themeLineOptions.xAxis.splitLine.lineStyle.color = '#313a41'
    themeLineOptions.yAxis.splitLine.lineStyle.color =
      'rgba(255, 255, 255, 0.1)'
    themeLineOptions.xAxis.axisLabel.textStyle.color = '#8492a6'
    themeLineOptions.yAxis.axisLabel.textStyle.color = '#8492a6'
  }
  themeLineOptions.grid.backgroundColor =
    theme === 'dark' ? '#293137' : '#f9fafc'
  themeLineOptions.grid.borderColor = theme === 'dark' ? '#313a41' : '#fff'
  themeLineOptions.grid.right = oneDayFlag ? '40' : '20'
  let legendData = []
  let seriesArray = [
    {
      type: 'line',
      symbol: 'none',
      data: dataPart1.data,
      name: dataPart1.label,
      smooth: true,
      sampling: 'average',
      areaStyle: {
        normal: {
          color: '#20a0ff',
          opacity: 0.8
        }
      }
    }
  ]
  if (dataPart2) {
    legendData = [dataPart1.label, dataPart2.label]
    let seriesItem = {
      type: 'line',
      symbol: 'none',
      data: dataPart2.data,
      name: dataPart2.label,
      smooth: true,
      sampling: 'average',
      areaStyle: {
        normal: {
          color: '#8ecfff',
          opacity: 0.8
        }
      }
    }
    seriesArray.push(seriesItem)
  }
  let newOptions = _.defaultsDeep({}, themeLineOptions, {
    legend: {
      data: legendData
    },
    series: seriesArray,
    tooltip: {
      formatter: function(params, ticket, callback) {
        let res =
          '时间：' +
          (oneDayFlag
            ? dateTimeYear(params[0].value[0] + 3600000)
            : date(params[0].value[0]))
        _.each(params, function(item) {
          res +=
            '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
            item.color +
            '"></span>' +
            item.seriesName +
            '：'
          res +=
            dataPart1.unit === 'byte'
              ? bytes(item.value[1], 3)
              : times(item.value[1])
        })
        return res
      }
    },
    xAxis: {
      axisLabel: {
        formatter: function(value) {
          return oneDayFlag ? dateTime(value + 3600000) : date(value, 'MD')
        }
      }
    },
    yAxis: {
      axisLabel: {
        formatter: function(value) {
          return dataPart1.unit === 'byte' ? bytes(value) : timesK(value)
        }
      }
    }
  })
  return newOptions
}
</script>
<style scoped lang="less">
.@{css-prefix}overview {
  min-width: 1200px;
  .left-section {
    padding-right: 20px;

    & > div {
      border: @common-border;
      padding: 16px;
      margin-bottom: 20px;
    }

    .storage {
      .storage-card-wrap {
        .fb(space-between, center);
        width: 100%;
      }
      .storage-card {
        display: inline-block;
        border: @common-border;
        width: calc(~'33% - 11px');
        height: 300px;

        .title {
          height: 100px;
          width: calc(~'100% - 20px');
          border-bottom: @common-border;
          margin: 0 10px;
          .fb(center, center);

          .images {
            height: 100px;
            background-size: 60px;
            flex: 7;
          }

          .texts {
            display: inline-block;
            height: 100px;
            flex: 13;

            .label {
              position: relative;
              left: 10px;
              top: 20px;
              font-size: 14px;
              color: #475669;
            }

            .numbers {
              position: relative;
              left: 10px;
              top: 20px;
              font-size: 34px;
              color: #475669;

              span {
                font-size: 14px;
              }
            }
          }
        }

        .echarts {
          display: inline-block;
          width: 100%;
          height: 200px;
        }
      }

      .storage-card-wrap .storage-card:nth-child(1) .images {
        background: url('../../assets/overview/capacity.png') center center
          no-repeat;
      }

      .storage-card-wrap .storage-card:nth-child(2) .images {
        background: url('../../assets/overview/traffic.png') center center
          no-repeat;
      }

      .storage-card-wrap .storage-card:nth-child(3) .images {
        background: url('../../assets/overview/request.png') center center
          no-repeat;
      }
    }

    .file-ruler-card {
      height: 150px;
      text-align: center;
      border: @common-border;
      flex: 1;
      margin-right: 20px;
      position: relative;
      box-sizing: content-box;

      &-title {
        height: 40px;
        background-color: #eff2f7;
        color: #475669;
        font-size: 14px;
        line-height: 40px;
      }

      &-body {
        height: 110px;
        width: 100%;
        background-size: 70px auto;
        background-position: 10px center;
        background-repeat: no-repeat;
        .fb(flex-start, center);
        text-align: left;

        p {
          flex: 13;
          padding-left: 90px;
          span {
            color: #20a0ff;
          }
        }
      }

      &-hover {
        position: absolute;
        top: 40px;
        left: 0;
        width: 100%;
        height: 110px;
        background-color: #fff;
        opacity: 0;
        .fb(center, center, inline-flex, column);

        &.waiting {
          background: url('../../assets/overview/waiting.png') center 20px
            no-repeat #fff;
        }
        &.phone {
          background: url('../../assets/overview/phone-white.png') center 20px
            no-repeat #fff;
        }
        p {
          color: #475669;
          position: absolute;
          top: 66px;
        }
      }
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        background-color: #fff;
        border-color: #54b6ff;

        .file-ruler-card-title {
          background-color: #54b6ff;
          color: #fff;
        }

        .file-ruler-card-hover {
          opacity: 1;
        }
      }
    }
    .file-ruler {
      .card-section {
        width: 100%;
        .fb(space-between, center);
      }

      .file-ruler-card {
        &:nth-child(1) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/permisson.png');
          }
        }
        &:nth-child(2) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/www.png');
          }
        }
        &:nth-child(3) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/404.png');
          }
        }
        &:nth-child(4) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/IP.png');
          }
        }
      }
    }

    .file-handle {
      .card-section {
        width: 100%;
        .fb(space-between, center);
      }

      .file-ruler-card {
        &-body p {
          padding-right: 10px;
        }
        &-body {
          text-align: center;
        }
        &:nth-child(1) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/pic.png');
          }
        }
        &:nth-child(2) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/sex.png');
          }
        }
        &:nth-child(3) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/video.png');
          }
        }
      }
    }
  }

  .right-section {
    .button-section {
      button {
        margin-right: 4px;
        border-radius: 3px;
      }
    }
    .bucket-section,
    .update-history {
      border: @common-border;
      margin-top: 12px;
      padding: 16px 20px 0;

      .section-separator {
        margin-bottom: 20px;
        padding-bottom: 14px;
        border-bottom: @common-border;
      }
    }

    .bucket-section {
      height: 250px;
      text-align: center;

      .bucket {
        height: 120px;
        width: 120px;
        text-align: center;
        margin: 5px auto 0 auto;
        background-image: url('../../assets/bucket.png');
        background-repeat: no-repeat;
        background-position: center 25px;
        background-size: 50px;
        cursor: pointer;

        p:first-child {
          position: relative;
          top: 42px;
          font-size: 18px;
          font-weight: bold;
          color: #fff;
        }

        p:last-child {
          position: relative;
          top: 52px;
          font-size: 14px;
          color: #475669;
        }
      }

      .bucket:hover {
        background-color: #f9fafc;
      }

      .buttons {
        margin-top: 20px;

        button:last-child {
          margin-left: 8px;
        }
      }
    }

    .update-history {
      .section-separator {
        margin-bottom: 30px;
      }
    }
  }

  .timeline-dot {
    width: 20px;
    height: 20px;
    margin: 0 auto;
    background-image: url('../../assets/overview/update-now-white.png');
    background-size: cover;
  }
}
.dark .@{css-prefix}overview {
  .left-section {
    padding-right: 20px;

    & > div {
      border-color: transparent;
    }

    .storage {
      padding: 0;
      margin-bottom: 15px;
      .section-separator {
        margin: 4px 0 20px;
      }
      .storage-card {
        border: none;
        background-color: @card-bg-dark;

        .title {
          border-color: @card-border-color-dark;
          .texts {
            .label {
              color: #8492a6;
            }

            .numbers {
              color: #ffba42;
            }
          }
        }
      }

      .storage-card-wrap .storage-card:nth-child(1) .images {
        background-image: url('../../assets/overview/capacity-dark.png');
      }

      .storage-card-wrap .storage-card:nth-child(2) .images {
        background-image: url('../../assets/overview/traffic-dark.png');
      }

      .storage-card-wrap .storage-card:nth-child(3) .images {
        background-image: url('../../assets/overview/request-dark.png');
      }
    }

    .file-handle,
    .file-ruler {
      background-color: #313a41;
    }
    .file-ruler-card {
      border-color: @card-border-color-dark;
      background-color: @card-bg-dark;
      color: #8491a6;

      &-title {
        background-color: #293137;
        color: #8491a6;
      }

      &-hover {
        background-color: #293137;

        &.waiting {
          background-image: url('../../assets/overview/waiting-dark.png');
        }
        &.phone {
          background-image: url('../../assets/overview/phone-dark.png');
        }
        p {
          color: #8492a6;
        }
      }
      &:hover {
        background-color: #fff;
        border-color: #54b6ff;

        .file-ruler-card-title {
          background-color: #20a0ff;
        }
      }
    }
    .file-ruler {
      .file-ruler-card {
        &:nth-child(1) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/permisson-dark.png');
          }
        }
        &:nth-child(2) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/www-dark.png');
          }
        }
        &:nth-child(3) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/404-dark.png');
          }
        }
        &:nth-child(4) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/IP-dark.png');
          }
        }
      }
    }

    .file-handle {
      .file-ruler-card {
        &-body {
          text-align: center;
        }
        &:nth-child(1) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/pic-dark.png');
          }
        }
        &:nth-child(2) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/sex-dark.png');
          }
        }
        &:nth-child(3) {
          .file-ruler-card-body {
            background-image: url('../../assets/overview/video-dark.png');
          }
        }
      }
    }
  }

  .right-section {
    .button-section {
      button {
        margin-top: 42px;
      }
    }
    .bucket-section,
    .update-history {
      border: none;
      background-color: @card-bg-dark;

      .section-separator {
        border-color: @card-border-color-dark;
      }
    }

    .bucket-section {
      .bucket {
        p:first-child {
          color: #fff;
          text-shadow: 0 0 1px 0px rgba(0, 0, 0, 0.24);
        }

        p:last-child {
          color: @text-color-dark;
        }
      }

      .bucket:hover {
        background-color: transparent;
        border: @common-border-dark;
      }
    }
  }

  .timeline-dot {
    background-image: url('../../assets/overview/update-now-dark.png');
  }
}
</style>
