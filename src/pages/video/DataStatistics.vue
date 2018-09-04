<template>
  <div class="bsc-data-statistics">
    <Spin size="bigger"
          fix
          v-if="spinShow"></Spin>
    <div class="toolbar">
      <div class="button-datepicker">
        <Date-picker v-model="dateSelect"
                     format="yyyy/MM/dd"
                     type="daterange"
                     placement="bottom-end"
                     placeholder="Select time"
                     :options="dateOptions"
                     style="width:100%;"></Date-picker>
      </div>
      <div class="button-group button-daterange">
        <Button-group>
          <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.seven_days[0].getTime()}"
                  @click="dateSelect = dateDefault.seven_days">{{ $t("DASHBOARD.SEVEN_DAYS")}}</Button>
          <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.this_month[0].getTime()}"
                  @click="dateSelect = dateDefault.this_month"
                  v-show="!isFristDay">{{ $t("DASHBOARD.THIS_MONTH")}}</Button>
          <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.thirty_days[0].getTime()}"
                  @click="dateSelect = dateDefault.thirty_days">{{ $t("DASHBOARD.THIRTY_DAYS")}}</Button>
        </Button-group>
      </div>
      <div class="button-export-data">
        <Button type="primary"
                @click="exportCsv">{{ $t("DASHBOARD.EXPORT_DATA")}}</Button>
      </div>
    </div>
    <div class="section-chart-tab">
      <button v-bind:class="{buttonFocus: showChart === 0}"
              @click="tabToggle(0,'overviewLine')">{{ $t("DASHBOARD.TRANSCODER_OVERVIEW")}}</button>
      <button v-bind:class="{buttonFocus: showChart === 1}"
              @click="tabToggle(1);tabVideoToggle(showVideoChart,'videoH264LfrLine')">{{ $t("DASHBOARD.VIDEO_TRANSCODER")}}</button>
      <button v-bind:class="{buttonFocus: showChart === 2}"
              @click="tabToggle(2,'audioLine')">{{ $t("DASHBOARD.AUDIO_TRANSCODER")}}</button>
      <button v-bind:class="{buttonFocus: showChart === 3}"
              @click="tabToggle(3,'transferPackageLine')">{{ $t("DASHBOARD.TRANSFER_PACKAGE")}}</button>
      <button disabled></button>
    </div>
    <div class="section-chart">
      <div class="card-chart"
           v-show="showChart === 0">
        <chart :options="overviewOptions"
               auto-resize
               ref="overviewLine"></chart>
      </div>
      <div class="card-chart"
           v-show="showChart === 1">
        <div class="button-group video-button-group">
          <Button-group>
            <Button v-bind:class="{buttonFocus: showVideoChart === 0}"
                    @click="tabVideoToggle(0,'videoH264LfrLine')">{{ $t("DASHBOARD.H264LFR")}}</Button>
            <Button v-bind:class="{buttonFocus: showVideoChart === 1}"
                    @click="tabVideoToggle(1,'videoH264HfrLine')">{{ $t("DASHBOARD.H264HFR")}}</Button>
            <Button v-bind:class="{buttonFocus: showVideoChart === 2}"
                    @click="tabVideoToggle(2,'videoH265LfrLine')">{{ $t("DASHBOARD.H265LFR")}}</Button>
            <Button v-bind:class="{buttonFocus: showVideoChart === 3}"
                    @click="tabVideoToggle(3,'videoH265HfrLine')">{{ $t("DASHBOARD.H265HFR")}}</Button>
          </Button-group>
        </div>
        <chart v-show="showVideoChart === 0"
               :options="videoH264LfrOptions"
               auto-resize
               ref="videoH264LfrLine"></chart>
        <chart v-show="showVideoChart === 1"
               :options="videoH264HfrOptions"
               auto-resize
               ref="videoH264HfrLine"></chart>
        <chart v-show="showVideoChart === 2"
               :options="videoH265LfrOptions"
               auto-resize
               ref="videoH265LfrLine"></chart>
        <chart v-show="showVideoChart === 3"
               :options="videoH265HfrOptions"
               auto-resize
               ref="videoH265HfrLine"></chart>
      </div>
      <div class="card-chart"
           v-show="showChart === 2">
        <chart :options="audioOptions"
               auto-resize
               ref="audioLine"></chart>
      </div>
      <div class="card-chart"
           v-show="showChart === 3">
        <chart :options="transferPackageOptions"
               auto-resize
               ref="transferPackageLine"></chart>
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
import 'echarts/lib/component/title'
import { getBillTranscoderUrl } from '@/service/API'
import { time, timesK, date } from '@/service/bucketService'
import Csv from '@/pages/dashboard/csv'
import fileSaver from 'file-saver'
import { checkRole } from 'helper'
import store from '@/store'
export default {
  components: {
    chart: ECharts,
  },
  data() {
    return {
      showChart: 0,
      showVideoChart: 0,
      dateDefault: {
        seven_days: [lastNDays(7), lastNDays(1)],
        this_month: [new Date(new Date().setDate(1)), lastNDays(1)],
        thirty_days: [lastNDays(30), lastNDays(1)],
      },
      dateSelect: this.dateSelect,
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now() - 86400000
        },
      },
      exportData: [],
      spinShow: true,
      overviewOptions: lineOptions,
      videoH264LfrOptions: lineOptions,
      videoH264HfrOptions: lineOptions,
      videoH265LfrOptions: lineOptions,
      videoH265HfrOptions: lineOptions,
      audioOptions: lineOptions,
      transferPackageOptions: lineOptions,
    }
  },
  computed: {
    dateRange() {
      return (
        formatDate(this.dateSelect[0]) + '-' + formatDate(this.dateSelect[1])
      )
    },
    isFristDay() {
      return new Date().getDate() === 1
    },
    theme: function() {
      return this.$store.state.theme
    },
  },
  watch: {
    dateSelect(to, from) {
      to[0] && this.getInitData()
    },
    theme(to, from) {
      this.toggleTheme(to)
    },
  },
  created() {
    this.dateSelect = this.dateDefault.seven_days
    this.getInitData()
  },
  methods: {
    async getInitData() {
      this.spinShow = true
      if (!this.dateSelect) return

      try {
        await Promise.all([
          this.$http.get(this.getApiURL()).then((res) => {
            this.overviewData = res.overview
            this.videoData = res.distribution.video
            this.audioData = res.distribution.not_video.audio_transcoding
            this.transferPackageData = res.distribution.not_video.container_only
            this.overviewOptions = initOverviewOptions(
              this.overviewData,
              this.theme,
            )
            this.videoH264LfrOptions = initVideoOptions(
              this.videoData.lfr_low,
              this.theme,
            )
            this.videoH264HfrOptions = initVideoOptions(
              this.videoData.hfr_low,
              this.theme,
            )
            this.videoH265LfrOptions = initVideoOptions(
              this.videoData.lfr_h265,
              this.theme,
            )
            this.videoH265HfrOptions = initVideoOptions(
              this.videoData.hfr_h265,
              this.theme,
            )
            this.audioOptions = initNotVideoOptions(
              this.audioData,
              '音频转码',
              this.theme,
            )
            this.transferPackageOptions = initNotVideoOptions(
              this.transferPackageData,
              '转封装',
              this.theme,
            )
          }),
        ]).then((res) => {
          this.exportData = []
          _.each(
            this.overviewData.video_transcoding.map((data) => data[0]),
            (time, index) => {
              let exportDataItem = {
                time: date(time),
                [exportDic.audioTranscodingCount]: this.overviewData
                  .audio_transcoding[index][1],
                [exportDic.snapshotCount]: this.overviewData.snapshot[index][1],
                [exportDic.transferPackageCount]: this.overviewData
                  .container_only[index][1],
                [exportDic.metadataCount]: this.overviewData.get_metadata[
                  index
                ][1],
                [exportDic.H264LFR_SD240]: this.videoData.lfr_low.SD240[
                  index
                ][1],
                [exportDic.H264LFR_SD480]: this.videoData.lfr_low.SD480[
                  index
                ][1],
                [exportDic.H264LFR_SD]: this.videoData.lfr_low.SD[index][1],
                [exportDic.H264LFR_HD]: this.videoData.lfr_low.HD[index][1],
                [exportDic.H264LFR_2K]: this.videoData.lfr_low['2K'][index][1],
                [exportDic.H264LFR_4K]: this.videoData.lfr_low['4K'][index][1],
                [exportDic.H264HFR_SD240]: this.videoData.hfr_low.SD240[
                  index
                ][1],
                [exportDic.H264HFR_SD480]: this.videoData.hfr_low.SD480[
                  index
                ][1],
                [exportDic.H264HFR_SD]: this.videoData.hfr_low.SD[index][1],

                [exportDic.H264HFR_HD]: this.videoData.hfr_low.HD[index][1],
                [exportDic.H264HFR_2K]: this.videoData.hfr_low['2K'][index][1],
                [exportDic.H264HFR_4K]: this.videoData.hfr_low['4K'][index][1],
                [exportDic.H265LFR_SD240]: this.videoData.lfr_h265.SD240[
                  index
                ][1],
                [exportDic.H265LFR_SD480]: this.videoData.lfr_h265.SD480[
                  index
                ][1],
                [exportDic.H265LFR_SD]: this.videoData.lfr_h265.SD[index][1],
                [exportDic.H265LFR_HD]: this.videoData.lfr_h265.HD[index][1],
                [exportDic.H265LFR_2K]: this.videoData.lfr_h265['2K'][index][1],
                [exportDic.H265LFR_4K]: this.videoData.lfr_h265['4K'][index][1],
                [exportDic.H265HFR_SD240]: this.videoData.hfr_h265.SD240[
                  index
                ][1],
                [exportDic.H265HFR_SD480]: this.videoData.hfr_h265.SD480[
                  index
                ][1],
                [exportDic.H265HFR_SD]: this.videoData.hfr_h265.SD[index][1],

                [exportDic.H265HFR_HD]: this.videoData.hfr_h265.HD[index][1],
                [exportDic.H265HFR_2K]: this.videoData.hfr_h265['2K'][index][1],
                [exportDic.H265HFR_4K]: this.videoData.hfr_h265['4K'][index][1],
                [exportDic.videoTranscoding]: this.audioData[index][1],
                [exportDic.transferPackage]: this.transferPackageData[index][1],
              }
              this.exportData.push(exportDataItem)
            },
          )
          this.spinShow = false
        })
      } catch (error) {
        console.log(error)
        this.spinShow = false
        this.$Message.warning(this.$t('STORAGE.GET_DATA_ERROR'))
      }
    },
    getApiURL() {
      let path = ''
      path += '?custom_range=' + this.dateRange
      if (checkRole('SUBUSER')) {
        path += '&customer=' + store.current.username
      }
      return getBillTranscoderUrl(path)
    },
    tabToggle(index, ref) {
      let vm = this
      vm.showChart = index
      ref &&
        setTimeout(() => {
          vm.$refs[ref].resize()
        }, 100)
    },
    tabVideoToggle(index, ref) {
      let vm = this
      vm.showVideoChart = index
      setTimeout(() => {
        vm.$refs[ref].resize()
      }, 100)
    },
    exportCsv() {
      let content = Csv(_.keys(this.exportData[0]), this.exportData, ',')
      let file = new File(Array.from(content), this.dateRange + '.csv', {
        type: 'text/csv;charset=utf-8',
      })
      fileSaver.saveAs(file)
    },
    toggleTheme(theme) {
      this.overviewOptions = initOverviewOptions(this.overviewData, theme)
      this.videoH264LfrOptions = initVideoOptions(
        this.videoData.lfr_low,
        this.theme,
      )
      this.videoH264HfrOptions = initVideoOptions(
        this.videoData.hfr_low,
        this.theme,
      )
      this.videoH265LfrOptions = initVideoOptions(
        this.videoData.lfr_h265,
        this.theme,
      )
      this.videoH265HfrOptions = initVideoOptions(
        this.videoData.hfr_h265,
        this.theme,
      )
      this.audioOptions = initNotVideoOptions(this.audioData, '音频转码', theme)
      this.transferPackageOptions = initNotVideoOptions(
        this.transferPackageData,
        '转封装',
        theme,
      )
    },
  },
}

