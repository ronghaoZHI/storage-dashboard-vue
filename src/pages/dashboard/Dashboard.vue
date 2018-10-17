<template>
  <div class="bsc-dashboard">
    <Spin size="bigger"
          fix
          v-if="spinShow || spinBandwidthShow"></Spin>
    <div class="toolbar">
      <div class="button-datepicker">
        <Tooltip class="redirect-info"
                 v-if="isRedirect"
                 :content="$t('DASHBOARD.IS_REDIRECT', {bucket: selectedBucket})"
                 placement="bottom-start">
          <span>*</span>
        </Tooltip>
        <Select :prepend="true"
                v-model="selectedBucket"
                style="width:30%;float:left;margin-right:16px;"
                @on-change="getInitData">
          <Icon slot="prepend"
                type="ios-folder"></Icon>
          <Option v-for="item in bucketList"
                  :value="item.Name"
                  :key="item.Name">{{ item.Name }}</Option>
        </Select>
        <Date-picker v-model="dateSelect"
                     format="yyyy/MM/dd"
                     type="daterange"
                     placement="bottom-end"
                     placeholder="Select time"
                     :options="dateOptions"
                     style="width: 40%;float:left;"></Date-picker>
        <Button type="primary"
                style="width:80px;float:left;margin-left:16px;"
                @click="exportCsv">{{ $t("DASHBOARD.EXPORT_DATA")}}</Button>
      </div>
      <div class="button-daterange">
        <Button-group>
          <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.today[0].getTime()}"
                  @click="dateSelect = dateDefault.today">{{ $t("DASHBOARD.TODAY")}}</Button>
          <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.seven_days[0].getTime()}"
                  @click="dateSelect = dateDefault.seven_days">{{ $t("DASHBOARD.SEVEN_DAYS")}}</Button>
          <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.this_month[0].getTime()}"
                  @click="dateSelect = dateDefault.this_month">{{ $t("DASHBOARD.THIS_MONTH")}}</Button>
          <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.thirty_days[0].getTime()}"
                  @click="dateSelect = dateDefault.thirty_days">{{ $t("DASHBOARD.THIRTY_DAYS")}}</Button>
        </Button-group>
      </div>
    </div>
    <div class="overview">
      <div>
        <img v-bind:src="imgSrc[0]"
             alt="capacity">
        <Tooltip :content="$t('DASHBOARD.CAPACITY_ALL_INFO')"
                 placement="top-end">
          <p>{{ $t("DASHBOARD.CAPACITY_ALL")}}
            <Icon type="ios-help-outline"></Icon>
          </p>
        </Tooltip>
        <div class="content">
          <span>{{originOverview.capacity && originOverview.capacity[0]}}</span>
          <span>{{originOverview.capacity && originOverview.capacity[1]}}</span>
        </div>
      </div>
      <div>
        <img v-bind:src="imgSrc[1]"
             alt="bandwidth">
        <Tooltip :content="$t('DASHBOARD.BANDWIDTH_ALL_INFO', {someBandwidth: cnEnBandwidthOverview(selectedBandwidthLabel)})"
                 placement="top-end">
          <span class="selectBandwidthLabel">{{cnEnBandwidthOverview(selectedBandwidthLabel)}}</span>
        </Tooltip>
        <Dropdown trigger="click"
                  placement="bottom-end"
                  class="selectBandwidth"
                  @on-click="changeBandwidthOverview">
          <p>
            <Icon class="arrowDown"
                  type="arrow-down-b"></Icon>
          </p>
          <DropdownMenu class="dropdownMenu"
                        slot="list">
            <DropdownItem v-for="item in Object.keys(outflowsBandwidthOverview)"
                          :name="`out_band_${item}`"
                          :key="`out_band_${item}`">{{item === 'pub' ? $t("DASHBOARD.PUB_OUTFLOW_BANDWIDTH") : `${item} ${$t("DASHBOARD.CDN_OUTFLOW_BANDWIDTH")}`}}</DropdownItem>
            <DropdownItem v-for="item in Object.keys(inflowsBandwidthOverview)"
                          :name="`in_band_${item}`"
                          :key="`in_band_${item}`">{{item === 'pub' ? $t("DASHBOARD.PUB_INFLOW_BANDWIDTH") : `${item} ${$t("DASHBOARD.CDN_INFLOW_BANDWIDTH")}`}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div class="content">
          <span>{{selectedBandwidthValue && selectedBandwidthValue[0]}}</span>
          <span>{{selectedBandwidthValue && selectedBandwidthValue[1]}}</span>
        </div>
      </div>
      <div>
        <img v-bind:src="imgSrc[2]"
             alt="inflows">
        <Tooltip :content="$t('DASHBOARD.INFLOWS_ALL_INFO')"
                 placement="top-end">
          <p>{{ $t("DASHBOARD.INFLOWS_ALL")}}
            <Icon type="ios-help-outline"></Icon>
          </p>
        </Tooltip>
        <div class="content">
          <span>{{originOverview.inflows && originOverview.inflows[0]}}</span>
          <span>{{originOverview.inflows && originOverview.inflows[1]}}</span>
        </div>
      </div>
      <div>
        <img v-bind:src="imgSrc[3]"
             alt="outflows">
        <Tooltip :content="$t('DASHBOARD.OUTFLOWS_ALL_INFO')"
                 placement="top-end">
          <p>{{ $t("DASHBOARD.OUTFLOWS_ALL")}}
            <Icon type="ios-help-outline"></Icon>
          </p>
        </Tooltip>
        <div class="content">
          <span>{{originOverview.outflows && originOverview.outflows[0]}}</span>
          <span>{{originOverview.outflows && originOverview.outflows[1]}}</span>
        </div>
      </div>
      <div>
        <img v-bind:src="imgSrc[4]"
             alt="requests">
        <Tooltip :content="$t('DASHBOARD.REQUESTS_ALL_INFO')"
                 placement="top-end">
          <p>{{ $t("DASHBOARD.REQUESTS_ALL")}}
            <Icon type="ios-help-outline"></Icon>
          </p>
        </Tooltip>
        <div class="content">
          <span>{{originOverview.requests && originOverview.requests[0]}}</span>
          <span>{{originOverview.requests && originOverview.requests[1]}}</span>
        </div>
      </div>
      <div>
        <img v-bind:src="imgSrc[5]"
             alt="files">
        <Tooltip :content="$t('DASHBOARD.FILES_ALL_INFO')"
                 placement="top-end">
          <p>{{ $t("DASHBOARD.FILES_ALL")}}
            <Icon type="ios-help-outline"></Icon>
          </p>
        </Tooltip>
        <div class="content">
          <span>{{originOverview.files && originOverview.files[0]}}</span>
          <span>{{originOverview.files && originOverview.files[1]}}</span>
        </div>
      </div>
    </div>
    <div class="section-chart-tab">
      <button v-bind:class="{buttonFocus: showChart === 0}"
              @click="tabToggle(0,'capacityLine')">{{ $t("DASHBOARD.CAPACITY")}}</button>
      <button v-bind:class="{buttonFocus: showChart === 1}"
              @click="tabToggle(1,'bandwidthLine')">{{ $t("DASHBOARD.BANDWIDTH")}}</button>
      <button v-bind:class="{buttonFocus: showChart === 2}"
              @click="tabToggle(2,'inflowsLine')">{{ $t("DASHBOARD.INFLOWS")}}</button>
      <button v-bind:class="{buttonFocus: showChart === 3}"
              @click="tabToggle(3,'outflowsLine')">{{ $t("DASHBOARD.OUTFLOWS")}}</button>
      <button v-bind:class="{buttonFocus: showChart === 4}"
              @click="tabToggle(4,'requestsLine')">{{ $t("DASHBOARD.REQUESTS")}}</button>
      <button v-bind:class="{buttonFocus: showChart === 5}"
              @click="tabToggle(5,'filesLine')">{{ $t("DASHBOARD.FILES")}}</button>
    </div>
    <div class="section-chart">
      <div class="card-chart"
           v-show="showChart === 0">
        <chart :options="capacityOptions"
               auto-resize
               ref="capacityLine"></chart>
      </div>
      <div class="card-chart"
           v-show="showChart === 1">
        <chart :options="bandwidthOptions"
               auto-resize
               ref="bandwidthLine"></chart>
      </div>
      <div class="card-chart"
           v-show="showChart === 2">
        <chart :options="inflowsOptions"
               auto-resize
               ref="inflowsLine"></chart>
      </div>
      <div class="card-chart"
           v-show="showChart === 3">
        <chart :options="outflowsOptions"
               auto-resize
               ref="outflowsLine"></chart>
      </div>
      <div class="card-chart"
           v-show="showChart === 4">
        <chart :options="requestsOptions"
               auto-resize
               ref="requestsLine"></chart>
      </div>
      <div class="card-chart"
           v-show="showChart === 5">
        <chart :options="filesOptions"
               auto-resize
               ref="filesLine"></chart>
      </div>
    </div>
  </div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legend/ScrollableLegendModel.js'
import 'echarts/lib/component/legend/ScrollableLegendView.js'
import 'echarts/lib/component/legend/scrollableLegendAction.js'
import 'echarts/lib/component/title'
import capacity from '../../assets/dashboard/capacity.svg'
import capacityDark from '../../assets/dashboard/capacity-dark.svg'
import bandwidth from '../../assets/dashboard/bandwidth.svg'
import bandwidthDark from '../../assets/dashboard/bandwidth-dark.svg'
import inflows from '../../assets/dashboard/inflows.svg'
import inflowsDark from '../../assets/dashboard/inflows-dark.svg'
import outflows from '../../assets/dashboard/outflows.svg'
import outflowsDark from '../../assets/dashboard/outflows-dark.svg'
import requests from '../../assets/dashboard/requests.svg'
import requestsDark from '../../assets/dashboard/requests-dark.svg'
import files from '../../assets/dashboard/files.svg'
import filesDark from '../../assets/dashboard/files-dark.svg'
import { getBillOldUrl, getBillUrl, getBillBandwidthUrl } from 'api'
import store from '@/store'
import {
  bytes,
  bps,
  times,
  timesK,
  date,
  dateTime,
  dateTimeYear,
  bytesSpliteUnits,
  bpsSpliteUnits,
  timesSpliteUnits,
} from '@/service/BucketService'
import Csv from './csv'
import fileSaver from 'file-saver'
export default {
  components: {
    chart: ECharts,
  },
  data() {
    return {
      showChart: 0,
      isRedirect: false,
      dateDividedBefore: '20171130',
      dateDivided: '20171201',
      selectedBucket: 'All Buckets',
      dateDefault: {
        today: [lastNDays(0), lastNDays(0)],
        seven_days: [lastNDays(6), lastNDays(0)],
        this_month: [new Date(new Date().setDate(1)), lastNDays(0)],
        thirty_days: [lastNDays(29), lastNDays(0)],
      },
      dateSelect: [lastNDays(0), lastNDays(0)],
      originOverview: {},
      outflowsBandwidthOverview: {},
      inflowsBandwidthOverview: {},
      selectedBandwidthLabel: 'out_band_pub',
      selectedBandwidthValue: '',
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        },
      },
      exportData: [],
      spinShow: true,
      spinBandwidthShow: true,
      bandwidthDataRes: {},
      capacityOptions: lineOptions,
      bandwidthOptions: lineOptions,
      inflowsOptions: lineOptions,
      outflowsOptions: lineOptions,
      requestsOptions: lineOptions,
      filesOptions: lineOptions,
    }
  },
  computed: {
    dateRange() {
      return (
        formatDate(this.dateSelect[0]) + '-' + formatDate(this.dateSelect[1])
      )
    },
    imgSrc: function() {
      return this.$store.state.theme === 'dark'
        ? [
            capacityDark,
            bandwidthDark,
            inflowsDark,
            outflowsDark,
            requestsDark,
            filesDark,
          ]
        : [capacity, bandwidth, inflows, outflows, requests, files]
    },
    theme: function() {
      return this.$store.state.theme
    },
    bucketList() {
      return this.$store.getters.buckets
        ? [{ Name: 'All Buckets' }, ...this.$store.getters.buckets]
        : [{ Name: 'All Buckets' }]
    },
  },
  watch: {
    dateSelect(to) {
      to[0] && this.getInitData()
    },
    theme() {
      let url =
        formatDate(this.dateSelect[1]) < this.dateDivided ? 'old' : 'oldAndNew'
      this.setOptions(url)
      this.setBandwidthOptions(url)
    },
  },
  created() {
    this.$store.dispatch('getBuckets')
    this.getInitData()
  },
  methods: {
    cnEnBandwidthOverview(val) {
      if (new RegExp(/^out_band_/).test(val)) {
        return val.slice(9) === 'pub'
          ? this.$t('DASHBOARD.PUB_OUTFLOW_BANDWIDTH')
          : val.slice(9) + ' ' + this.$t('DASHBOARD.CDN_OUTFLOW_BANDWIDTH')
      } else {
        return val.slice(8) === 'pub'
          ? this.$t('DASHBOARD.PUB_INFLOW_BANDWIDTH')
          : val.slice(8) + ' ' + this.$t('DASHBOARD.CDN_INFLOW_BANDWIDTH')
      }
    },
    changeBandwidthOverview(val) {
      if (new RegExp(/^out_band_/).test(val)) {
        this.selectedBandwidthLabel = val
        this.selectedBandwidthValue = this.outflowsBandwidthOverview[
          val.slice(9)
        ]
      } else {
        this.selectedBandwidthLabel = val
        this.selectedBandwidthValue = this.inflowsBandwidthOverview[
          val.slice(8)
        ]
      }
    },
    async getInitData() {
      this.spinShow = true
      if (!this.dateSelect) return

      if (formatDate(this.dateSelect[1]) < this.dateDivided) {
        // no bandwidth
        this.setBandwidthOptions('old')
        this.outflowsBandwidthOverview = {}
        this.inflowsBandwidthOverview = {}
        this.selectedBandwidthValue = ['', '无数据']
        this.selectedBandwidthLabel = 'out_band_pub'

        // old storage
        try {
          await Promise.all([
            this.$http
              .get(this.getApiURL('old', this.dateRange))
              .then((res) => {
                this.isRedirect = res.is_redirect
                // overview data old
                this.originOverview = {
                  capacity: this.convertData(res.total.space_used, true),
                  inflows: this.convertData(res.sum.flow_up, true),
                  outflows: this.convertData(res.sum.flow_down, true),
                  requests: this.convertData(
                    res.sum.read_count +
                      res.sum.write_count +
                      res.sum.delete_count,
                    true,
                    'times',
                  ),
                  files: this.convertData(res.total.num_used, true, ''),
                }
                // echarts data old
                _.extend(this, res)
                this.setOptions('old')
              }),
          ]).then(() => {
            // export data old
            this.exportData = []
            _.each(
              this.time_nodes.map((time) => time * 1000),
              (time, index) => {
                let exportData = {
                  time: date(time),
                }
                exportData[exportDic.capacity] = this.distributed.space_used[
                  index
                ]
                exportData[exportDic.inflows] = this.distributed.flow_up[index]
                exportData[exportDic.outflows] = this.distributed.flow_down[
                  index
                ]
                exportData[
                  exportDic.readRequests
                ] = this.distributed.read_count[index]
                exportData[
                  exportDic.writeRequests
                ] = this.distributed.write_count[index]
                exportData[
                  exportDic.deleteRequests
                ] = this.distributed.delete_count[index]
                exportData[exportDic.files] = this.distributed.num_used[index]
                this.exportData.push(exportData)
              },
            )
            this.spinShow = false
          })
        } catch (error) {
          this.spinShow = false
          this.$Message.warning(this.$t('STORAGE.GET_DATA_ERROR'))
        }
      } else {
        // bandwidth data
        this.spinBandwidthShow = true
        try {
          await this.$http
            .get(this.getApiURL('bandwidth', this.dateRange))
            .then((res) => {
              this.isRedirect = res.is_redirect
              this.bandwidthDataRes = _.cloneDeep(res)

              this.outflowsBandwidthOverview = {}
              this.inflowsBandwidthOverview = {}

              Object.keys(res.down_bandwidth).forEach(
                (item) =>
                  (this.outflowsBandwidthOverview[item] = this.convertData(
                    res.down_bandwidth[item].sort((a, b) => {
                      return b - a
                    })[0],
                    true,
                    'bps',
                  )),
              )
              Object.keys(res.up_bandwidth).forEach(
                (item) =>
                  (this.inflowsBandwidthOverview[item] = this.convertData(
                    res.up_bandwidth[item].sort((a, b) => {
                      return b - a
                    })[0],
                    true,
                    'bps',
                  )),
              )

              this.selectedBandwidthLabel = 'out_band_pub'
              this.selectedBandwidthValue = this.outflowsBandwidthOverview.pub

              this.setBandwidthOptions()

              this.spinBandwidthShow = false
            })
        } catch (error) {
          this.spinBandwidthShow = false
          this.$Message.warning(this.$t('STORAGE.GET_DATA_ERROR'))
        }

        // other data
        let resOld = {}
        let resNew = {}
        let oldTimeLength = 0
        try {
          if (formatDate(this.dateSelect[0]) >= this.dateDivided) {
            // new storage
            await Promise.all([
              this.$http
                .get(this.getApiURL('new', this.dateRange))
                .then((res) => {
                  this.isRedirect = res.is_redirect
                  resNew = res
                }),
            ])
          } else {
            // old and new storage
            await Promise.all([
              this.$http
                .get(
                  this.getApiURL(
                    'old',
                    formatDate(this.dateSelect[0]) +
                      '-' +
                      this.dateDividedBefore,
                  ),
                )
                .then((res) => {
                  this.isRedirect = res.is_redirect
                  resOld = res
                  oldTimeLength = res.time_nodes.length
                }),
              this.$http
                .get(this.getApiURL('new', this.dateRange))
                .then((res) => {
                  this.isRedirect = res.is_redirect
                  resNew = res
                }),
            ])
          }
          // overview data total
          this.originOverview = {
            capacity: this.convertData(resNew.total.space_used, true),
            inflows: this.convertData(
              resOld.sum === undefined
                ? resNew.sum.flow_up_cdn + resNew.sum.flow_up_pub
                : resOld.sum.flow_up +
                  resNew.sum.flow_up_cdn +
                  resNew.sum.flow_up_pub,
              true,
            ),
            outflows: this.convertData(
              resOld.sum === undefined
                ? resNew.sum.flow_down_cdn + resNew.sum.flow_down_pub
                : resOld.sum.flow_down +
                  resNew.sum.flow_down_cdn +
                  resNew.sum.flow_down_pub,
              true,
            ),
            requests: this.convertData(
              resOld.sum === undefined
                ? resNew.sum.get_count +
                  resNew.sum.head_count +
                  resNew.sum.post_count +
                  resNew.sum.put_count +
                  resNew.sum.delete_count +
                  resNew.sum.list_count
                : resOld.sum.read_count +
                  resOld.sum.write_count +
                  resOld.sum.delete_count +
                  resNew.sum.get_count +
                  resNew.sum.head_count +
                  resNew.sum.post_count +
                  resNew.sum.put_count +
                  resNew.sum.delete_count +
                  resNew.sum.list_count,
              true,
              'times',
            ),
            files: this.convertData(resNew.total.num_used, true, ''),
          }
          // echarts data total
          let echartData = {
            time_nodes:
              resOld.time_nodes === undefined
                ? resNew.time_nodes
                : resOld.time_nodes.concat(resNew.time_nodes),
            space_used:
              resOld.distributed === undefined
                ? resNew.distributed.space_used
                : resOld.distributed.space_used.concat(
                    resNew.distributed.space_used,
                  ),
            flow_up:
              resOld.distributed === undefined
                ? this.combineTwoArray(
                    resNew.distributed.flow_up_cdn,
                    resNew.distributed.flow_up_pub,
                  )
                : resOld.distributed.flow_up.concat(
                    this.combineTwoArray(
                      resNew.distributed.flow_up_cdn,
                      resNew.distributed.flow_up_pub,
                    ),
                  ),
            flow_up_pub: resNew.distributed.flow_up_pub,
            up_cdn: resNew.distributed.up_cdn,
            flow_down:
              resOld.distributed === undefined
                ? this.combineTwoArray(
                    resNew.distributed.flow_down_cdn,
                    resNew.distributed.flow_down_pub,
                  )
                : resOld.distributed.flow_down.concat(
                    this.combineTwoArray(
                      resNew.distributed.flow_down_cdn,
                      resNew.distributed.flow_down_pub,
                    ),
                  ),
            flow_down_pub: resNew.distributed.flow_down_pub,
            down_cdn: resNew.distributed.down_cdn,
            read_count:
              resOld.distributed === undefined
                ? this.combineTwoArray(
                    resNew.distributed.get_count,
                    resNew.distributed.head_count,
                  )
                : resOld.distributed.read_count.concat(
                    this.combineTwoArray(
                      resNew.distributed.get_count,
                      resNew.distributed.head_count,
                    ),
                  ),
            write_count:
              resOld.distributed === undefined
                ? this.combineTwoArray(
                    resNew.distributed.post_count,
                    resNew.distributed.put_count,
                  )
                : resOld.distributed.write_count.concat(
                    this.combineTwoArray(
                      resNew.distributed.post_count,
                      resNew.distributed.put_count,
                    ),
                  ),
            delete_count:
              resOld.distributed === undefined
                ? resNew.distributed.delete_count
                : resOld.distributed.delete_count.concat(
                    resNew.distributed.delete_count,
                  ),
            list_count: resNew.distributed.list_count,
            num_used:
              resOld.distributed === undefined
                ? resNew.distributed.num_used
                : resOld.distributed.num_used.concat(
                    resNew.distributed.num_used,
                  ),
          }
          _.extend(this, echartData)
          this.setOptions('oldAndNew')
          // export data total
          this.exportData = []
          _.each(
            this.bandwidthDataRes.time_nodes.map((time) => time * 1000),
            (time, index) => {
              let exportData = {
                time: echartData.time_nodes[index]
                  ? formatDate(this.dateSelect[0]) ===
                      formatDate(this.dateSelect[1]) &&
                    formatDate(this.dateSelect[0]) >= this.dateDivided
                    ? dateTimeYear(
                        echartData.time_nodes[index] * 1000 + 3600000,
                      )
                    : date(echartData.time_nodes[index] * 1000)
                  : '',
              }
              exportData[exportDic.capacity] = echartData.space_used[index]
              exportData[exportDic.inflows] = echartData.flow_up[index]
              exportData[exportDic.pubInflows] =
                index < oldTimeLength
                  ? ''
                  : echartData.flow_up_pub[index - oldTimeLength]
              _.forEach(echartData.up_cdn, (value, key) => {
                exportData[`${key} cdn ${exportDic.inflows}`] =
                  index < oldTimeLength ? '' : value[index - oldTimeLength]
              })
              exportData[exportDic.outflows] = echartData.flow_down[index]
              exportData[exportDic.pubOutflows] =
                index < oldTimeLength
                  ? ''
                  : echartData.flow_down_pub[index - oldTimeLength]
              _.forEach(echartData.down_cdn, (value, key) => {
                exportData[`${key} cdn ${exportDic.outflows}`] =
                  index < oldTimeLength ? '' : value[index - oldTimeLength]
              })
              exportData[exportDic.readRequests] = echartData.read_count[index]
              exportData[exportDic.writeRequests] =
                echartData.write_count[index]
              exportData[exportDic.deleteRequests] =
                echartData.delete_count[index]
              exportData[exportDic.listRequests] =
                index < oldTimeLength
                  ? ''
                  : echartData.list_count[index - oldTimeLength]
              exportData[exportDic.files] = echartData.num_used[index]

              // bandwidth
              exportData['bandwidth_time'] = dateTimeYear(time)
              exportData[
                exportDic.pubOutBand
              ] = this.bandwidthDataRes.down_bandwidth.pub[index]
              _.forEach(
                _.omit(this.bandwidthDataRes.down_bandwidth, ['pub']),
                (value, key) => {
                  exportData[`${key} ${exportDic.cdnOutBand}`] = value[index]
                },
              )
              exportData[
                exportDic.pubInBand
              ] = this.bandwidthDataRes.up_bandwidth.pub[index]
              _.forEach(
                _.omit(this.bandwidthDataRes.up_bandwidth, ['pub']),
                (value, key) => {
                  exportData[`${key} ${exportDic.cdnInBand}`] = value[index]
                },
              )
              this.exportData.push(exportData)
            },
          )
          this.spinShow = false
        } catch (error) {
          this.spinShow = false
          if (
            error.msg &&
            error.msg.message &&
            error.msg.message === 'Not found any data in custom_range'
          ) {
            this.$Modal.warning({
              title: this.$t('DASHBOARD.PROMPT'),
              content: this.$t('DASHBOARD.PROMPT_CONTENT'),
            })
            return
          }
          this.$Message.warning(this.$t('STORAGE.GET_DATA_ERROR'))
        }
      }
    },
    setBandwidthOptions(type) {
      this.bandwidthOptions =
        type === 'old'
          ? {}
          : initBandwidthOptions({
              outBandPub: this.combineTimeDataUnitLabel(
                this.bandwidthDataRes.down_bandwidth.pub,
                '公网流出带宽',
                'byte',
                this.bandwidthDataRes.time_nodes,
              ),
              outBandCdn: this.combineTimeDataUnitLabelToObjectArray(
                _.omit(this.bandwidthDataRes.down_bandwidth, ['pub']),
                ' cdn 流出带宽',
                'type',
                this.bandwidthDataRes.time_nodes,
              ),
              inBandPub: this.combineTimeDataUnitLabel(
                this.bandwidthDataRes.up_bandwidth.pub,
                '公网流入带宽',
                'byte',
                this.bandwidthDataRes.time_nodes,
              ),
              inBandCdn: this.combineTimeDataUnitLabelToObjectArray(
                _.omit(this.bandwidthDataRes.up_bandwidth, ['pub']),
                ' cdn 流入带宽',
                'type',
                this.bandwidthDataRes.time_nodes,
              ),
              theme: this.theme,
            })
    },
    setOptions(url) {
      let newOneDayFlag =
        formatDate(this.dateSelect[0]) === formatDate(this.dateSelect[1]) &&
        formatDate(this.dateSelect[0]) >= this.dateDivided
      this.capacityOptions = initOptions({
        dataPart: this.combineTimeDataUnitLabel(
          url === 'old' ? this.distributed.space_used : this.space_used,
          '存储容量',
        ),
        theme: this.theme,
        newOneDayFlag: newOneDayFlag,
      })
      this.inflowsOptions = initOptions({
        dataPart: this.combineTimeDataUnitLabel(
          url === 'old' ? this.distributed.flow_up : this.flow_up,
          '流入流量',
        ),
        dataPart1:
          url === 'old'
            ? ''
            : this.combineTimeDataUnitLabel(this.flow_up_pub, '公网流入流量'),
        dataPart2:
          url === 'old'
            ? ''
            : this.combineTimeDataUnitLabelToObjectArray(
                this.up_cdn,
                ' cdn 流入流量',
              ),
        theme: this.theme,
        newOneDayFlag: newOneDayFlag,
      })
      this.outflowsOptions = initOptions({
        dataPart: this.combineTimeDataUnitLabel(
          url === 'old' ? this.distributed.flow_down : this.flow_down,
          '流出流量',
        ),
        dataPart1:
          url === 'old'
            ? ''
            : this.combineTimeDataUnitLabel(this.flow_down_pub, '公网流出流量'),
        dataPart2:
          url === 'old'
            ? ''
            : this.combineTimeDataUnitLabelToObjectArray(
                this.down_cdn,
                ' cdn 流出流量',
              ),
        theme: this.theme,
        newOneDayFlag: newOneDayFlag,
      })
      this.requestsOptions = initOptions({
        dataPart: this.combineTimeDataUnitLabel(
          url === 'old' ? this.distributed.read_count : this.read_count,
          '读请求数',
          'times',
        ),
        dataPart1: this.combineTimeDataUnitLabel(
          url === 'old' ? this.distributed.write_count : this.write_count,
          '写请求数',
          'times',
        ),
        dataPart2: this.combineTimeDataUnitLabel(
          url === 'old' ? this.distributed.delete_count : this.delete_count,
          '删除请求数',
          'times',
        ),
        dataPart3:
          url === 'old'
            ? ''
            : this.combineTimeDataUnitLabel(
                this.list_count,
                '列文件请求数',
                'times',
              ),
        theme: this.theme,
        newOneDayFlag: newOneDayFlag,
      })
      this.filesOptions = initOptions({
        dataPart: this.combineTimeDataUnitLabel(
          url === 'old' ? this.distributed.num_used : this.num_used,
          '文件数',
          '',
        ),
        theme: this.theme,
        newOneDayFlag: newOneDayFlag,
      })
    },
    combineTwoArray(array1, array2) {
      let combinedData = []
      _.forEach(array1, (value, key) => {
        combinedData.push(value + array2[key])
      })
      return combinedData
    },
    combineTimeDataUnitLabel(
      data,
      label,
      unit = 'byte',
      time = this.time_nodes,
    ) {
      let _time =
        time.length === data.length
          ? time
          : time.slice(time.length - data.length)
      let combinedData = []
      _.forEach(_time, (value, key) => {
        combinedData.push([value * 1000, data[key]])
      })
      let object = {
        label: label,
        unit: unit,
        data: combinedData,
      }
      return object
    },
    combineTimeDataUnitLabelToObjectArray(
      data,
      label,
      unit = 'byte',
      time = this.time_nodes,
    ) {
      let objectArray = []
      _.forEach(data, (value, key) => {
        let _time =
          time.length === value.length
            ? time
            : time.slice(time.length - value.length)
        let combinedData = []
        _.forEach(_time, (value, index) => {
          combinedData.push([value * 1000, data[key][index]])
        })
        let object = {
          label: key + label,
          unit: unit,
          data: combinedData,
        }
        objectArray.push(object)
      })
      return objectArray
    },
    convertData(value, splite = false, unit = 'byte') {
      if (!value) {
        return ['0']
      }
      return splite
        ? unit === 'byte'
          ? bytesSpliteUnits(value, 3)
          : unit === 'bps'
            ? bpsSpliteUnits(value, 3)
            : timesSpliteUnits(value, 3)
        : unit === 'byte'
          ? bytes(value)
          : unit === 'bps'
            ? bps(value)
            : times(value)
    },
    getApiURL(url, range) {
      let path = ''
      path += '?custom_range=' + range
      if (this.selectedBucket && this.selectedBucket !== 'All Buckets') {
        path += '&bucket=' + this.selectedBucket
      }
      if (
        this.$store.getters.mode === 'manage' &&
        !this.$store.getters.isSameUser
      ) {
        path += '&customer=' + store.state.current.username
      }
      return url === 'new'
        ? getBillUrl(path)
        : url === 'old'
          ? getBillOldUrl(path)
          : getBillBandwidthUrl(path)
    },
    tabToggle(index, ref) {
      let vm = this
      vm.showChart = index
      setTimeout(() => {
        vm.$refs[ref].resize()
      }, 100)
    },
    exportCsv() {
      let content = Csv(_.keys(this.exportData[0]), this.exportData, ',')
      let blob = new Blob([content], {
        type: 'text/csv;charset=utf-8',
      })
      fileSaver.saveAs(
        blob,
        store.state.current.username + '-' + this.dateRange + '.csv',
      )
    },
  },
}

