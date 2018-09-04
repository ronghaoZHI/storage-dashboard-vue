<template>
  <div class="bsc-machine-card">
    <div class="card-title"
         :class="{ alive: data.status === 'alive', down: data.status !== 'alive' }">
      <span>
        <Icon type="android-star"
              v-show="data.status === 'alive'"
              size="16"></Icon> {{data.hostname.slice(data.hostname.indexOf('-',14) + 1)}}</span>
    </div>
    <div class="card-mem">
      <span>内存使用：{{bytes(data.mem.total - data.mem.available)}}／{{bytes(data.mem.total)}} (已用/总计)</span>
      <div class="mem-show"
           v-percentPointer="[{percent: data.mem.percent, width: data.mem.percent, bc: true}, {percent: 100 - data.mem.percent, width: 100 - data.mem.percent - 2, bc: false}]">
        <span v-if="data.mem.percent > 12"
              class="mem-used">{{data.mem.percent}}%</span>
        <span v-else
              class="mem-used">&nbsp;</span>
        <span class="mem-unused">{{Math.floor(100 - data.mem.percent)}}%</span>
      </div>
    </div>
    <div class="card-mem">
      <span>swap：{{bytes(data.swap.total - data.swap.free)}}／{{bytes(data.swap.total)}} (已用/总计)</span>
      <div class="mem-show"
           v-percentPointer="[{percent: data.swap.percent, width: data.swap.percent, bc: true}, {percent: 100 - data.swap.percent, width: 100 - data.swap.percent - 2, bc: false}]">
        <span v-if="data.swap.percent > 12"
              class="mem-used">{{data.swap.percent}}%</span>
        <span v-else
              class="mem-used">&nbsp;</span>
        <span class="mem-unused">{{100 - data.swap.percent}}%</span>
      </div>
    </div>
    <div class="card-cpu">
      <span>CPU load: {{data.cpu.load}}</span>
    </div>
    <div class="card-partition"
         v-if="partitionList.length > 0">
      <span>磁盘信息</span>
      <span class="ps">Space - IO (单位:%)</span>
      <partition-node v-for="node in partitionList"
                      :data="node"
                      :key="node.ts"></partition-node>
    </div>
    <div class="card-ip">
      <div v-for="pubip in data.pub_ips"
           :key="pubip">Public IP: {{pubip}}</div>
      <div v-for="innip in data.inn_ips"
           :key="innip">Inner IP: {{innip}}</div>
    </div>
    <div class="card-footer">
      <div v-openBtn
           class="button-open">
        <Icon type="chevron-down"></Icon>
      </div>
      <div v-cloBtn
           class="button-close dn">
        <Icon type="chevron-up"></Icon>
      </div>
      <div class="card-network dn">
        <div class="row-network">
          <span>网卡</span>
          <span>发送</span>
          <span>接收</span>
        </div>
        <div class="row-network"
             v-for="(value, key) in data.net.io"
             :key="key">
          <span>{{key}}</span>
          <span>{{Math.floor(value.bytes_sent / 8 / 1024)}} Kb/s</span>
          <span>{{Math.floor(value.bytes_recv / 8 / 1024)}} Kb/s</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { bytes } from '@/service/BucketService'