const exportDic = {
  videoTranscodingCount: '视频转码任务数(个)',
  audioTranscodingCount: '音频转码任务数(个)',
  snapshotCount: '视频截图张数(个)',
  transferPackageCount: '转封装任务数(个)',
  metadataCount: '音视频元信息接口调用次数(个)',
  H264LFR_SD240: 'H264及其他普通帧率-SD240(s)',
  H264LFR_SD480: 'H264及其他普通帧率-SD480(s)',
  H264LFR_SD: 'H264及其他普通帧率-SD(s)',
  H264LFR_HD: 'H264及其他普通帧率-HD(s)',
  H264LFR_2K: 'H264及其他普通帧率-2K(s)',
  H264LFR_4K: 'H264及其他普通帧率-4K(s)',
  H264HFR_SD240: 'H264及其他高帧率-SD240(s)',
  H264HFR_SD480: 'H264及其他高帧率-SD480(s)',
  H264HFR_SD: 'H264及其他高帧率-SD(s)',
  H264HFR_HD: 'H264及其他高帧率-HD(s)',
  H264HFR_2K: 'H264及其他高帧率-2K(s)',
  H264HFR_4K: 'H264及其他高帧率-4K(s)',
  H265LFR_SD240: 'H265普通帧率-SD240(s)',
  H265LFR_SD480: 'H265普通帧率-SD480(s)',
  H265LFR_SD: 'H265普通帧率-SD(s)',
  H265LFR_HD: 'H265普通帧率-HD(s)',
  H265LFR_2K: 'H265普通帧率-2K(s)',
  H265LFR_4K: 'H265普通帧率-4K(s)',
  H265HFR_SD240: 'H265高帧率-SD240(s)',
  H265HFR_SD480: 'H265高帧率-SD480(s)',
  H265HFR_SD: 'H265高帧率-SD(s)',
  H265HFR_HD: 'H265高帧率-HD(s)',
  H265HFR_2K: 'H265高帧率-2K(s)',
  H265HFR_4K: 'H265高帧率-4K(s)',
  videoTranscoding: '音频转码(s)',
  transferPackage: '转封装(s)',
}
const fixDate = (n) => (n < 10 ? '0' + n : String(n))
const formatDate = (date) =>
  date &&
  date.getFullYear() + fixDate(date.getMonth() + 1) + fixDate(date.getDate())
