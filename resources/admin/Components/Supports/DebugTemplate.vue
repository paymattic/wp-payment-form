<template>
    <div>
        <div class="wppayform-debug-item-line" v-for="(item, i) in renderContent" :key="i">
            <p>{{ item.label }}:</p>
            <p v-html="item.result"
                class="result"
                :class="item.status === 'warn' ? 'status-warn' : ''"
            >
            </p>
        </div>
    </div>
</template>

<script>
	export default {
        name: "debugTemplate",
        props: ['renderContent']
    };
</script>
