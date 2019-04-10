<template>
    <div>
        <div v-for="val in test" :key="val">
            {{val}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'instance_table_column',
    props: ['test']
}
</script>

<style>

</style>