const lastNDays = (n) => new Date(new Date().getTime() - 3600 * 1000 * 24 * n)
const lineOptions = {
  legend: {
    top: '20px',
    textStyle: {
      color: '#1E9FFF',
      fontSize: 14,
    },
    icon: 'square',
    itemGap: 40,
  },
  tooltip: {
    trigger: 'axis',
    textStyle: {
      color: '#fff',
      fontSize: 16,
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
    top: '60',
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
      formatter: function(value) {
        return date(value)
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
const seriesPart = {
  type: 'line',
  smooth: true,
  sampling: 'average',
  areaStyle: {
    normal: {
      color: '#20a0ff',
      opacity: 0.5,
    },
  },
}
const initOverviewOptions = (data, theme) => {
  let themeLineOptions =
    theme === 'dark'
      ? _.defaultsDeep({}, lineOptions, darkLineOptions)
      : _.defaultsDeep({}, lineOptions)
  let n = Math.floor((data.video_transcoding.length - 1) / 7) + 1
  themeLineOptions.xAxis.interval = 86400000 * n
  let newOptions = _.defaultsDeep({}, themeLineOptions, {
    tooltip: {
      formatter: function(params, ticket, callback) {
        let res = '时间：' + date(params[0].value[0])
        _.each(params, function(item) {
          res +=
            '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
            item.color +
            '"></span>' +
            item.seriesName +
            '：'
          res += item.value[1]
        })
        return res
      },
    },
    yAxis: {
      axisLabel: {
        formatter: function(value) {
          return timesK(value)
        },
      },
    },
    color: ['#9f61fc', '#1e9fff', '#0cce66', '#ffac2a', '#8492a6'],
    legend: {
      data: [
        '视频转码任务数',
        '音频转码任务数',
        '视频截图张数',
        '转封装任务数',
        '音视频元信息接口调用次数',
      ],
    },
    series: [
      {
        name: '视频转码任务数',
        ...seriesPart,
        data: data.video_transcoding,
      },
      {
        name: '音频转码任务数',
        ...seriesPart,
        data: data.audio_transcoding,
      },
      {
        name: '视频截图张数',
        ...seriesPart,
        data: data.snapshot,
      },
      {
        name: '转封装任务数',
        ...seriesPart,
        data: data.container_only,
      },
      {
        name: '音视频元信息接口调用次数',
        ...seriesPart,
        data: data.get_metadata,
      },
    ],
  })
  return newOptions
}
const initVideoOptions = (data, theme) => {
  let themeLineOptions =
    theme === 'dark'
      ? _.defaultsDeep({}, lineOptions, darkLineOptions)
      : _.defaultsDeep({}, lineOptions)
  let n = Math.floor((data.SD240.length - 1) / 7) + 1
  themeLineOptions.xAxis.interval = 86400000 * n
  let newOptions = _.defaultsDeep({}, themeLineOptions, {
    tooltip: {
      formatter: function(params, ticket, callback) {
        let res = '时间：' + date(params[0].value[0])
        _.each(params, function(item) {
          res +=
            '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
            item.color +
            '"></span>' +
            item.seriesName +
            '：'
          res += time(item.value[1], 2)
        })
        return res
      },
    },
    yAxis: {
      axisLabel: {
        formatter: function(value) {
          return time(value)
        },
      },
    },
    color: [
      '#9f61fc',
      '#1e9fff',
      '#0cce66',
      '#f85959',
      '#ffac2a',
      '#8492a6',
      '#aacc11',
      '#c4cfdf',
    ],
    legend: {
      data: ['SD240', 'SD480', 'SD', 'HD', '2K', '4K', '音频转码', '转封装'],
    },
    series: [
      {
        name: 'SD240',
        ...seriesPart,
        data: data.SD240,
      },
      {
        name: 'SD480',
        ...seriesPart,
        data: data.SD480,
      },
      {
        name: 'SD',
        ...seriesPart,
        data: data.SD,
      },
      {
        name: 'HD',
        ...seriesPart,
        data: data.HD,
      },
      {
        name: '2K',
        ...seriesPart,
        data: data['2K'],
      },
      {
        name: '4K',
        ...seriesPart,
        data: data['4K'],
      },
    ],
  })
  return newOptions
}
const initNotVideoOptions = (data, typeName, theme) => {
  let themeLineOptions =
    theme === 'dark'
      ? _.defaultsDeep({}, lineOptions, darkLineOptions)
      : _.defaultsDeep({}, lineOptions)
  let n = Math.floor((data.length - 1) / 7) + 1
  themeLineOptions.xAxis.interval = 86400000 * n
  let newOptions = _.defaultsDeep({}, themeLineOptions, {
    tooltip: {
      formatter: function(params, ticket, callback) {
        let res = '时间：' + date(params[0].value[0])
        _.each(params, function(item) {
          res +=
            '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
            item.color +
            '"></span>' +
            item.seriesName +
            '：'
          res += time(item.value[1], 2)
        })
        return res
      },
    },
    yAxis: {
      axisLabel: {
        formatter: function(value) {
          return time(value)
        },
      },
    },
    color: ['#9f61fc'],
    legend: {
      data: [typeName],
    },
    series: [
      {
        name: typeName,
        ...seriesPart,
        data: data,
      },
    ],
  })
  return newOptions
}
</script>

<style lang="less" scoped>
@import '../../styles/index.less';
.dark .@{css-prefix}data-statistics {
  .button-group {
    button {
      border: 1px solid #52626d;
      background: #414d56;
      color: #fff;
    }
    button:first-child {
      border-left: 1px solid #52626d;
    }
  }

  .section-chart-tab {
    border: @common-border-dark;
    border-bottom: 0;
    button {
      border: none;
      border-right: @common-border-dark;
      border-bottom: @common-border-dark;
      color: #99a9bf;
      background-color: #313a41;
    }
    button:focus,
    .buttonFocus {
      background-color: @body-background-dark;
      border-bottom: 0;
      color: @text-color-dark;
    }
  }

  .card-chart {
    border: @common-border-dark;
    border-top: 0;
  }
}

.@{css-prefix}data-statistics {
  .button-group {
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
    button:focus,
    .buttonFocus {
      outline: 0;
      background: #20a0ff !important;
      border-color: #20a0ff !important;
      color: #fff !important;
    }
  }

  .toolbar {
    margin-bottom: 16px;
    height: 32px;
    .button-datepicker {
      width: 430px;
      float: left;
      margin-right: 16px;
    }
    .button-daterange {
      float: left;
    }
    .button-export-data {
      float: right;
    }
  }

  .section-chart-tab {
    width: 100%;
    height: 50px;
    margin-top: 16px;
    border: 1px solid #d3dce6;
    border-bottom: 0;
    button {
      float: left;
      border-radius: 0;
      width: 15%;
      height: 50px;
      text-align: center;
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
    }
    & > button:nth-last-child(1) {
      border-right: 0;
      width: 40%;
      cursor: default;
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
    padding: 40px 4px 10px;
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
    .video-button-group {
      margin-left: 40px;
    }
  }
}
</style>