const exportDic = {
  capacity: '存储容量（字节）',
  pubOutBand: '公网流出带宽(bps)',
  pubInBand: '公网流入带宽(bps)',
  cdnOutBand: 'cdn 流出带宽(bps)',
  cdnInBand: 'cdn 流入带宽(bps)',
  outBandwidth: '流出带宽(字节)',
  inBandwidth: '流入带宽(字节)',
  inflows: '流入流量（字节）',
  pubInflows: '公网流入流量（字节）',
  outflows: '流出流量（字节）',
  pubOutflows: '公网流出流量（字节）',
  readRequests: '读请求数（次）',
  writeRequests: '写请求数（次）',
  deleteRequests: '删除请求数（次）',
  listRequests: '列文件请求数（次）',
  files: '文件数（个）',
}
const fixDate = (n) => (n < 10 ? '0' + n : String(n))
const formatDate = (date) =>
  date &&
  date.getFullYear() + fixDate(date.getMonth() + 1) + fixDate(date.getDate())
const lastNDays = (n) => new Date(new Date().getTime() - 3600 * 1000 * 24 * n)
const lineOptions = {
  tooltip: {
    trigger: 'axis',
    textStyle: {
      color: '#fff',
      fontSize: 14,
    },
    axisPointer: {
      lineStyle: {
        color: '#1e9fff',
      },
      z: 0,
    },
    backgroundColor: 'rgba(71, 86, 105, 0.8)',
    padding: 10,
  },
  grid: {
    top: '40',
    left: '20',
    right: '50',
    bottom: '10',
    containLabel: true,
  },
  xAxis: {
    type: 'time',
    offset: 5,
    axisLine: {
      lineStyle: {
        color: '#8492a6',
      },
    },
    interval: 86400000,
    axisTick: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: '#8492a6',
        fontSize: 14,
      },
    },
  },
  yAxis: {
    type: 'value',
    min: 0,
    minInterval: 1,
    offset: 5,
    nameTextStyle: {
      color: '#8492a6',
      fontSize: 14,
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: '#8492a6',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: '#8492a6',
        fontSize: 14,
      },
    },
  },
}
const darkLineOptions = {
  legend: {
    pageIconColor: '#c0ccda',
    pageIconInactiveColor: '#555',
    pageTextStyle: {
      color: '#c0ccda',
    },
  },
  grid: {
    show: true,
    backgroundColor: '#293137',
    borderColor: '#52626d',
  },
  xAxis: {
    splitLine: {
      lineStyle: {
        color: '#52626d',
      },
    },
  },
  yAxis: {
    splitLine: {
      lineStyle: {
        color: '#52626d',
      },
    },
  },
}

