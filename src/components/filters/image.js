function imageStatus(value){
    switch (value){
        case 'queued':
          return '排队'
          break
        case 'saving':
          return '保存'
          break
        case 'active':
          return '运行中'
          break
        case 'killed':
          return '死亡'
          break
        case 'deleted':
          return '删除'
          break
        case 'pending_delete':
          return '待删除'
          break
        case 'deactivated':
          return '停用'
          break
        case 'uploading':
          return '上传中'
          break
        case 'importing':
          return '输入'
          break
      }
}

export default {
    imageStatus
}