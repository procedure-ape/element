<template>
    <div>
        <div v-for="subnet in subnets" :key="subnet.cidr">
            {{ subnet.name }}{{ subnet.cidr }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'subNet',
    props: ['subnets']
}
</script>

<style>

</style>

