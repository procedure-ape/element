let rules = {
  name: [{
    required: true,
    message: '名称不可为空',
    trigger: 'blur'
  }, ],
  image_id: [{
    required: true,
    message: '选择一个镜像',
    trigger: 'blur'
  }, ],
  flavor_id: [{
    required: true,
    message: '选择虚拟机配置',
    trigger: 'blur'
  }, ],
  networks: [{
    required: true,
    message: '至少选择一个网络',
    trigger: 'blur'
  }, ],
  username: [{
    required: true,
    message: '用户名不可为空',
    trigger: 'blur'
  }, ],
  email: [{
      required: true,
      message: '请输入活动名称',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 5,
      message: '长度在 3 到 5 个字符',
      trigger: 'blur'
    }
  ],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }, ],
  description: [{
    required: true,
    message: '不可为空',
    trigger: 'blur'
  }, ],
  image_name: [{
    required: true,
    message: '镜像名不可为空',
    trigger: 'blur'
  }, ],
  filename: [{
    required: true,
    message: '请选择一个文件',
    trigger: 'change'
  }, ],
  snapshot_name: [{
    required: true,
    message: '请输入快照名称',
    trigger: 'blur'
  }, ],
  volume_name: [{
    required: true,
    message: '卷名称不可为空',
    trigger: 'blur'
  }, ],
  cidr: [{
    required: true,
    message: '子网名不可为空',
    trigger: 'blur'
  }, ],
  floating_network_id: [{
    required: true,
    message: '请选择一个端口',
    trigger: 'blur'
  }, ],
  server_id: [{
    required: true,
    message: '请选择一个服务',
    trigger: 'blur'
  }, ],
  network_id: [{
    required: true,
    message: '请选择一个网络',
    trigger: 'blur'
  }, ],
  subnet_id: [{
    required: true,
    message: '请选择一个子网',
    trigger: 'blur'
  }, ],
}

export default {
  rules
}