<template>
	<div style="min-height: 400px">
		<el-container
			class="wppayform-debug-container"
		>
            <el-col class="debug-left-side"
                element-loading-icon="el-icon-loading"
                element-loading-background="#e5e5e5"
                element-loading-spinner="el-icon-loading"
                v-loading="wpLoading"
                element-loading-text="Please wait, generating debug infos..."
            :lg="18" :sm="24">
                <code class="copy">
                    <i class="el-icon-document"></i> Copy
                </code>
                <div class="notice-container">
                    <p><i class="el-icon-info"/></p>
                    <p>Check if there is any item with red color or labeled 'issue'</p>
                </div>
                <div class="wppayform-debug-server">
                    <div class="wppayform-debug-item">
                        <h4>#WordPress Info</h4>
                        <DebugTemplate :renderContent="wordpress" />

                        <h4>#Paymattic Status</h4>
                        <DebugTemplate :renderContent="payformInfo" />


                        <h4>#Theme Info</h4>
                        <DebugTemplate :renderContent="themeInfo" />

                        <h4>#Active Plugins: ({{plugins.total}})</h4>
                        <div
                            class="wppayform-debug-item-line"
                            v-for="(plugin, i) in plugins.all"
                            :key="i"
                        >
                            <p>{{i+1}}.</p>
                            <p class="result" :class="plugin.status === 'ok' ? 'status-ok' : ''">{{ plugin}}</p>
                        </div>

                        <h4>#Server Info</h4>
                        <DebugTemplate :renderContent="serverInfos" />
                    </div>
                </div>
            </el-col>
            <el-col class="debug-right-side" :lg="6" :sm="24">
                <h4>#Debug Log</h4>
                <div class="status-container">
                    <div v-if="wpLoading">
                        <p><i class="el-icon-loading"/></p>
                        <p>WP Compatibility..</p>
                    </div>
                    <div v-else>
                        <p><i class="el-icon-circle-check"/></p>
                        <p>WordPress test completed</p>
                    </div>
                </div>
                 <div class="status-container">
                    <div v-if="payformLoading">
                        <p><i class="el-icon-loading"/></p>
                        <p>Paymattic compatibility..</p>
                    </div>
                    <div v-else>
                        <p><i class="el-icon-circle-check"/></p>
                        <p>Paymattic test completed</p>
                    </div>
                </div>
                 <div class="status-container">
                    <div v-if="serverLoading">
                        <p><i class="el-icon-loading"/></p>
                        <p>Server Compatibility..</p>
                    </div>
                    <div v-else>
                        <p><i class="el-icon-circle-check"/></p>
                        <p>Server config test completed</p>
                    </div>
                </div>
                 <div class="status-container">
                    <div v-if="othersLoading">
                        <p><i class="el-icon-loading"/></p>
                        <p>Testing theme & plugins..</p>
                    </div>
                    <div v-else>
                        <p><i class="el-icon-circle-check"/></p>
                        <p>Others test completed</p>
                    </div>
                </div>
                <div v-if="downlodable" style="margin-top: 45px;">
                    <el-button type="primary" icon="el-icon-download" size="mini" plain @click="download">Download Report</el-button>
                </div>
            </el-col>

		</el-container>
	</div>
</template>

<script>
    import DebugTemplate from './DebugTemplate';
    import Clipboard from 'clipboard';
import ClipboardJS from 'clipboard';

	export default {
		name: 'debug',
		data() {
			return {
                wpLoading: false,
                serverLoading: false,
                othersLoading: false,
                payformLoading: false,

				serverInfos: {},
				wordpress: {},
				themeInfo: {},
                plugins: {},
                payformInfo: {}
			};
		},
        components: {
            DebugTemplate
        },
        computed: {
            downlodable() {
                return !this.wpLoading &&
                !this.serverLoading &&
                !this.othersLoading &&
                !this.payformLoading;
            }
        },
		methods: {
            copyData() {
                this.getString();
            },
            download() {
                var str = this.getString();
                const url = window.URL.createObjectURL(new Blob([str]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'file.txt'); //or any other extension
                document.body.appendChild(link);
                link.click();
                document.querySelector('body').removeChild(link);
            },
            getConcatString(obj) {
                let str = ''
                for (var item in obj) {
                    str += `${obj[item].label} : ${obj[item].result}\n`;
                }
                return str;
            },
            getString() {
                var str = '\n#WordPress\n';
                str += this.getConcatString(this.wordpress);
                str += "\n#PayForm Infos\n";
                str += this.getConcatString(this.payformInfo);
                str += "\n#Theme Infos\n";
                str += this.getConcatString(this.themeInfo);
                str += "\n#Server Infos\n";
                str += this.getConcatString(this.serverInfos);
                str += `\n#All Active Plugins (${this.plugins.total})\n`;
                for (let plugin in this.plugins.all) {
                    str += ` ${this.plugins.all[plugin]} \n`;
                }
                return str;
            },
			getWPData() {
                this.wpLoading = true;
				this.$get('debug/wp', {})
					.then((response) => {
						this.wordpress = response;
					})
					.always(() => {
                        this.wpLoading = false;
					});
			},
            getPayformData() {
                this.serverLoading = true;
                this.$get('debug/payform', {})
					.then((response) => {
                        this.payformInfo = response;
					})
					.always(() => {
                        this.serverLoading = false;
					});
            },
            getOthersData() {
                this.othersLoading = true;
                this.$get('debug/others', {})
					.then((response) => {
						this.themeInfo = response.themes;
                        this.plugins = response.plugins;
					})
					.always(() => {
                        this.othersLoading = false;
					});
            },
            getServerData() {
                this.payformLoading = true;
                this.$get('debug/server', {})
					.then((response) => {
						this.serverInfos = response;
                    })
					.always(() => {
                        this.payformLoading = false;
					});
            },

		},
		mounted() {
			this.getWPData();
            this.getPayformData();
            this.getOthersData()
            this.getServerData();

            if(!window.wpf_clip_inited) {
                 var clipboard = new ClipboardJS('.copy', {
                    text: () => {
                        return this.getString();
                    }
                });
                clipboard.on('success', (e) => {
                    this.$message({
                        offset: 39,
                        message: 'Copied to Clipboard!',
                        type: 'success'
                    });
                });
                window.wpf_clip_inited = true;
            }
		}
	};
</script>

<style lang="scss">
	.wppayform-debug-item-line {
		p.result {
			color: #1e81b0;
		}
		p {
			display: inline;
			font-size: 13px;
		}
        a {
			text-decoration: none;
		}
        .status-warn {
            color: rgb(248, 86, 10) !important;
        }
	}

	.wppayform-debug-container {
		min-height: 500px;
		border: 1px solid white;
		box-shadow: inset 1px 1px 6px 2px #e5e5e5;
		.wppayform-debug-item {
			font-family: monospace;
		}
		padding: 7px;
        .debug-right-side {
            padding: 18px;
            border-left: 1px solid #e4dede;
        }
        .status-container {
            padding: 2px 5px;
            margin-bottom: 13px;
            p {
                display: inline;
            }
            .el-icon-circle-check {
                color:green
            }
        }
        .notice-container p{
            display: inline;
            margin-top: 40px;
        }
        .copy {
            float: right;
            margin-right: 12px;
            cursor: context-menu;
        }
        .debug-left-side {
            background: #fffbf6;
            padding: 15px;
        }
        .debug-right-side {
            padding: 18px;
            border-left: 1px solid #e4dede;
            background: #e6e6e6;
        }
	}
</style>
