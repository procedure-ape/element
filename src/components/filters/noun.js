function noun(v){
    switch(v){
        case 'cpu_info':
        return 'cpu信息'
        break

        case 'cache_size':
        return '缓存大小'
        break

        case 'vendor_id':
        return '供应商'
        break

        case 'cpu cores':
        return 'cpu内核'
        break

        case 'model name':
        return '模型名称'
        break

        case 'cpu_MHz':
        return 'cpu信息'
        break

        case 'memory_info':
        return '内存信息'
        break

        case 'MemTotal':
        return '内存信息'
        break

        case 'Cached':
        return '高速缓冲存储器'
        break

        case 'SwapCached':
        return '交换分区'
        break

        case 'SwapFree':
        return '空闲分区'
        break

        case 'SwapTotal':
        return '总分区'
        break

        case 'MemFree':
        return '空闲内存'
        break

        case 'MemAvailable':
        return '可用内存'
        break

        case 'server_info':
        return '服务器信息'
        break

        case 'Serial Number':
        return '串行数'
        break

        case 'Product Name':
        return '产品名称'
        break

        case 'Manufacturer':
        return '生产厂家'
        break

        case 'net_card_info':
        return '网卡信息'
        break

        case 'Ethernet controller':
        return '以太网控制器'
        break

        default :
        return '未知'
        break
    }
}

export default{
    noun
}