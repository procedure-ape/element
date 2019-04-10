function instance_states(value) {
  switch (value) {
    case 'active':
      return '运行'
      break;
    case 'building':
      return '创建中'
      break;
    case 'deleted':
      return '删除'
      break;
    case 'error':
      return '错误'
      break;
    case 'hard_reboot':
      return '硬重启中'
      break;
    case 'password':
      return '加密'
      break;
    case 'paused':
      return '暂停'
      break;
    case 'reboot':
      return '重启'
      break;
    case 'rebuild':
      return '重建'
      break;
    case 'rescued':
      return '营救中'
      break;
    case 'resized':
      return '调整中'
      break;
    case 'revert_resize':
      return '恢复调整'
      break;
    case 'shutoff':
      return '关机'
      break;
    case 'soft_deleted':
      return '软删除'
      break;
    case 'stopped':
      return '停止'
      break;
    case 'suspended':
      return '挂起'
      break;
    case 'verify_resize':
      return '验证调整'
      break;
    case 'shelved_offloaded':
      return '强制搁置'
      break;

    default:
      return '未知'
      break;
  }
}

function status(value) {
  switch (value) {
    case 'ACTIVE':
      return '运行'
      break;
    case 'BUILDING':
      return '创建中'
      break;
    case 'DELETED':
      return '删除'
      break;
    case 'ERROR':
      return '错误'
      break;
    case 'HARD_REBOOT':
      return '硬重启'
      break;
    case 'PASSWORD':
      return '加密'
      break;
    case 'PAUSED':
      return '暂停'
      break;
    case 'REBOOT':
      return '重启'
      break;
    case 'REBUILD':
      return '重建'
      break;
    case 'RESCUED':
      return '救援中'
      break;
    case 'RESIZED':
      return '调整大小'
      break;
    case 'REVERT_RESIZE':
      return '取消调整大小'
      break;
    case 'SHUTOFF':
      return '关机'
      break;
    case 'SOFT_DELETED':
      return '删除'
      break;
    case 'STOPPED':
      return '停止'
      break;
    case 'SUSPENDED':
      return '搁置'
      break;
    case 'UNKNOWN':
      return '未知'
      break;
    case 'VERIFY_RESIZE':
      return '确认调整大小'
      break;
    case 'SHELVED_OFFLOADED':
      return '强制搁置'
      break;

    default:
      return '未知'
      break;
  }
}

function power_states(value) {
  switch (value) {
    case 0:
      return '无状态'
      break;
    case 1:
      return '运行中'
      break;
    case 3:
      return '暂停'
      break;
    case 4:
      return '关闭'
      break;
    case 6:
      return '撞坏'
      break;
    case 7:
      return '暂停的'
      break;
    case 'reboot_started':
      return '重启中'
      break
    case 'powering-off':
      return '电源关闭中'
      break
    case 'powering-on':
      return '电源开启中'
      break
  }
}

function instance_address(values) {
  let addrs = []
  for (let key in values) {
    let value = values[key]
    for (let k in value) {
      let ip = value[k]
      addrs.push(ip.addr)
    }
  }
  return addrs
}

function task_states(values) {
  switch (values) {
    case null:
      return '无状态'
      break;
    case 'reboot_started':
      return '重启中'
      break
    case 'image_pending_upload':
      return '创建快照中'
      break
    case 'powering-off':
      return '电源关闭中'
      break
    case 'powering-on':
      return '电源开启中'
      break
    case 'rebuilding':
      return '重建中'
      break;
  }
}

export default {
  instance_states,
  instance_address,
  power_states,
  task_states,
  status
}