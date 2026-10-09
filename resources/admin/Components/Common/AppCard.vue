<template>
    <div class="app-card">
        <div class="app-card-header" v-if="header">
            <slot name="header"></slot>
        </div>
        <div class="app-card-body" v-if="body">
            <slot name="body"></slot>
        </div>
        <div class="app-card-footer" v-if="footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<script type="text/babel">
    export default {
        name: 'app-card',

        props: {
            header: {
            type: Boolean,
            default: true,
            },
            body: {
            type: Boolean,
            default: true,
            },
            footer: {
            type: Boolean,
            default: true,
            },
        },
    }
</script>

<style lang="scss">
.app-card {
    border: 1px solid #EAECF0;
    border-radius: 4px;
    background-color: #fff;
    margin-bottom: 20px;
    border-radius: 8px;
    h1, h2, h3, h4, h5, h6 {
        margin: 0;
    }
    .app-card-header {
        padding: 20px;
        border-bottom: 1px solid #EAECF0;
        border-radius: 8px 8px 0 0;
    }
    .app-card-body {
        display: flex;
        padding: 20px;
        flex-direction: column;
        align-items: flex-start;
        border-radius: 0px 0px 8px 8px;
        background: var(--White, #FFF);
        gap: 20px;
        align-self: stretch;
    }
    .app-card-footer {
        background-color: #f9f9f9;
        border-radius: 0 0 4px 4px;
    }
}
</style>