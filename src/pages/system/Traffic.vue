<template>
  <div class="bsc-system bsc-traffic">
    <legend-list :data="legendList"></legend-list>
    <div class="header">
      <div class="search"
           @keyup.enter="getFilterTrafficList(true)">
        <Select :prepend="true"
                v-model="searchType"
                style="width:180px;margin-right:8px;">
          <Icon slot="prepend"
                size="18"
                type="ios-grid-view"></Icon>
          <Option value="group_id">Group ID</Option>
          <Option value="server_ip">Server IP</Option>
          <Option value="partition_id">Partition ID</Option>
        </Select>
        <Input v-model="searchValue"
               :placeholder="$t('SYSTEM.PLEASE_ENTER') + searchType"
               style="width:260px" />
        <Button type="primary"
                @click="getFilterTrafficList(true)">{{$t('SYSTEM.SEARCH')}}</Button>
      </div>
      <div class="status">
        <span class="group-status-prefix">{{$t('SYSTEM.GROUP_STATUS')}} :</span>
        <button :class="{statusButtonFocus: tabName === 'group_all'}"
                @click="tabName = 'group_all'; getFilterTrafficList()">{{$t('SYSTEM.ALL')}}</button>
        <button :class="{statusButtonFocus: tabName === 'preparing'}"
                @click="tabName = 'preparing'; getFilterTrafficList()">preparing</button>
        <button :class="{statusButtonFocus: tabName === 'moving'}"
                @click="tabName = 'moving'; getFilterTrafficList()">moving</button>
        <button :class="{statusButtonFocus: tabName === 'finished'}"
                @click="tabName = 'finished'; getFilterTrafficList()">finished</button>
        <div class="refresh-section">
          <span @click="refresh()">
            <Icon type="refresh"
                  size="20"></Icon>
          </span>
        </div>
      </div>
    </div>
    <div class="content">
      <Spin size="bigger"
            fix
            v-if="spinShow"></Spin>
      <Table border
             :context="self"
             :stripe="true"
             :columns="listHeader"
             :data="trafficList"
             :no-data-text="$t('STORAGE.NO_LIST')"></Table>
    </div>
  </div>
</template>
<script>
import { TRAFFIC_LIST } from '@/service/API'
import legendList from '@/components/legend/legend'
export default {
  components: {
    legendList
  },
  data() {
    return {
      self: this,
      searchType: 'group_id',
      searchValue: '',
      spinShow: true,
      tabName: 'group_all',
      trafficListAll: [],
      trafficList: [],
      legendList: [
        {
          text: 'group:存储单元'
        },
        {
          text: 'server:服务器'
        },
        {
          text: 'partition:磁盘'
        }
      ],
      listHeader: [
        {
          title: 'Group ID',
          key: 'group_id',
          width: 150
        },
        {
          title: this.$t('SYSTEM.PROGRESS'),
          key: 'process_percent',
          width: 150,
          sortable: true,
          render: (h, params) => {
            return h('Progress', {
              props: {
                percent: params.row.process_percent
              }
            })
          }
        },
        {
          title: this.$t('SYSTEM.TIME_SPENT'),
          key: 'spent_time',
          width: 150
        },
        {
          title: this.$t('SYSTEM.REMAINING_TIME'),
          key: 'left_time',
          width: 150,
          sortable: true,
          sortMethod: (a, b, type) =>
            a.length !== b.length
              ? type === 'asc' ? a.length - b.length : b.length - a.length
              : type === 'asc' ? (a > b ? 1 : -1) : a < b ? 1 : -1
        },
        {
          title: this.$t('SYSTEM.GROUP_STATUS'),
          key: 'group_status',
          width: 150
        },
        {
          title: this.$t('SYSTEM.SOURCE_DISK'),
          key: 'source_disk',
          width: 200,
          render: (h, params) => {
            return h(
              'div',
              { style: { padding: '8px 0' } },
              params.row.source_disk.map((item) => [
                h(
                  'Tooltip',
                  {
                    props: {
                      content: item[2],
                      placement: 'top-end'
                    }
                  },
                  [
                    h(
                      'div',
                      { style: { margin: '2px 0' } },
                      `${item[0]}:/s2/drive/${item[1]}`
                    )
                  ]
                ),
                h('br')
              ])
            )
          }
        },
        {
          title: this.$t('SYSTEM.TARGET_DISK'),
          key: 'target_disk',
          width: 200,
          render: (h, params) => {
            return h(
              'Tooltip',
              {
                props: {
                  content: params.row.target_disk[2],
                  placement: 'top-end'
                }
              },
              `${params.row.target_disk[0]}:/s2/drive/${
                params.row.target_disk[1]
              }`
            )
          }
        }
      ]
    }
  },
  created() {
    this.getTrafficList()
  },
  methods: {
    async getTrafficList(isRefresh = false) {
      this.spinShow = true
      this.$Loading.start()
      try {
        let trafficData = await this.$http.get(TRAFFIC_LIST)
        this.trafficListAll = this.convert2Front(trafficData)
        if (!isRefresh) this.trafficList = this.trafficListAll
        this.spinShow = false
        this.$Loading.finish()
      } catch (error) {
        this.spinShow = false
        this.$Loading.error()
      }
    },
    convert2Front(data) {
      let frontList = []
      _.forEach(data, (value, key) => {
        const frontItem = {
          group_id: key,
          process_percent: value.process ? value.process : 0,
          spent_time: value.spent_time ? value.spent_time : '-',
          left_time: value.left_time ? value.left_time : '-',
          group_status: value.step,
          src_server_ip: value.src_node_ip,
          src_partition_id: value.src_partition_id,
          source_disk: value.src_node_ip.map((val, index) => [
            val,
            value.src_partition_paths[index].slice(-3),
            value.src_partition_id[index]
          ]),
          target_disk: [
            value.target_node_ip ? value.target_node_ip[0] : '-',
            value.target_partition_path
              ? value.target_partition_path.slice(-3)
              : '-',
            value.target_partition_id ? value.target_partition_id : '-'
          ]
        }
        frontList.push(frontItem)
      })
      return frontList
    },
    getFilterTrafficList(isSearch = false) {
      if (isSearch) this.tabName = 'group_all'
      let _trafficList =
        this.searchType === 'group_id'
          ? this.trafficListAll.filter(
              (value) => value.group_id >= this.searchValue
            )
          : this.searchValue
            ? this.trafficListAll.filter(
                (value) =>
                  this.searchType === 'server_ip'
                    ? value.src_server_ip.indexOf(this.searchValue) >= 0
                    : value.src_partition_id.indexOf(this.searchValue) >= 0
              )
            : this.trafficListAll
      this.trafficList =
        this.tabName === 'group_all'
          ? _trafficList
          : _trafficList.filter((value) => value.group_status === this.tabName)
    },
    async refresh() {
      await this.getTrafficList(true)
      this.getFilterTrafficList()
    }
  }
}
</script>
<style lang="less" scoped>
.dark .@{css-prefix}traffic {
  .header {
    .search {
      border-bottom: @common-border-dark;
    }

    .status {
      .refresh-section {
        color: @text-color-dark;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
}
.@{css-prefix}traffic {
  .header {
    .search {
      border-bottom: 1px dashed #d3dce6;
    }

    .status {
      .refresh-section {
        float: right;
        position: relative;
        top: 6px;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
  .content {
    position: relative;
  }
}
</style>