import partitionNode from './PartitionNode'
export default {
  components: {
    partitionNode,
  },
  directives: {
    cloBtn: {
      bind: function(el) {
        $(el).click(() => {
          $(el)
            .toggleClass('dn')
            .siblings('.card-network')
            .toggleClass('dn')
            .siblings('.button-open')
            .toggleClass('dn')
        })
      },
    },
    openBtn: {
      bind: function(el) {
        $(el).click(() => {
          $(el)
            .toggleClass('dn')
            .siblings('.card-network')
            .toggleClass('dn')
            .siblings('.button-close')
            .toggleClass('dn')
        })
      },
    },
    percentPointer: {
      inserted: function(el, binding) {
        let data = binding.value
        const colorList = [
          '#76d0a3',
          '#76d0a3',
          '#76d0a3',
          '#76d0a3',
          '#76d0a3',
          '#76d0a3',
          '#76d0a3',
          '#76d0a3',
          '#76d0a3',
          '#F1A4A4',
        ]
        data.forEach((item, index) => {
          let val = `span:nth-child(${index + 1})`
          $(el)
            .children(val)
            .css('width', Math.floor(item.width) + '%')
          item.bc &&
            $(el)
              .children(val)
              .css('background-color', colorList[Math.floor(item.percent / 10)])
        })
      },
    },
  },
  props: ['data'],
  data() {
    return {
      memPointData: [],
    }
  },
  computed: {
    partitionList: function() {
      return this.data.partitions.ok
        .concat(this.data.partitions.bad)
        .slice(0, 50)
    },
  },
  methods: {
    bytes: bytes,
  },
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
.dark .@{css-prefix}machine-card {
  border: @common-border-dark;
  color: #c0ccda;

  .card-title {
    i {
      color: #00a854;
    }
  }

  .alive {
    background-color: #414e55;
    .sc(14px, #c0ccda);
  }

  .down {
    background-color: #f85959;
  }

  .card-mem {
    border-top: @common-border-dark;

    .mem-show {
      background: #414e55;

      .mem-used {
        color: #fff;
      }
    }
  }

  .card-cpu {
    border-top: @common-border-dark;
    span {
      .sc(14px, #c0ccda);
    }
  }

  .card-partition {
    border-top: @common-border-dark;
  }

  .card-ip {
    border-top: @common-border-dark;
    .sc(13px, #c0ccda);

    & > div:not(:first-child) {
      border-top: @common-border-dark;
    }
  }

  .card-footer {
    background: #414e55;
    .sc(13px, #c0ccda);

    .button-close {
      border-top: @common-border-dark;
    }

    .card-network {
      background: #414e55;
      .sc(13px, #c0ccda);
      border: @common-border-dark;

      .row-network {
        & > span {
          border-top: @common-border-dark;
        }

        & > span:not(:last-child) {
          border-top: @common-border-dark;
        }
      }
    }
  }
}

.@{css-prefix}machine-card {
  .wh(300px, 100%);
  margin: 0 15px 15px 0;
  border: 1px solid #d8dbdb;

  .card-title {
    padding: 10px 16px 10px 16px;

    i {
      color: #00924c;
    }
  }

  .alive {
    background-color: #fafafb;
    .sc(14px, #475669);
  }

  .down {
    background-color: #f65c59;
    .sc(14px, #fff);
  }

  .card-mem {
    width: 100%;
    padding: 8px 10px;
    border-top: @common-border;

    .mem-show {
      .wh(100%, 20px);
      background: #eff3f7;

      span {
        height: 100%;
        .fb(center, center);
      }
    }
  }

  .card-cpu {
    border-top: @common-border;
    text-align: center;
    height: 34px;
    line-height: 34px;
    span {
      .sc(14px, #475669);
    }
  }

  .card-partition {
    position: relative;
    border-top: @common-border;
    min-height: 100%;
    width: 100%;
    .fb(flex-start, flex-start);
    flex-wrap: wrap;
    padding: 30px 10px 16px 10px;

    & > span {
      position: absolute;
      top: 10px;
    }

    .ps {
      right: 20px;
    }
  }

  .card-ip {
    border-top: @common-border;
    .sc(13px, #475669);
    padding-left: 16px;

    & > div {
      height: 30px;
      line-height: 30px;
    }

    & > div:not(:first-child) {
      border-top: @common-border;
    }
  }

  .card-footer {
    background: #f9fafc;
    .sc(13px, #475669);

    .card-footer-button {
      height: 30px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
    }

    .button-open {
      .card-footer-button();
    }

    .button-close {
      .card-footer-button();
      border-top: @common-border;
    }

    .card-network {
      background: #f9fafc;
      width: 298px;
      .sc(13px, #475669);
      line-height: 30px;
      z-index: 100;
      border: @common-border;

      .row-network {
        width: 100%;
        .fb(center, center);

        & > span {
          flex: 1;
          padding: 0 16px;
          border-top: @common-border;
          text-align: right;
        }

        & > span:first-child {
          flex: 1;
          text-align: left;
        }

        & > span:not(:last-child) {
          border-top: @common-border;
        }
      }
    }
  }
}

.echarts {
  width: initial;
  height: 165px;
}

.dn {
  display: none;
}
</style>