const initBandwidthOptions = ({
  outBandPub,
  outBandCdn,
  inBandPub,
  inBandCdn,
  theme,
}) => {
  let themeLineOptions =
    theme === 'dark'
      ? _.defaultsDeep({}, lineOptions, darkLineOptions)
      : _.defaultsDeep({}, lineOptions)
  themeLineOptions.xAxis.interval = null
  themeLineOptions.xAxis.splitNumber = 7
  themeLineOptions.grid.top = '60'

  let legendData = []
  let seriesArray = []

  legendData = [outBandPub.label]
  seriesArray = [
    {
      type: 'line',
      data: outBandPub.data,
      name: outBandPub.label,
      smooth: true,
      symbol: 'none',
      areaStyle: {
        normal: {
          color: '#20a0ff',
          opacity: 0.5,
        },
      },
    },
  ]

  _.forEach(outBandCdn, (value, index) => {
    legendData.push(outBandCdn[index].label)
    let seriesItem = {
      type: 'line',
      data: outBandCdn[index].data,
      name: outBandCdn[index].label,
      smooth: true,
      symbol: 'none',
      areaStyle: {
        normal: {
          color: '#20a0ff',
          opacity: 0.5,
        },
      },
    }
    seriesArray.push(seriesItem)
  })

  legendData.push(inBandPub.label)
  seriesArray.push({
    type: 'line',
    data: inBandPub.data,
    name: inBandPub.label,
    smooth: true,
    symbol: 'none',
    areaStyle: {
      normal: {
        color: '#20a0ff',
        opacity: 0.5,
      },
    },
  })

  _.forEach(inBandCdn, (value, index) => {
    legendData.push(inBandCdn[index].label)
    let seriesItem = {
      type: 'line',
      data: inBandCdn[index].data,
      name: inBandCdn[index].label,
      smooth: true,
      symbol: 'none',
      areaStyle: {
        normal: {
          color: '#20a0ff',
          opacity: 0.5,
        },
      },
    }
    seriesArray.push(seriesItem)
  })

  let newOptions = _.defaultsDeep({}, themeLineOptions, {
    color: [
      '#1e9fff',
      '#9f61fc',
      '#0cce66',
      '#f85959',
      '#ffac2a',
      '#8492a6',
      '#c4cfdf',
    ],
    legend: {
      type: 'scroll',
      data: legendData,
      top: '20px',
      textStyle: {
        color: '#1E9FFF',
        fontSize: 14,
      },
      icon: 'square',
      itemGap: 40,
    },
    series: seriesArray,
    tooltip: {
      formatter: function(params) {
        let res = '时间：' + dateTimeYear(params[0].value[0])
        _.each(params, function(item) {
          res +=
            '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
            item.color +
            '"></span>' +
            item.seriesName +
            '：'
          res += bps(item.value[1], 3)
        })
        return res
      },
    },
    xAxis: {
      axisLabel: {
        formatter: function(value) {
          return dateTime(value)
        },
      },
    },
    yAxis: {
      axisLabel: {
        formatter: function(value) {
          return bps(value)
        },
      },
    },
  })
  return newOptions
}

