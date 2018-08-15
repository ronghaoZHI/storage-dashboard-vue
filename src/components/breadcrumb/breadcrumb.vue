<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>
<script>
const prefixCls = 'bsc-breadcrumb'

export default {
  name: 'bscBreadcrumb',
  props: {
    separator: {
      type: String,
      default: '/'
    }
  },
  computed: {
    classes() {
      return `${prefixCls}`
    }
  },
  watch: {
    separator() {
      this.updateChildren()
    }
  },
  mounted() {
    this.updateChildren()
  },
  updated() {
    this.$nextTick(() => {
      this.updateChildren()
    })
  },
  methods: {
    updateChildren() {
      this.$children.forEach((child) => {
        child.separator = this.separator
      })
    }
  }
}
</script>
<style lang="less">
.bsc-breadcrumb {
  font-size: 14px;
  a {
    transition: color 0.2s ease-in-out;
    &:hover {
      color: tint(#3399ff, 20%);
    }
  }

  & > span:last-child > a {
    color: #99a9bf;
    cursor: default;
  }

  & > span:last-child &-item-separator {
    display: none;
  }

  &-item-separator {
    margin: 0 8px;
    color: #d7dde4;
  }

  &-item-link {
    > .ivu-icon + span {
      margin-left: 4px;
    }
  }
}
</style>
