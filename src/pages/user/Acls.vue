<template>
<div class="bsc-user">
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
      <tr v-if="aclsData.acl.length === 0">
        <td>No Buckets</td>
        <td></td>
        <td></td>
      </tr>
      <tr v-else v-for="row in aclsData.acl" :key="row.bucket">
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
</div>
</template>
<script>
export default {
  name: 'Acls',
  props: {
    aclsData: {
      type: Object,
      default: function() {
        return { acl: [] }
      },
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.@{css-prefix}user {
  & > div.table {
    margin-top: 16px;
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