const initOptions = ({
  dataPart,
  dataPart1,
  dataPart2,
  dataPart3,
  theme,
  newOneDayFlag,
}) => {
  let themeLineOptions =
    theme === 'dark'
      ? _.defaultsDeep({}, lineOptions, darkLineOptions)
      : _.defaultsDeep({}, lineOptions)
  let n = Math.floor((dataPart.data.length - 1) / 7) + 1
  themeLineOptions.xAxis.interval = newOneDayFlag
    ? dataPart.data.length === 1
      ? 86400000
      : 3600000 * n
    : 86400000 * n
  themeLineOptions.grid.top = '60'
  let legendData = []
  let seriesArray = []
  if (!dataPart1) {
    legendData = [dataPart.label]
    seriesArray = [
      {
        type: 'line',
        data: dataPart.data,
        name: dataPart.label,
        smooth: true,
        areaStyle: {
          normal: {
            color: '#20a0ff',
            opacity: 0.5,
          },
        },
      },
    ]
  } else {
    legendData = [dataPart.label, dataPart1.label]
    seriesArray = [
      {
        type: 'line',
        data: dataPart.data,
        name: dataPart.label,
        smooth: true,
        areaStyle: {
          normal: {
            color: '#20a0ff',
            opacity: 0.5,
          },
        },
      },
      {
        type: 'line',
        data: dataPart1.data,
        name: dataPart1.label,
        smooth: true,
        areaStyle: {
          normal: {
            color: '#20a0ff',
            opacity: 0.5,
          },
        },
      },
    ]
    if (dataPart2 instanceof Array) {
      _.forEach(dataPart2, (value, index) => {
        legendData.push(dataPart2[index].label)
        let seriesItem = {
          type: 'line',
          data: dataPart2[index].data,
          name: dataPart2[index].label,
          smooth: true,
          areaStyle: {
            normal: {
              color: '#20a0ff',
              opacity: 0.5,
            },
          },
        }
        seriesArray.push(seriesItem)
      })
    } else {
      legendData = legendData.concat([dataPart2.label, dataPart3.label])
      let seriesItem = [
        {
          type: 'line',
          data: dataPart2.data,
          name: dataPart2.label,
          smooth: true,
          areaStyle: {
            normal: {
              color: '#20a0ff',
              opacity: 0.5,
            },
          },
        },
        {
          type: 'line',
          data: dataPart3.data,
          name: dataPart3.label,
          smooth: true,
          areaStyle: {
            normal: {
              color: '#20a0ff',
              opacity: 0.5,
            },
          },
        },
      ]
      seriesArray = seriesArray.concat(seriesItem)
    }
  }
  let newOptions = _.defaultsDeep({}, themeLineOptions, {
    color: [
      '#1e9fff',
      '#9f61fc',
      '#0cce66',
      '#f85959',
      '#ffac2a',
      '#8492a6',
      '#c4cfdf',
    ],
    legend: {
      type: 'scroll',
      data: legendData,
      top: '20px',
      textStyle: {
        color: '#1E9FFF',
        fontSize: 14,
      },
      icon: 'square',
      itemGap: 40,
    },
    series: seriesArray,
    tooltip: {
      formatter: function(params) {
        let res =
          '时间：' +
          (newOneDayFlag
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
            dataPart.unit === 'byte'
              ? bytes(item.value[1], 3)
              : times(item.value[1])
        })
        return res
      },
    },
    xAxis: {
      axisLabel: {
        formatter: function(value) {
          return newOneDayFlag ? dateTime(value + 3600000) : date(value)
        },
      },
    },
    yAxis: {
      name:
        dataPart.unit === 'byte'
          ? ''
          : dataPart.unit === 'times'
            ? '单位：次'
            : '单位：个',
      axisLabel: {
        formatter: function(value) {
          return dataPart.unit === 'byte' ? bytes(value) : timesK(value)
        },
      },
    },
  })
  return newOptions
}
</script>

<style lang="less">
.bsc-tooltip-inner {
  max-width: none;
}
</style>

<style lang="less" scoped>
@import '../../styles/index.less';
@overview-height: 160px;

.dark .@{css-prefix}dashboard {
  .toolbar {
    border-bottom: @common-border-dark;
    .button-daterange {
      button {
        border: 1px solid #52626d;
        border-left: none;
        background: #414d56;
        color: #fff;
      }
      button:first-child {
        border-left: 1px solid #52626d;
      }
    }
  }

  .overview {
    & > div {
      border: 0;
      background-color: #313a41;
      .content {
        span {
          color: #ffba42;
        }
      }
    }
  }

  .section-chart-tab {
    border: @common-border-dark;
    border-bottom: 0;
    button {
      border: none;
      border-right: @common-border-dark;
      border-bottom: @common-border-dark;
      color: @text-color-dark;
      background-color: #414d56;
    }
    & > button:nth-last-child(1) {
      border-right: 0;
    }
    button:focus,
    .buttonFocus {
      background-color: #313a41;
      border-bottom: 0;
      color: @text-color-dark;
    }
  }

  .card-chart {
    background-color: #313a41;
    border: @common-border-dark;
    border-top: 0;
  }
}

.@{css-prefix}dashboard {
  .toolbar {
    padding-bottom: 50px;
    margin-bottom: 50px;
    border-bottom: @common-border;
    height: 32px;

    .button-datepicker {
      width: 60%;
    }

    .button-daterange {
      float: right;

      button {
        margin: 0;
        font-size: 14px;
        color: #475669;
        height: 32px;
        background: #fff;
        line-height: 16px;
        border: 1px solid #d3dce6;
        border-left: none;
      }
      button:first-child {
        border-left: 1px solid #d3dce6;
      }
    }

    button:focus,
    .buttonFocus {
      outline: 0;
      background: #20a0ff !important;
      border-color: #20a0ff !important;
      color: #fff !important;
    }
  }

  .redirect-info {
    float: left;
    color: #8492a6;
    margin-right: 10px;
    font-size: 24px;
  }

  .overview {
    width: 100%;
    display: inline-flex;
    height: @overview-height;

    & > div {
      border: 1px solid hsl(212, 28%, 86%);
      margin-right: 16px;
      padding-top: 16px;
      padding-right: 16px;
      position: relative;
      text-align: right;
      width: 100%;
      height: 100%;
      min-width: 220px;

      img {
        position: absolute;
        top: -32px;
        left: 16px;
      }

      p {
        font-size: 18px;
        color: #8492a6;

        i {
          margin-left: 4px;
        }
      }

      .content {
        position: absolute;
        bottom: 14px;
        right: 14px;

        span {
          color: #475669;
        }

        span:first-child {
          font: 36px bolder;
        }

        span:nth-child(2) {
          font: 24px bolder;
        }
      }
    }
    & > div:last-child {
      margin-right: 0;
    }

    .selectBandwidth {
      text-align: left;

      .arrowDown {
        cursor: pointer;
        position: relative;
        top: -5px;
      }
    }

    .selectBandwidthLabel {
      font-size: 18px;
      color: #8492a6;
      display: inline-block;
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .section-chart-tab {
    width: 100%;
    height: 48px;
    display: inline-flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 16px;
    border: 1px solid #d3dce6;
    border-bottom: 0;
    button {
      width: 100%;
      height: 100%;
      text-align: center;
      vertical-align: middle;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      cursor: pointer;
      background-image: none;
      border: none;
      border-right: 1px solid #d3dce6;
      border-bottom: 1px solid #d3dce6;
      white-space: nowrap;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      font-size: 14px;
      transform: translateZ(0);
      transition: color 0.2s linear, background-color 0.2s linear;
      color: #a1acb5;
      background-color: #f9fafc;
      border-radius: 0;
    }
    & > button:nth-last-child(1) {
      border-right: 0;
    }
    button:focus,
    .buttonFocus {
      outline: 0;
      background: #fff;
      border-bottom: 0;
      color: #475669;
    }
  }

  .card-chart {
    width: 100%;
    padding: 4px 4px 10px;
    border: 1px solid #d3dce6;
    border-top: 0;
    margin-bottom: 16px;
    transition: all 0.2s ease-in-out;
    span {
      display: inline-block;
      margin-top: 10px;
      margin-left: 10px;
      font-size: 20px;
    }
    .echarts {
      width: initial;
      margin-left: 8px;
    }
  }
}

@media (max-width: 1840px) {
  .@{css-prefix}dashboard {
    .overview {
      & > div {
        min-width: 190px;
        padding-top: 75px;

        p {
          font-size: 16px;
        }

        .content {
          span:first-child {
            font: 30px bolder;
          }

          span:nth-child(2) {
            font: 18px bolder;
          }
        }

        .selectBandwidthLabel {
          width: 140px;
        }
      }
    }
  }
}

@media (max-width: 1440px) {
  .@{css-prefix}dashboard {
    .overview {
      & > div {
        min-width: 185px;
        padding-right: 15px;
      }
    }
  }
}
</style>
